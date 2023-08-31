const axios = require('axios')
const config = require('config')
const { getCookie } = require('../functions/session')

const dev = config.dash.env
const baseURLDev = config.server.localUrl + '/api'
const baseURLProd = config.server.productionUrl + '/api'

axios.defaults.baseURL = dev === 'development' ? baseURLDev : baseURLProd

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
