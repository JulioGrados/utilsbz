'use strict'

const axios = require('axios')
const { saveImage } = require('../image')

const getMedia = async (id, token) => {
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

const setMessage = async (id, token, chat, message) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v17.0/${id}/messages`,
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: chat.mobile,
        type: 'text',
        text: {
          body: message
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    return response.data
  } catch (error) {
    console.log('error', error)
  }
}

const setImage = async (id, token, chat, message, file) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v17.0/${id}/messages`,
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: chat.mobileCode + chat.mobile,
        type: 'image',
        image: {
          link: `https://bizeus-test.s3.us-east-2.amazonaws.com${file}`,
          caption: message
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    return response
  } catch (error) {
    console.log('error', error)
  }
}

const setVideo = async (id, token, chat, message, file) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v17.0/${id}/messages`,
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: chat.mobileCode + chat.mobile,
        type: 'video',
        video: {
          link: `https://bizeus-test.s3.us-east-2.amazonaws.com${file}`,
          caption: message
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    return response
  } catch (error) {
    console.log('error', error)
  }
}

const setDocument = async (id, token, chat, message, file) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v17.0/${id}/messages`,
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: chat.mobileCode + chat.mobile,
        type: 'document',
        document: {
          link: `https://bizeus-test.s3.us-east-2.amazonaws.com${file}`,
          caption: message
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    return response
  } catch (error) {
    console.log('error', error)
  }
}

const setAudio = async (id, token, chat, message, file) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v17.0/${id}/messages`,
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: chat.mobileCode + chat.mobile,
        type: 'audio',
        document: {
          link: `https://bizeus-test.s3.us-east-2.amazonaws.com${file}`,
          caption: message
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    return response
  } catch (error) {
    console.log('error', error)
  }
}


module.exports = {
  getMedia,
  setMessage,
  setImage,
  setVideo,
  setDocument,
  setAudio
}