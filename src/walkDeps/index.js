#!/usr/bin/env node

import getDepends from '../fileDeps'
import collate from '../collate'
import getRegistryDeps from '../registryDeps'
import async from 'async'
import cleanPrivProps from '../cleanPrivateProps'
import findNamedModule from '../findNamedModule'

export const isCircularDependency = ({ parent: ancestor, dependency }) => {
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

const walkDeps = async (moduleToFind, done) => {
  const packageJsonDeps = await getDepends('package.json')
  const name = packageJsonDeps.name
  const collatedDeps = collate(packageJsonDeps)
  let results = { __depends: collatedDeps }
  const q = async.queue(walker, 10)
  q.drain = () => {
    results = cleanPrivProps(results)
    const matches = findNamedModule(results, moduleToFind, undefined)
    matches.forEach(m => console.log(`${name} => ${m.replace(/\./g, ' --> ')}`))
    if (done) done(results)
    process.exit()
  }
  // TODO cb error handling
  // TODO take package@version as argument rather than package.json
  // TODO add package.json name to top of the tree
  collatedDeps.forEach((d) => q.push({ dependency: d, results, q, __depth: 1, parent: undefined }, () => null))
}

export default walkDeps
