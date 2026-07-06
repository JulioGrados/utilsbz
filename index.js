'use strict'

const log = require('./functions/log')
const auth = require('./functions/auth')
const errors = require('./functions/errors')
const session = require('./functions/session')
const reducers = require('./functions/reducers')
const transform = require('./functions/transform')
const user = require('./functions/user')
const wahaApi = require('./functions/wahaApi')
const zadarma = require('./functions/zadarmaApi')

module.exports = {
  log,
  auth,
  errors,
  session,
  reducers,
  transform,
  user,
  // WAHA API
  ...wahaApi,
  // Zadarma (telefonía) — namespaced para evitar colisiones de nombres (callback/request)
  zadarma
}