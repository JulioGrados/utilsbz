const { post } = require('../lib/request')

const login = (email, password) => {
  return post('/open/auth/login', { email, password })
}

const singup = (data) => {
  return post('/open/auth/singup', { ...data })
}

module.exports = {
  login,
  singup
}
