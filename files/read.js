const fs = require('fs')

const readFile = async (route) => {
  try {
    const rawdata = await fs.readFileSync(route)
    const arr = (JSON.parse(rawdata))
    return arr
  } catch (e) {
    const errorMsg = {
      status: 500,
      message: `Error de lectura de archivo ${e}`
    }
    throw errorMsg
  }
}

module.exports = {
  readFile
}