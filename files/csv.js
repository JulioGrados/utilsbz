const csv = require('csv-parser')
const fs = require('fs')
const results = [];

const readFileCsv = async (route) => { 
  const records = []
  const parser = fs
  .createReadStream(route)
  .pipe(csv())

  for await (const record of parser) {
    records.push(record)
  }
  return records
}

module.exports = {
  readFileCsv
}