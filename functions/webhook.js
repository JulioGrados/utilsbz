const axios = require('axios')

const sendTextWebhook = async (connection, mobileCode, mobile, message, url, mood) => {
    try {
        const resp = await axios({
            method: 'POST',
            url: url,
            data: {
                connection: connection,
                typeMessage: 'text',
                mobileCode: mobileCode,
                mobile: mobile,
                caption: message,
                mood: mood
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('resp', resp)
        return resp
    } catch (error) {
        console.log('error', error)
        throw error
    }
}

const sendMediaWebhook = async (chatId, connection, typeMsg, mobileCode, mobile, message, fileName, file, url, mood) => {
    try {
        const resp = await axios({
            method: 'POST',
            url: url,
            data: {
                chatId: chatId,
                connection: connection,
                typeMessage: typeMsg,
                mobileCode: mobileCode,
                mobile: mobile,
                caption: message,
                fileName: fileName ? fileName : '',
                file: file ? `https://bizeus-test.s3.us-east-2.amazonaws.com${file}` : '',
                mood: mood
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('resp', resp)
        return resp
    } catch (error) {
        console.log('error', error)
        throw error
    }
}

module.exports = {
    sendTextWebhook,
    sendMediaWebhook
}