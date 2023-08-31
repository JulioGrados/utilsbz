const { get, getOne, post, put, remove } = require('../lib/request')

const listMessages = async params => {
  return get('/messages', params)
}

const createMessage = async data => {
  return post('/messages', data)
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

module.exports = {
  listMessages,
  createMessage,
  updateMessage,
  detailMessage,
  removeMessage
}
