'use strict'

const axios = require('axios')
const { saveImage } = require('../image')

const getMedia = async (id, token) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://graph.facebook.com/v21.0/${id}`,
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
      url: `https://graph.facebook.com/v21.0/${id}/messages`,
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
      url: `https://graph.facebook.com/v21.0/${id}/messages`,
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: chat.mobile,
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
      url: `https://graph.facebook.com/v21.0/${id}/messages`,
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: chat.mobile,
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
      url: `https://graph.facebook.com/v21.0/${id}/messages`,
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: chat.mobile,
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
      url: `https://graph.facebook.com/v21.0/${id}/messages`,
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: chat.mobile,
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

const sendMedia = async (id, token, chat, message, file) => {
  try {
    const form = new FormData();
    form.append('file', file.data, {
      filename: file.name,
      contentType: file.mimetype
    });
    form.append('messaging_product', 'whatsapp');

    const uploadResp = await axios.post(
      `https://graph.facebook.com/v18.0/${id}/media`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...form.getHeaders()
        }
      }
    );

    const mediaId = uploadResp.data.id;
    console.log('Media ID:', mediaId);

    // Paso 2: Enviar el archivo
    const tipo = obtenerTipoMensajeDesdeMime(file.mimetype); // 'document', 'image', etc.

    const body = {
      messaging_product: 'whatsapp',
      to: chat.mobile,
      type: tipo,
      [tipo]: {
        id: mediaId
      }
    };

    if (tipo === 'document') {
      body.document.filename = file.name;
      body.document.caption = message;
    } else if (tipo === 'image' || tipo === 'video') {
      body[tipo].caption = 'Aquí está tu contenido';
    }

    const messageResp = await axios.post(
      `https://graph.facebook.com/v18.0/${id}/messages`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Mensaje enviado:', messageResp.data);
    return  messageResp.data
  } catch (error) {
    throw error
  }
}

// Helper para decidir el tipo de mensaje desde mimetype
function obtenerTipoMensajeDesdeMime(mimetype) {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'document'; // fallback por defecto
}


module.exports = {
  getMedia,
  setMessage,
  setImage,
  setVideo,
  setDocument,
  setAudio,
  sendMedia
}