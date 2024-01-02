const { get, getOne, post, put, remove } = require('../lib/request')

const listChats = async params => {
  return get('/chats', params)
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

const removeChat = async id => {
  return remove(`/chats/${id}`)
}

module.exports = {
  listChats,
  createChat,
  createoreditChat,
  updateChat,
  detailChat,
  removeChat
}
