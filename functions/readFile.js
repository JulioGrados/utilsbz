const readFile = async (file) => {
  const fs = require('fs')
  const { URL } = require('url')
  const fileUrl = new URL(file)

  const data = fs.readFileSync(fileUrl)
  return data
}

module.exports = {
  readFile
}