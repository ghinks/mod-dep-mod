import getDepends from '../fileDeps'
import collate from '../collate'
import getRegistryDeps from '../registryDeps'
import async from 'async'
import cleanPrivProps from '../cleanPrivateProps'
import treeify from 'treeify'

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
  if (!ancestor || !ancestor.__name) return false
  const match = (ancestor.__name === dependency.module)
  if (match) return `Circular dependency parent ${ancestor.__name}`
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
    const __depends = []
    Object.getOwnPropertyNames(regDeps).forEach((depName) => {
      if (depName) __depends.push({ module: depName, version: regDeps[depName] })
    })
    if (__depends.length > 0) {
      task.results[task.dependency.module] = { __name: task.dependency.module, __depends, __depth: task.__depth }
      const newDeps = __depends.map(dependency => ({ dependency, results: task.results[task.dependency.module], q: task.q, __depth: task.__depth + 1, parent: task.results }))
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
  let results = { __depends: collatedDeps }
  const q = async.queue(walker, 10)
  q.drain = () => {
    results = cleanPrivProps(results)
    // console.log(`${JSON.stringify(results, null, 2)}`)
    console.log(treeify.asTree(results, true))
    if (done) done(results)
  }
  // TODO cb error handling
  // TODO add moduleToFind and mark it in objects when found
  // TODO take package@version as argument rather than package.json
  collatedDeps.forEach((d) => q.push({ dependency: d, results, q, __depth: 1, parent: undefined }, () => null))
}

export default walkDeps
