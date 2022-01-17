import fetch from 'isomorphic-fetch'
import registryUrl from 'registry-url'
import npa from 'npm-package-arg'
import semverMatcher from '../packageMatcher/index.js'
import { createOra } from '../thirdPartyMocks/ora/index.js'

let spinner
const cache = {}
const getCache = (key) => {
  if (key) {
    return cache[key]
  }
}
const setCache = (key, value) => {
  cache[key] = value
  return cache
}
let fetchCount = 0

const registryDeps = async (dependency) => {
  const ora = createOra()
  if (!spinner) spinner = ora.start()
  const registry = registryUrl()
  const escapedName = npa(`${dependency.module}`).escapedName
  const url = `${registry}${escapedName}`
  let response
  if (!getCache(url)) {
    try {
      fetchCount += 1
      // spinner.text = `fetch count ${fetchCount} now fetching ${url} `
      const options = { method: 'get', timeout: 20000 }
      const data = await fetch(url, options)
      response = await data.json()
      setCache(url, response)
    } catch (err) {
      console.error(`Module ${dependency.module} was not found ${err.message}`)
      return {}
    }
  } else {
    response = getCache(url)
  }
  if (response.versions) {
    const match = semverMatcher(Object.keys(response.versions), dependency.version)
    if (!response.versions[match] && !dependency.version.match(/.*(gz|git)/)) {
      console.error(` no match for ${dependency.module} ${dependency.version}`)
      return {}
    }
    return response.versions[match].dependencies || {}
  }

  return {}
}

export { registryDeps, getCache, setCache }
