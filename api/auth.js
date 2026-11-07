const { post } = require('../lib/request')

const login = (email, password) => {
  return post('/open/auth/login', { email, password })
}

const singup = (data) => {
  return post('/open/auth/singup', { ...data })
}

// Restablecer contraseña con el enlace que genera un admin (crmbz) o el staff (dashbz).
const checkResetToken = token => {
  return post('/open/auth/reset/check', { token })
}

const resetPassword = (token, password) => {
  return post('/open/auth/reset', { token, password })
}

module.exports = {
  login,
  singup,
  checkResetToken,
  resetPassword
}
