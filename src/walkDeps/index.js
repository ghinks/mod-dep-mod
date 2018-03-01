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
  const q = async.queue(async function (depend, cb) {
    const regDeps = await getRegistryDeps(depend)
    if (regDeps) {
      Object.keys(regDeps).forEach((k) => {
        if (k) results[k] = regDeps[k]
      })
    }
    cb()
  }, 10)
  // here we are with a lovely list of modules and semvers
  // from which we wish to find our top level package that
  // is including the moduleToFind
  q.drain = () => console.log(`all finished ${JSON.stringify(results, null, 2)}`)
  q.push(collatedDeps, () => null)
}

export default walkDeps
