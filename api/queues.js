const { get, getOne, post, put, remove } = require('../lib/request')

const listTags = async params => {
  return get('/queue', params)
}

const createTag = async data => {
  return post('/queue', data)
}

const detailTag = async (id, params, jwt) => {
  return getOne(`/queue/${id}`, params, jwt)
}

const updateTag = async (id, data) => {
  return put(`/queue/${id}`, data)
}

const removeTag = async id => {
  return remove(`/queue/${id}`)
}

module.exports = {
  listTags,
  createTag,
  updateTag,
  detailTag,
  removeTag
}
