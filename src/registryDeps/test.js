import { expect } from 'chai'
import nock from 'nock'
import registryUrl from 'registry-url'
import registryDeps from './index'

describe('Registry Dependencies', () => {
  describe('Passing', () => {
    let getRegistry
    const moduleName = 'debug'
    beforeEach(() => {
      getRegistry = nock(`${registryUrl()}`)
        .get(`/${moduleName}`)
        .reply(200, {})
    })
    afterEach(() => nock.cleanAll())

    it.only('Expect to get dependencies', (done) => {
      registryDeps(moduleName)
        .then((response) => {
          getRegistry.isDone()
          done()
        })
    })
  })
  describe('Failing', () => {
    it('Expect no dependencies', (done) => {
      expect.fail()
      done()
    })
  })
})
