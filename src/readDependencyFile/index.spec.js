import * as td from 'testdouble'
import { expect } from 'chai'
import getDepends, { isUrl, getPckFromUrl } from './index.js'
import nock from 'nock'

describe('Read Package JSON', () => {
  describe('Passing tests', () => {
    it('Expect to read file', (done) => {
      getDepends('package.json')
        .then(result => {
          expect(result).to.be.an('Object')
          done()
        })
        .catch(err => done(err))
    })
    describe('Local package.json', () => {
      const data = {
        dependencies: {
          debug: '1.0.0',
          otherOne: '1.0.1'
        },
        devDependencies: {
          eslint: '1.0.0'
        }
      }
      beforeEach(async () => {
        const pify = () => () => Promise.resolve(data)
        await td.replaceEsm('../thirdPartyEsmWrapping/promisify/index.js', { pify })
      })
      afterEach(() => td.reset())

      it('Expect to get dependencies with read stubbed', async () => {
        const read = (await import('./index.js')).default
        const result = await read('package.json')
        expect(result).to.have.property('dependencies')
        expect(result.dependencies).not.to.have.property('async')
      })
    })

    describe('Url as file stubbed via nock', () => {
      let scope
      const response = {
        dependencies: {},
        devDependencies: {},
        name: 'xyz'
      }
      beforeEach(() => {
        scope = nock('https://raw.githubusercontent.com')
          .get(/.*/)
          .reply(200, response)
      })
      afterEach(() => nock.cleanAll())
      it('Expect to get a stubbed url response', async () => {
        const url = 'https://raw.githubusercontent.com/ghinks/ls-remote-versions/master/package.json'
        const result = await getDepends(url)
        expect(result).to.have.property('dependencies')
        expect(scope.isDone()).to.be.equal(true)
      })
    })
  })

  describe('Failing tests no package.json', () => {
    it('Expect not to read the file', (done) => {
      getDepends('')
        .then(() => done(new Error('not expected')))
        .catch(() => done())
    })
  })

  describe('Detection of a url based package.json', () => {
    describe('Detect url', () => {
      it('Expect to detect a url', () => {
        const url = 'http://name.domain.com/path/package.json'
        const result = isUrl(url)
        expect(result).to.be.a('URL')
      })
    })
    describe('Do not detect url', () => {
      it('Expect not to detect a url', () => {
        const url = 'name.domain.com/path/package.json'
        expect(isUrl(url)).to.be.undefined// eslint-disable-line no-unused-expressions
      })
    })
  })
  describe('Read package.json from a url based file', () => {
    let scope
    const response = {
      dependencies: {},
      devDependencies: {},
      name: 'xyz'
    }
    beforeEach(() => {
      scope = nock('https://raw.githubusercontent.com')
        .get(/.*/)
        .reply(200, response)
    })
    afterEach(() => nock.cleanAll())
    it('Expect to get a dependencies, devDepends and the name', async () => {
      const url = 'https://raw.githubusercontent.com/ghinks/ls-remote-versions/master/package.json'
      const result = await getPckFromUrl(url)
      expect(result).to.be.an('object')
      expect(result.name).to.be.equal('xyz')
      expect(scope.isDone()).to.be.equal(true)
    })
  })
})
