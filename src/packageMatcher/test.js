import {expect} from 'chai'
import matcher, {getMinor, getMajor, getExact, getSingle, getMax, getRange } from './index'
import versions from './testData/versions'
import increasingVersions from './testData/increasingVersions'

describe('package matching', () => {
  const reversedVersions = [...versions].reverse()
  describe('minor', () => {
    it('expect minor match 1.0.9', () => {
      const result = getMinor(reversedVersions, '1.0.0')
      expect(result).to.be.equal('1.0.9')
    })
    it('expect minor match 1.0.2', () => {
      const result = getMinor(['1.0.0', '1.0.1', '1.0.2'], '1.0.9')
      expect(result).to.be.equal('1.0.2')
    })
  })
  describe('major', () => {
    it('expect major match 1.2.9', () => {
      const result = getMajor(versions, '1.2.0')
      expect(result).to.be.equal('1.2.9')
    })
    it('expect major match 7.2.1', () => {
      const result = getMajor(versions, '7.2.1')
      expect(result).to.be.equal('7.2.1')
    })
    it('expect major match 2.14.1', () => {
      const result = getMajor(increasingVersions, '2.14.1')
      expect(result).to.be.equal('2.14.1')
    })
  })
  describe('single digit', () => {
    it('expect single digit match 1', () => {
      const result = getSingle(versions, '1')
      expect(result).to.be.equal('1.2.9')
    })
    it('expect single digit match ^1', () => {
      const result = getSingle(versions, '^1')
      expect(result).to.be.equal('1.2.9')
    })
    it('expect single digit match 7', () => {
      const result = getSingle(versions, '7')
      expect(result).to.be.equal('7.2.1')
    })
    it('expect no single digit match', () => {
      const result = getSingle([], 'x')
      expect(result).to.be.undefined // eslint-disable-line
    })
  })
  describe('exact', () => {
    it('expect no match on 100.100.100', () => {
      const result = getExact(versions, '100.100.100')
      expect(result).to.be.an('undefined')
    })
    it('expect exact match 1.0.1', () => {
      const result = getExact(versions, '1.0.1')
      expect(result).to.be.equal('1.0.1')
    })
    it('expect exact match 1.2.1', () => {
      const result = getExact(versions, '1.2.1')
      expect(result).to.be.equal('1.2.1')
    })
    it('expect exact match 7.2.1', () => {
      const result = getExact(versions, '7.2.1')
      expect(result).to.be.equal('7.2.1')
    })
  })
  describe('max (*)', () => {
    it('expect max version *', () => {
      const result = getMax(versions, '*')
      expect(result).to.be.equal('7.2.1')
    })
  })
  describe('range x < y', () => {
    // 6.0.0 <=6.1.1
    // 2.2.7 <3
    // 0.3.0 < 0.4.0
    // 1.0.33-1 <1.1.0-0
    it('expect 0.0.1 < 0.1.0 to match 0.0.1', () => {
      const result = getRange(versions, '0.0.1 < 0.1.0')
      expect(result).to.be.equal('0.0.1')
    })
    it('expect 0.0.1 <0.1.0 to match 0.0.1', () => {
      const result = getRange(versions, '0.0.1 <0.1.0')
      expect(result).to.be.equal('0.0.1')
    })
    it('expect 1.0.0 <=1.0.9', () => {
      const result = getRange(versions, '1.0.0 <=1.0.9')
      expect(result).to.be.equal('1.0.0')
    })
    it('expect 1.0.0 < 3', () => {
      const result = getRange(versions, '1.0.0 < 3')
      expect(result).to.be.equal('1.0.0')
    })
  })
  describe('equality = ', () => {
    it('expect =1.0.0 to match 1.0.0', () => {
      const result = matcher(versions, '=1.0.0')
      expect(result).to.be.equal('1.0.0')
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
      it('Expect to match 1.1.5 on ^1.0.0', () => {
        const result = matcher(versions, '^1.1.1')
        expect(result).to.be.equal('1.2.9')
      })
      it('Expect to match 7.2.1 on ^7.2.1', () => {
        const result = matcher(versions, '^7.2.1')
        expect(result).to.be.equal('7.2.1')
      })
      it('expect single digit match 1', () => {
        const result = matcher(versions, '1')
        expect(result).to.be.equal('1.2.9')
      })
      it('expect single digit match ^1', () => {
        const result = matcher(versions, '^1')
        expect(result).to.be.equal('1.2.9')
      })
      it('expect max major version 1.x', () => {
        const result = matcher(versions, '1.x')
        expect(result).to.be.equal('1.2.9')
      })
      it('expect max major version 1.x.x.', () => {
        const result = matcher(versions, '1.x.x')
        expect(result).to.be.equal('1.2.9')
      })
      it('expect major version match on 0.3', () => {
        const result = matcher(versions, '0.3')
        expect(result).to.be.equal('0.3.1')
      })
      it('expect highest version *', () => {
        const result = matcher(versions, '*')
        expect(result).to.be.equal('7.2.1')
      })
      it('expect highest version *', () => {
        const result = matcher(versions, '>=7.2.1')
        expect(result).to.be.equal('7.2.1')
      })
      it('expect highest version >=2.0.0', () => {
        const result = matcher(versions, '>=2.0.0')
        expect(result).to.be.equal('2.0.1')
      })
      it('expect highest version 1.1.x', () => {
        const result = matcher(versions, '1.1.x')
        expect(result).to.be.equal('1.1.5')
      })
      it('expect to match range 1.0.0', () => {
        const result = matcher(versions, '1.0.0 <=1.0.9')
        expect(result).to.be.equal('1.0.0')
      })
      it('expect to match range 1.0.0 < 3', () => {
        const result = matcher(versions, '1.0.0 < 3')
        expect(result).to.be.equal('1.0.0')
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
      it('Expect to match 1.1.5 on ^1.0.0', () => {
        const result = matcher(reversedVersions, '^1.1.1')
        expect(result).to.be.equal('1.2.9')
      })
      it('Expect to match 7.2.1 on ^7.2.1', () => {
        const result = matcher(reversedVersions, '^7.2.1')
        expect(result).to.be.equal('7.2.1')
      })
    })
  })
})
