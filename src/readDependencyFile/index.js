import readPackageJson from 'read-package-json'
import { pify as promisify } from '../thirdPartyMocks/promisify/index.js'
// import promisify from 'pify'
import fs from 'fs'
import fetch from 'isomorphic-fetch'
import { URL } from 'url'

const isUrl = (pckUrl) => {
  try {
    const tgtUrl = new URL(pckUrl)
    return tgtUrl
  } catch (err) {
    return undefined
  }
}

const getPckFromUrl = async (url) => {
  const options = { method: 'get', timeout: 10000 }
  const data = await fetch(url, options)
  const { dependencies, devDependencies, name } = await data.json()
  return {
    dependencies,
    devDependencies,
    name
  }
}

export { getPckFromUrl, isUrl }

const read = async (file) => {
  if (isUrl(file)) {
    return getPckFromUrl(file)
  } else if (!fs.existsSync(file)) {
    return Promise.reject(new Error('file not found xxxx'))
  }

  const pj = promisify(readPackageJson)
  const { dependencies, devDependencies, name } = await pj(file)
  return { dependencies, devDependencies, name }
}

export default read
