const axios = require('axios')
const FormData = require('form-data')

const API_BASE = process.env.TIKTOK_API_BASE || 'https://business-api.tiktok.com/open_api/v1.3'
const APP_ID = process.env.TIKTOK_APP_ID
const APP_SECRET = process.env.TIKTOK_APP_SECRET

// auth_code -> { access_token, open_id (=business_id), refresh_token, expires_in, ... }
const exchangeCodeForToken = async (authCode, redirectUri) => {
  const { data } = await axios.post(`${API_BASE}/tt_user/oauth2/token/`, {
    client_id: APP_ID, client_secret: APP_SECRET,
    grant_type: 'authorization_code', auth_code: authCode, redirect_uri: redirectUri
  }, { headers: { 'Content-Type': 'application/json' } })
  if (data.code !== 0) throw data
  return data.data
}

const refreshAccessToken = async (refreshToken) => {
  const { data } = await axios.post(`${API_BASE}/tt_user/oauth2/refresh_token/`, {
    client_id: APP_ID, client_secret: APP_SECRET,
    grant_type: 'refresh_token', refresh_token: refreshToken
  }, { headers: { 'Content-Type': 'application/json' } })
  if (data.code !== 0) throw data
  return data.data
}

const getUserInfo = async (token) => {
  const { data } = await axios.get(`${API_BASE}/user/info/`, { headers: { 'Access-Token': token } })
  return data.data
}

const getConversations = async (businessId, token, conversationType = 'SINGLE', cursor = 0, limit = 100) => {
  const { data } = await axios.get(`${API_BASE}/business/message/conversation/list/`, {
    params: { business_id: businessId, conversation_type: conversationType, cursor, limit },
    headers: { 'Access-Token': token }
  })
  if (data.code !== 0) throw data
  return data.data
}

const sendText = async (businessId, conversationId, text, token) => {
  const { data } = await axios.post(`${API_BASE}/business/message/send/`, {
    business_id: businessId, recipient_type: 'CONVERSATION', recipient: conversationId,
    message_type: 'TEXT', text: { body: text }
  }, { headers: { 'Access-Token': token, 'Content-Type': 'application/json' } })
  if (data.code !== 0) throw data
  return data.data // { message: { message_id } }
}

// Historial de mensajes de una conversación → GET .../business/message/content/list/
const getMessages = async (businessId, conversationId, token, cursor = 0, limit = 100) => {
  const { data } = await axios.get(`${API_BASE}/business/message/content/list/`, {
    params: { business_id: businessId, conversation_id: conversationId, cursor, limit },
    headers: { 'Access-Token': token }
  })
  if (data.code !== 0) throw data
  return data.data
}

// Sube una imagen (multipart) y devuelve un id reutilizable en sendImage
// POST .../business/message/image/upload/  (confirmar path/forma exacta en doc)
const uploadImage = async (businessId, file, token) => {
  const form = new FormData()
  form.append('business_id', businessId)
  form.append('image', Buffer.from(file.data.data), {
    filename: file.name, contentType: file.mimetype
  })
  const { data } = await axios.post(`${API_BASE}/business/message/image/upload/`, form, {
    headers: { 'Access-Token': token, ...form.getHeaders() }
  })
  if (data.code !== 0) throw data
  return data.data // { image_id }
}

// Envía una imagen ya subida (uploadImage) a una conversación
const sendImage = async (businessId, conversationId, imageId, token) => {
  const { data } = await axios.post(`${API_BASE}/business/message/send/`, {
    business_id: businessId, recipient_type: 'CONVERSATION', recipient: conversationId,
    message_type: 'IMAGE', image: { image_id: imageId }
  }, { headers: { 'Access-Token': token, 'Content-Type': 'application/json' } })
  if (data.code !== 0) throw data
  return data.data // { message: { message_id } }
}

// Acción de remitente: typing / leído → POST .../business/message/action/
// action: 'TYPING_ON' | 'MARK_READ'  (confirmar path/valores en doc)
const senderAction = async (businessId, conversationId, action, token) => {
  const { data } = await axios.post(`${API_BASE}/business/message/action/`, {
    business_id: businessId, recipient_type: 'CONVERSATION', recipient: conversationId, action
  }, { headers: { 'Access-Token': token, 'Content-Type': 'application/json' } })
  if (data.code !== 0) throw data
  return data.data
}

// Suscribe/actualiza el webhook a NIVEL DE APP (auth con app_id+secret, no Access-Token).
// Endpoint real: POST /business/webhook/update/  ·  event_type para DMs: 'DIRECT_MESSAGE'
// (otros válidos: BRAND_MENTION, COMMENT, DEFAULT, VIDEO)
const subscribeWebhook = async (callbackUrl, eventType = 'DIRECT_MESSAGE') => {
  const { data } = await axios.post(`${API_BASE}/business/webhook/update/`, {
    app_id: APP_ID, secret: APP_SECRET, event_type: eventType, callback_url: callbackUrl
  }, { headers: { 'Content-Type': 'application/json' } })
  if (data.code !== 0) throw data
  return data.data // { app_id, callback_url, event_type }
}

module.exports = {
  exchangeCodeForToken,
  refreshAccessToken,
  getUserInfo,
  getConversations,
  getMessages,
  sendText,
  uploadImage,
  sendImage,
  senderAction,
  subscribeWebhook
}