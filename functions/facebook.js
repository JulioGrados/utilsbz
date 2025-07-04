const axios = require('axios')
var FormData = require('form-data');

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
      url: `https://graph.facebook.com/v20.0/1811506018901320/messages`,
      params: {
        access_token: pageAccessToken
      },
      data: {
        recipient: {
          id: recipientId
        },
        message: {
          text: messageText
        },
        messaging_type: 'RESPONSE',
        access_token: pageAccessToken
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('resp', resp)
    return resp
  } catch (error) {
    console.log('error', error.response.data)
    console.log('error', error.response.data.error)
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

// Funciones Facebook, proyecto brasil
// const getPageProfileFB = async (id, token) => {
//   try {
//       const accountsResponse = await axios.get(`https://graph.facebook.com/v22.0/${id}/accounts`, {
//         params: {
//           access_token: token,
//         }
//       })
//       // console.log('accountsResponse.data.data', accountsResponse)
//       return accountsResponse.data.data
//   }
//   catch (error) {
//       console.log(error);
//       throw error
//   }
// };

// const getPageProfile = async (id, token) => {
//   try {
//       const accountsResponse = await axios.get(`https://graph.facebook.com/v22.0/${id}/accounts?access_token=${token}`, {
//         params: {
//           access_token: token,
//           fields: 'name,access_token,instagram_business_account{id,username,profile_picture_url,name}'
//         }
//       })
//       // console.log('accountsResponse.data.data', accountsResponse.data)

//       return accountsResponse.data.data;
//   }
//   catch (error) {
//       console.log(error);
//       throw error
//   }
// };

const getPageProfileFB = async (id, token) => {
  try {
      const accountsResponse = await axios.get(`https://graph.facebook.com/v22.0/${id}/accounts`, {
        params: {
          access_token: token,
        }
      })
      // console.log('accountsResponse.data.data', accountsResponse)
      return accountsResponse.data.data
  }
  catch (error) {
      console.log(error);
      throw error
  }
};

const getPageProfileIG = async (id, token) => {
  try {
      const accountsResponse = await axios.get(`https://graph.facebook.com/v22.0/${id}/accounts?access_token=${token}`, {
        params: {
          access_token: token,
          fields: 'name,access_token,instagram_business_account{id,username,profile_picture_url,name}'
        }
      })
      // console.log('accountsResponse.data.data', accountsResponse.data)

      return accountsResponse.data.data;
  }
  catch (error) {
      console.log(error);
      throw error
  }
};

const getAccessTokenFromPage = async (appId, appSecret, token) => {
  try {
    const data = await axios.get("https://graph.facebook.com/v22.0/oauth/access_token", {
        params: {
            client_id: appId,
            client_secret: appSecret,
            grant_type: "fb_exchange_token",
            fb_exchange_token: token
        }
    });
    // console.log('data', data)
    return data.data.access_token;
  }
  catch (error) {
    throw error
  }
}

const subscribeApp = async (id, token) => {
  try {
      const { data } = await axios.post(`https://graph.facebook.com/v22.0/${id}/subscribed_apps?access_token=${token}`, {
          subscribed_fields: [
              "messages",
              "messaging_postbacks",
              "message_reactions",
              "message_deliveries",
              "message_reads",
              "message_echoes"
          ]
      });
      console.log('sus data', data);
      return data;
  }
  catch (error) {
      throw error;
  }
}

const subscribeAppIG = async (id, token) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${id}/subscribed_apps`,
      null, // el cuerpo es nulo
      {
        params: {
          access_token: token,
          subscribed_fields: [
            "messages",
            "messaging_postbacks",
            "message_reactions",
            "message_deliveries",
            "message_reads",
            "message_echoes"
          ].join(",")
        }
      }
    );

    console.log("Suscripción exitosa:", response.data);
  } catch (error) {
    console.error("Error al suscribirse:", error.response?.data || error.message);
  }
}
//eventos de facebook cuando se envie un mensaje 
const apiBase = (token) => axios.create({
  baseURL: "https://graph.facebook.com/v22.0/",
  params: {
      access_token: token
  }
});

const getProfile = async (id, token) => {
  try {
      const { data } = await apiBase(token).get(id);
      return data;
  }
  catch (error) {
      console.log(error);
      console.log(id);
      throw error;
  }
};

const profilePsid = async (id, token) => {
  try {
      const { data } = await axios.get(`https://graph.facebook.com/v22.0/${id}?access_token=${token}`);
      return data;
  }
  catch (error) {
    const data = {
      first_name: id,
      last_name: id,
      profile_pic: '',
      id: id
    }
    return data;
  }
};

const markSeen = async (id, token) => {
  try {
    const url = `https://graph.facebook.com/v22.0/me/messages?access_token=${token}`;

    const payload = {
        recipient: { id: id },
        sender_action: "mark_seen"
    };

    const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" }
    });

    console.log("Mensaje marcado como visto:", response.data);
    return response.data;
  } catch (error) {
      console.error("Error al marcar el mensaje como visto:", error.response?.data || error.message);
  }
};

const sendText = async (id, text, token) => {
  const url = `https://graph.facebook.com/v22.0/me/messages?access_token=${token}`;

  const messageData = {
    recipient: { id: id },
    message: { text: text }
  };

  try {
    const response = await axios.post(url, messageData, {
      headers: { "Content-Type": "application/json" }
    });
    console.log("Mensaje enviado:", response.data);
    return response.data
  } catch (error) {
    console.error("Error enviando mensaje:", error.response ? error.response.data : error);
    throw error.response ? error.response.data : error
  }
};

const sendAttachmentFromUrl = async (id, file, type, token) => {
  const url = `https://graph.facebook.com/v22.0/me/messages?access_token=${token}`;
  
  const messageData = {
    recipient: { id: id },
    message: {
      attachment: {
        type: type, // Puede ser "image", "video", "audio" o "file"
        payload: {
          url: file,
          is_reusable: false // Permite reutilizar el archivo
        }
      }
    }
  };

  try {
    const response = await axios.post(url, messageData, {
      headers: { "Content-Type": "application/json" }
    });
    console.log("Archivo enviado con éxito:", response.data);
    return response.data
  } catch (error) {
    console.error("Error enviando archivo:", error.response ? error.response.data : error);
    throw error.response ? error.response.data : error
  }
};

const sendAttachment = async (id, file, type, token) => {
  console.log('file', file)
  const url = `https://graph.facebook.com/v22.0/me/message_attachments?access_token=${token}`;

  const form = new FormData();
  form.append('message', JSON.stringify({
    attachment: {
      type: type,
      payload: { is_reusable: false }
    }
  }));

  // Agregar la imagen como Buffer
  form.append('filedata', file.data, { filename: file.name, contentType: file.mimetype });

  try {
      // Enviar la imagen a Facebook
    const response = await axios.post(url, form, {
      headers: { 
        ...form.getHeaders() // Agregar los headers correctos
      }
    });

    console.log("Imagen subida con éxito:", response.data);
    const attachmentId = response.data.attachment_id;

      // Enviar la imagen al usuario con el attachment_id obtenido
    return  await sendImageById(attachmentId, token, id, type);
  } catch (error) {
    console.error("Error enviando imagen:", error.response ? error.response.data : error);
    throw error.response ? error.response.data : error
  }
};

const sendImageById = async (attachmentId, token, id, type) => {
  const url = `https://graph.facebook.com/v22.0/me/messages?access_token=${token}`;

  const messageData = {
    recipient: { id: id },
    message: {
      attachment: {
        type: type,
        payload: {
          attachment_id: attachmentId
        }
      }
    }
  };

  try {
    const response = await axios.post(url, messageData, {
      headers: { "Content-Type": "application/json" }
    });
    console.log("Imagen enviada con attachment_id:", response.data);
    return response.data
  } catch (error) {
    console.error("Error enviando imagen:", error.response ? error.response.data : error);
    throw error.response ? error.response.data : error
  }
};

const sendUploadServer = async (id, file, mediaType, pageId, pageAccessToken) => {
  const url = `https://graph.facebook.com/v22.0/${pageId}/message_attachments`;

  const form = new FormData();

  form.append('platform', 'instagram');
  form.append('filedata', file.data, { filename: file.name, contentType: file.mimetype });
  form.append('message', JSON.stringify({
    attachment: {
      type: mediaType
    }
  }));

  try {
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${pageAccessToken}`
      }
    });

    console.log("Imagen subida con éxito:", response.data);
    const attachmentId = response.data.attachment_id;

    return  await sendTheMedia(attachmentId, pageId, pageAccessToken, id, mediaType);
  } catch (error) {
    console.error('Error al subir el archivo:', error.response?.data || error.message);
    throw error;
  }
}

const sendUploadMedia = async (id, mediaUrl, mediaType, pageId, pageAccessToken) => {
  const url = `https://graph.facebook.com/v22.0/${pageId}/message_attachments`;

  const payload = {
    platform: "instagram",
    message: {
      attachment: {
        type: mediaType, // ej. "image", "video"
        payload: {
          url: mediaUrl,
          is_reusable: true
        }
      }
    }
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pageAccessToken}`
      }
    });

    console.log('Media uploaded successfully:', response.data);
    const attachmentId = response.data.attachment_id;
    return  await sendTheMedia(attachmentId, pageId, pageAccessToken, id, mediaType);
  } catch (error) {
    console.error('Error uploading media:', error.response?.data || error.message);
    throw error;
  }
}

const sendTheMedia = async (attachmentId, pageId, token, id, type) => {
  const url = `https://graph.facebook.com/v22.0/${pageId}/messages`;

  const messageData = {
    recipient: { id: id },
    message: {
      attachment: {
        type: type,
        payload: {
          attachment_id: attachmentId
        }
      }
    }
  };

  try {
    const response = await axios.post(url, messageData, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log("Imagen enviada con attachment_id:", response.data);
    return response.data
  } catch (error) {
    console.error("Error enviando imagen:", error.response ? error.response.data : error);
    throw error.response ? error.response.data : error
  }
};

module.exports = {
  sendMessageTextFacebook,
  sendMessageMediaFacebook,
  getPageProfileFB,
  getPageProfileIG,
  getAccessTokenFromPage,
  subscribeApp,
  subscribeAppIG,
  profilePsid,
  markSeen,
  sendText,
  sendAttachmentFromUrl,
  sendAttachment,
  sendUploadMedia,
  sendUploadServer
}