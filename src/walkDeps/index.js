import getDepends from '../fileDeps'
import collate from '../collate'
import getRegistryDeps from '../registryDeps'
import async from 'async'
import cleanPrivProps from '../cleanPrivateProps'
import findNamedModule from '../findNamedModule'

const circulars = []

export const isCircularDependency = ({ parent: ancestor, dependency }) => {
  if (!ancestor || !ancestor.__name) return false
  if (circulars.includes(dependency.module)) return true
  // console.log(`check circular ${dependency.module} vs ${ancestor.__name}`)
  const match = (ancestor.__name === dependency.module)
  if (match) {
    // console.log(`CIRCULAR ${dependency.module} vs ${ancestor.__name}`)
    circulars.push(dependency.module)
    return `Circular dependency parent ${ancestor.__name}`
  }
  if (!ancestor.parent) return false
  return isCircularDependency({parent: ancestor.parent, dependency})
}

const walker = async (task, cb) => {
  const circular = isCircularDependency(task)
  if (circular) {
    task.results[task.dependency.module] = { circular }
    return cb(null, null, null, null)
  }
  // console.log(`walk the module ${task.dependency.module}`)

  let regDeps
  try {
    regDeps = await getRegistryDeps(task.dependency)
  } catch (err) {
    console.error(err.message)
  }

  try {
    task.results[task.dependency.module] = {}
    if (regDeps) {
      const __depends = []
      Object.getOwnPropertyNames(regDeps).forEach((depName) => {
        if (depName) __depends.push({ module: depName, version: regDeps[depName] })
      })
      if (__depends.length > 0) {
        task.results[task.dependency.module] = { __name: task.dependency.module, __depends, __depth: task.__depth }
        // console.log(`results = ${JSON.stringify(task.results[task.dependency.module], null, 2)}`)
        const newDeps = __depends.map(dependency => ({ dependency, results: task.results[task.dependency.module], q: task.q, __depth: task.__depth + 1, parent: task.results }))
        // TODO cd error handling
        // console.log(`create ${newDeps.length} tasks qLen before=${task.q.length()}`)
        newDeps.forEach(nd => task.q.push(nd, () => null))
      }
    }
  } catch (err) {
    console.error(err.message)
  }

  cb(null, task.dependency.module, task.results[task.dependency.module], task.results)
}

const walkDeps = async (moduleToFind, dependsFile = 'package.json', done) => {
  const packageJsonDeps = await getDepends(dependsFile)
  const name = packageJsonDeps.name
  const collatedDeps = collate(packageJsonDeps)
  let results = { __depends: collatedDeps }
  const q = async.queue(walker, 10)
  q.drain = () => {
    results = cleanPrivProps(results)
    const matches = findNamedModule(results, moduleToFind, undefined)
    matches.forEach(m => console.log(`${name} => ${m.replace(/\./g, ' --> ')}`))
    if (done) done(results)
    if (process.env.NODE_ENV !== 'test') process.exit()
  }
  // TODO cb error handling
  // TODO take package@version as argument rather than package.json
  // TODO add package.json name to top of the tree
  collatedDeps.forEach((d) => q.push({ dependency: d, results, q, __depth: 1, parent: undefined }, () => null))
}

export default walkDeps
