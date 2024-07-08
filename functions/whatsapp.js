const { saveFileHookAws } = require("./aws")
const { countriesData } = require("./countries")
const { getFile } = require("./file")

const principalBody = (body) => {
    let names = '', msgId = '', typeMsg = ''
    names = body && body.senderData && body.senderData.chatName ? body.senderData.chatName : ''
    msgId = body && body.idMessage
    typeMsg = body && body.messageData && body.messageData.typeMessage && body.messageData.typeMessage.replace('Message', '')
    return {names, msgId, typeMsg}
  }
  
  const messageBody = (body, typeMsg) => {
    let msgBody = '', fileName = '', contacts = []
  
    if (typeMsg === 'text') {
      msgBody = body && body.senderData && body.messageData.textMessageData && body.messageData.textMessageData.textMessage ? body.messageData.textMessageData.textMessage : ''
    } else if (typeMsg === 'extendedText' || typeMsg === 'quoted') {
      msgBody = body && body.messageData && body.messageData.extendedTextMessageData && body.messageData.extendedTextMessageData.text ? body.messageData.extendedTextMessageData.text : ''
    } else if (typeMsg === 'image') {
      msgBody = body && body.senderData && body.messageData.fileMessageData && body.messageData.fileMessageData.caption ? body.messageData.fileMessageData.caption : ''
      fileName = body && body.senderData && body.messageData.fileMessageData && body.messageData.fileMessageData.fileName ? body.messageData.fileMessageData.fileName : ''
    } else if (typeMsg === 'video') {
      msgBody = body && body.senderData && body.messageData.fileMessageData && body.messageData.fileMessageData.caption ? body.messageData.fileMessageData.caption : ''
      fileName = body && body.senderData && body.messageData.fileMessageData && body.messageData.fileMessageData.fileName ? body.messageData.fileMessageData.fileName : ''
    } else if (typeMsg === 'document') {
      msgBody = body && body.senderData && body.messageData.fileMessageData && body.messageData.fileMessageData.caption ? body.messageData.fileMessageData.caption : ''
      fileName = body && body.senderData && body.messageData.fileMessageData && body.messageData.fileMessageData.fileName ? body.messageData.fileMessageData.fileName : ''
    } else if (typeMsg === 'audio') {
      msgBody = body && body.senderData && body.messageData.fileMessageData && body.messageData.fileMessageData.caption ? body.messageData.fileMessageData.caption : ''
      fileName = body && body.senderData && body.messageData.fileMessageData && body.messageData.fileMessageData.fileName ? body.messageData.fileMessageData.fileName : ''
    } else if (typeMsg === 'contact' || typeMsg === 'contactsArray'){
      if(typeMsg === 'contact') {
        msgBody = ''
        const names = body && body.messageData && body.messageData.contactMessageData && body.messageData.contactMessageData.displayName ? body.messageData.contactMessageData.displayName : ''
        const vcard = body && body.messageData && body.messageData.contactMessageData && body.messageData.contactMessageData.displayName ? body.messageData.contactMessageData.vcard : ''
        if (vcard) {
          const indexFirst = vcard.indexOf('waid=')
          const numberEnd = vcard.substring((indexFirst+5), vcard.length)
          const number = numberEnd.substring(0, numberEnd.indexOf(":"))
          contacts.push({mobile: number, names: names})
        }
      } else {
        msgBody = ''
        const contactsArray = body && body.messageData && body.messageData.messageData && body.messageData.messageData.contacts ? body.messageData.messageData.contacts : []
        if(contactsArray && contactsArray.length) {
          contactsArray.forEach(contact => {
            const names = contact.displayName ? contact.displayName : ''
            const vcard = contact.vcard ? contact.vcard : ''
            if (vcard) {
              const indexFirst = vcard.indexOf('waid=')
              const numberEnd = vcard.substring((indexFirst+5), vcard.length)
              const number = numberEnd.substring(0, numberEnd.indexOf(":"))
              contacts.push({mobile: number, names: names})
            }
          })
        }
      }
    }
    return {msgBody, fileName, contacts}
  }
  
  const fileBody = async (body, typeMsg) => {
    const url = body && body.senderData && body.messageData.fileMessageData && body.messageData.fileMessageData.downloadUrl
    const file = (typeMsg === 'image' || typeMsg === 'video' || typeMsg === 'document' || typeMsg === 'audio') ? await getFile(url) : ''
    return {file, url}
  }
  
  const mobileBody = (body) => {
    let mobile = ''
    let from = body && body.senderData && body.senderData.chatId && body.senderData.sender.replace('@c.us', '')
    from = from.charAt(0) === '+' ? from.substring(1) : from
    const { code, country } = searchCodeNumber(from)
    mobile = from
  
    return {mobile, code, country}
  }

  const mobileBodyRecived = (body) => {
    let mobile = ''
    let from = body && body.senderData && body.senderData.chatId && body.senderData.chatId.replace('@c.us', '')
    from = from.charAt(0) === '+' ? from.substring(1) : from
    const { code, country } = searchCodeNumber(from)
    mobile = from
  
    return {mobile, code, country}
  }
  
  const uploadBody = async (url, file, msgId) => {
    const positionEnd = url && url.lastIndexOf('.')
    const extension = url && positionEnd && url.substring((positionEnd + 1), url.length)
    let route = ''
    // console.log('extension', extension)
    if (file) {
      route = await saveFileHookAws(file, `${msgId}.${extension}`)
    }
    // console.log('route', route)
    return route
  }

  const searchCodeNumber = number => {
    let code = number.substring(0, 1)
    let country 
    do {
      country = countriesData.find(item => item.callingCode === code)
      if (!country) {
        code = number.substring(0, code.length + 1)
      }
    } while (code.length < 5 && !country)
  
    return {code, country}
  }

  module.exports = {
    principalBody,
    messageBody,
    fileBody,
    mobileBody,
    mobileBodyRecived,
    uploadBody
  }