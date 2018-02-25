import { expect } from 'chai'
import parseInput from './index'

describe('Parse', () => {
  it('Expect to parse', () => {
    const result = parseInput()
    expect(result).to.be.equal('')
  })
})
