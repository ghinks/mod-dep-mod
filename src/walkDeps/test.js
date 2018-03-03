import { expect } from 'chai'
import walkDeps, { isCircularDependency } from './index'

describe('Walk dependency tree', () => {
  // when you depend on your parent!
  describe('Circular Depeneds', () => {
    it('Expect no circular dependencies', () => {
      const parent = undefined
      const dependency = {}
      const result = isCircularDependency({ parent, dependency })
      expect(result).to.be.equal(false)
    })
    it('Expect no circular dependencies', () => {
      const parent = { depends: undefined }
      const dependency = {}
      const result = isCircularDependency({ parent, dependency })
      expect(result).to.be.equal(false)
    })
    it('Expect to find circular dependencies', () => {
      const parent = { depends: [{ module: 'debug', version: '1.0.0' }] }
      const dependency = { module: 'debug', version: '1.0.0' }
      const result = isCircularDependency({ parent, dependency })
      expect(result).to.be.equal(true)
    })
  })
  describe('Walking', () => {
    beforeEach(() => {
      walkDeps.__Rewire__('getRegistryDeps', (dependency) => {
        let result
        if (dependency.module === 'debug') result = {}
        if (dependency.module === 'name1') result = {}
        if (dependency.module === 'name2') result = {}
        if (dependency.module === 'name3') result = {}
        return Promise.resolve(result)
      })
      walkDeps.__Rewire__('getDepends', () => Promise.resolve({}))
      walkDeps.__Rewire__('collate', () => [
        { module: 'name1', version: '1.0.0' },
        { module: 'name2', version: '1.0.1' },
        { module: 'name3', version: '1.0.2' }
      ])
    })
    it.only('Expect to get depends', (done) => {
      const finished = (results) => {
        expect(results).to.be.an('Object')
        done()
      }
      walkDeps('debug', finished)
        .then(() => {})
        .catch(err => done(err))
    })
  })
})
