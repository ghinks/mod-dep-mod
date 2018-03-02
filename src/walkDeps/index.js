import getDepends from '../fileDeps'
import collate from '../collate'
import getRegistryDeps from '../registryDeps'
import async from 'async'
/*
results tree object should be
{
  depends: [],
  nameA: {identical to this object},
  nameB: {
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
export const isCircularDependency = ({ parent, dependency }) => {
  if (!parent) return false
  if (!parent.depends) return false
  const parentsMatchingDepends = parent.depends.filter(parentDependency => parentDependency.module === dependency.module)
  if (parentsMatchingDepends.length > 0) {
    return true
  }
  return false
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

const walkDeps = async (moduleToFind) => {
  const packageJsonDeps = await getDepends('package.json')
  // get an array of { module, semver }
  const collatedDeps = collate(packageJsonDeps)
  let results = { depends: collatedDeps }
  const q = async.queue(walker, 10)
  // here we are with a lovely list of modules and semvers
  // from which we wish to find our top level package that
  // is including the moduleToFind
  q.drain = () => console.log(`all finished ${JSON.stringify(results, null, 2)}`)
  collatedDeps.forEach((d) => q.push({ dependency: d, results, q, depth: 1, parent: undefined }, (e, n, v) => null))
}

export default walkDeps
