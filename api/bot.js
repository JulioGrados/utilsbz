const { get, getOne, post, put, remove } = require('../lib/request')

const listBots = async params => {
  return get('/bot', params)
}

const createBot = async data => {
  return post('/bot', data)
}

const detailBot = async (id, params, jwt) => {
  return getOne(`/bot/${id}`, params, jwt)
}

const updateBot = async (id, data) => {
  return put(`/bot/${id}`, data)
}

const removeBot = async id => {
  return remove(`/bot/${id}`)
}

module.exports = {
  listBots,
  createBot,
  updateBot,
  detailBot,
  removeBot
}
