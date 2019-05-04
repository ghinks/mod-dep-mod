import { expect } from 'chai'
import matcher from './index'
import versions from './testData/versions'

describe('package matching', () => {
  const reversedVersions = [...versions].reverse()
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
        expect(result).to.be.equal('7.2.1')
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
      it('expect a match from ^0.3.0', () => {
        const result = matcher(versions, '^0.3.0')
        expect(result).to.be.equal('0.3.1')
      })
      it('expect a match from ~0.3.0', () => {
        const result = matcher(versions, '~0.3.0')
        expect(result).to.be.equal('0.3.1')
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
