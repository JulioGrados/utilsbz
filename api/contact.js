const { get, getOne, post, put, remove } = require('../lib/request')

const listContacts = async params => {
  return get('/contact', params)
}

const createContact = async data => {
  return post('/contact', data)
}

const detailContact = async (id, params, jwt) => {
  return getOne(`/contact/${id}`, params, jwt)
}

const updateContact = async (id, data) => {
  return put(`/contact/${id}`, data)
}

const removeContact = async id => {
  return remove(`/contact/${id}`)
}

module.exports = {
  listContacts,
  createContact,
  updateContact,
  detailContact,
  removeContact
}
