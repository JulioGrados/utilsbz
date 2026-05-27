const { get } = require('../lib/request')

const listPayments = async params => {
  return get('/payment', params)
}

const listMyPayments = async () => {
  return get('/payment/me')
}

module.exports = { listPayments, listMyPayments }
