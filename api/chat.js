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

// Guarda a mano el teléfono de un chat identificado por @lid.
// `numero` va SIN código de país; `mobileCode` lo aporta el selector de país.
// `forzar` y `fusionar` solo se mandan tras un 409, cuando el agente confirma:
// `forzar` = guardar aunque WhatsApp no confirme que el número sea suyo;
// `fusionar` = unir con el chat que ya tiene ese número, conservando este.
const updateChatMobile = async (id, { mobileCode, numero, forzar = false, fusionar = false }) => {
  return post(`/chats/${id}/update-mobile`, { mobileCode, numero, forzar, fusionar })
}

const moveChat = async (id, data) => {
  return put(`/chats/${id}/move`, data)
}

const removeChat = async id => {
  return remove(`/chats/${id}`)
}

module.exports = {
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
