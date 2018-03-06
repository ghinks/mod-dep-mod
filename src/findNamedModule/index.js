const findNamedModule = (obj, name, tree) => {
  if (!obj || !name) return []
  const regex = new RegExp(name)
  let matchingKeys = Object.keys(obj).filter(k => k.match(regex)).map(k => `${tree ? tree + '.' + k : k}`)
  Object.keys(obj).filter(k => !k.match(regex) && obj[k] instanceof Object).forEach((k) => {
    matchingKeys = [...matchingKeys, ...findNamedModule(obj[k], name, `${tree ? tree + '.' + k : k}`)]
  })
  return matchingKeys
}

export default findNamedModule