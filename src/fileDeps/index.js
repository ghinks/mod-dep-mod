import readPackageJson from 'read-package-json'
import checkPackageFile from '../checkFile'
import { promisify } from 'util'

const read = async (file) => {
  if (!checkPackageFile(file)) {
    return Promise.reject(new Error('file not found'))
  }
  const pj = promisify(readPackageJson)
  const { dependencies, devDependencies } = await pj(file)
  return { dependencies, devDependencies }
}

export default read