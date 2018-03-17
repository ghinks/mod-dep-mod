import {expect} from 'chai'
import matcher, {getMinor, getMajor, getExact, getSingle, getMax } from './index'

describe('package matching', () => {
  const versions = ['0.0.1', '0.1.0', '0.2.0', '0.3.0', '0.3.1', '1.0.0', '1.0.1', '1.0.9', '1.1.0', '1.1.1', '1.1.5', '1.2.0', '1.2.1', '1.2.9', '2.0.1', '2.0.1', '3.1.0', '4.0.0', '7.2.1']
  const increasingVersions = [
    '0.0.1',
    '0.0.3',
    '0.0.4',
    '0.0.5',
    '0.1.0',
    '0.2.0',
    '0.2.1',
    '0.3.0',
    '0.3.1',
    '0.3.2',
    '0.3.3',
    '0.4.0',
    '0.4.1',
    '0.4.2',
    '0.4.3',
    '0.5.0',
    '0.5.1',
    '0.6.0',
    '0.6.1',
    '0.5.2',
    '1.0.0',
    '1.0.1',
    '1.0.2',
    '1.0.3',
    '1.0.4',
    '1.0.5',
    '1.1.0',
    '1.1.1',
    '1.2.0',
    '1.3.0',
    '1.3.1',
    '1.3.2',
    '2.0.0',
    '2.1.0',
    '2.2.0',
    '2.3.0',
    '2.4.0',
    '2.5.0',
    '2.5.1',
    '2.6.0',
    '2.7.0',
    '2.7.1',
    '2.8.0',
    '2.8.1',
    '2.9.0',
    '2.10.0',
    '2.11.0',
    '2.12.0',
    '2.12.1',
    '2.12.2',
    '2.13.0',
    '2.14.0',
    '2.14.1'
  ]
  const reversedVersions = [...versions].reverse()
  describe('minor', () => {
    it('expect minor match 1.0.9', () => {
      const result = getMinor(reversedVersions, '1.0.0')
      expect(result).to.be.equal('1.0.9')
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
