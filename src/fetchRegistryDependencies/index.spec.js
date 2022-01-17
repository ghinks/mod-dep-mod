import * as td from 'testdouble'
import { expect } from 'chai'
import nock from 'nock'

describe('Registry Dependencies', () => {
  const myRegistry = 'https://registry.npmjs.org'
  const module = 'debug'
  const url = `${myRegistry}/${module}`
  const version = '~1.0.1'
  const errorConsole = console.error
  before(function () {
    console.error = () => null
  })
  after(() => {
    console.error = errorConsole
  })
  describe('Passing', () => {
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

    beforeEach(async () => {
      await td.replaceEsm('../thirdPartyMocks/ora/index.js', { createOra: () => ({ start: () => ({ text: '' }) }) })
    })
    afterEach(() => {
      td.reset()
      nock.cleanAll()
    })
    it('Expect to get dependencies', async () => {
      const { registryDeps } = await import('./index.js')
      nock(`${myRegistry}`).get('/debug').reply(200, response)
      const dependencies = await registryDeps({ module, version })
      expect(dependencies).to.be.an('Object')
      expect(dependencies).to.have.property('name1')
    })

    it('Expect to get dependencies via the cache', async () => {
      const { registryDeps, setCache } = await import('./index.js')
      setCache(url, response)
      const dependencies = await registryDeps({ module, version })
      expect(dependencies).to.be.an('Object')
      expect(dependencies).to.have.property('name1')
    })

    it('Expect to get empty response', async () => {
      nock(`${myRegistry}`).get('/debug').reply(200, {})
      const { registryDeps } = await import('./index.js')
      const dependencies = await registryDeps({ module, version: '3.0.0' })
      expect(dependencies).to.be.an('Object')
      expect(dependencies).to.deep.equal({})
    })
  })
  describe('Failing resp empty Object', () => {
    beforeEach(async () => {
      await td.replaceEsm('../thirdPartyMocks/ora/index.js', {
        createOra: () => ({
          start: () => ({ text: '' })
        })
      })
    })
    afterEach(() => {
      nock.cleanAll()
      td.reset()
    })

    it('Expect no dependencies', async () => {
      nock(`${myRegistry}`).get('/notdebug').reply(200, {})
      const { registryDeps } = await import('./index.js')
      const dependencies = await registryDeps({ module: 'notdebug', version })
      expect(dependencies).to.be.an('Object')
      expect(dependencies).not.to.have.property('name1')
    })
  })
  describe('Failing resp object with no matching versions for depend name', () => {
    let response = {
      versions: {
        '1.0.0': {}
      }
    }
    beforeEach(() => {
      td.replaceEsm('../thirdPartyMocks/ora/index.js', {
        createOra: () => ({
          start: () => null
        })
      })
      nock(`${myRegistry}`).get('/debug').reply(200, response)
    })
    afterEach(() => {
      td.reset()
      nock.cleanAll()
    })
    it('Expect no dependencies gzp depend', async () => {
      response = {
        versions: {
          '1.0.0': {}
        }
      }
      const { registryDeps } = await import('./index.js')
      const dependencies = await registryDeps({ module, version: 'not-going-to-find' })
      expect(dependencies).to.be.an('Object')
      expect(dependencies).not.to.have.property('name1')
    })
  })
  // TODO not sure what this test does
  describe.skip('Failing due to error thrown', () => {
    beforeEach(async () => {
      await td.replaceEsm('./ora/index.js', {
        createOra: () => ({
          start: () => null
        })
      })
    })
    afterEach(() => {
      td.reset()
    })
    it('Expect to get dependencies', async () => {
      const { registryDeps } = await import('./index.js')
      const data = await registryDeps({ module, version })
      expect(data).to.deep.equal({})
    })
  })
})
