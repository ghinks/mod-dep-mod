import readPackageJson from 'read-package-json'
import promisify from 'pify'
import fs from 'fs'

const read = async (file) => {
  if (!fs.existsSync(file)) {
    return Promise.reject(new Error('file not found'))
  }
  const pj = promisify(readPackageJson)
  const { dependencies, devDependencies, name } = await pj(file)
  return { dependencies, devDependencies, name }
}

export default read
