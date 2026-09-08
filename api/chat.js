const { get, getOne, post, put, remove } = require('../lib/request')

const listChats = async params => {
  return get('/chats', params)
}

const listChatsPipeline = async params => {
  return get('/chats/pipeline', params)
}

const countFilters = async params => {
  return get('/chats/counts', params)
}

const filterChats = async params => {
  return get('/chats/filter', params)
}

const updateChatsManyTime = async data => {
  return post('/chats/many', data)
}

const filterMessages = async params => {
  return get('/chats/message', params)
}

const countChats = async params => {
  return get('/chats/count', params)
}

const createChat = async data => {
  return post('/chats', data)
}

const createoreditChat = async data => {
  return post('/chats/addoredit', data)
}

const detailChat = async (id, params) => {
  return getOne(`/chats/${id}`, params)
}

const updateChat = async (id, data) => {
  return put(`/chats/${id}`, data)
}

// Pide al backend el teléfono real de un chat guardado con un @lid.
// No recibe datos: el servidor resuelve la identidad contra WhatsApp.
const resolveChatIdentity = async id => {
  return post(`/chats/${id}/resolve-identity`, {})
}

// Guarda a mano el teléfono de un chat identificado por @lid.
// `numero` va SIN código de país; `mobileCode` lo aporta el selector de país.
// `forzar` solo se manda tras un 409 SIN_VERIFICAR, cuando el agente confirma.
const updateChatMobile = async (id, { mobileCode, numero, forzar = false }) => {
  return post(`/chats/${id}/update-mobile`, { mobileCode, numero, forzar })
}

const moveChat = async (id, data) => {
  return put(`/chats/${id}/move`, data)
}

const removeChat = async id => {
  return remove(`/chats/${id}`)
}

module.exports = {
  resolveChatIdentity,
  updateChatMobile,
  listChats,
  listChatsPipeline,
  countFilters,
  filterChats,
  filterMessages,
  countChats,
  createChat,
  createoreditChat,
  updateChat,
  updateChatsManyTime,
  moveChat,
  detailChat,
  removeChat
}
