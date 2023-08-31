const { get, getOne, post, put, remove } = require('../lib/request')

const listWhatsapps = async params => {
  return get('/whatsapps', params)
}

const createWhatsapp = async data => {
  return post('/whatsapps', data)
}

const detailWhatsapp = async (id, params) => {
  return getOne(`/whatsapps/${id}`, params)
}

const updateWhatsapp = async (id, data) => {
  return put(`/whatsapps/${id}`, data)
}

const sendCBWhatsapp = async params => {
  return post('/whatsapps/admin', params)
}

const removeWhatsapp = async id => {
  return remove(`/whatsapps/${id}`)
}

module.exports = {
  listWhatsapps,
  createWhatsapp,
  updateWhatsapp,
  detailWhatsapp,
  sendCBWhatsapp,
  removeWhatsapp
}
