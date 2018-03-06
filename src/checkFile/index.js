import fs from 'fs'

const checkForFile = (file) => {
  return fs.existsSync(file)
}

export default checkForFile
