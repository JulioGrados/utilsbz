'use strict'

const fs = require('fs')
const path = require('path')
const config = require('config')

let SERVER_PATH
if (config.media.env === 'production') {
  SERVER_PATH = '/opt/media/uploads'
} else {
  SERVER_PATH = path.join(__dirname, '../../mediabz/uploads')
}

const saveImage = async (binary, name) => {
  // try {
  //   const data = Buffer.from(binary, 'binary').toString('base64')
  //   const route = SERVER_PATH + '/images/' + name + '.png'
  //   fs.writeFile(route, data, 'base64', function (error) {
  //     console.log('error', error)
  //   })
  //   return `/images/${name}.png`
  // } catch (error) {
  //   console.log(error)
  // }
  // return `/images/${name.png}`

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
}

module.exports = {
  saveImage
}