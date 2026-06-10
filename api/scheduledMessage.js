const { get, post, put, remove } = require('../lib/request')

const listScheduledMessages = async params => {
  return get('/scheduled-messages', params)
}

const createScheduledMessage = async data => {
  return post('/scheduled-messages', data)
}

const createScheduledMessageMedia = async data => {
  return post('/scheduled-messages/media', data, true)
}

const updateScheduledMessage = async (id, data) => {
  return put(`/scheduled-messages/${id}`, data)
}

const cancelScheduledMessage = async id => {
  return remove(`/scheduled-messages/${id}`)
}

module.exports = {
  listScheduledMessages,
  createScheduledMessage,
  createScheduledMessageMedia,
  updateScheduledMessage,
  cancelScheduledMessage
}
