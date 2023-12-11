const { get, getOne, post, put, remove } = require('../lib/request')

const listCompanys = async params => {
  return get('/company', params)
}

const createCompany = async data => {
  return post('/company', data)
}

const detailCompany = async (id, params, jwt) => {
  return getOne(`/company/${id}`, params, jwt)
}

const updateCompany = async (id, data) => {
  return put(`/company/${id}`, data)
}

const removeCompany = async id => {
  return remove(`/company/${id}`)
}

module.exports = {
  listCompanys,
  createCompany,
  updateCompany,
  detailCompany,
  removeCompany
}
