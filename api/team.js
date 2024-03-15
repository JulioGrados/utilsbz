const { get, getOne, post, put, remove } = require('../lib/request')

const listTeams = async params => {
  return get('/team', params)
}

const createTeam = async data => {
  return post('/team', data)
}

const detailTeam = async (id, params, jwt) => {
  return getOne(`/team/${id}`, params, jwt)
}

const updateTeam = async (id, data) => {
  return put(`/team/${id}`, data)
}

const removeTeam = async id => {
  return remove(`/team/${id}`)
}

module.exports = {
  listTeams,
  createTeam,
  updateTeam,
  detailTeam,
  removeTeam
}
