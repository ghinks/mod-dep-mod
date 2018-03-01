import { expect } from 'chai'
import matcher, { getMinor, getMajor, getExact } from './index'

describe('package matching', () => {
  const versions = ['1.0.0', '1.0.1', '1.0.9', '1.1.0', '1.1.1', '1.1.5', '1.2.0', '1.2.1', '1.2.9', '2.0.1', '2.0.1', '3.1.0', '4.0.0', '7.0.0']
  const reversedVersions = [...versions].reverse()
  describe('minor', () => {
    it('expect minor match 1.0.9', () => {
      const result = getMinor(reversedVersions, '1.0.0')
      expect(result).to.be.equal('1.0.9')
    })
  })
  describe('major', () => {
    it('expect major match 1.2.9', () => {
      const result = getMajor(versions, '1.2.x')
      expect(result).to.be.equal('1.2.9')
    })
  })
  describe('exact', () => {
    it('expect exact match 1.0.1', () => {
      const result = getExact(versions, '1.0.1')
      expect(result).to.be.equal('1.0.1')
    })
    it('expect exact match 1.2.1', () => {
      const result = getExact(versions, '1.2.1')
      expect(result).to.be.equal('1.2.1')
    })
  })
  describe('matcher tests', () => {
    describe('Use incrementing versions', () => {
      it('Expect to match 1.1.5 exactly', () => {
        const result = matcher(versions, '1.1.5')
        expect(result).to.be.equal('1.1.5')
      })
      it('Expect to match 1.1.5 on ~1.1.0', () => {
        const result = matcher(versions, '~1.1.0')
        expect(result).to.be.equal('1.1.5')
      })
      it('Expect to match 1.1.5 on ^1.0.x', () => {
        const result = matcher(versions, '^1.1.1')
        expect(result).to.be.equal('1.2.9')
      })
    })
    describe('Use decrementing versions', () => {
      it('Expect to match 1.1.5 exactly', () => {
        const result = matcher(reversedVersions, '1.1.5')
        expect(result).to.be.equal('1.1.5')
      })
      it('Expect to match 1.1.5 on ~1.1.0', () => {
        const result = matcher(reversedVersions, '~1.1.0')
        expect(result).to.be.equal('1.1.5')
      })
      it('Expect to match 1.1.5 on ^1.0.x', () => {
        const result = matcher(reversedVersions, '^1.1.1')
        expect(result).to.be.equal('1.2.9')
      })
    })
  })
})
