import promisify from 'pify'

const pify = (subject) => {
  return promisify(subject)
}

export { pify }
