const axios = require('axios')
const config = require('config')
const { getCookie, removeCookie } = require('../functions/session')

const dev = config.dash.env
const baseURLDev = config.server.localUrl + '/api'
const baseURLProd = config.server.productionUrl + '/api'

axios.defaults.baseURL = dev === 'development' ? baseURLDev : baseURLProd

// La API revoca sesiones (contraseña restablecida, usuario eliminado) con
// 401 + code SESSION_INVALID. En el navegador se limpia la sesión y se vuelve
// al login una sola vez, en vez de dejar la app rota con llamadas fallando.
let redirectingToLogin = false
if (typeof window !== 'undefined' && !axios.__bizeusSessionInterceptor) {
  axios.__bizeusSessionInterceptor = true
  axios.interceptors.response.use(undefined, error => {
    const data = error && error.response && error.response.data
    if (error.response && error.response.status === 401 && data && data.code === 'SESSION_INVALID' && !redirectingToLogin) {
      redirectingToLogin = true
      removeCookie('jwt')
      removeCookie('user')
      if (!/^\/(login|signup|recuperar)/.test(window.location.pathname)) {
        window.location.assign('/login?sesion=expirada')
      }
    }
    return Promise.reject(error)
  })
}

const getHeaders = (params = {}, isFile = false, jwt = null) => {
  let headers = {}

  if (jwt) {
    headers = {
      Authorization: `Bearer ${jwt}`,
      'x-access-token': jwt
    }
  }

  if (isFile) {
    headers['Content-Type'] = 'multipart/form-data'
  }

  return {
    headers,
    params
  }
}

const get = async (endpoint, params, jwt = getCookie('jwt')) => {
  return axios
    .get(endpoint, getHeaders(params, false, jwt))
    .then(response => {
      return response.data || []
    })
    .catch(error => {
      if (error && error.response) {
        console.error(error.response.data)
      } else {
        console.error('Error al obtener los datos')
      }
      return []
    })
}

const getOne = async (endpoint, params, jwt = getCookie('jwt')) => {
  return axios
    .get(endpoint, getHeaders(params, false, jwt))
    .then(response => {
      return {
        ...response.data,
        success: true
      }
    })
    .catch(error => {
      if (error && error.response) {
        return {
          ...error.response.data,
          success: false
        }
      } else {
        return {
          success: false,
          message: 'Error al obtener el dato.'
        }
      }
    })
}

const post = async (
  endpoint,
  data = {},
  isFile = false,
  jwt = getCookie('jwt')
) => {
  return axios
    .post(endpoint, data, getHeaders(null, isFile, jwt))
    .then(response => {
      return {
        ...response.data,
        success: true
      }
    })
    .catch(error => {
      if (error && error.response) {
        return {
          ...error.response.data,
          success: false
        }
      } else {
        return {
          success: false,
          message: 'Error al guardar.'
        }
      }
    })
}

const put = async (
  endpoint,
  data = {},
  isFile = false,
  jwt = getCookie('jwt')
) => {
  return axios
    .put(endpoint, data, getHeaders(null, isFile, jwt))
    .then(response => {
      return {
        ...response.data,
        success: true
      }
    })
    .catch(error => {
      if (error && error.response) {
        return {
          ...error.response.data,
          success: false
        }
      } else if (error && error.data) {
        return error.data
      } else {
        return {
          success: false,
          message: 'Error al actualizar.'
        }
      }
    })
}

const remove = async (endpoint, jwt = getCookie('jwt')) => {
  return axios
    .delete(endpoint, getHeaders(null, false, jwt))
    .then(response => {
      return {
        ...response.data,
        success: true
      }
    })
    .catch(error => {
      if (error && error.response) {
        return {
          ...error.response.data,
          success: false
        }
      } else {
        return {
          success: false,
          message: 'Error al eliminar.'
        }
      }
    })
}

module.exports = {
  get,
  getOne,
  post,
  put,
  remove
}
