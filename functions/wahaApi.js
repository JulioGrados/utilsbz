const axios = require('axios')

/**
 * Cliente base para WAHA API
 * Con retry automático, timeouts mejorados y manejo de sesiones
 */

// ==================== CONFIGURACIÓN ====================

const WAHA_BASE_URL = process.env.WAHA_BASE_URL || 'https://appbizeus-waha-prod.m1imp2.easypanel.host'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'waha_sk_bizeus_8d1a6e35234fbcb82ddffc4a1eaad2c0'

// Timeouts configurables
const TIMEOUTS = {
  default: 30000,      // 30s para operaciones generales
  message: 60000,      // 60s para envío de mensajes
  media: 120000,       // 120s para envío de media (archivos grandes)
  download: 90000,     // 90s para descarga de archivos
  session: 45000       // 45s para operaciones de sesión
}

// Configuración de retry
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,   // 1 segundo inicial
  maxDelayMs: 10000,   // máximo 10 segundos
  retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'ENETUNREACH']
}

/**
 * Cliente HTTP configurado para WAHA
 */
const wahaClient = axios.create({
  baseURL: WAHA_BASE_URL,
  headers: {
    'X-Api-Key': WAHA_API_KEY,
    'Content-Type': 'application/json'
  },
  timeout: TIMEOUTS.default
})

// ==================== UTILIDADES ====================

/**
 * Delay con promesa
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Calcular delay con backoff exponencial
 */
const calculateBackoff = (attempt, baseDelay = RETRY_CONFIG.baseDelayMs) => {
  const exponentialDelay = baseDelay * Math.pow(2, attempt)
  const jitter = Math.random() * 1000 // Añadir jitter para evitar thundering herd
  return Math.min(exponentialDelay + jitter, RETRY_CONFIG.maxDelayMs)
}

/**
 * Determinar si un error es retriable
 */
const isRetryableError = (error) => {
  // Errores de red
  if (RETRY_CONFIG.retryableErrors.includes(error.code)) {
    return true
  }

  // Timeout
  if (error.message?.includes('timeout') || error.code === 'ECONNABORTED') {
    return true
  }

  // Errores de servidor (5xx)
  if (error.response?.status >= 500) {
    return true
  }

  // Error 429 (rate limit)
  if (error.response?.status === 429) {
    return true
  }

  return false
}

/**
 * Ejecutar función con retry y backoff exponencial
 */
const withRetry = async (fn, options = {}) => {
  const {
    maxRetries = RETRY_CONFIG.maxRetries,
    context = 'WAHA API',
    onRetry = null
  } = options

  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Si no es retriable, lanzar inmediatamente
      if (!isRetryableError(error)) {
        throw error
      }

      // Si ya agotamos los reintentos
      if (attempt >= maxRetries) {
        console.error(`❌ [${context}] Fallido después de ${maxRetries + 1} intentos:`, error.message)
        throw error
      }

      const backoffMs = calculateBackoff(attempt)
      console.warn(`⚠️ [${context}] Intento ${attempt + 1}/${maxRetries + 1} falló. Reintentando en ${Math.round(backoffMs)}ms...`, error.message)

      if (onRetry) {
        await onRetry(attempt, error)
      }

      await delay(backoffMs)
    }
  }

  throw lastError
}

/**
 * Verificar si la sesión está activa y saludable
 */
const checkSessionHealth = async (sessionName) => {
  try {
    const resp = await wahaClient.get(`/api/sessions/${sessionName}`, {
      timeout: TIMEOUTS.session
    })

    const status = resp.data?.status
    const isHealthy = status === 'WORKING'

    return {
      isHealthy,
      status,
      me: resp.data?.me,
      error: isHealthy ? null : `Sesión no está activa (estado: ${status})`
    }
  } catch (error) {
    return {
      isHealthy: false,
      status: 'UNKNOWN',
      me: null,
      error: error.message
    }
  }
}

// ==================== SESSION MANAGEMENT ====================

/**
 * Eventos de WAHA disponibles para webhooks:
 * - message: Mensajes entrantes
 * - message.any: TODOS los mensajes (entrantes y salientes desde móvil/web)
 * - message.ack: Confirmaciones de entrega/lectura (sent, delivered, read)
 * - message.reaction: Reacciones a mensajes (emojis)
 * - message.revoked: Mensajes eliminados/revocados
 * - message.waiting: Mensajes en espera
 * - session.status: Cambios de estado de sesión (WORKING, FAILED, etc.)
 * - presence.update: Actualizaciones de presencia (online, typing, etc.)
 * - poll.vote: Votos en encuestas
 * - call.received: Llamadas recibidas
 * - call.accepted: Llamadas aceptadas
 * - call.rejected: Llamadas rechazadas
 * - group.join: Cuando alguien se une a un grupo
 * - group.leave: Cuando alguien sale de un grupo
 * - label.upsert: Etiquetas creadas/actualizadas
 * - label.deleted: Etiquetas eliminadas
 * - label.chat.added: Chat añadido a etiqueta
 * - label.chat.deleted: Chat removido de etiqueta
 */
const WAHA_WEBHOOK_EVENTS = [
  'message',
  'message.any',
  'message.ack',
  'message.reaction',
  'message.revoked',
  'message.edited',    // Soporte para mensajes editados
  'session.status',
  'presence.update',
  'poll.vote'
];

/**
 * Crear o iniciar sesión en WAHA
 */
const createSessionWaha = async (sessionName, webhookUrl) => {
  return withRetry(async () => {
    const resp = await wahaClient.post('/api/sessions', {
      name: sessionName,
      start: true,
      config: {
        // ✅ NOWEB Store - NECESARIO para sendSeen, getChats, getMessages
        noweb: {
          store: {
            enabled: true,
            fullSync: false  // false = 3 meses, true = 1 año de historial
          }
        },
        webhooks: [{
          url: webhookUrl,
          events: WAHA_WEBHOOK_EVENTS,
          hmac: null,
          retries: {
            attempts: 3,
            delaySeconds: 2
          }
        }]
      }
    }, { timeout: TIMEOUTS.session })

    return resp.data
  }, { context: 'createSession' })
}

/**
 * Reiniciar sesión para obtener nuevo QR
 */
const restartSessionWaha = async (sessionName) => {
  try {
    // Primero detener la sesión
    await wahaClient.post(`/api/sessions/${sessionName}/stop`, {}, { timeout: TIMEOUTS.session }).catch(() => {})
    // Esperar un momento
    await delay(1000)
    // Iniciar la sesión nuevamente
    const resp = await wahaClient.post(`/api/sessions/${sessionName}/start`, {}, { timeout: TIMEOUTS.session })
    return resp.data
  } catch (error) {
    console.error('Error reiniciando sesión WAHA:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Obtener QR code para autenticación
 */
const getQRCodeWaha = async (sessionName, forceRestart = false) => {
  try {
    let sessionStatus
    try {
      const statusResp = await wahaClient.get(`/api/sessions/${sessionName}`, { timeout: TIMEOUTS.session })
      sessionStatus = statusResp.data?.status
      console.log(`📊 [WAHA] Estado de sesión ${sessionName}: ${sessionStatus}`)
    } catch (e) {
      sessionStatus = 'UNKNOWN'
    }

    if (forceRestart || (sessionStatus !== 'SCAN_QR_CODE' && sessionStatus !== 'STARTING')) {
      console.log(`🔄 [WAHA] Reiniciando sesión para obtener nuevo QR...`)
      await restartSessionWaha(sessionName)
      await delay(2000)
    }

    const resp = await wahaClient.get(`/api/${sessionName}/auth/qr`, {
      params: { format: 'image' },
      responseType: 'arraybuffer',
      timeout: TIMEOUTS.session
    })

    const base64 = Buffer.from(resp.data, 'binary').toString('base64')
    return { value: `data:image/png;base64,${base64}` }
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 422) {
      throw new Error('QR_NOT_AVAILABLE')
    }
    throw error
  }
}

/**
 * Obtener estado de sesión
 */
const getSessionStatusWaha = async (sessionName) => {
  return withRetry(async () => {
    const resp = await wahaClient.get(`/api/sessions/${sessionName}`, { timeout: TIMEOUTS.session })
    return resp.data
  }, { context: 'getSessionStatus', maxRetries: 2 })
}

/**
 * Detener sesión
 */
const stopSessionWaha = async (sessionName) => {
  const resp = await wahaClient.post(`/api/sessions/${sessionName}/stop`, {}, { timeout: TIMEOUTS.session })
  return resp.data
}

/**
 * Eliminar sesión completamente
 */
const deleteSessionWaha = async (sessionName) => {
  const resp = await wahaClient.delete(`/api/sessions/${sessionName}`, { timeout: TIMEOUTS.session })
  return resp.data
}

/**
 * Actualizar configuración de webhook para una sesión existente
 * Necesario para agregar eventos como message.any a sesiones ya creadas
 * Usa la misma lista de eventos que createSessionWaha (WAHA_WEBHOOK_EVENTS)
 * IMPORTANTE: Preserva la configuración de noweb.store para no perder el acceso a sendSeen
 */
const updateSessionWebhookWaha = async (sessionName, webhookUrl) => {
  return withRetry(async () => {
    // Primero obtener la configuración actual para preservar noweb.store
    let currentConfig = {}
    try {
      const currentSession = await wahaClient.get(`/api/sessions/${sessionName}`, { timeout: TIMEOUTS.session })
      currentConfig = currentSession.data?.config || {}
    } catch (e) {
      console.warn(`⚠️ [WAHA] No se pudo obtener config actual de ${sessionName}, usando defaults`)
    }

    const resp = await wahaClient.put(`/api/sessions/${sessionName}`, {
      config: {
        // Preservar configuración de noweb (incluyendo store)
        noweb: currentConfig.noweb || {
          store: {
            enabled: true,
            fullSync: false
          }
        },
        webhooks: [{
          url: webhookUrl,
          events: WAHA_WEBHOOK_EVENTS,
          hmac: null,
          retries: {
            attempts: 3,
            delaySeconds: 2
          }
        }]
      }
    }, { timeout: TIMEOUTS.session })

    console.log(`✅ [WAHA] Webhook actualizado para sesión ${sessionName} con eventos: ${WAHA_WEBHOOK_EVENTS.join(', ')}`)
    return resp.data
  }, { context: 'updateSessionWebhook', maxRetries: 2 })
}

/**
 * Obtener información del usuario autenticado
 */
const getMeWaha = async (sessionName) => {
  const resp = await wahaClient.get(`/api/sessions/${sessionName}/me`, { timeout: TIMEOUTS.session })
  return resp.data
}

/**
 * Verificar si una sesión tiene NOWEB store habilitado
 * El store es necesario para sendSeen, getChats, getMessages
 * @returns {Object} { hasStore: boolean, storeEnabled: boolean, fullSync: boolean, sessionConfig: object }
 */
const checkSessionStoreEnabled = async (sessionName) => {
  try {
    const resp = await wahaClient.get(`/api/sessions/${sessionName}`, { timeout: TIMEOUTS.session })
    const config = resp.data?.config || {}
    const nowebConfig = config.noweb || {}
    const storeConfig = nowebConfig.store || {}

    const result = {
      sessionName,
      status: resp.data?.status,
      hasStore: !!storeConfig.enabled,
      storeEnabled: storeConfig.enabled === true,
      fullSync: storeConfig.fullSync === true,
      sessionConfig: config
    }

    console.log(`📊 [WAHA] Store check para ${sessionName}:`, {
      status: result.status,
      storeEnabled: result.storeEnabled,
      fullSync: result.fullSync
    })

    return result
  } catch (error) {
    console.error(`❌ [WAHA] Error verificando store de ${sessionName}:`, error.message)
    return {
      sessionName,
      status: 'UNKNOWN',
      hasStore: false,
      storeEnabled: false,
      fullSync: false,
      error: error.message
    }
  }
}

/**
 * Recrear sesión con NOWEB store habilitado
 * Útil para migrar sesiones antiguas que no tienen store
 * ADVERTENCIA: Esto requiere volver a escanear el QR
 */
const recreateSessionWithStore = async (sessionName, webhookUrl) => {
  console.log(`🔄 [WAHA] Recreando sesión ${sessionName} con store habilitado...`)

  try {
    // 1. Detener sesión existente (si existe)
    try {
      await stopSessionWaha(sessionName)
      await delay(1000)
    } catch (e) {
      // Ignorar si no existe
    }

    // 2. Eliminar sesión existente
    try {
      await deleteSessionWaha(sessionName)
      await delay(1000)
    } catch (e) {
      // Ignorar si no existe
    }

    // 3. Crear nueva sesión con store habilitado
    const newSession = await createSessionWaha(sessionName, webhookUrl)

    console.log(`✅ [WAHA] Sesión ${sessionName} recreada con store habilitado`)
    return {
      success: true,
      session: newSession,
      message: 'Sesión recreada. Escanea el QR nuevamente para conectar.'
    }
  } catch (error) {
    console.error(`❌ [WAHA] Error recreando sesión ${sessionName}:`, error.message)
    throw error
  }
}

// ==================== MESSAGING (con retry y verificación de sesión) ====================

/**
 * Enviar mensaje con verificación de sesión y retry
 */
const sendWithSessionCheck = async (sessionName, sendFn, context) => {
  // Verificar salud de la sesión antes de enviar
  const health = await checkSessionHealth(sessionName)

  if (!health.isHealthy) {
    console.error(`❌ [WAHA] Sesión no saludable: ${health.error}`)
    throw new Error(`SESSION_NOT_HEALTHY: ${health.error}`)
  }

  // Ejecutar envío con retry
  return withRetry(sendFn, {
    context,
    maxRetries: RETRY_CONFIG.maxRetries,
    onRetry: async (attempt, error) => {
      // En cada retry, verificar si la sesión sigue activa
      if (attempt > 0) {
        const recheck = await checkSessionHealth(sessionName)
        if (!recheck.isHealthy) {
          throw new Error(`SESSION_DISCONNECTED: ${recheck.error}`)
        }
      }
    }
  })
}

/**
 * Enviar mensaje de texto
 */
const sendMessageTextWaha = async (sessionName, chatId, text) => {
  const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

  return sendWithSessionCheck(sessionName, async () => {
    const resp = await wahaClient.post('/api/sendText', {
      session: sessionName,
      chatId: formattedChatId,
      text: text
    }, { timeout: TIMEOUTS.message })

    console.log('✅ [WAHA] Mensaje de texto enviado:', resp.data?.key?.id)
    return resp
  }, 'sendText')
}

/**
 * Extraer el ID corto del mensaje desde el formato completo de WhatsApp
 * Formato: {direction}_{chatId}_{messageId}
 * Ejemplo: false_99020605235316@lid_3EB0A6FFE32526632302FC -> 3EB0A6FFE32526632302FC
 */
const extractShortMessageId = (fullMessageId) => {
  if (!fullMessageId) return ''

  // Si el ID contiene underscore, extraer la última parte (el ID real del mensaje)
  const parts = fullMessageId.split('_')
  if (parts.length >= 3) {
    // El ID del mensaje es la última parte
    return parts[parts.length - 1]
  }

  // Si no tiene el formato esperado, devolver tal cual
  return fullMessageId
}

/**
 * Enviar mensaje de texto con quoted (respuesta)
 */
const sendMessageTextQuotedWaha = async (sessionName, chatId, text, quotedMessageId) => {
  const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`
  // Extraer solo el ID corto del mensaje para reply_to
  const shortMessageId = extractShortMessageId(quotedMessageId)

  console.log(`📝 [WAHA] reply_to original: ${quotedMessageId} -> corto: ${shortMessageId}`)

  return sendWithSessionCheck(sessionName, async () => {
    const resp = await wahaClient.post('/api/sendText', {
      session: sessionName,
      chatId: formattedChatId,
      text: text,
      reply_to: shortMessageId
    }, { timeout: TIMEOUTS.message })

    console.log('✅ [WAHA] Mensaje quoted enviado:', resp.data?.key?.id)
    return resp
  }, 'sendTextQuoted')
}

/**
 * Enviar imagen
 */
const sendMessageImageWaha = async (sessionName, chatId, url, caption = '') => {
  const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

  return sendWithSessionCheck(sessionName, async () => {
    const resp = await wahaClient.post('/api/sendImage', {
      session: sessionName,
      chatId: formattedChatId,
      file: { url: url },
      caption: caption
    }, { timeout: TIMEOUTS.media })

    console.log('✅ [WAHA] Imagen enviada:', resp.data?.key?.id)
    return resp
  }, 'sendImage')
}

/**
 * Enviar video
 */
const sendMessageVideoWaha = async (sessionName, chatId, url, caption = '') => {
  const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

  return sendWithSessionCheck(sessionName, async () => {
    const resp = await wahaClient.post('/api/sendVideo', {
      session: sessionName,
      chatId: formattedChatId,
      file: { url: url },
      caption: caption
    }, { timeout: TIMEOUTS.media })

    console.log('✅ [WAHA] Video enviado:', resp.data?.key?.id)
    return resp
  }, 'sendVideo')
}

/**
 * Enviar documento
 */
const sendMessageDocumentWaha = async (sessionName, chatId, url, filename = '', caption = '') => {
  const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

  return sendWithSessionCheck(sessionName, async () => {
    const resp = await wahaClient.post('/api/sendFile', {
      session: sessionName,
      chatId: formattedChatId,
      file: {
        url: url,
        filename: filename
      },
      caption: caption
    }, { timeout: TIMEOUTS.media })

    console.log('✅ [WAHA] Documento enviado:', resp.data?.key?.id)
    return resp
  }, 'sendDocument')
}

/**
 * Enviar audio/voz
 */
const sendMessageVoiceWaha = async (sessionName, chatId, url) => {
  const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

  return sendWithSessionCheck(sessionName, async () => {
    const resp = await wahaClient.post('/api/sendVoice', {
      session: sessionName,
      chatId: formattedChatId,
      file: { url: url }
    }, { timeout: TIMEOUTS.media })

    console.log('✅ [WAHA] Audio enviado:', resp.data?.key?.id)
    return resp
  }, 'sendVoice')
}

/**
 * Enviar media con quoted (respuesta)
 */
const sendMessageMediaQuotedWaha = async (sessionName, chatId, url, filename = '', caption = '', quotedMessageId = '') => {
  const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`
  // Extraer solo el ID corto del mensaje para reply_to
  const shortMessageId = extractShortMessageId(quotedMessageId)

  console.log(`📝 [WAHA] Media reply_to original: ${quotedMessageId} -> corto: ${shortMessageId}`)

  return sendWithSessionCheck(sessionName, async () => {
    const resp = await wahaClient.post('/api/sendFile', {
      session: sessionName,
      chatId: formattedChatId,
      file: {
        url: url,
        filename: filename
      },
      caption: caption,
      reply_to: shortMessageId
    }, { timeout: TIMEOUTS.media })

    console.log('✅ [WAHA] Media quoted enviada:', resp.data?.key?.id)
    return resp
  }, 'sendMediaQuoted')
}

// ==================== STATUS & UTILITIES ====================

/**
 * Marcar chat como leído
 */
const sendMarkReadWaha = async (sessionName, chatId) => {
  const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

  return withRetry(async () => {
    const resp = await wahaClient.post('/api/sendSeen', {
      session: sessionName,
      chatId: formattedChatId
    }, { timeout: TIMEOUTS.message })

    return resp
  }, { context: 'sendSeen', maxRetries: 2 })
}

/**
 * Verificar si número tiene WhatsApp
 */
const checkNumberExistsWaha = async (sessionName, phoneNumber) => {
  return withRetry(async () => {
    const resp = await wahaClient.post('/api/checkNumberStatus', {
      session: sessionName,
      phoneNumber: phoneNumber
    }, { timeout: TIMEOUTS.message })

    return resp
  }, { context: 'checkNumber', maxRetries: 2 })
}

/**
 * Descargar media desde WAHA
 */
const downloadMediaWaha = async (mediaUrl) => {
  let downloadUrl = mediaUrl

  // Si la URL es interna (IP directa), convertir a URL pública
  if (mediaUrl.includes('52.191.211.223') || mediaUrl.includes('localhost') || mediaUrl.includes('127.0.0.1')) {
    const urlObj = new URL(mediaUrl)
    const filePath = urlObj.pathname
    downloadUrl = `${WAHA_BASE_URL}${filePath}`
    console.log(`🔄 [WAHA] URL convertida: ${mediaUrl} -> ${downloadUrl}`)
  }

  return withRetry(async () => {
    const resp = await axios.get(downloadUrl, {
      responseType: 'arraybuffer',
      headers: {
        'X-Api-Key': WAHA_API_KEY
      },
      timeout: TIMEOUTS.download
    })

    return Buffer.from(resp.data)
  }, { context: 'downloadMedia', maxRetries: 2 })
}

/**
 * Editar mensaje
 * @param {string} sessionName - Nombre de la sesión WAHA
 * @param {string} chatId - ID del chat (número de teléfono)
 * @param {string} messageId - ID corto del mensaje (wamid)
 * @param {string} newText - Nuevo texto del mensaje
 * @param {boolean} isOutgoing - true si es mensaje saliente, false si es entrante
 */
const editMessageWaha = async (sessionName, chatId, messageId, newText, isOutgoing = true) => {
  const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

  // WAHA requiere el messageId en formato: {fromMe}_{chatId}_{messageId}
  const fullMessageId = `${isOutgoing}_${formattedChatId}_${messageId}`

  return withRetry(async () => {
    // WAHA usa PUT /api/{session}/chats/{chatId}/messages/{messageId}
    const resp = await wahaClient.put(
      `/api/${sessionName}/chats/${formattedChatId}/messages/${fullMessageId}`,
      { text: newText },
      { timeout: TIMEOUTS.message }
    )

    return resp
  }, { context: 'editMessage' })
}

/**
 * Eliminar mensaje
 * @param {string} sessionName - Nombre de la sesión WAHA
 * @param {string} chatId - ID del chat (número de teléfono)
 * @param {string} messageId - ID corto del mensaje (wamid)
 * @param {boolean} isOutgoing - true si es mensaje saliente, false si es entrante
 */
const deleteMessageWaha = async (sessionName, chatId, messageId, isOutgoing = true) => {
  const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

  // WAHA requiere el messageId en formato: {fromMe}_{chatId}_{messageId}
  // Ejemplo: true_51949002838@c.us_3EB0800A81B00A9917C466
  const fullMessageId = `${isOutgoing}_${formattedChatId}_${messageId}`

  // WAHA usa la ruta: DELETE /api/{session}/chats/{chatId}/messages/{messageId}
  const resp = await wahaClient.delete(
    `/api/${sessionName}/chats/${formattedChatId}/messages/${fullMessageId}`,
    { timeout: TIMEOUTS.message }
  )

  return resp
}

// ==================== EXPORTS ====================

module.exports = {
  // Configuración
  TIMEOUTS,
  RETRY_CONFIG,
  WAHA_WEBHOOK_EVENTS,

  // Utilidades
  checkSessionHealth,
  withRetry,

  // Session Management
  createSessionWaha,
  getQRCodeWaha,
  getSessionStatusWaha,
  stopSessionWaha,
  restartSessionWaha,
  deleteSessionWaha,
  updateSessionWebhookWaha,
  getMeWaha,
  checkSessionStoreEnabled,    // Verificar si store está habilitado
  recreateSessionWithStore,    // Recrear sesión con store

  // Messaging
  sendMessageTextWaha,
  sendMessageTextQuotedWaha,
  sendMessageImageWaha,
  sendMessageVideoWaha,
  sendMessageDocumentWaha,
  sendMessageVoiceWaha,
  sendMessageMediaQuotedWaha,

  // Status & Utilities
  sendMarkReadWaha,
  checkNumberExistsWaha,
  downloadMediaWaha,
  editMessageWaha,
  deleteMessageWaha
}
