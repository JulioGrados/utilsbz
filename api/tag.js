const { get, getOne, post, put, remove } = require('../lib/request')

const listTags = async params => {
  return get('/tag', params)
}

const createTag = async data => {
  return post('/tag', data)
}

const detailTag = async (id, params, jwt) => {
  return getOne(`/tag/${id}`, params, jwt)
}

const updateTag = async (id, data) => {
  return put(`/tag/${id}`, data)
}

const removeTag = async id => {
  return remove(`/tag/${id}`)
}

module.exports = {
  listTags,
  createTag,
  updateTag,
  detailTag,
  removeTag
}
