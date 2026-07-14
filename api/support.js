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

module.exports = {
  getSupportChat,
  listSupportMessages,
  createSupportMessage,
  createSupportMessageMedia,
  readSupportMessages
}