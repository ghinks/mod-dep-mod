import { expect } from 'chai'
import getDepeneds from './index'

describe('Read Package JSON', () => {
  describe('Passing tests', () => {
    beforeEach(() => getDepeneds.__Rewire__('checkPackageFile', () => true))
    afterEach(() => getDepeneds.__ResetDependency__('checkPackageFile'))
    it('Expect to read file', (done) => {
      getDepeneds('package.json')
        .then(result => {
          expect(result).to.be.an('Object')
          done()
        })
        .catch(err => done(err))
    })
    describe('Stub package.json', () => {
      const data = {
        dependencies: {
          debug: '1.0.0',
          otherOne: '1.0.1'
        },
        devDependencies: {
          eslint: '1.0.0'
        }
      }
      beforeEach(() => getDepeneds.__Rewire__('promisify', () => () => Promise.resolve(data)))
      afterEach(() => getDepeneds.__ResetDependency__('promisify'))

      it('Expect to get dependencies', (done) => {
        getDepeneds('package.json')
          .then(result => {
            expect(result).to.have.property('dependencies')
            done()
          })
          .catch(err => done(err))
      })
    })
  })

  describe('Failing tests no package.json', () => {
    beforeEach(() => getDepeneds.__Rewire__('checkPackageFile', () => false))
    afterEach(() => getDepeneds.__ResetDependency__('checkPackageFile'))
    it('Expect not to read the file', (done) => {
      getDepeneds('')
        .then(() => done(new Error('not expected')))
        .catch(() => done())
    })
  })
})
