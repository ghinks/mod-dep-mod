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
// TODO add circular dependency breadcrumb trail
export const isCircularDependency = ({ parent: ancestor, dependency, chain }) => {
  if (!ancestor || !ancestor.name) return false
  const match = (ancestor.name === dependency.module)
  if (match) return `Circular dependency parent ${ancestor.name}`
  if (!ancestor.parent) return false
  return isCircularDependency({parent: ancestor.parent, dependency})
}

const walker = async (task, cb) => {
  const circular = isCircularDependency(task)
  if (circular) {
    task.results[task.dependency.module] = { circular }
    return cb(null, null, null, null)
  }
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
      // TODO cd error handling
      newDeps.forEach(nd => task.q.push(nd, () => null))
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
  const collatedDeps = collate(packageJsonDeps)
  let results = { depends: collatedDeps }
  const q = async.queue(walker, 10)
  q.drain = () => {
    console.log(`all finished ${JSON.stringify(results, null, 2)}`)
    if (done) done(results)
  }
  // TODO cb error handling
  // TODO add moduleToFind and mark it in objects when found
  // TODO rename properites with double underscores so we can walk results and ignore some props
  // TODO take package@version as argument rather than package.json
  collatedDeps.forEach((d) => q.push({ dependency: d, results, q, depth: 1, parent: undefined }, () => null))
}

export default walkDeps
