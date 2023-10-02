'use strict'

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

const B2 = require('backblaze-b2');

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_KEY,
});

let authorized = false;
const maxAttempts = 3;  // Número máximo de intentos de autorización

const handleAuthorization = async () => {
  try {
    await b2.authorize();
    authorized = true;
  } catch (error) {
    console.error('Error al autorizar:', error);
    throw new Error('No se pudo autorizar con Backblaze B2');
  }
};

const saveImage = async (binary, name) => {
  // Buffer del archivo
  const data = Buffer.from(binary, 'binary');

  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      // Manejar la autorización
      if (!authorized) {
        await handleAuthorization();
      }

      // Obtener la URL y el token para la carga
      const { data: { authorizationToken,uploadUrl }} = await b2.getUploadUrl({
        bucketId: process.env.B2_BUCKET_ID,
      });

      // Subir el archivo
      await b2.uploadFile({
        uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName: 'images/' + name + '.png',
        data: data,
      });

      return '/images/' + name + '.png'; // Nombre del archivo
    } catch (error) {
      console.error('Error al subir el archivo:', error);

      // Si el error está relacionado con la autorización, reiniciar la bandera de autorización
      if (error.code === 'unauthorized' || error.code === 'expired_auth_token') {
        authorized = false;
        attempts++;  // Aumentar el contador de intentos
      } else {
        // Si el error es por otra razón, lanzar el error
        throw error;
      }
    }
  }

  // Si se alcanza el número máximo de intentos, lanzar un error
  throw new Error('Se alcanzó el número máximo de intentos para subir el archivo');
};

module.exports = {
  saveImage
}