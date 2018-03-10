import fetch from 'isomorphic-fetch'
import registryUrl from 'registry-url'
import npa from 'npm-package-arg'
import semverMatcher from '../packageMatcher'
import ora from 'ora'

const spinner = ora('...fetching').start();
const cache = {}
let totalFetchCount = 0

const registryDeps = async (dependency) => {
  const registry = registryUrl()
  const escapedName = npa(`${dependency.module}`).escapedName
  const url = `${registry}${escapedName}`
  let response
  // TODO handle the case when the call is pending and not yet cached
  if (!cache[url]) {
    try {
      totalFetchCount += 1
      spinner.text = `fetch count ${totalFetchCount} now fetching ${url}`
      const data = await fetch(url)
      response = await data.json()
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
      if (!response.versions[match] && !dependency.version.match(/.*tgz/)) {
        console.error(`no match for ${dependency.module} ${dependency.version}`)
        return {}
      }
      // handle no dependencies
      return response.versions[match].dependencies || {}
    }
    if (response.versions) {
      const match = semverMatcher(Object.keys(response.versions), dependency.version)
      if (!response.versions[match]) {
        console.error(`no match for ${dependency.module} ${dependency.version}`)
        return {}
      }
      // handle no dependencies
      return response.versions[match].dependencies || {}
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'test') console.log(`error getting semver match ${err.message}`)
  }
  return {}
}

export default registryDeps
