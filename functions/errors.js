'use strict'

const parseErrorDB = err => {
  console.log(err)
  let message = '!Ups ocurrio un error en el servidor¡'
  let status = 500
  if (err) {
    const errors = []
    if (err.status && err.message) {
      return err
    }

    if (err.name === 'ValidationError') {
      for (const field in err.errors) {
        errors.push(err.errors[field])
      }
      message = errors[0] ? errors[0].message : 'Error en la base de datos'
      status = 402
    } else if (err.name === 'MongoError') {
      message = 'Error en la base de datos.'
      status = 500
    }
  }
  return {
    message,
    status
  }
}

module.exports = {
  parseErrorDB
}
