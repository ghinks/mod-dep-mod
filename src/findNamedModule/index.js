const findNamedModule = (obj, name, tree) => {
  if (!obj || !name) return []
  const keys = Object.keys(obj)
  const regex = new RegExp(name)
  const keyMatch = keys.filter(k => k.match(regex))
  let matchingKeys = keyMatch.map(k => `${tree ? tree + '.' + k : k}`)
  Object.keys(obj).filter(k => !k.match(regex) && obj[k] instanceof Object).forEach((k) => {
    let nextTree = `${tree ? tree + '.' + k : k}`
    const newMatchingKeys = findNamedModule(obj[k], name, nextTree)
    if (newMatchingKeys.length > 0) {
      matchingKeys = [...matchingKeys, ...newMatchingKeys]
    }
  })
  return matchingKeys
}

export default findNamedModule
