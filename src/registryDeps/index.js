import request from 'request-promise'
import registryUrl from 'registry-url'
import npa from 'npm-package-arg'

const registry = registryUrl()

const registryDeps = async (moduleName) => {
  const response = await request()
}

export default registryDeps