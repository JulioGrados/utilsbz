const { get, getOne, post, put, remove } = require('../lib/request')

const listTimelines = async params => {
  return get('/timeline', params)
}

const createTimeline = async data => {
  return post('/timeline', data)
}

const detailTimeline = async (id, params, jwt) => {
  return getOne(`/timeline/${id}`, params, jwt)
}

const updateTimeline = async (id, data) => {
  return put(`/timeline/${id}`, data)
}

const removeTimeline = async id => {
  return remove(`/timeline/${id}`)
}

module.exports = {
  listTimelines,
  createTimeline,
  updateTimeline,
  detailTimeline,
  removeTimeline
}
