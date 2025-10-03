const { get, getOne, post, put, remove } = require('../lib/request')

const listStages = async params => {
  return get('/stage', params)
}

const createStage = async data => {
  return post('/stage', data)
}

const detailStage = async (id, params, jwt) => {
  return getOne(`/stage/${id}`, params, jwt)
}

const updateStage = async (id, data) => {
  return put(`/stage/${id}`, data)
}

const removeStage = async id => {
  return remove(`/stage/${id}`)
}

const reorderStages = (pipelineId, stages) => {
  return put(`/pipelines/${pipelineId}/stages/reorder`, {stages})
}

module.exports = {
  listStages,
  createStage,
  updateStage,
  detailStage,
  removeStage,
  reorderStages
}