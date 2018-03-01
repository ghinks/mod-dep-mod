import { expect } from 'chai'
import collate from './index'

describe('Collate package.json dependencies', () => {
  const packageJson = {
    dependencies: {
      debug: '1.0.0',
      otherOne: '1.0.1'
    },
    devDependencies: {
      eslint: '~1.0.0'
    }
  }
  it('Expect to get an array of dependencies', () => {
    const collated = collate(packageJson)
    expect(collated).to.be.an('Array')
    expect(collated.length).to.be.equal(3)
    collated.forEach(c => {
      expect(c).to.have.property('module')
      expect(c).to.have.property('version')
    })
  })
})
