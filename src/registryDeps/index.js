import fetch from 'isomorphic-fetch'
import registryUrl from 'registry-url'
import npa from 'npm-package-arg'
import semverMatcher from '../packageMatcher'
// import promisify from 'pify'
// import fs from 'fs'

const cache = {}

const registryDeps = async (dependency) => {
  const registry = registryUrl()
  const escapedName = npa(`${dependency.module}`).escapedName
  const url = `${registry}${escapedName}`
  let response
  // TODO handle the case when the call is pending and not yet cached
  if (!cache[url]) {
    try {
      // console.log(`fetch ${url}`)
      const data = await fetch(url)
      response = await data.json()
      // await promisify(fs.writeFile)(`./data/${dependency.module}.json`, JSON.stringify(response, null, 2), 'utf8')
      cache[url] = response
    } catch (err) {
      console.error(`Module ${dependency.module} was not found`)
      return {}
    }
  } else {
    response = cache[url]
  }
  try {
    if (response.versions) {
      const match = semverMatcher(Object.keys(response.versions), dependency.version)
      if (!response.versions[match]) {
        console.error(`no match for ${dependency.module} ${dependency.version} in ${Object.keys(response.versions)}`)
        return {}
      }
      // handle no dependencies
      return response.versions[match].dependencies || {}
    }  if (response.versions) {
      const match = semverMatcher(Object.keys(response.versions), dependency.version)
      if (!response.versions[match]) {
        console.error(`no match for ${dependency.module} ${dependency.version} in ${Object.keys(response.versions)}`)
        return {}
      }
      // handle no dependencies
      return response.versions[match].dependencies || {}
    }
  } catch (err) {
    console.log(`error getting semver match ${err.message}`)
  }
  return {}
}

export default registryDeps
