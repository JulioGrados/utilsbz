const { get, getOne, post, put, remove } = require('../lib/request')

const listMessages = async params => {
  return get('/messages', params)
}

const createMessage = async data => {
  return post('/messages', data)
}

const createMessageMedia = async data => {
  return post('/messages/media', data)
}

const detailMessage = async (id, params) => {
  return getOne(`/messages/${id}`, params)
}

const updateMessage = async (id, data) => {
  return put(`/messages/${id}`, data)
}

const removeMessage = async id => {
  return remove(`/messages/${id}`)
}

// Reaccionar a un mensaje (emoji '' elimina la reacción). Solo WhatsApp (WAHA / Cloud API).
const reactMessage = async (id, emoji) => {
  return post(`/messages/${id}/reaction`, { emoji })
}

module.exports = {
  listMessages,
  createMessage,
  createMessageMedia,
  updateMessage,
  detailMessage,
  removeMessage,
  reactMessage
}
