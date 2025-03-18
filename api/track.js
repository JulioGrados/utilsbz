const { get, getOne, post, put, remove } = require('../lib/request')

const listTracks = async params => {
  return get('/track', params)
}

const createTrack = async data => {
  return post('/track', data)
}

const detailTrack = async (id, params) => {
  return getOne(`/track/${id}`, params)
}

const updateTrack = async (id, data) => {
  return put(`/track/${id}`, data)
}

const removeTrack = async id => {
  return remove(`/track/${id}`)
}

module.exports = {
  listTracks,
  createTrack,
  updateTrack,
  detailTrack,
  removeTrack
}
