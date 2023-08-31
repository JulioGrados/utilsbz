const { post } = require('../lib/request')

const login = (username, password) => {
  return post('/open/auth/login', { username, password })
}

module.exports = {
  login
}
