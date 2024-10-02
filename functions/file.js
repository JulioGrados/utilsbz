const axios = require('axios')

const getFile = async (url) => {
  const response = await axios.get(url, {
      responseType: 'arraybuffer'
  })
  return response.data
}

const getFileData = async (url) => {
  const response = await axios.get(url, {
      responseType: 'arraybuffer'
  })
  return response
}


module.exports = {
  getFile,
  getFileData
}