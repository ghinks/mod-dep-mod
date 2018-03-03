const cleanPrivateProps = (obj) => {
  const regex = /__(.*)/
  Object.keys(obj).forEach(k => {
    if (k.match(regex)) delete obj[k]
  })
  Object.keys(obj).forEach((k) => {
    if (obj[k] instanceof Object) cleanPrivateProps(obj[k])
  })
  return obj
}

export default cleanPrivateProps
