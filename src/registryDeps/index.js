import fetch from 'isomorphic-fetch'
import registryUrl from 'registry-url'
import npa from 'npm-package-arg'

const registryDeps = async (dependency) => {
  const registry = registryUrl()
  // not sure how the registry responds to the different
  const escapedName = npa(`${dependency.module}`).escapedName
  const url = `${registry}${escapedName}`
  console.log(`url=${url}`)
  const data = await fetch(url)
  const response = await data.json()
  if (response.versions) {
    return response.versions[dependency.version].dependencies
  }
  return {}
}

export default registryDeps
