import getDepends from '../readDependencyFile'
import collate from '../collate'
import getRegistryDeps from '../fetchRegistryDependencies'
import async from 'async'
import cleanPrivProps from '../cleanPrivateProps'
import findNamedModule from '../findNamedModule'

const circulars = []

export const isCircularDependency = ({ ancestry, dependency }) => {
  if (!ancestry) return false
  if (circulars.includes(dependency.module)) return true
  if (!ancestry.includes(dependency.module)) return false
  return true
}

const walker = async (task, cb) => {
  const circular = isCircularDependency(task)
  if (circular) {
    task.results[task.dependency.module] = { circular: `Circular dependency in tree` }
    return cb(null, null, null, null)
  }

  let regDeps
  try {
    regDeps = await getRegistryDeps(task.dependency)
  } catch (err) {
    console.error(err.message)
  }

  task.results[task.dependency.module] = {}
  if (regDeps) {
    const __depends = []
    Object.getOwnPropertyNames(regDeps).forEach((depName) => {
      if (depName) __depends.push({ module: depName, version: regDeps[depName] })
    })
    if (__depends.length > 0) {
      task.results[task.dependency.module] = { __name: task.dependency.module, __depends, __depth: task.__depth }
      const newDeps = __depends.map(dependency => ({ dependency, results: task.results[task.dependency.module], q: task.q, __depth: task.__depth + 1, ancestry: [...task.ancestry, task.dependency.module] }))
      // TODO cd error handling
      newDeps.forEach(nd => task.q.push(nd, () => null))
    }
  }
  cb(null, task.dependency.module, task.results[task.dependency.module], task.results)
}

const walkDeps = async (modules, dependsFile, nodeEnv, done) => {
  const packageJsonDeps = await getDepends(dependsFile)
  const name = packageJsonDeps.name
  const collatedDeps = collate(packageJsonDeps)
  let results = { __depends: collatedDeps }
  const q = async.queue(walker, 10)
  q.drain = () => {
    results = cleanPrivProps(results)
    const matches = modules.reduce((acc, moduleToFind) => {
      const found = findNamedModule(results, moduleToFind, undefined)
      return [...acc, ...found]
    }, [])
    if (nodeEnv !== 'test' && matches.length > 0) {
      console.log('')
      console.log(Array(50).join('--'))
      matches.forEach(m => console.log(`${name} => ${m.replace(/\./g, ' --> ')}`))
      console.log(Array(50).join('--'))
    }
    else if (nodeEnv !== 'test' && matches.length === 0) {
      console.log('')
      console.log(Array(50).join('--'))
      console.log('no matches found')
      console.log(Array(50).join('--'))
    }
    if (done) done(results)
  }
  // TODO cb error handling
  // TODO take package@version as argument rather than package.json
  // TODO add package.json name to top of the tree
  collatedDeps.forEach((d) => q.push({ dependency: d, results, q, __depth: 1, ancestry: [] }, () => null))
}

export default walkDeps
