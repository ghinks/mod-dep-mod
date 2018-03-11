import {expect} from 'chai'
import registryDeps, {__RewireAPI__ as registryDepsRewireAPI} from './index'
import nock from 'nock'

describe('Registry Dependencies', () => {
  const myRegistry = 'http://registry.npmjs.org'
  const module = 'debug'
  const version = '~1.0.1'
  describe('Passing', () => {
    const dependencies = {
      name1: '0.0.1',
      name2: '0.0.2'
    }
    const response = {
      versions: {
        '1.0.0': {dependencies},
        '1.0.1': {dependencies},
        '2.0.0': {dependencies}
      }
    }

    let cache = {}

    beforeEach(() => {
      registryDeps.__Rewire__('registryUrl', () => `${myRegistry}/`)
      registryDepsRewireAPI.__Rewire__('cache', cache)
      registryDepsRewireAPI.__Rewire__('spinner', {text: ''})
      nock(`${myRegistry}`).get('/debug').reply(200, response)
    })
    afterEach(() => {
      registryDeps.__ResetDependency__('registryUrl')
      registryDeps.__ResetDependency__('request')
      registryDeps.__ResetDependency__('ora')
      nock.cleanAll()
    })

    it('Expect to get dependencies', (done) => {
      registryDeps({module, version})
        .then((dependencies) => {
          expect(dependencies).to.be.an('Object')
          expect(dependencies).to.have.property('name1')
          done()
        })
        .catch(err => done(err))
    })

    it('Expect to get dependencies', (done) => {
      cache[module] = response
      registryDeps({module, version})
        .then((dependencies) => {
          expect(dependencies).to.be.an('Object')
          expect(dependencies).to.have.property('name1')
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('Failing resp empty Object', () => {
    let response = {}
    beforeEach(() => {
      registryDeps.__Rewire__('registryUrl', () => `${myRegistry}/`)
      registryDepsRewireAPI.__Rewire__('cache', {})
      nock(`${myRegistry}`).get('/debug').reply(200, response)
    })
    afterEach(() => {
      registryDeps.__ResetDependency__('registryUrl')
      registryDeps.__ResetDependency__('request')
      nock.cleanAll()
    })
    it('Expect no dependencies', (done) => {
      registryDeps({module, version})
        .then((dependencies) => {
          expect(dependencies).to.be.an('Object')
          expect(dependencies).not.to.have.property('name1')
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('Failing resp object with no matching versions for depend name', () => {
    let response = {
      versions: {
        '1.0.0': {}
      }
    }
    beforeEach(() => {
      registryDeps.__Rewire__('registryUrl', () => `${myRegistry}/`)
      registryDepsRewireAPI.__Rewire__('cache', {})
      nock(`${myRegistry}`).get('/debug').reply(200, response)
    })
    afterEach(() => {
      registryDeps.__ResetDependency__('registryUrl')
      registryDeps.__ResetDependency__('request')
      nock.cleanAll()
    })
    it('Expect no dependencies gzp depend', (done) => {
      response = {
        versions: {
          '1.0.0': {}
        }
      }
      registryDeps({module, version: 'not-going-to-find'})
        .then((dependencies) => {
          expect(dependencies).to.be.an('Object')
          expect(dependencies).not.to.have.property('name1')
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('Failing due to error thrown', () => {
    beforeEach(() => {
      registryDeps.__Rewire__('registryUrl', () => `${myRegistry}/`)
      registryDeps.__Rewire__('fetch', () => Promise.reject(new Error('Connection Error')))
      registryDepsRewireAPI.__Rewire__('cache', {})
    })
    afterEach(() => {
      registryDeps.__ResetDependency__('registryUrl')
      registryDeps.__ResetDependency__('fetch')
    })
    it('Expect to get dependencies', (done) => {
      registryDeps({module, version})
        .then((data) => {
          expect(data).to.deep.equal({})
          done()
        })
        .catch((err) => done(err.message))
    })
  })
})
