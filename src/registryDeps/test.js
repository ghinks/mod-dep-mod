import { expect } from 'chai'
import registryDeps from './index'
import nock from 'nock'

describe('Registry Dependencies', () => {
  const myRegistry = 'http://registry.npmjs.org'
  const module = 'debug'
  const version = '1.0.1'
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
    beforeEach(() => {
      registryDeps.__Rewire__('registryUrl', () => `${myRegistry}/`)
      nock(`${myRegistry}`).get('/debug').reply(200, response)
    })
    afterEach(() => {
      registryDeps.__ResetDependency__('registryUrl')
      registryDeps.__ResetDependency__('request')
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
  })
  describe('Failing', () => {
    beforeEach(() => {
      registryDeps.__Rewire__('registryUrl', () => `${myRegistry}/`)
      nock(`${myRegistry}`).get('/debug').reply(200, {})
    })
    afterEach(() => {
      registryDeps.__ResetDependency__('registryUrl')
      registryDeps.__ResetDependency__('request')
      nock.cleanAll()
    })
    it.only('Expect no dependencies', (done) => {
      registryDeps({module, version})
        .then((dependencies) => {
          expect(dependencies).to.be.an('Object')
          expect(dependencies).not.to.have.property('name1')
          done()
        })
        .catch(err => done(err))
    })
  })
})
