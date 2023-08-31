'use strict'

const debug = require('debug')
const chalk = require('chalk')

const handleFatalError = (log, filePath) => {
  const message = debug(filePath)
  if (log) {
    message(`${chalk.red('[Fatal Error]')} ${log.message ? log.message : log}`)
  }
  console.log('error', log)
  process.exit(1)
}

const hanldeError = (log, filePath) => {
  const message = debug(filePath)
  message(`${chalk.red('[Error]')} ${log.message ? log.message : log}`)
  console.log(log.stack ? log.stack : '')
}

const handleMessage = (log, filePath, extra = '') => {
  const message = debug(filePath)
  message(`${chalk.blue('[Message]')} ${log}`)
  if (extra !== '') {
    console.log(`${extra}`)
  }
}

module.exports = {
  handleFatalError,
  hanldeError,
  handleMessage
}
