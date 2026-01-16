const axios = require('axios')

/**
 * Cliente base para WAHA API
 * Similar a las funciones de greenApi.js pero para WAHA
 */

// ==================== CONFIGURACIÓN ====================

const WAHA_BASE_URL = process.env.WAHA_BASE_URL || 'https://appbizeus-waha-prod.m1imp2.easypanel.host'
const WAHA_API_KEY = process.env.WAHA_API_KEY || 'waha_sk_bizeus_8d1a6e35234fbcb82ddffc4a1eaad2c0'

/**
 * Cliente HTTP configurado para WAHA
 */
const wahaClient = axios.create({
  baseURL: WAHA_BASE_URL,
  headers: {
    'X-Api-Key': WAHA_API_KEY,
    'Content-Type': 'application/json'
  },
  timeout: 30000
})

// ==================== SESSION MANAGEMENT ====================

/**
 * Crear o iniciar sesión en WAHA
 * @param {string} sessionName - Nombre único de la sesión
 * @param {string} webhookUrl - URL para recibir webhooks
 */
const createSessionWaha = async (sessionName, webhookUrl) => {
  try {
    const resp = await wahaClient.post('/api/sessions', {
      name: sessionName,
      start: true,
      config: {
        webhooks: [{
          url: webhookUrl,
          events: ['message', 'message.ack', 'session.status'],
          hmac: null,
          retries: {
            attempts: 3,
            delaySeconds: 2
          }
        }]
      }
    })
    return resp.data
  } catch (error) {
    console.error('Error creando sesión WAHA:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Reiniciar sesión para obtener nuevo QR
 * @param {string} sessionName
 */
const restartSessionWaha = async (sessionName) => {
  try {
    // Primero detener la sesión
    await wahaClient.post(`/api/sessions/${sessionName}/stop`).catch(() => {})
    // Esperar un momento
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Iniciar la sesión nuevamente
    const resp = await wahaClient.post(`/api/sessions/${sessionName}/start`)
    return resp.data
  } catch (error) {
    console.error('Error reiniciando sesión WAHA:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Obtener QR code para autenticación
 * @param {string} sessionName
 * @param {boolean} forceRestart - Si es true, reinicia la sesión para obtener nuevo QR
 * @returns {Promise<{value: string}>} QR en base64
 */
const getQRCodeWaha = async (sessionName, forceRestart = false) => {
  try {
    // Verificar estado de la sesión primero
    let sessionStatus
    try {
      const statusResp = await wahaClient.get(`/api/sessions/${sessionName}`)
      sessionStatus = statusResp.data?.status
      console.log(`📊 [WAHA] Estado de sesión ${sessionName}: ${sessionStatus}`)
    } catch (e) {
      sessionStatus = 'UNKNOWN'
    }

    // Si la sesión no está en SCAN_QR_CODE, necesitamos reiniciarla
    if (forceRestart || (sessionStatus !== 'SCAN_QR_CODE' && sessionStatus !== 'STARTING')) {
      console.log(`🔄 [WAHA] Reiniciando sesión para obtener nuevo QR...`)
      await restartSessionWaha(sessionName)
      // Esperar a que la sesión esté lista para escanear
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Obtener QR
    const resp = await wahaClient.get(`/api/${sessionName}/auth/qr`, {
      params: { format: 'image' },
      responseType: 'arraybuffer'
    })
    // Convertir a base64
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
 * @param {string} sessionName
 */
const getSessionStatusWaha = async (sessionName) => {
  try {
    const resp = await wahaClient.get(`/api/sessions/${sessionName}`)
    return resp.data
  } catch (error) {
    throw error
  }
}

/**
 * Detener sesión
 * @param {string} sessionName
 */
const stopSessionWaha = async (sessionName) => {
  try {
    const resp = await wahaClient.post(`/api/sessions/${sessionName}/stop`)
    return resp.data
  } catch (error) {
    throw error
  }
}

/**
 * Eliminar sesión completamente
 * @param {string} sessionName
 */
const deleteSessionWaha = async (sessionName) => {
  try {
    const resp = await wahaClient.delete(`/api/sessions/${sessionName}`)
    return resp.data
  } catch (error) {
    throw error
  }
}

/**
 * Obtener información del usuario autenticado
 * @param {string} sessionName
 */
const getMeWaha = async (sessionName) => {
  try {
    const resp = await wahaClient.get(`/api/sessions/${sessionName}/me`)
    return resp.data
  } catch (error) {
    throw error
  }
}

// ==================== MESSAGING ====================

/**
 * Enviar mensaje de texto
 * Similar a sendMessageTextGreen()
 * @param {string} sessionName
 * @param {string} chatId - Formato: 5212345678901@c.us
 * @param {string} text
 */
const sendMessageTextWaha = async (sessionName, chatId, text) => {
  try {
    // Asegurar formato correcto
    const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

    const resp = await wahaClient.post('/api/sendText', {
      session: sessionName,
      chatId: formattedChatId,
      text: text
    })

    console.log('Mensaje enviado WAHA:', resp.data)
    return resp
  } catch (error) {
    console.error('Error enviando mensaje WAHA:', error.response?.data || error.message)
    return null
  }
}

/**
 * Enviar mensaje de texto con quoted (respuesta)
 * Similar a sendMessageTextQuotedGreen()
 */
const sendMessageTextQuotedWaha = async (sessionName, chatId, text, quotedMessageId) => {
  try {
    const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

    const resp = await wahaClient.post('/api/sendText', {
      session: sessionName,
      chatId: formattedChatId,
      text: text,
      reply_to: quotedMessageId
    })

    console.log('Mensaje quoted enviado WAHA:', resp.data)
    return resp
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Enviar imagen
 * @param {string} sessionName
 * @param {string} chatId
 * @param {string} url - URL de la imagen
 * @param {string} caption - Texto opcional
 */
const sendMessageImageWaha = async (sessionName, chatId, url, caption = '') => {
  try {
    const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

    const resp = await wahaClient.post('/api/sendImage', {
      session: sessionName,
      chatId: formattedChatId,
      file: { url: url },
      caption: caption
    })

    return resp
  } catch (error) {
    throw error
  }
}

/**
 * Enviar video
 */
const sendMessageVideoWaha = async (sessionName, chatId, url, caption = '') => {
  try {
    const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

    const resp = await wahaClient.post('/api/sendVideo', {
      session: sessionName,
      chatId: formattedChatId,
      file: { url: url },
      caption: caption
    })

    return resp
  } catch (error) {
    throw error
  }
}

/**
 * Enviar documento
 * Similar a sendMessageMediaGreen()
 */
const sendMessageDocumentWaha = async (sessionName, chatId, url, filename = '', caption = '') => {
  try {
    const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

    const resp = await wahaClient.post('/api/sendFile', {
      session: sessionName,
      chatId: formattedChatId,
      file: {
        url: url,
        filename: filename
      },
      caption: caption
    })

    return resp
  } catch (error) {
    throw error
  }
}

/**
 * Enviar audio/voz
 */
const sendMessageVoiceWaha = async (sessionName, chatId, url) => {
  try {
    const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

    const resp = await wahaClient.post('/api/sendVoice', {
      session: sessionName,
      chatId: formattedChatId,
      file: { url: url }
    })

    return resp
  } catch (error) {
    throw error
  }
}

/**
 * Enviar media con quoted (respuesta)
 */
const sendMessageMediaQuotedWaha = async (sessionName, chatId, url, filename = '', caption = '', quotedMessageId = '') => {
  try {
    const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

    const resp = await wahaClient.post('/api/sendFile', {
      session: sessionName,
      chatId: formattedChatId,
      file: {
        url: url,
        filename: filename
      },
      caption: caption,
      reply_to: quotedMessageId
    })

    return resp
  } catch (error) {
    throw error
  }
}

// ==================== STATUS & UTILITIES ====================

/**
 * Marcar chat como leído
 * Similar a sendMarkReadGreen()
 */
const sendMarkReadWaha = async (sessionName, chatId) => {
  try {
    const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

    const resp = await wahaClient.post('/api/sendSeen', {
      session: sessionName,
      chatId: formattedChatId
    })

    return resp
  } catch (error) {
    throw error
  }
}

/**
 * Verificar si número tiene WhatsApp
 * Similar a existWspGreen()
 */
const checkNumberExistsWaha = async (sessionName, phoneNumber) => {
  try {
    const resp = await wahaClient.post('/api/checkNumberStatus', {
      session: sessionName,
      phoneNumber: phoneNumber
    })

    return resp
  } catch (error) {
    throw error
  }
}

/**
 * Descargar media desde WAHA
 * @param {string} mediaUrl - URL del archivo (puede ser interna o pública)
 * @returns {Promise<Buffer>}
 */
const downloadMediaWaha = async (mediaUrl) => {
  try {
    // Extraer el path del archivo (ej: /api/files/session_xxx/file.jpeg)
    let downloadUrl = mediaUrl

    // Si la URL es interna (IP directa), convertir a URL pública
    if (mediaUrl.includes('52.191.211.223') || mediaUrl.includes('localhost') || mediaUrl.includes('127.0.0.1')) {
      const urlObj = new URL(mediaUrl)
      const filePath = urlObj.pathname // /api/files/session_xxx/file.jpeg
      downloadUrl = `${WAHA_BASE_URL}${filePath}`
      console.log(`🔄 [WAHA] URL convertida: ${mediaUrl} -> ${downloadUrl}`)
    }

    const resp = await axios.get(downloadUrl, {
      responseType: 'arraybuffer',
      headers: {
        'X-Api-Key': WAHA_API_KEY
      },
      timeout: 60000
    })

    return Buffer.from(resp.data)
  } catch (error) {
    console.error('Error descargando media:', error.message)
    throw error
  }
}

/**
 * Editar mensaje (si WAHA lo soporta)
 */
const editMessageWaha = async (sessionName, chatId, messageId, newText) => {
  try {
    const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

    // Nota: WAHA puede no soportar esto aún, verificar docs
    const resp = await wahaClient.post('/api/editMessage', {
      session: sessionName,
      chatId: formattedChatId,
      messageId: messageId,
      text: newText
    })

    return resp
  } catch (error) {
    console.error('Error editando mensaje:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Eliminar mensaje
 */
const deleteMessageWaha = async (sessionName, chatId, messageId) => {
  try {
    const formattedChatId = chatId.includes('@') ? chatId : `${chatId}@c.us`

    const resp = await wahaClient.delete('/api/deleteMessage', {
      data: {
        session: sessionName,
        chatId: formattedChatId,
        messageId: messageId
      }
    })

    return resp
  } catch (error) {
    throw error
  }
}

// ==================== EXPORTS ====================

module.exports = {
  // Session Management
  createSessionWaha,
  getQRCodeWaha,
  getSessionStatusWaha,
  stopSessionWaha,
  restartSessionWaha,
  deleteSessionWaha,
  getMeWaha,

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
