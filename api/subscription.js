const { get, getOne, post, put, remove } = require('../lib/request')

const listSubscriptions = async params => {
  return get('/subscription', params)
}

const createSubscription = async data => {
  return post('/subscription', data)
}

const detailSubscription = async (id, params, jwt) => {
  return getOne(`/subscription/${id}`, params, jwt)
}

const detailMeSubscription = async (id, params) => {
  return getOne(`/subscription/me/${id}`, params)
}

const updateSubscription = async (id, data) => {
  return put(`/subscription/${id}`, data)
}

const removeSubscription = async id => {
  return remove(`/subscription/${id}`)
}

const createManualSubscription = async data => {
  return post('/subscription/manual', data)
}

const triggerSubscriptionCheck = async () => {
  return post('/subscription/trigger-check', {})
}

module.exports = {
  listSubscriptions,
  createSubscription,
  updateSubscription,
  detailSubscription,
  detailMeSubscription,
  removeSubscription,
  createManualSubscription,
  triggerSubscriptionCheck
}