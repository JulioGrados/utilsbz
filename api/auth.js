const { post } = require('../lib/request')

const login = (email, password) => {
  return post('/open/auth/login', { email, password })
}

module.exports = {
  login
}
