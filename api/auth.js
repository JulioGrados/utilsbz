const { post } = require('../lib/request')

const login = (email, password) => {
  return post('/open/auth/login', { email, password })
}

const singup = (data) => {
  return post('/open/auth/singup', { ...data })
}

// El registro no crea la cuenta: primero se confirma el correo con un código.
const verifySignup = (email, verificationId, code) => {
  return post('/open/auth/singup/verify', { email, verificationId, code })
}

const resendSignupCode = (email, verificationId) => {
  return post('/open/auth/singup/resend', { email, verificationId })
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
  verifySignup,
  resendSignupCode,
  checkResetToken,
  resetPassword
}
