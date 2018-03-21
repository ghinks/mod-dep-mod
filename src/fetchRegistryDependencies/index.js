import fetch from 'isomorphic-fetch'
import registryUrl from 'registry-url'
import npa from 'npm-package-arg'
import semverMatcher from '../packageMatcher'
import ora from 'ora'

let spinner
const cache = {}
let fetchCount = 0

const registryDeps = async (dependency) => {
  if (!spinner) spinner = ora('...fetching').start()
  const registry = registryUrl()
  const escapedName = npa(`${dependency.module}`).escapedName
  const url = `${registry}${escapedName}`
  let response
  if (!cache[url]) {
    try {
      fetchCount += 1
      spinner.text = `fetch count ${fetchCount} now fetching ${url} `
      const options = { method: 'get', timeout: 20000 }
      const data = await fetch(url, options)
      response = await data.json()
      cache[url] = response
    } catch (err) {
      console.error(`Module ${dependency.module} was not found ${err.message}`)
      return {}
    }
  } else {
    response = cache[url]
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

export default registryDeps
