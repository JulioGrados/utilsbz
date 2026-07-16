const { get, post, put } = require('../lib/request')

// get-or-create del chat de soporte del usuario logueado (incluye welcome)
const getSupportChat = async params => {
  return get('/support/chat', params)
}

// histórico paginado: params = { query: { supportChat }, sort, limit, skip }
const listSupportMessages = async params => {
  return get('/support/messages', params)
}

// mensaje de texto: data = { text }
const createSupportMessage = async data => {
  return post('/support/messages', data)
}

// adjunto: data = FormData con campos 'file' (binario) y 'data' (JSON string)
const createSupportMessageMedia = async data => {
  return post('/support/messages/media', data)
}

// marcar leídas las respuestas del agente
const readSupportMessages = async data => {
  return put('/support/read', data)
}

// --- Bandeja de soporte (dashbz, solo staff de Bizeus) ---

// lista de conversaciones de soporte (populadas con user y company)
const listSupportInbox = async params => {
  return get('/support/inbox', params)
}

// histórico de una conversación: params = { sort, limit, skip }
const listSupportInboxMessages = async (id, params) => {
  return get(`/support/inbox/${id}/messages`, params)
}

// responder como agente: data = { supportChat, text }
const replySupportMessage = async data => {
  return post('/support/reply', data)
}

// respuesta con adjunto: data = FormData con 'file' (binario) y 'data' (JSON string: { supportChat, typeMsg, text? })
const replySupportMessageMedia = async data => {
  return post('/support/reply/media', data)
}

// marcar leídos los mensajes del usuario (countAgent → 0)
const readSupportInbox = async id => {
  return put(`/support/inbox/${id}/read`, {})
}

// cambiar estado: data = { status: 'abierto' | 'resuelto' }
const updateSupportStatus = async (id, data) => {
  return put(`/support/inbox/${id}/status`, data)
}

module.exports = {
  getSupportChat,
  listSupportMessages,
  createSupportMessage,
  createSupportMessageMedia,
  readSupportMessages,
  listSupportInbox,
  listSupportInboxMessages,
  replySupportMessage,
  replySupportMessageMedia,
  readSupportInbox,
  updateSupportStatus
}