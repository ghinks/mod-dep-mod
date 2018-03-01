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

const walkDeps = async (moduleToFind) => {
  const packageJsonDeps = await getDepends('package.json')
  // get an array of { module, semver }
  const collatedDeps = collate(packageJsonDeps)
  let results = { depends: collatedDeps }
  const q = async.queue(async function (task, cb) {
    const regDeps = await getRegistryDeps(task.dependency)
    results[task.dependency.module] = {}
    if (regDeps) {
      Object.keys(regDeps).forEach((k) => {
        if (k) results[task.dependency.module][k] = regDeps[k]
      })
    }
    cb()
  }, 10)
  // here we are with a lovely list of modules and semvers
  // from which we wish to find our top level package that
  // is including the moduleToFind
  q.drain = () => console.log(`all finished ${JSON.stringify(results, null, 2)}`)
  collatedDeps.forEach((d) => {
    q.push({ dependency: d, results }, () => null)
  })
}

export default walkDeps
