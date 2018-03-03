import fetch from 'isomorphic-fetch'
import registryUrl from 'registry-url'
import npa from 'npm-package-arg'
import semverMatcher from '../packageMatcher'
import fs from 'fs'

const cache = {}

const registryDeps = async (dependency) => {
  const registry = registryUrl()
  const escapedName = npa(`${dependency.module}`).escapedName
  const url = `${registry}${escapedName}`
  let response
  // TODO handle the case when the call is pending and not yet cached
  if (!cache[url]) {
    console.log(`fetch ${url}`)
    const data = await fetch(url)
    response = await data.json()
    cache[url] = response
  } else {
    response = cache[url]
  }
  if (response.versions) {
    const match = semverMatcher(Object.keys(response.versions), dependency.version)
    if (!response.versions[match]) {
      console.error(`no match for ${dependency.module} ${match} in ${Object.keys(response.versions)}`)
      return {}
    }
    // handle no dependencies
    return response.versions[match].dependencies || {}
  }
  return {}
}

export default registryDeps
