const axios = require('axios')
const whatsAppClient = require('@green-api/whatsapp-api-client')

const existWspGreen = async (idInstance, token, mobile) => {
  try {
    const resp = await axios({
      method: 'POST',
      url: `https://7103.api.greenapi.com/waInstance${idInstance}/checkWhatsapp/${token}`,
      data: {
        phoneNumber: parseInt(mobile)
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

const deleteMessageGreen = async (idInstance, token, chatId, idMessage) => {
  try {
    const resp = await axios({
      method: 'POST',
      url: `https://7103.api.greenapi.com/waInstance${idInstance}/deleteMessage/${token}`,
      data: {
        chatId: `${chatId}@c.us`,
        idMessage: idMessage
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

const sendMessageTextGreen = async (idInstance, token, chatId, text) => {
  try {
    const resp = await axios({
      method: 'POST',
      url: `https://7103.api.greenapi.com/waInstance${idInstance}/sendMessage/${token}`,
      data: {
        chatId: `${chatId}@c.us`,
        message: text
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // console.log('resp', resp)
    return resp
  } catch (error) {
    // console.log('error', error)
    throw error
  }
}

const sendMessageMediaGreen = async (idInstance, token, chatId, url, filename = '', caption = '') => {
  try {
    const resp = await axios({
      method: 'POST',
      url: `https://7103.api.greenapi.com/waInstance${idInstance}/sendFileByUrl/${token}`,
      data: {
        chatId: `${chatId}@c.us`,
        urlFile: url,
        fileName: filename,
        caption: caption
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

const uploadediaGreen = async (idInstance, token, file) => {
  try {
    const resp = await axios({
      method: 'POST',
      url: `https://media.green-api.com/waInstance${idInstance}/uploadFile/${token}`,
      data: {
        file: file
      },
      headers: {
        'Content-Type': 'audio/mp3'
      }
    })
    // console.log('resp', resp)
    return resp
  } catch (error) {
    throw error
  }
}

const sendGreenClient = async (idInstance, token, mobile, caption, route, fileName, typeMessage) => {
  let response
  const restAPI = whatsAppClient.restAPI(({
    idInstance: idInstance,
    apiTokenInstance: token
  }))
  if (typeMessage === 'image' || typeMessage === 'video' || typeMessage === 'document') { 
    response = await restAPI.file.sendFileByUrl(`${mobile}@c.us`, null, route, fileName, caption)
  } else {
    response = await restAPI.message.sendMessage(`${mobile}@c.us`, null, caption)
  }
  return response
}

module.exports = {
  existWspGreen,
  deleteMessageGreen,
  sendMessageTextGreen,
  sendMessageMediaGreen,
  sendGreenClient,
  uploadediaGreen
}


// console.log('filerootReplace', fs.createReadStream(`${SERVER_PATH}${filerootReplace}`))
        // let resp 
        // try {
        //   resp = await axios({
        //     method: 'POST',
        //     url: `https://media.green-api.com/waInstance${connection.idInstance}/uploadFile/${connection.key}`,
        //     data: fs.createReadStream(`${SERVER_PATH}${filerootReplace}`),
        //     headers: {
        //       'Content-Type': 'audio/mpeg'
        //     }
        //   })
        //   console.log('resp', resp)
        //   // return resp
        // } catch (error) {
        //   console.log('error', error)
        //   throw error
        // }
        // const data = await sendMessageMediaGreen(
        //   connection.idInstance, connection.key,
        //   chat.mobile, body.resend ? body.url : resp.data.urlFile,
        //   'audio.mp3',
        //   body.text, file
        // )
        // wamid = data && data.data && data.data.idMessage