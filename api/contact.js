const { get, getOne, post, put, remove } = require('../lib/request')

const listContacts = async params => {
  return get('/contact', params)
}

const createContact = async data => {
  return post('/contact', data)
}

const createOpenContacts = async data => {
  return post('/open/contact/upload', data)
}

const detailContact = async (id, params, jwt) => {
  return getOne(`/contact/${id}`, params, jwt)
}

const updateContact = async (id, data) => {
  return put(`/contact/${id}`, data)
}

// Pide al backend el teléfono real de un contacto guardado con un @lid.
const resolveContactIdentity = async id => {
  return post(`/contact/${id}/resolve-identity`, {})
}

const removeContact = async id => {
  return remove(`/contact/${id}`)
}

module.exports = {
  resolveContactIdentity,
  listContacts,
  createContact,
  createOpenContacts,
  updateContact,
  detailContact,
  removeContact
}
