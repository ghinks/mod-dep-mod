const findNamedModule = (obj, name, tree) => {
  if (!obj || !name) return []
  const regex = new RegExp(name)
  let matchingKeys = Object.keys(obj).filter(k => k.match(regex)).map(k => `${tree ? tree + '.' + k : k}`)
  Object.keys(obj).filter(k => !k.match(regex) && obj[k] instanceof Object).forEach((k) => {
    const newMatchingKeys = findNamedModule(obj[k], name, `${tree ? tree + '.' + k : k}`)
    if (newMatchingKeys.length > 0) {
      matchingKeys = [...matchingKeys, ...newMatchingKeys]
    }
  })
  return matchingKeys
}

export default findNamedModule
