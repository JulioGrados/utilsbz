const { get, getOne, post, put, remove } = require('../lib/request')

const listUploads = async params => {
  return get('/upload', params)
}

const createUpload = async data => {
  return post('/upload', data)
}

const detailUpload = async (id, params) => {
  return getOne(`/upload/${id}`, params)
}

const updateUpload = async (id, data) => {
  return put(`/upload/${id}`, data)
}

const removeUpload = async id => {
  return remove(`/upload/${id}`)
}

module.exports = {
  listUploads,
  createUpload,
  updateUpload,
  detailUpload,
  removeUpload
}
