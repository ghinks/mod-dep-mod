import * as td from 'testdouble'
import { expect } from 'chai'
import fs from 'fs'
import promisify from 'pify'

describe('Walk dependency tree', () => {
  const getFile = promisify(fs.readFile)
  // when you depend on your ancestor
  describe('Walking', () => {
    describe('basic test', () => {
      let walkDeps
      beforeEach(async () => {
        await td.replaceEsm('../fetchRegistryDependencies', undefined, (dependency) => {
          let result
          if (dependency.module === 'name1') result = {}
          if (dependency.module === 'name2') result = {}
          if (dependency.module === 'name3') result = {}
          return Promise.resolve(result)
        })

        await td.replaceEsm('../readDependencyFile/index.js', undefined, function () {
          console.log('mocked read dep file')
          // return {}
          return Promise.resolve({})
        })

        await td.replaceEsm('../collate/index.js', undefined, () => [
          { module: 'name1', version: '1.0.0' },
          { module: 'name2', version: '1.0.1' },
          { module: 'name3', version: '1.0.2' }
        ])
        td.replace('ora', function () {
          return {
            start: () => ({
              text: ''
            })
          }
        })
        const subject = await import('./index.js')
        walkDeps = subject.default
      })
      afterEach(() => {
        td.reset()
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
      let walkDeps
      beforeEach(async () => {
        await td.replaceEsm('../fetchRegistryDependencies/index.js', undefined, () => Promise.reject(new Error('testError')))
        await td.replaceEsm('../readDependencyFile/index.js', undefined, () => Promise.resolve({}))
        await td.replaceEsm('../collate/index.js', undefined, () => [
          { module: 'name1', version: '1.0.0' },
          { module: 'name2', version: '1.0.1' },
          { module: 'name3', version: '1.0.2' }
        ])
        const subject = await import('./index.js')
        walkDeps = subject.default
      })
      afterEach(() => {
        td.reset()
      })
      it('Expect to handle registry errors', (done) => {
        const finished = () => done()
        walkDeps(['debug'], null, 'test', finished)
          .then(() => null)
          .catch((err) => done(err))
      })
    })
    describe('babel env testing', () => {
      let walkDeps
      beforeEach(async () => {
        await td.replaceEsm('../readDependencyFile/index.js', undefined, () => Promise.resolve({}))
        // walkDeps.__Rewire__('getDepends', () => Promise.resolve({}))
        await td.replaceEsm('../fetchRegistryDependencies/index.js', undefined, (dependency) => {
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
        td.reset()
      })
      describe('babel collation', () => {
        beforeEach(async () => {
          await td.replaceEsm('../collate/index.js', undefined, () => [
            { module: 'babel-preset-stage-0', version: '^6.24.1' }
          ])
          const subject = await import('./index.js')
          walkDeps = subject.default
        })
        it('Expect to get babel depends', (done) => {
          const finished = (results) => {
            expect(results).to.be.an('Object')
            done()
          }
          walkDeps(['debug'], null, 'test', finished)
            .then(() => {})
            .catch(err => done(err))
        })
      })

      describe('collate remote depends', function () {
        beforeEach(async () => {
          await td.replaceEsm('../collate/index.js', undefined, () => [
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
          const subject = await import('./index.js')
          walkDeps = subject.default
        })
        it('Expect to get npm-ls-remote depends', (done) => {
          const finished = (results) => {
            expect(results).to.be.an('Object')
            done()
          }
          walkDeps(['debug'], null, 'test', finished)
            .then(() => {})
            .catch(err => done(err))
        })
      })

      describe('cookie depends', () => {
        beforeEach(async () => {
          await td.replaceEsm('../collate/index.js', undefined, () =>
            [
              { module: 'cookie', version: '0.1.2' }
            ]
          )
          const subject = await import('./index.js')
          walkDeps = subject.default
        })
        it('Expect to get cookie depends', (done) => {
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
})
