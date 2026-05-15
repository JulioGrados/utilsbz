const { get, getOne, post, put, remove } = require('../lib/request')

const getPlans = asyn => {
  return get('/billing/plans')
}

const createCheckoutSession = async data => {
  return post('/billing/checkout', data)
}

const getProrationPreview = async (params) => {
  return get(`/billing/proration-preview`, params)
}

const changePlan = async (data) => {
  return post(`/billing/change-plan`, data)
}

const cancelSubscription = async  => {
  return post(`/billing/cancel`, {})
}

const reactivateSubscription = async  => {
  return post(`/billing/reactivate`, {})
}

const createPortalSession = async  => {
  return post(`/billing/portal`, {})
}

const updateBillingInfo = async  => {
  return put(`/billing/portal`, {})
}

module.exports = {
  getPlans,
  createCheckoutSession,
  changePlan,
  getProrationPreview,
  cancelSubscription,
  reactivateSubscription,
  createPortalSession,
  updateBillingInfo
}
