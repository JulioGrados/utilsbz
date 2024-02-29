const axios = require('axios')

const deleteMessageGreen = async (idInstance, token, chatId, idMessage) => {
  try {
    const resp = await axios({
      method: 'POST',
      url: `https://api.greenapi.com/waInstance${idInstance}/deleteMessage/${token}`,
      data: {
        chatId: `${chatId}@c.us`,
        idMessage: idMessage
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('resp', resp)
    return resp
  } catch (error) {
    throw error
  }
}

const sendMessageTextGreen = async (idInstance, token, chatId, text) => {
  try {
    const resp = await axios({
      method: 'POST',
      url: `https://api.greenapi.com/waInstance${idInstance}/sendMessage/${token}`,
      data: {
        chatId: `${chatId}@c.us`,
        message: text
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('resp', resp)
    return resp
  } catch (error) {
    throw error
  }
}

const sendMessageMediaGreen = async (idInstance, token, chatId, url, filename = '', caption = '') => {
  try {
    const resp = await axios({
      method: 'POST',
      url: `https://api.greenapi.com/waInstance${idInstance}/sendFileByUrl/${token}`,
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
    console.log('resp', resp)
    return resp
  } catch (error) {
    throw error
  }
}

module.exports = {
  deleteMessageGreen,
  sendMessageTextGreen,
  sendMessageMediaGreen
}