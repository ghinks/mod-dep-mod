import { expect } from 'chai'
import cleanPrvProps from './index.js'

describe('Given an object with __propNames remove prv props', () => {
  it('expect empty object', () => {
    const testObj = {
      __name: 'name1',
      __depends: [],
      __depth: 1
    }
    const result = cleanPrvProps(testObj)
    expect(result).deep.equal({})
  })
  it('expect empty object', () => {
    const testObj = {
      __name: 'name1',
      __depends: [],
      __depth: 1,
      realProp1: 1
    }
    const result = cleanPrvProps(testObj)
    expect(result).deep.equal({ realProp1: 1 })
  })
  it('expect empty object', () => {
    const testObj = {
      __name: 'name1',
      __depends: [],
      __depth: 1,
      realProp1: 1,
      realObj1: {
        realProp2: 2,
        realObj2: {
          realProp3: 3
        }
      }
    }
    const result = cleanPrvProps(testObj)
    expect(result).deep.equal({
      realProp1: 1,
      realObj1: {
        realProp2: 2,
        realObj2: {
          realProp3: 3
        }
      }
    })
  })
})
