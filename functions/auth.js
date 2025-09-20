import bcrypt from 'bcryptjs'
import { redirect } from './redirect.js'

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
  const rol = ctx && ctx.currentUser && ctx.currentUser.rol

  if (!ctx.jwt) {
    redirect({ ctx, location: '/login' })
    return null
  }
  
  if (rol !== 'Admin') {
    redirect({ ctx, location: '/401' })
    return null
  } 

  return { jwt: ctx.jwt }
}

const isLoggedContact = async ctx => {
  const notSeeContact = ctx && ctx.currentUser && ctx.currentUser.notSeeContact

  if (!ctx.jwt) {
    redirect({ ctx, location: '/login' })
    return null
  }
  
  if (notSeeContact) {
    redirect({ ctx, location: '/401' })
    return null
  } 

  return { jwt: ctx.jwt }
}

export {
  comparePass,
  generateHash,
  isLoggedUser,
  isLoggedRole,
  isLoggedContact
}
