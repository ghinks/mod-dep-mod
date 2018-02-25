import { expect } from 'chai'
import checkPackage from './index'

describe('Check package.json exists', () => {
  describe('Passing tests', () => {
    beforeEach(() => {
      checkPackage.__Rewire__('fs', {
        existsSync: () => true
      })
    })
    afterEach(() => checkPackage.__ResetDependency__('fs'))

    it('Expect the package.json to exist', () => {
      expect(checkPackage('package.json')).to.be.equal(true)
    })
  })
  describe('Failing tests', () => {
    beforeEach(() => {
      checkPackage.__Rewire__('fs', {
        existsSync: () => false
      })
    })
    afterEach(() => checkPackage.__ResetDependency__('fs'))
    it('Expect no package.json file', () => {
      expect(checkPackage('package.json')).to.be.equal(false)
    })
  })
})
