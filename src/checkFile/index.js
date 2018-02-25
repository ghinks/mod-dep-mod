import fs from 'fs'
import debug from 'debug'

const debugFile = debug('file')

const checkForFile = (file) => {
  debugFile(`check for file ${file}`)
  return fs.existsSync(file)
}

export default checkForFile
