import getDepends from '../fileDeps'
import collate from '../collate'
import getRegistryDeps from '../registryDeps'
import async from 'async'
/*
results tree object should be
{
  name: undefined
  depends: [],
  nameA: {identical to this object},
  nameB: {
    name: 'nameB',
    depends: [],
    nameC: {}
    nameD: {
      depends: [],
      nameE: {}
    }
  },
  ...
  nameN: {}
}
*/
// babel-traverse babel-types 'babel-types', version: '^6.9.0'  'babel-traverse', version: '^6.9.0'
export const isCircularDependency = ({ parent: ancestor, dependency }) => {
  if (!ancestor || !ancestor.name) return false
  const match = (ancestor.name === dependency.module)
  if (match) {
    console.log(`Circ dep parent ${ancestor.name} to ${dependency.module}`)
    return match
  }
  if (!ancestor.parent) return false
  return isCircularDependency({parent: ancestor.parent, dependency})
}

const walker = async (task, cb) => {
  if (isCircularDependency(task)) return cb(null, null, null, null)
  const regDeps = await getRegistryDeps(task.dependency)
  task.results[task.dependency.module] = {}
  if (regDeps) {
    const depends = []
    Object.getOwnPropertyNames(regDeps).forEach((depName) => {
      if (depName) depends.push({ module: depName, version: regDeps[depName] })
    })
    if (depends.length > 0) {
      task.results[task.dependency.module] = { name: task.dependency.module, depends, depth: task.depth }
      const newDeps = depends.map(dependency => ({ dependency, results: task.results[task.dependency.module], q: task.q, depth: task.depth + 1, parent: task.results }))
      newDeps.forEach(nd => task.q.push(nd, (e, n, v, p) => true))
    }
  }
  cb(null, task.dependency.module, task.results[task.dependency.module], task.results)
}

/*
task is
dependency,
results Obj
depth
parent

 */

const walkDeps = async (moduleToFind, done) => {
  const packageJsonDeps = await getDepends('package.json')
  // get an array of { module, semver }
  const collatedDeps = collate(packageJsonDeps)
  let results = { depends: collatedDeps }
  const q = async.queue(walker, 10)
  q.drain = () => {
    console.log(`all finished ${JSON.stringify(results, null, 2)}`)
    if (done) done(results)
  }
  collatedDeps.forEach((d) => q.push({ dependency: d, results, q, depth: 1, parent: undefined }, (e, n, v) => null))
}

export default walkDeps
