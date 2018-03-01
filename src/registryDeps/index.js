import fetch from 'isomorphic-fetch'
import registryUrl from 'registry-url'
import npa from 'npm-package-arg'
import semverMatcher from '../packageMatcher'

const registryDeps = async (dependency) => {
  const registry = registryUrl()
  const escapedName = npa(`${dependency.module}`).escapedName
  const url = `${registry}${escapedName}`
  const data = await fetch(url)
  const response = await data.json()
  if (response.versions) {
    const match = semverMatcher(Object.keys(response.versions), dependency.version)
    return response.versions[match].dependencies
  }
  return {}
}

export default registryDeps
