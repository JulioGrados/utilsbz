const { get, post } = require('../lib/request')

/**
 * Obtener templates de una conexion
 * @param {string} connectionId
 */
const listTemplates = async (connectionId) => {
  return get('/templates', { connectionId })
}

/**
 * Crear chat y enviar template
 */
const sendTemplateAndCreateChat = async (data) => {
  return post('/chats/template', data)
}

module.exports = {
  listTemplates,
  sendTemplateAndCreateChat
}
