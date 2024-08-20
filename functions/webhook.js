const axios = require('axios')

const sendTextWebhook = async (connection, mobile, message, url, mood) => {
    try {
        const resp = await axios({
            method: 'POST',
            url: url,
            data: {
                connection: connection,
                typeMessage: 'text',
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

const sendMediaWebhook = async (connection, typeMsg, mobile, message, fileName, file, url, mood) => {
    try {
        const resp = await axios({
            method: 'POST',
            url: url,
            data: {
                connection: connection,
                typeMessage: typeMsg,
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