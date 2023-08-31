const { get, getOne, post, put, remove } = require('../lib/request')

const countUsers = async params => {
  return get('/open/users/count', params)
}

const listUsers = async (params, jwt) => {
  return get('/users', params, jwt)
}

const listTeachers = async params => {
  return get('/open/teachers', params)
}

const createUser = async data => {
  return post('/users', data)
}

const createUsersMoodle = async data => {
  return post('/migrations/users', data)
}

const createGradesMoodle = async data => {
  return post('/migrations/grades', data)
}

const createEvaluationsMoodle = async data => {
  return post('/migrations/evaluations', data)
}

const createCertificatesMoodle = async data => {
  // console.log('data certi url', data)
  return post('/migrations/certificates', data)
}

const createEnrolsMoodle = async data => {
  return post('/migrations/enrols', data)
}

const createOrUpdateUser = async data => {
  return post('/open/users', data)
}

const createOrUpdateUserRegister = async data => {
  return post('/open/users/register', data)
}

const addOrUpdateUser = async data => {
  return post('/open/users/add', data)
}

const createStudent = async data => {
  return post('/open/student', data)
}

const createDealUser = async data => {
  return post('/open/users/deal', data)
}

const detailUser = async (id, params, jwt) => {
  return getOne(`/users/${id}`, params, jwt)
}

const detailOpenUser = async params => {
  return get('/open/users/detail', params)
}

const detailOpenTeacher = async params => {
  return get('/open/teachers/detail', params)
}

const updateUser = async (id, data) => {
  return put(`/users/${id}`, data)
}

const updateUserStage = async (id, data) => {
  return put(`/users/stage/${id}`, data)
}

const updateDeleteDNI = async (id, data) => {
  return put(`/users/dni/${id}`, data)
}

const updateDeleteAccount = async (id, data) => {
  return put(`/users/account/${id}`, data)
}

const updateDeleteAccountMoodle = async (id, data) => {
  return put(`/users/account/moodle/${id}`, data)
}

const updateDeletePhoto = async (id, data) => {
  return put(`/users/photo/${id}`, data)
}

const removeUser = async id => {
  return remove(`/users/${id}`)
}

const recoverPassword = async data => {
  return post(`/open/users/recover`, data)
}

module.exports = {
  listUsers,
  createUser,
  createDealUser,
  createUsersMoodle,
  createGradesMoodle,
  createEvaluationsMoodle,
  createEnrolsMoodle,
  createCertificatesMoodle,
  updateDeleteAccountMoodle,
  updateUser,
  updateUserStage,
  updateDeleteDNI,
  updateDeleteAccount,
  updateDeletePhoto,
  detailUser,
  detailOpenUser,
  detailOpenTeacher,
  removeUser,
  listTeachers,
  createOrUpdateUser,
  createOrUpdateUserRegister,
  addOrUpdateUser,
  countUsers,
  recoverPassword,
  createStudent
}
