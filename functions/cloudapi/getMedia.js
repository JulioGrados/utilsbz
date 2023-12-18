'use strict'

const axios = require('axios')
const { saveImage } = require('../image')

const getFile = async (id, token) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://graph.facebook.com/v17.0/${id}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    console.log('response', response)
    const url = response && response.data && response.data.url
    const file = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    // console.log('image', image)
    // const saveUrl = await saveImage(image.data, id)
    return file && response.data && {file: file.data, type: response.data.mime_type}
  } catch (error) {
    console.log('error', error)
  }
}

module.exports = {
  getFile
}