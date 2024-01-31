const greenMsgFile = (body) => {
  let msgBody = ''
  let fileName = ''

  const typeMsg = body && body.messageData && body.messageData.typeMessage && body.messageData.typeMessage.replace('Message', '')

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
  }

  return { msgBody, fileName }
}

module.exports = {
  greenMsgFile
}