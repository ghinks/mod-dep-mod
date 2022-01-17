import { expect } from 'chai'
import fs from 'fs'
import promisify from 'pify'
import * as td from 'testdouble'

describe('Walk dependency tree', () => {
  const getFile = promisify(fs.readFile)
  describe('Walking', () => {
    describe('basic test', () => {
      beforeEach(async function () {
        await td.replaceEsm('../fetchRegistryDependencies/index.js', {
          registryDeps: (dependency) => {
            let result
            if (dependency.module === 'name1') result = {}
            if (dependency.module === 'name2') result = {}
            if (dependency.module === 'name3') result = {}
            return Promise.resolve(result)
          }
        })
        await td.replaceEsm('../readDependencyFile/index.js', undefined, () => Promise.resolve({}))
        await td.replaceEsm('../collate/index.js', undefined,
          () => [
            { module: 'name1', version: '1.0.0' },
            { module: 'name2', version: '1.0.1' },
            { module: 'name3', version: '1.0.2' }
          ]
        )
      })
      afterEach(() => td.reset())
      it('Expect to get depends', async () => {
        const finished = (results) => {
          expect(results).to.be.an('Object')
        }
        const walkDeps = (await import('./index.js')).default
        await walkDeps(['debug', 'other'], null, 'test', finished)
      })
      it('Expect to get depends and show output', async () => {
        const finished = (results) => {
          expect(results).to.be.an('Object')
        }
        const walkDeps = (await import('./index.js')).default
        await walkDeps(['name3', 'name2'], null, 'production', finished)
      })
      it('Expect to get no depends', async () => {
        const finished = (results) => {
          expect(results).to.be.an('Object')
        }
        const walkDeps = (await import('./index.js')).default
        await walkDeps(['xxxx', 'xxxx'], null, 'production', finished)
      })
    })
    describe('failing tests', () => {
      beforeEach(() => {
        td.replaceEsm('../fetchRegistryDependencies/index.js', { registryDeps: () => Promise.reject(new Error('testError')) })
        td.replaceEsm('../readDependencyFile/index.js', undefined, () => Promise.resolve({}))
        td.replaceEsm('../collate/index.js', undefined,
          () => [
            { module: 'name1', version: '1.0.0' },
            { module: 'name2', version: '1.0.1' },
            { module: 'name3', version: '1.0.2' }
          ]
        )
      })

      it('Expect to handle registry errors', async () => {
        const finished = () => null
        const walkDeps = (await import('./index.js')).default
        await walkDeps(['debug'], null, 'test', finished)
      })
    })
    describe('babel env testing', () => {
      beforeEach(() => {
        td.replaceEsm('../readDependencyFile/index.js', undefined, () => Promise.resolve({}))
        td.replaceEsm('../fetchRegistryDependencies/index.js', {
          registryDeps: (dependency) => {
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
          }
        })
      })
      it('Expect to get babel depends', async () => {
        await td.replaceEsm('../collate/index.js', undefined, () => [
          { module: 'babel-preset-stage-0', version: '^6.24.1' }
        ])
        const finished = (results) => {
          expect(results).to.be.an('Object')
        }
        const walkDeps = (await import('./index.js')).default
        await walkDeps(['debug'], null, 'test', finished)
      })

      it('Expect to get npm-ls-remote depends', async () => {
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
        const finished = (results) => {
          expect(results).to.be.an('Object')
        }
        const walkDeps = (await import('./index.js')).default
        await walkDeps(['debug'], null, 'test', finished)
      })

      it('Expect to get cookie depends', async () => {
        await td.replaceEsm('../collate/index.js', undefined, () => [
          { module: 'cookie', version: '0.1.2' }
        ])
        const finished = (results) => {
          expect(results).to.be.an('Object')
        }
        const walkDeps = (await import('./index.js')).default
        walkDeps(['cookie'], null, 'test', finished)
      })
    })
  })
})
