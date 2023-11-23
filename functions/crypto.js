const config = require('config')

const CryptoJS = require("crypto-js")

// Encrypt
const encryptKey = ( key ) => {
  const encrypt = CryptoJS.AES.encrypt(key, config.auth.secret).toString()
  return encrypt
}

// Decrypt
const decryptKey = (key) => {
  const bytes  = CryptoJS.AES.decrypt(key, config.auth.secret);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);  
  return originalText
}

module.exports = {
  encryptKey,
  decryptKey
}