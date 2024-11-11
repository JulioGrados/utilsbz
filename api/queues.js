const { get, getOne, post, put, remove } = require('../lib/request')

const listQueues = async params => {
  return get('/queue', params)
}

const createQueue = async data => {
  return post('/queue', data)
}

const detailQueue = async (id, params, jwt) => {
  return getOne(`/queue/${id}`, params, jwt)
}

const updateQueue = async (id, data) => {
  return put(`/queue/${id}`, data)
}

const removeQueue = async id => {
  return remove(`/queue/${id}`)
}

module.exports = {
  listQueues,
  createQueue,
  updateQueue,
  detailQueue,
  removeQueue
}
