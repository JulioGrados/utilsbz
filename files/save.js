const path = require('path')
const config = require('config')
const download = require('download')

let SERVER_PATH
if (config.media.env === 'production') {
  SERVER_PATH = '/opt/mediabz/uploads'
} else {
  SERVER_PATH = path.join(__dirname, '../../mediabz/uploads')
}

const saveFile = async (file, route) => {
  const cleanName = file.name.toLowerCase().replace(/\s/g, '')
  console.log('cleanName', cleanName)
  const fileroot = route + '/' + file.md5 + '-' + cleanName
  try {
    await file.mv(SERVER_PATH + fileroot)
  } catch (error) {
    const errorMsg = {
      status: 500,
      message: `¡Error al subir el archivo ${file.name}!`
    }
    throw errorMsg
  }

  return fileroot
}

const saveFileCreateName = async (file, route) => {
  const cleanName = file.name.toLowerCase().replace(/\s/g, '')
  console.log('cleanName', cleanName)
  const ext = cleanName.split('.').pop()
  const filter = cleanName.replace('.' + ext, '')
  const part = filter.substring(filter.length, filter.length - 2)
  const code = filter.substring(filter.length - 4, filter.length - 12)

  const fileroot = route + '/' + file.md5 + '-' + code + '-' + part + '.' + ext
  try {
    await file.mv(SERVER_PATH + fileroot)
  } catch (error) {
    const errorMsg = {
      status: 500,
      message: `¡Error al subir el archivo ${file.name}!`
    }
    throw errorMsg
  }

  return fileroot
}

const saveFileName = async (file, route, name) => {
  const fileroot = route + '/' + file.md5 + '-' + name
  try {
    await file.mv(SERVER_PATH + fileroot)
  } catch (error) {
    const errorMsg = {
      status: 500,
      message: `¡Error al subir el archivo ${file.name}!`
    }
    throw errorMsg
  }

  return fileroot
}

const saveCustom = async (file, route, course, names, code) => {
  // const cleanNames = names.toLowerCase().replace(/\s/g, '')
  // const courseNames = course.toLowerCase().replace(/\s/g, '')
  const fileroot = route + '/' + 'Certificado-' + course + '-' + names + '-' + code + '.pdf'
  try {
    await file.mv(SERVER_PATH + fileroot)
  } catch (error) {
    const errorMsg = {
      status: 500,
      message: `¡Error al subir el archivo ${file.name}!`
    }
    throw errorMsg
  }

  return fileroot
}

const downloadFile = async (uri, route, name) => {
  if (!uri) {
    return undefined
  }
  const url = encodeURI(uri)
  const dest = SERVER_PATH + route

  try {
    await download(url, dest, { filename: name })

    return route + '/' + name
  } catch (e) {
    console.log(e)
    const errorMsg = {
      status: 500,
      message: `¡Error al subir la imagen de ${uri}!`
    }
    throw errorMsg
  }
}

module.exports = {
  saveFile,
  saveFileName,
  saveFileCreateName,
  saveCustom,
  downloadFile
}
