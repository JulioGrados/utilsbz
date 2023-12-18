'use strict'

const { saveFile } = require("./backblaze");

/* const fs = require('fs')
const path = require('path')
const config = require('config')

let SERVER_PATH
if (config.media.env === 'production') {
  SERVER_PATH = config.media.productionUrl + '/uploads'
} else {
  SERVER_PATH = path.join(__dirname, '../../mediabz/uploads')
}

const saveImage = async (binary, name) => {

  const data = Buffer.from(binary, 'binary').toString('base64')
  const fileroot = '/images/' + name + '.png'
  console.log('data', SERVER_PATH + fileroot)
  try {
    await fs.writeFile(SERVER_PATH + fileroot, data, 'base64', function (error) {
      console.log(error)
    })
    return fileroot
  } catch (error) {
    throw error
  }
} */




const saveImage = async (binary, name) => {
  // const fileName = 'images/' + name + '.png';
  // Guardar la imagen en Backblaze
  const fileName = await saveFile(binary, name);
  return fileName
};



module.exports = {
  saveImage
}

