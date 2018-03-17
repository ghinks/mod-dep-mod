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
        walkDeps('debug', null, 'test', finished)
          .then(() => {})
          .catch(err => done(err))
      })
      it('Expect to get depends and show output', (done) => {
        const finished = (results) => {
          expect(results).to.be.an('Object')
          done()
        }
        walkDeps('name3', null, 'production', finished)
          .then(() => {})
          .catch(err => done(err))
      })
    })
    describe('failing tests', () => {
      beforeEach(() => {
        walkDeps.__Rewire__('getRegistryDeps', () => Promise.reject(new Error('testError')))
        walkDeps.__Rewire__('getDepends', () => Promise.resolve({}))
        walkDeps.__Rewire__('collate', () => [
          {module: 'name1', version: '1.0.0'},
          {module: 'name2', version: '1.0.1'},
          {module: 'name3', version: '1.0.2'}
        ])
      })
      afterEach(() => {
        // eslint-disable-next-line no-undef
        __rewire_reset_all__()
      })
      it('Expect to handle registry errors', (done) => {
        const finished = () => done()
        walkDeps('debug', null, 'test', finished)
          .then(() => null)
          .catch((err) => done(err))
      })
    })
    describe('babel env testing', () => {
      beforeEach(() => {
        walkDeps.__Rewire__('getDepends', () => Promise.resolve({}))
        walkDeps.__Rewire__('getRegistryDeps', (dependency) => {
          const path = `./src/walkDeps/testData/${dependency.module}.json`
          // TODO handle the caret and tildas
          const regexMajMin = /(\^\d)*(\d+\.[\d]+\.[\d]+)/
          const match = dependency.version.match(regexMajMin)
          if (!match) {
            console.log(`no match for ${dependency.module} @ ${dependency.version}`)
            // return {}
          }
          const version = match ? match[2] : undefined
          return getFile(path, {encoding: 'utf8'})
            .then((data) => {
              const dep = JSON.parse(data)
              if (!dep.versions[version || 0]) {
                console.log(`cannot find ${dependency.module} ${version}`)
                return {}
              }
              const result = dep.versions[version].dependencies || {}
              return result
            })
            .catch(() => console.log(`cannot find file ${path}`))
        })
      })
      afterEach(() => {
        // eslint-disable-next-line no-undef
        __rewire_reset_all__()
      })
      it('Expect to get babel depends', (done) => {
        walkDeps.__Rewire__('collate', () => [
          { module: 'babel-preset-stage-0', version: '^6.24.1' }
        ])
        const finished = (results) => {
          expect(results).to.be.an('Object')
          done()
        }
        walkDeps('debug', null, 'test', finished)
          .then(() => {})
          .catch(err => done(err))
      })

      it('Expect to get npm-ls-remote depends', (done) => {
        walkDeps.__Rewire__('collate', () => [
          { module: 'chai', version: '^3.5.0' },
          { module: 'nock', version: '^8.0.0' },
          { module: 'standard', version: '^6.0.8' },
          { module: 'standard-version', version: '^2.1.2' },
          { module: 'tap', version: '^5.7.1' },
          { module: 'async', version: '^2.0.0-rc.3' },
          { module: 'char-spinner', version: '^1.0.1' },
          { module: 'lodash', version: '^4.10.0' },
          { module: 'npm-package-arg', version: '^4.2.0' },
          { module: 'once', version: '^1.3.3' },
          { module: 'registry-url', version: '^3.0.3' },
          { module: 'request', version: '^2.37.0' },
          { module: 'semver', version: '^5.1.0' },
          { module: 'treeify', version: '^1.0.1' },
          { module: 'yargs', version: '^4.6.0' }
        ])
        const finished = (results) => {
          expect(results).to.be.an('Object')
          done()
        }
        walkDeps('debug', null, 'test', finished)
          .then(() => {})
          .catch(err => done(err))
      })
    })
  })
})
