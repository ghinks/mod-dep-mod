import { expect } from 'chai'
import walkDeps, { isCircularDependency } from './index'
import fs from 'fs'
import promisify from 'pify'

describe('Walk dependency tree', () => {
  const getFile = promisify(fs.readFile)
  // when you depend on your ancestor
  describe('Circular Depeneds', () => {
    it('Expect no circular dependencies', () => {
      const parent = undefined
      const dependency = {}
      const result = isCircularDependency({ parent, dependency })
      expect(result).to.be.equal(false)
    })
    it('Expect no circular dependencies', () => {
      const parent = { __name: undefined }
      const dependency = {}
      const result = isCircularDependency({ parent, dependency })
      expect(result).to.be.equal(false)
    })
    it('Expect to find circular dependencies', () => {
      const parent = {
        __name: 'mom',
        __depends: [{ module: 'debug', version: '1.0.0' }]
      }
      const dependency = { module: 'mom', version: '1.0.0' }
      const result = isCircularDependency({ parent, dependency })
      expect(result).not.to.be.equal(false)
    })
    it('Expect to find circular dependencies', () => {
      const grandParent = {
        __name: 'pop',
        __depends: [ {module: 'mom', version: '1.0.0'} ]
      }
      const parent = {
        parent: grandParent,
        __name: 'mom',
        __depends: [{ module: 'debug', version: '1.0.0' }]
      }
      const dependency = { module: 'pop', version: '1.0.0' }
      const result = isCircularDependency({ parent, dependency })
      expect(result).not.to.be.equal(false)
    })
  })
  describe('Walking', () => {
    describe('basic test', () => {
      beforeEach(() => {
        walkDeps.__Rewire__('getRegistryDeps', (dependency) => {
          let result
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
      afterEach(() => {
        // eslint-disable-next-line no-undef
        __rewire_reset_all__()
      })
      it('Expect to get depends', (done) => {
        const finished = (results) => {
          expect(results).to.be.an('Object')
          done()
        }
        walkDeps('debug', finished)
          .then(() => {})
          .catch(err => done(err))
      })
    })
    describe('babel env testing', () => {
      beforeEach(() => {
        walkDeps.__Rewire__('getDepends', () => Promise.resolve({}))
        walkDeps.__Rewire__('collate', () => [
          { module: 'babel-preset-stage-0', version: '^6.24.1' }
        ])
        walkDeps.__Rewire__('getRegistryDeps', (dependency) => {
          const path = `./src/walkDeps/testData/${dependency.module}.json`
          // TODO handle the caret and tildas
          const regexMajMin = /(\^\d)*(\d+\.[\d]+\.[\d]+)/
          const match = dependency.version.match(regexMajMin)
          if (!match) {
            console.log(`no match for ${dependency.module} @ ${dependency.version}`)
          }
          const version = match[2]
          return getFile(path, {encoding: 'utf8'})
            .then((data) => {
              const dep = JSON.parse(data)
              if (!dep.versions[version]) {
                console.log(`cannot find ${dependency.module} ${version}`)
                return {}
              }
              const result = dep.versions[version].dependencies || {}
              return result
            })
        })
      })
      afterEach(() => {
        // eslint-disable-next-line no-undef
        __rewire_reset_all__()
      })
      it('Expect to get depends', (done) => {
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
})
