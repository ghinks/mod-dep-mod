import { expect } from 'chai'
import walkDeps, { isCircularDependency } from './index'
import fs from 'fs'
import promisify from 'pify'

describe('Walk dependency tree', () => {
  const getFile = promisify(fs.readFile)
  // when you depend on your ancestor
  describe('Circular Depeneds', () => {
    it('Expect no circular dependencies with no ancestor', () => {
      const dependency = { module: 'mod1', version: '0.0.1' }
      const ancestry = undefined
      const result = isCircularDependency({ ancestry, dependency })
      expect(result).to.be.equal(false)
    })
    it('Expect no circular dependencies with no ancestor name', () => {
      const dependency = { module: 'mod1', version: '0.0.1' }
      const ancestry = ['abc', 'def']
      const result = isCircularDependency({ ancestry, dependency })
      expect(result).to.be.equal(false)
    })
    it('Expect match on ancestor', () => {
      const dependency = { module: 'mod1', version: '0.0.1' }
      const ancestry = ['abc', 'def', 'mod1']
      const result = isCircularDependency({ ancestry, dependency })
      expect(result).not.to.be.equal(false)
    })
    describe('Set circulars', () => {
      let revertRewire
      beforeEach(() => {
        revertRewire = walkDeps.__Rewire__('circulars', ['mod1'])
      })
      afterEach(() => revertRewire)
      it('Expect circulars on previous match', () => {
        const dependency = { module: 'mod1', version: '0.0.1' }
        const ancestry = []
        const result = isCircularDependency({ ancestry, dependency })
        expect(result).not.to.be.equal(false)
      })
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
        walkDeps(['debug', 'other'], null, 'test', finished)
          .then(() => {})
          .catch(err => done(err))
      })
      it('Expect to get depends and show output', (done) => {
        const finished = (results) => {
          expect(results).to.be.an('Object')
          done()
        }
        walkDeps(['name3', 'name2'], null, 'production', finished)
          .then(() => {})
          .catch(err => done(err))
      })
      it('Expect to get no depends', (done) => {
        const finished = (results) => {
          expect(results).to.be.an('Object')
          done()
        }
        walkDeps(['xxxx', 'xxxx'], null, 'production', finished)
          .then(() => {})
          .catch(err => done(err))
      })
    })
    describe('failing tests', () => {
      beforeEach(() => {
        walkDeps.__Rewire__('getRegistryDeps', () => Promise.reject(new Error('testError')))
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
      it('Expect to handle registry errors', (done) => {
        const finished = () => done()
        walkDeps(['debug'], null, 'test', finished)
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
          const version = match ? match[2] : undefined
          return getFile(path, { encoding: 'utf8' })
            .then((data) => {
              const dep = JSON.parse(data)
              if (!dep.versions[version || 0]) {
                return {}
              }
              const result = dep.versions[version].dependencies || {}
              return result
            })
            .catch(() => null)
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
        walkDeps(['debug'], null, 'test', finished)
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
        walkDeps(['debug'], null, 'test', finished)
          .then(() => {})
          .catch(err => done(err))
      })

      it('Expect to get cookie depends', (done) => {
        walkDeps.__Rewire__('collate', () => [
          { module: 'cookie', version: '0.1.2' }
        ])
        const finished = (results) => {
          expect(results).to.be.an('Object')
          done()
        }
        walkDeps(['cookie'], null, 'test', finished)
          .then(() => {})
          .catch(err => done(err))
      })
    })
  })
})
