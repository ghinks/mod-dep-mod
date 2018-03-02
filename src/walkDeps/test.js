import { expect } from 'chai'
import { isCircularDependency } from './index'

describe('Walk dependency tree', () => {
  it('Expect no ciruclar dependencies', () => {
    const parent = undefined
    const dependency = {}
    const result = isCircularDependency({ parent, dependency })
    expect(result).to.be.equal(false)
  })
  it('Expect no ciruclar dependencies', () => {
    const parent = { depends: undefined }
    const dependency = {}
    const result = isCircularDependency({ parent, dependency })
    expect(result).to.be.equal(false)
  })
  it('Expect to find ciruclar dependencies', () => {
    const parent = { depends: [{ module: 'debug', version: '1.0.0' }] }
    const dependency = { module: 'debug', version: '1.0.0' }
    const result = isCircularDependency({ parent, dependency })
    expect(result).to.be.equal(true)
  })
})
