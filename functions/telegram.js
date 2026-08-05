'use strict'

const axios = require('axios')
const FormData = require('form-data')

// Wrapper del Bot API de Telegram (https://core.telegram.org/bots/api).
// Cada tenant usa su propio bot token (BotFather). Sin OAuth ni credenciales app-level.
// Todas las funciones lanzan si data.ok !== true. 429 → un reintento respetando retry_after.
// Doc de integración: ../docs/integraciones/telegram.md

const apiBase = token => `https://api.telegram.org/bot${token}`
const fileBase = token => `https://api.telegram.org/file/bot${token}`

const call = async (token, method, payload = {}, _retried = false) => {
  try {
    const { data } = await axios.post(`${apiBase(token)}/${method}`, payload, {
      headers: { 'Content-Type': 'application/json' }
    })
    if (data.ok !== true) throw data
    return data.result
  } catch (err) {
    const resp = err?.response?.data
    // Rate limit: Telegram responde 429 con parameters.retry_after (segundos)
    const retryAfter = resp?.parameters?.retry_after
    if (!_retried && err?.response?.status === 429 && retryAfter) {
      await new Promise(r => setTimeout(r, (retryAfter + 1) * 1000))
      return call(token, method, payload, true)
    }
    throw resp || err
  }
}

// Valida el token y devuelve { id, username, first_name, ... } del bot
const getMe = token => call(token, 'getMe')

// Registra el webhook único del bot. secret vuelve en el header X-Telegram-Bot-Api-Secret-Token.
const setWebhook = (token, url, secret) =>
  call(token, 'setWebhook', {
    url,
    secret_token: secret,
    allowed_updates: ['message', 'edited_message', 'my_chat_member', 'callback_query'],
    drop_pending_updates: false
  })

const deleteWebhook = token => call(token, 'deleteWebhook', { drop_pending_updates: true })

// replyToId (opcional) = message_id numérico de Telegram a citar
const sendText = (token, chatId, text, replyToId) =>
  call(token, 'sendMessage', {
    chat_id: chatId, text,
    ...(replyToId ? { reply_parameters: { message_id: replyToId, allow_sending_without_reply: true } } : {})
  })

// Media SALIENTE por URL pública (S3/Spaces). Límites de Telegram vía URL: fotos 5 MB, resto 20 MB.
const buildMediaPayload = (chatId, field, url, caption, replyToId) => ({
  chat_id: chatId, [field]: url,
  ...(caption ? { caption } : {}),
  ...(replyToId ? { reply_parameters: { message_id: replyToId, allow_sending_without_reply: true } } : {})
})

const sendPhoto = (token, chatId, url, caption, replyToId) => call(token, 'sendPhoto', buildMediaPayload(chatId, 'photo', url, caption, replyToId))
const sendVideo = (token, chatId, url, caption, replyToId) => call(token, 'sendVideo', buildMediaPayload(chatId, 'video', url, caption, replyToId))
const sendDocument = (token, chatId, url, caption, replyToId) => call(token, 'sendDocument', buildMediaPayload(chatId, 'document', url, caption, replyToId))
// sendVoice requiere OGG/Opus; sendAudio acepta mp3/m4a
const sendVoice = (token, chatId, url, caption, replyToId) => call(token, 'sendVoice', buildMediaPayload(chatId, 'voice', url, caption, replyToId))
const sendAudio = (token, chatId, url, caption, replyToId) => call(token, 'sendAudio', buildMediaPayload(chatId, 'audio', url, caption, replyToId))

// Reconstruir Buffer (puede venir serializado de Redis/BullMQ como {type:'Buffer',data:[...]})
const toBuffer = (file) => {
  if (Buffer.isBuffer(file.data)) return file.data
  if (file.data && file.data.type === 'Buffer' && Array.isArray(file.data.data)) return Buffer.from(file.data.data)
  return Buffer.from(file.data)
}

// Envía media subiendo el binario por multipart (límite 50 MB).
// Necesario para sendDocument: por URL Telegram SOLO soporta GIF/PDF/ZIP;
// docx/xlsx/etc. devuelven "failed to get HTTP URL content".
const sendMediaUpload = async (token, chatId, method, field, file, caption, replyToId, _retried = false) => {
  const form = new FormData()
  form.append('chat_id', String(chatId))
  if (caption) form.append('caption', caption)
  if (replyToId) form.append('reply_parameters', JSON.stringify({ message_id: replyToId, allow_sending_without_reply: true }))
  form.append(field, toBuffer(file), { filename: file.name || 'archivo', contentType: file.mimetype })
  try {
    const { data } = await axios.post(`${apiBase(token)}/${method}`, form, {
      headers: form.getHeaders(), maxBodyLength: Infinity, maxContentLength: Infinity
    })
    if (data.ok !== true) throw data
    return data.result
  } catch (err) {
    const resp = err?.response?.data
    const retryAfter = resp?.parameters?.retry_after
    if (!_retried && err?.response?.status === 429 && retryAfter) {
      await new Promise(r => setTimeout(r, (retryAfter + 1) * 1000))
      return sendMediaUpload(token, chatId, method, field, file, caption, replyToId, true)
    }
    throw resp || err
  }
}

const sendDocumentUpload = (token, chatId, file, caption, replyToId) =>
  sendMediaUpload(token, chatId, 'sendDocument', 'document', file, caption, replyToId)

const sendLocation = (token, chatId, latitude, longitude) =>
  call(token, 'sendLocation', { chat_id: chatId, latitude, longitude })

// Indicador "escribiendo…" (equivalente al senderAction de TikTok)
const sendChatAction = (token, chatId, action = 'typing') =>
  call(token, 'sendChatAction', { chat_id: chatId, action })

// emoji falsy → quita la reacción
const setReaction = (token, chatId, messageId, emoji) =>
  call(token, 'setMessageReaction', {
    chat_id: chatId, message_id: messageId,
    reaction: emoji ? [{ type: 'emoji', emoji }] : []
  })

// Media ENTRANTE: file_id → getFile → descarga (URL válida ~1h, máx 20 MB) → Buffer
const getFile = (token, fileId) => call(token, 'getFile', { file_id: fileId }) // → { file_id, file_size, file_path }

const downloadFile = async (token, filePath) => {
  const { data } = await axios.get(`${fileBase(token)}/${filePath}`, { responseType: 'arraybuffer' })
  return Buffer.from(data)
}

module.exports = {
  getMe,
  setWebhook,
  deleteWebhook,
  sendText,
  sendPhoto,
  sendVideo,
  sendDocument,
  sendVoice,
  sendAudio,
  sendMediaUpload,
  sendDocumentUpload,
  sendLocation,
  sendChatAction,
  setReaction,
  getFile,
  downloadFile
}
