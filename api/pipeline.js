const { get, getOne, post, put, remove } = require('../lib/request')

const listPipelines = async params => {
  return get('/pipeline', params)
}

const createPipeline = async data => {
  return post('/pipeline', data)
}

const detailPipeline = async (id, params, jwt) => {
  return getOne(`/pipeline/${id}`, params, jwt)
}

const updatePipeline = async (id, data) => {
  return put(`/pipeline/${id}`, data)
}

const removePipeline = async id => {
  return remove(`/pipeline/${id}`)
}

const reorderStages = (pipelineId, stages) => {
  return put(`/pipelines/${pipelineId}/stages/reorder`, {stages})
}

module.exports = {
  listPipelines,
  createPipeline,
  updatePipeline,
  detailPipeline,
  removePipeline,
  reorderStages
}