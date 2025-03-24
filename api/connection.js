const { get, getOne, post, put, remove } = require('../lib/request')

const listConnections = async params => {
  return get('/connection', params)
}

const setConnectionFB = async data => {
  return post('/connection/fb', data)
}

const setConnectionIG = async data => {
  return post('/connection/ig', data)
}

const createConnection = async data => {
  return post('/connection', data)
}

const getQRConnection = async data => {
  return get('/connection/qr', data)
}

const detailConnection = async (id, params, jwt) => {
  return getOne(`/connection/${id}`, params, jwt)
}

const updateConnection = async (id, data) => {
  return put(`/connection/${id}`, data)
}

const removeConnection = async id => {
  return remove(`/connection/${id}`)
}

module.exports = {
  listConnections,
  setConnectionFB,
  setConnectionIG,
  createConnection,
  updateConnection,
  detailConnection,
  getQRConnection,
  removeConnection
}
