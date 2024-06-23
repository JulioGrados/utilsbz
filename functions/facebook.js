const axios = require('axios')

//Nota: las mismas funciones se utilizan para instagram; solo se debe indicar el recipientId del usuario

/**
 * Envia un mensaje de texto a un usuario de Facebook Messenger.
 * @param {string} pageAccessToken - El token de acceso de la página de Facebook.
 * @param {string} recipientId - El ID de Messenger del usuario al que enviar el mensaje.
 * @param {string} messageText - El texto del mensaje a enviar.
 * @return {Promise<Object>} La respuesta de la API de Messenger.
 */
const sendMessageTextFacebook  = async (pageAccessToken, recipientId, messageText) => {
  try {
    const resp = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v20.0/me/messages`,
      params: {
        access_token: pageAccessToken
      },
      data: {
        recipient: {
          id: recipientId
        },
        message: {
          text: messageText
        }
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // console.log('resp', resp)
    return resp
  } catch (error) {
    throw error
  }
}

/**
 * Envia un archivo multimedia a un usuario de Facebook Messenger.
 * @param {string} pageAccessToken - El token de acceso de la página de Facebook.
 * @param {string} recipientId - El ID de Messenger del usuario al que enviar el archivo.
 * @param {string} url - URL del archivo multimedia a enviar.
 * @param {string} messageType - Tipo de archivo ('image', 'video', o 'file').
 * @return {Promise<Object>} La respuesta de la API de Messenger.
 */

const sendMessageMediaFacebook = async (pageAccessToken, recipientId, url, messageType = 'image') => {
  try {
    const resp = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v20.0/me/messages`,
      params: {
        access_token: pageAccessToken
      },
      data: {
        recipient: {
          id: recipientId
        },
        message: {
          attachment: {
            type: messageType,
            payload: {
              url: url,
              is_reusable: true
            }
          }
        }
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // console.log('resp', resp)
    return resp
  } catch (error) {
    throw error
  }
}

module.exports = {
  sendMessageTextFacebook,
  sendMessageMediaFacebook,
}