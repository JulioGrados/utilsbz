const { get, getOne, post, put, remove } = require('../lib/request')

const listLogs = async params => {
  return get('/logs', params)
}

const createLog = async data => {
  return post('/logs', data)
}

const detailLog = async (id, params) => {
  return getOne(`/logs/${id}`, params)
}

const updateLog = async (id, data) => {
  return put(`/logs/${id}`, data)
}

const removeLog = async id => {
  return remove(`/logs/${id}`)
}

module.exports = {
  listLogs,
  createLog,
  updateLog,
  detailLog,
  removeLog
}
