import * as td from 'testdouble'
import { expect } from 'chai'
import nock from 'nock'

describe('Registry Dependencies', () => {
  const myRegistry = 'https://registry.npmjs.org'
  const module = 'debug'
  const url = `${myRegistry}/${module}`
  const version = '~1.0.1'
  const errorConsole = console.error
  beforeEach(async () => {
    console.error = () => null
    td.replace('ora', function () {
      return {
        start: () => ({
          text: ''
        })
      }
    })
  })
  afterEach(() => {
    console.error = errorConsole
    td.reset()
  })
  describe('Passing', () => {
    let registryDeps
    const dependencies = {
      name1: '0.0.1',
      name2: '0.0.2'
    }
    const response = {
      versions: {
        '1.0.0': { dependencies },
        '1.0.1': { dependencies },
        '2.0.0': { dependencies },
        '3.0.0': {}
      }
    }

    const cache = {}

    beforeEach(async () => {
      const subject = await import('./index.js')
      registryDeps = subject.default
      nock(`${myRegistry}`).get('/debug').reply(200, response)
    })
    afterEach(() => {
      nock.cleanAll()
    })

    it('Expect to get dependencies', (done) => {
      registryDeps({ module, version })
        .then((dependencies) => {
          expect(dependencies).to.be.an('Object')
          expect(dependencies).to.have.property('name1')
          done()
        })
        .catch(err => done(err))
    })

    it('Expect to get dependencies via the cache', (done) => {
      cache[url] = response
      registryDeps({ module, version })
        .then((dependencies) => {
          expect(dependencies).to.be.an('Object')
          expect(dependencies).to.have.property('name1')
          done()
        })
        .catch(err => done(err))
    })

    it('Expect to get empty response', (done) => {
      registryDeps({ module, version: '3.0.0' })
        .then((dependencies) => {
          expect(dependencies).to.be.an('Object')
          expect(dependencies).to.deep.equal({})
          done()
        })
        .catch(err => done(err))
    })
  })
  describe('Failing resp empty Object', () => {
    let registryDeps
    const response = {}
    beforeEach(async () => {
      td.replace('registry-url', td.func())
      // registryDeps.__Rewire__('registryUrl', () => `${myRegistry}/`)
      await td.replaceEsm('./cache.js')
      // registryDepsRewireAPI.__Rewire__('cache', {})
      const subject = await import('./index.js')
      registryDeps = subject.default
      nock(`${myRegistry}`).get('/debug').reply(200, response)
    })
    afterEach(() => {
      nock.cleanAll()
      td.reset()
    })
    it('Expect no dependencies', (done) => {
      registryDeps({ module, version })
        .then((dependencies) => {
          expect(dependencies).to.be.an('Object')
          expect(dependencies).not.to.have.property('name1')
          done()
        })
        .catch(err => done(err))
    })
  })
  describe('Failing resp object with no matching versions for depend name', () => {
    let registryDeps
    let response = {
      versions: {
        '1.0.0': {}
      }
    }
    beforeEach(async () => {
      await td.replaceEsm('./cache.js')
      td.replace('registry-url', td.func())
      const subject = await import('./index.js')
      registryDeps = subject.default
      nock(`${myRegistry}`).get('/debug').reply(200, response)
    })
    afterEach(() => {
      td.reset()
      nock.cleanAll()
    })
    it('Expect no dependencies gzp depend', (done) => {
      response = {
        versions: {
          '1.0.0': {}
        }
      }
      registryDeps({ module, version: 'not-going-to-find' })
        .then((dependencies) => {
          expect(dependencies).to.be.an('Object')
          expect(dependencies).not.to.have.property('name1')
          done()
        })
        .catch(err => done(err))
    })
  })
  describe('Failing due to error thrown', () => {
    let registryDeps
    beforeEach(async () => {
      td.replace('registry-url', td.func())
      await td.replaceEsm('./cache.js')
      td.replace('isomorphic-fetch', () => {
        return async () => Promise.reject(new Error('mock error'))
      })
      td.replace('ora', function () {
        return {
          start: () => ({
            text: ''
          })
        }
      })
      const subject = await import('./index.js')
      registryDeps = subject.default
    })
    afterEach(() => {
      td.reset()
    })
    it('Expect to get dependencies', (done) => {
      registryDeps({ module, version })
        .then((data) => {
          expect(data).to.deep.equal({})
          done()
        })
        .catch((err) => done(err))
    })
  })
})
