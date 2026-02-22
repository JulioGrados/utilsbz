'use strict'

const axios = require('axios')
const FormData = require('form-data');

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
        audio: {
          link: `https://bizeus-test.s3.us-east-2.amazonaws.com${file}`
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
    // Reconstruir Buffer si viene serializado de Redis/BullMQ
    // Cuando pasa por Redis, file.data se convierte en {type: 'Buffer', data: [...]}
    let bufferData;
    if (Buffer.isBuffer(file.data)) {
      bufferData = file.data;
    } else if (file.data && file.data.type === 'Buffer' && Array.isArray(file.data.data)) {
      // Serializado desde Redis/BullMQ
      bufferData = Buffer.from(file.data.data);
    } else if (file.data) {
      // Intentar convertir directamente
      bufferData = Buffer.from(file.data);
    } else {
      throw new Error('No se pudo obtener datos del archivo');
    }

    console.log('[Cloud-API sendMedia] Archivo:', {
      name: file.name,
      mimetype: file.mimetype,
      bufferSize: bufferData.length
    });

    // Normalizar mimetype para Cloud API
    // Tipos soportados: audio/aac, audio/mp4, audio/mpeg, audio/amr, audio/ogg, audio/opus,
    // application/vnd.ms-powerpoint, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document,
    // application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
    // application/pdf, text/plain, application/vnd.ms-excel, image/jpeg, image/png, image/webp, video/mp4, video/3gpp
    let contentType = file.mimetype;

    // Mimetypes que necesitan normalización
    if (contentType === 'audio/mp3') {
      contentType = 'audio/mpeg';
    }
    // CSV NO está soportado por WhatsApp Cloud API, enviarlo como text/plain
    if (contentType === 'text/csv' || contentType === 'application/csv') {
      contentType = 'text/plain';
      console.log('[Cloud-API sendMedia] CSV convertido a text/plain para compatibilidad');
    }

    const form = new FormData();
    form.append('file', bufferData, {
      filename: file.name,
      contentType: contentType
    });
    form.append('messaging_product', 'whatsapp');
    form.append('type', contentType);

    console.log('[Cloud-API sendMedia] Subiendo media con contentType:', contentType);

    const uploadResp = await axios.post(
      `https://graph.facebook.com/v21.0/${id}/media`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...form.getHeaders()
        }
      }
    );

    const mediaId = uploadResp.data.id;
    console.log('[Cloud-API sendMedia] Media ID:', mediaId);

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
      body[tipo].caption = message;
    }

    const messageResp = await axios.post(
      `https://graph.facebook.com/v21.0/${id}/messages`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('[Cloud-API sendMedia] Mensaje enviado:', messageResp.data);
    return messageResp.data
  } catch (error) {
    // Mostrar el error real de Meta
    if (error.response?.data?.error) {
      console.error('[Cloud-API sendMedia] Error de Meta:', JSON.stringify(error.response.data.error, null, 2));
    }
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

/**
 * Obtener templates desde Meta API
 * @param {string} wabaId - WhatsApp Business Account ID
 * @param {string} token - Access Token
 * @returns {Promise<Array>} - Lista de templates aprobados
 */
const getTemplates = async (wabaId, token) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://graph.facebook.com/v21.0/${wabaId}/message_templates`,
      params: {
        fields: 'name,status,language,category,components',
        limit: 100
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    // Filtrar solo templates aprobados
    const templates = response.data?.data || []
    return templates.filter(t => t.status === 'APPROVED')
  } catch (error) {
    console.error('[getTemplates] Error:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Enviar mensaje de template
 * @param {string} phoneNumberId - Phone Number ID
 * @param {string} token - Access Token
 * @param {string} to - Numero destino (con codigo pais)
 * @param {object} templateData - Datos del template
 */
const setTemplate = async (phoneNumberId, token, to, templateData) => {
  try {
    const { name, language, components } = templateData

    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: name,
        language: { code: language }
      }
    }

    // Agregar components si tienen parametros
    if (components && components.length > 0) {
      payload.template.components = components
    }

    console.log('[setTemplate] Enviando:', JSON.stringify(payload, null, 2))

    const response = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    return response.data
  } catch (error) {
    console.error('[setTemplate] Error:', error.response?.data || error.message)
    throw error
  }
}

module.exports = {
  getMedia,
  setMessage,
  setImage,
  setVideo,
  setDocument,
  setAudio,
  sendMedia,
  getTemplates,
  setTemplate
}