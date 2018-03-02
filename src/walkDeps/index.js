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
const walker = async (task, cb) => {
  const regDeps = await getRegistryDeps(task.dependency)
  task.results[task.dependency.module] = {}
  if (regDeps) {
    const depends = []
    Object.getOwnPropertyNames(regDeps).forEach((depName) => {
      if (depName) depends.push({ module: depName, version: regDeps[depName] })
    })
    if (depends.length > 0) {
      task.results[task.dependency.module] = { depends }
      const newDeps = depends.map(dependency => ({ dependency, results: task.results[task.dependency.module], q: task.q }))
      newDeps.forEach(nd => task.q.push(nd, (e, n, v) => console.log(n, v)))
      // depends.forEach(dependency => task.q.push({ dependency, results: task.results[task.dependency.module], q: task.q }, (e, v) => console.log(v)))
    }
  }
  cb(null, task.dependency.module, task.results[task.dependency.module])
}

const walkDeps = async (moduleToFind) => {
  const packageJsonDeps = await getDepends('package.json')
  // get an array of { module, semver }
  const collatedDeps = collate(packageJsonDeps)
  let results = { depends: collatedDeps }
  const q = async.queue(walker, 1)
  // here we are with a lovely list of modules and semvers
  // from which we wish to find our top level package that
  // is including the moduleToFind
  q.drain = () => console.log(`all finished ${JSON.stringify(results, null, 2)}`)
  collatedDeps.forEach((d) => q.push({ dependency: d, results, q }, (e, n, v) => console.log(n, v)))
}

export default walkDeps
