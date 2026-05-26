const { get, post, put } = require('../lib/request')

const getPlans = async () => {
  return get('/billing/plans')
}

const createCheckoutSession = async (data) => {
  return post('/billing/checkout', data)
}

const getProrationPreview = async (params) => {
  return get('/billing/proration-preview', params)
}

const changePlan = async (data) => {
  return post('/billing/change-plan', data)
}

const cancelSubscription = async () => {
  return post('/billing/cancel', {})
}

const cancelManualSubscription = async () => {
  return post('/billing/cancel-manual', {})
}

const reactivateSubscription = async () => {
  return post('/billing/reactivate', {})
}

const createPortalSession = async () => {
  return post('/billing/portal', {})
}

const updateBillingInfo = async (data) => {
  return put('/billing/info', data)
}

module.exports = {
  getPlans,
  createCheckoutSession,
  getProrationPreview,
  changePlan,
  cancelSubscription,
  cancelManualSubscription,
  reactivateSubscription,
  createPortalSession,
  updateBillingInfo
}
