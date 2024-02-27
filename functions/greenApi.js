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

module.exports = {
  deleteMessageGreen
}