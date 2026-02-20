const { get, getOne, post, put, remove } = require('../lib/request')

const listConnections = async params => {
  return get('/connection', params)
}

const setConnectionFB = async data => {
  return post('/connection/fb', data)
}

const setConnectionIG = async data => {
  return post('/connection/ig', data)
}

const createConnection = async data => {
  return post('/connection', data)
}

const getQRConnection = async data => {
  return get('/connection/qr', data)
}

const getStatusConnections = async data => {
  return get('/connection/status', data)
}

const detailConnection = async (id, params, jwt) => {
  return getOne(`/connection/${id}`, params, jwt)
}

const updateConnection = async (id, data) => {
  return put(`/connection/${id}`, data)
}

const removeConnection = async id => {
  return remove(`/connection/${id}`)
}

// ==========================================
// WAHA API FUNCTIONS
// ==========================================

/**
 * Crear nueva conexión WAHA
 * @param {Object} data - { name, company }
 * @returns {Promise} Conexión creada con sessionName
 */
const createWahaConnection = async data => {
  return post('/waha', data)
}

/**
 * Obtener QR code de conexión WAHA
 * @param {Object} params - { connection: connectionId }
 * @returns {Promise} { qr: "data:image/png;base64,...", status: "SCAN_QR_CODE" }
 */
const getWahaQRCode = async params => {
  return get('/waha/qr', params)
}

/**
 * Obtener estado de conexión WAHA
 * @param {Object} params - { connection: connectionId }
 * @returns {Promise} { wahaStatus: "WORKING", status: "authorized", isReady: true }
 */
const getWahaStatus = async params => {
  return get('/waha/status', params)
}

/**
 * Obtener detalle de conexión WAHA
 * @param {string} id - ID de la conexión
 * @param {Object} params - Parámetros adicionales
 * @returns {Promise} Conexión
 */
const detailWahaConnection = async (id, params) => {
  return getOne(`/waha/${id}`, params)
}

/**
 * Actualizar conexión WAHA
 * @param {string} id - ID de la conexión
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Conexión actualizada
 */
const updateWahaConnection = async (id, data) => {
  return put(`/waha/${id}`, data)
}

/**
 * Eliminar conexión WAHA
 * @param {string} id - ID de la conexión
 * @returns {Promise} { success: true }
 */
const deleteWahaConnection = async id => {
  return remove(`/waha/${id}`)
}

// ==========================================
// CLOUD API (Meta WhatsApp Business) FUNCTIONS
// ==========================================

/**
 * Procesar Embedded Signup de Cloud API
 * @param {Object} data - { code, company, teams, name, phoneNumberId, wabaId }
 * @returns {Promise} { success: true, connection: {...} }
 */
const processCloudApiSignup = async data => {
  return post('/cloudapi/signup', data)
}

/**
 * Obtener estado de conexión Cloud API
 * @param {Object} params - { connection: connectionId }
 * @returns {Promise} { success: true, connection: {...}, tokenValid: boolean }
 */
const getCloudApiStatus = async params => {
  return get('/cloudapi/status', params)
}

/**
 * Obtener detalle de conexión Cloud API
 * @param {string} id - ID de la conexión
 * @param {Object} params - Parámetros adicionales
 * @returns {Promise} Conexión
 */
const detailCloudApiConnection = async (id, params) => {
  return getOne(`/cloudapi/${id}`, params)
}

/**
 * Actualizar conexión Cloud API
 * @param {string} id - ID de la conexión
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} Conexión actualizada
 */
const updateCloudApiConnection = async (id, data) => {
  return put(`/cloudapi/${id}`, data)
}

/**
 * Eliminar conexión Cloud API
 * @param {string} id - ID de la conexión
 * @returns {Promise} { success: true }
 */
const deleteCloudApiConnection = async id => {
  return remove(`/cloudapi/${id}`)
}

/**
 * Listar números de teléfono de un WABA
 * @param {string} wabaId - ID del WhatsApp Business Account
 * @param {Object} params - { accessToken }
 * @returns {Promise} { success: true, phoneNumbers: [...] }
 */
const listCloudApiPhoneNumbers = async (wabaId, params) => {
  return get(`/cloudapi/waba/${wabaId}/phone-numbers`, params)
}

module.exports = {
  listConnections,
  setConnectionFB,
  setConnectionIG,
  createConnection,
  updateConnection,
  detailConnection,
  getQRConnection,
  getStatusConnections,
  removeConnection,
  // WAHA
  createWahaConnection,
  getWahaQRCode,
  getWahaStatus,
  detailWahaConnection,
  updateWahaConnection,
  deleteWahaConnection,
  // Cloud API (Meta WhatsApp Business)
  processCloudApiSignup,
  getCloudApiStatus,
  detailCloudApiConnection,
  updateCloudApiConnection,
  deleteCloudApiConnection,
  listCloudApiPhoneNumbers
}
