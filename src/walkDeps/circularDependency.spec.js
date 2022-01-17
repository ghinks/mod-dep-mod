import { expect } from 'chai'
import { isCircularDependency } from './index.js'

describe('Walk dependency tree', () => {
  describe('Circular Depeneds', () => {
    describe('No pre-existing circular dependencies yet detected', () => {
      it('Expect no circular dependencies with no ancestor', () => {
        const dependency = { module: 'mod1', version: '0.0.1' }
        const ancestry = undefined
        const result = isCircularDependency({ ancestry, dependency })
        expect(result).to.be.equal(false)
      })
      it('Expect no circular dependencies with no ancestor name', () => {
        const dependency = { module: 'mod1', version: '0.0.1' }
        const ancestry = ['abc', 'def']
        const result = isCircularDependency({ ancestry, dependency })
        expect(result).to.be.equal(false)
      })
      it('Expect match on ancestor', () => {
        const dependency = { module: 'mod1', version: '0.0.1' }
        const ancestry = ['abc', 'def', 'mod1']
        const result = isCircularDependency({ ancestry, dependency })
        expect(result).not.to.be.equal(false)
      })
    })
  })
})
