'use strict'

const axios = require('axios')
const crypto = require('crypto')

/**
 * Cliente para la API de Zadarma (telefonía / PBX en la nube).
 *
 * Doc: https://zadarma.com/en/support/api/  ·  Integración CRM: https://zadarma.com/en/support/instructions/crm-zadarma/
 * Ver también: ../../docs/integraciones/zadarma-telefonia.md
 *
 * IMPORTANTE (multi-tenant): las credenciales (key/secret) son POR EMPRESA y se guardan en la
 * `Connection` (`zadarmaKey` / `zadarmaSecret`). Por eso cada función recibe `key` y `secret` como
 * argumentos y NO los lee de `process.env`. Los `ZADARMA_KEY`/`ZADARMA_SECRET` de env solo sirven
 * como fallback para una cuenta de pruebas.
 */

// ==================== CONFIGURACIÓN ====================

const ZADARMA_BASE_URL = process.env.ZADARMA_BASE_URL || 'https://api.zadarma.com'

const TIMEOUTS = {
  default: 20000
}

const RETRY_CONFIG = {
  maxRetries: 2,
  baseDelayMs: 800,
  maxDelayMs: 6000,
  retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'ENETUNREACH']
}

const zadarmaClient = axios.create({
  baseURL: ZADARMA_BASE_URL,
  timeout: TIMEOUTS.default
})

// ==================== FIRMA (HMAC-SHA1) ====================
// Réplica exacta de la librería oficial `zadarma/user-api-v1` (lib/Client.php):
//   paramsString = http_build_query( ksort(params), PHP_QUERY_RFC1738 )
//   signature    = base64( hmac_sha1( method + paramsString + md5(paramsString), secret ) )
//   header       = "Authorization: <key>:<signature>"
// El `method` es la ruta con versión y barra final, p.ej. "/v1/request/callback/".

/**
 * urlencode compatible con PHP (RFC1738): espacios como '+' y codifica ! ' ( ) * ~.
 * Necesario para que la cadena firmada sea byte-idéntica a la que espera Zadarma.
 */
const phpUrlencode = (str) =>
  encodeURIComponent(String(str))
    .replace(/%20/g, '+')
    .replace(/[!'()*~]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())

/**
 * Construye el query string firmable: params sin null/undefined, ordenados por clave.
 */
const buildParamsString = (params = {}) => {
  const clean = {}
  Object.keys(params).forEach((k) => {
    const v = params[k]
    if (v !== null && v !== undefined && typeof v !== 'object') clean[k] = v
  })
  return Object.keys(clean)
    .sort()
    .map((k) => `${phpUrlencode(k)}=${phpUrlencode(clean[k])}`)
    .join('&')
}

/**
 * Firma al estilo de la lib oficial de Zadarma (PHP):
 *   base64_encode( hash_hmac('sha1', data, secret) )
 * OJO: en PHP `hash_hmac` devuelve un string HEX de 40 chars por defecto, y el base64 se aplica sobre
 * ESE string hex (NO sobre los 20 bytes crudos). Replicarlo exactamente o Zadarma responde
 * 401 "Not authorized". Reutilizable para verificar webhooks.
 */
const signString = (signatureString, secret) =>
  Buffer.from(
    crypto.createHmac('sha1', secret).update(signatureString).digest('hex'),
    'utf8'
  ).toString('base64')

/**
 * Cabecera Authorization para una petición firmada.
 */
const authHeader = (key, secret, method, paramsString) => {
  const md5 = crypto.createHash('md5').update(paramsString).digest('hex')
  const signature = signString(method + paramsString + md5, secret)
  return `${key}:${signature}`
}

// ==================== RETRY ====================

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isRetryableError = (error) => {
  if (RETRY_CONFIG.retryableErrors.includes(error.code)) return true
  if (error.code === 'ECONNABORTED' || (error.message || '').includes('timeout')) return true
  const status = error.response && error.response.status
  if (status >= 500) return true
  if (status === 429) return true // rate limit de Zadarma
  return false
}

const withRetry = async (fn, context = 'Zadarma API') => {
  let lastError
  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (!isRetryableError(error) || attempt >= RETRY_CONFIG.maxRetries) {
        console.error(`❌ [${context}] Error:`, error.response ? JSON.stringify(error.response.data) : error.message)
        throw error
      }
      const backoff = Math.min(RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt), RETRY_CONFIG.maxDelayMs)
      await delay(backoff)
    }
  }
  throw lastError
}

// ==================== PETICIÓN FIRMADA ====================

/**
 * Ejecuta una petición firmada a Zadarma.
 * @param {string} key    API user key (de la Connection)
 * @param {string} secret API secret
 * @param {string} path   ruta con versión y barra final, p.ej. '/v1/request/callback/'
 * @param {object} params parámetros de la petición
 * @param {string} httpMethod 'GET' | 'POST' | 'PUT' | 'DELETE'
 * @returns {Promise<object>} cuerpo JSON de la respuesta
 */
const request = async (key, secret, path, params = {}, httpMethod = 'GET') => {
  if (!key || !secret) throw new Error('Zadarma: faltan credenciales (key/secret)')

  const paramsString = buildParamsString(params)
  const Authorization = authHeader(key, secret, path, paramsString)
  const method = httpMethod.toUpperCase()

  return withRetry(async () => {
    let response
    if (method === 'GET') {
      const url = paramsString ? `${path}?${paramsString}` : path
      response = await zadarmaClient.get(url, { headers: { Authorization } })
    } else {
      response = await zadarmaClient.request({
        url: path,
        method,
        data: paramsString,
        headers: {
          Authorization,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    }
    const data = response.data
    // Zadarma responde { status: 'success' | 'error', ... }
    if (data && data.status === 'error') {
      const err = new Error(`Zadarma ${path}: ${data.message || 'error'}`)
      err.zadarma = data
      throw err
    }
    return data
  }, `Zadarma ${path}`)
}

// Solo dígitos (Zadarma filtra los números de teléfono así antes de firmar/enviar).
const onlyDigits = (v) => String(v || '').replace(/[^0-9]/g, '')

// ==================== MÉTODOS DE ALTO NIVEL ====================

/**
 * Saldo de la cuenta. Útil para validar credenciales al conectar el canal.
 * GET /v1/info/balance/
 */
const getBalance = (key, secret) => request(key, secret, '/v1/info/balance/')

/**
 * Genera la clave temporal del softphone WebRTC para una extensión SIP (vive 72h).
 * El front la usa junto al `sip` en `zadarmaWidgetFn`.
 * GET /v1/webrtc/get_key/  → { status:'success', key:'...' }
 * @param {string} sip login SIP / extensión completa del agente (p.ej. '100' o '123456-100')
 */
const getWebrtcKey = (key, secret, sip) =>
  request(key, secret, '/v1/webrtc/get_key/', { sip })

/**
 * Registra la URL que recibirá las notificaciones de llamada (NOTIFY_*).
 * POST /v1/pbx/callinfo/url/
 */
const setWebhookUrl = (key, secret, url) =>
  request(key, secret, '/v1/pbx/callinfo/url/', { url }, 'POST')

/**
 * Activa/desactiva qué notificaciones envía Zadarma. Flags: notify_start, notify_internal,
 * notify_answer, notify_end, notify_out_start, notify_out_end ('on' | 'off').
 * POST /v1/pbx/callinfo/notifications/
 */
const setNotifications = (key, secret, flags = {}) =>
  request(key, secret, '/v1/pbx/callinfo/notifications/', flags, 'POST')

/**
 * Click-to-call (fallback al softphone WebRTC): Zadarma timbra a `from` (extensión/número del
 * agente) y al contestar marca a `to` (contacto).
 * GET /v1/request/callback/
 */
const callback = (key, secret, { from, to, sip, predicted } = {}) =>
  request(key, secret, '/v1/request/callback/', {
    from: onlyDigits(from),
    to: onlyDigits(to),
    sip,
    predicted
  })

/**
 * Solicita el link temporal de descarga de una grabación.
 * GET /v1/pbx/record/request/  → { status:'success', link:'...', lifetime_till:... }
 * @param {object} opts { pbxCallId } o { callId }, y `lifetime` opcional (seg, 180–5184000)
 */
const recordRequest = (key, secret, { pbxCallId, callId, lifetime } = {}) =>
  request(key, secret, '/v1/pbx/record/request/', {
    pbx_call_id: pbxCallId,
    call_id: callId,
    lifetime
  })

module.exports = {
  // primitivas (reutilizables en el controller para verificar la firma del webhook)
  signString,
  buildParamsString,
  phpUrlencode,
  request,
  // métodos de alto nivel
  getBalance,
  getWebrtcKey,
  setWebhookUrl,
  setNotifications,
  callback,
  recordRequest
}
