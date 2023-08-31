'use strict'

const bcrypt = require('bcryptjs')
const { redirect } = require('./redirect')

const comparePass = (password, passwordDB) => {
  const passCorrect = bcrypt.compareSync(password, passwordDB)
  return passCorrect
}

const generateHash = password => {
  const saltRounds = 10
  const hash = bcrypt.hashSync(password, saltRounds)

  return hash
}

const isLoggedUser = async ctx => {
  if (!ctx.jwt) {
    redirect({ ctx, location: '/login' })
    return null
  }

  return { jwt: ctx.jwt }
}

const isLoggedRole = async ctx => {
  const roles = ctx && ctx.currentUser && ctx.currentUser.roles
  
  if (roles.length && roles.includes('Administrador') || roles.includes('Recepcionista') ) {
    return { roles: roles }
  } else {
    redirect({ ctx, location: '/login' })
    return null
  }
}

module.exports = {
  comparePass,
  generateHash,
  isLoggedUser,
  isLoggedRole
}
