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
const axios = require('axios');

const TOKEN_EXPIRATION_TIME = 86400000; // 24 horas en milisegundos
const API_BASE_URL = 'https://api.backblazeb2.com/b2api/v2/';
const INITIAL_DELAY = 200; // Tiempo inicial de espera en milisegundos para reintento exponencial

class BackblazeManager {
  constructor(accountId, applicationKey) {
    this.accountId = accountId;
    this.applicationKey = applicationKey;
    this.authData = null;
    this.authTime = null;
    this.uploadUrlInfo = null;
    this.uploadUrlExpireTime = null;
  }

  isTokenExpired(lastAuthTime) {
    return Date.now() - lastAuthTime >= TOKEN_EXPIRATION_TIME;
  }

  buildAuthHeader() {
    return {
      Authorization: this.authData.authorizationToken,
    };
  }

  buildUploadHeaders(uploadInfo, fileName) {
    return {
      Authorization: uploadInfo.authorizationToken,
      'X-Bz-File-Name': fileName,
      'Content-Type': 'b2/x-auto',
      'X-Bz-Content-Sha1': 'do_not_verify',
    };
  }

  async authorizeIfNeeded() {
    if (this.authData && !this.isTokenExpired(this.authTime)) {
      return;
    }

    try {
      const response = await axios({
        method: 'GET',
        url: `${API_BASE_URL}b2_authorize_account`,
        auth: {
          username: this.accountId,
          password: this.applicationKey,
        },
      });

      this.authData = response.data;
      this.authTime = Date.now();
    } catch (error) {
      if (error.response && error.response.status !== 401) {
        throw new Error('Error al autorizar la cuenta');
      }
    }
  }

  async getUploadUrlIfNeeded(bucketId) {
    if (this.uploadUrlInfo && !this.isTokenExpired(this.uploadUrlExpireTime)) {
      return this.uploadUrlInfo;
    }

    await this.authorizeIfNeeded();

    const response = await axios.get(`${this.authData.apiUrl}/b2api/v2/b2_get_upload_url`, {
      params: { bucketId },
      headers: this.buildAuthHeader(),
    });

    this.uploadUrlInfo = response.data;
    this.uploadUrlExpireTime = Date.now();
    return this.uploadUrlInfo;
  }

  async uploadFile(bucketId, fileName, data, retries = 3) {
    let delay = INITIAL_DELAY;

    for (let i = 0; i < retries; i++) {
      try {
        const uploadInfo = await this.getUploadUrlIfNeeded(bucketId);
        const response = await axios.post(uploadInfo.uploadUrl, data, {
          headers: this.buildUploadHeaders(uploadInfo, fileName),
        });
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await this.authorizeIfNeeded();
        } else {
          console.log(`Error al subir el archivo, reintentando... (${i + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponencial backoff
        }
      }
    }

    throw new Error('Error al subir el archivo después de varios intentos');
  }
}

// Crea una nueva instancia de BackblazeManager
const backblazeManager = new BackblazeManager(
  process.env.B2_KEY_ID, 
  process.env.B2_KEY
);

const saveImage = async (binary, name) => {
  // Buffer del archivo
  const data = Buffer.from(binary, 'binary');
  const fileName = 'images/' + name + '.png';
  try {
    const bucketId = process.env.B2_BUCKET_ID;
    const uploadResponse = await backblazeManager.uploadFile(bucketId, fileName, data);
    console.log('Archivo subido con éxito:', uploadResponse);
    return "/"+fileName;
  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    throw error;
  }
};



module.exports = {
  saveImage
}

