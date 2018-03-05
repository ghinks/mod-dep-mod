import { rcompare } from 'semver'

const getMinor = (versions, testValue) => {
  const regex = /(\d+)\.([\d]+)\.([\dxX]+)/
  const testValueMatch = testValue.replace(/x/ig, '0').match(regex)
  return versions.reduce((acc, cur) => {
    const versionMatch = cur.match(regex)
    if (versionMatch[1] === testValueMatch[1] & versionMatch[2] === testValueMatch[2]) {
      if (!acc) {
        return cur
      }
      const accMatch = acc.match(regex)
      if (versionMatch[3] > accMatch[3]) {
        return cur
      }
    }
    return acc
  }, undefined)
}

const getMajor = (versions, testValue) => {
  const regex = /(\d+)\.([\dxX]+)\.([\dxX]+)/
  const testValueMatch = testValue.replace(/x/ig, '0').match(regex)
  return versions.reduce((acc, cur) => {
    const versionMatch = cur.match(regex)
    if (versionMatch[1] === testValueMatch[1]) {
      if (versionMatch[2] < testValueMatch[2]) {
        return acc
      }
      if (!acc && versionMatch[2] >= testValueMatch[2]) {
        return cur
      }
      const accMatch = acc.match(regex)
      if (versionMatch[2] === testValueMatch[2] && versionMatch[3] > accMatch[3]) {
        return cur
      }
      if (versionMatch[2] >= testValueMatch[2] && versionMatch[2] > accMatch[2]) {
        return cur
      }
      if (versionMatch[2] >= testValueMatch[2] && versionMatch[3] > accMatch[3]) {
        return cur
      }
    }
    return acc
  }, undefined)
}

const getExact = (versions, testValue) => {
  if (versions.includes(testValue)) {
    return testValue
  }
  return undefined
}

const getSingle = (versions, testValue) => {
  const regexSingleDigit = /(\^?)(\d+)/
  const match = testValue.match(regexSingleDigit)
  if (match[2]) return getMajor(versions, `${match[2]}.x.x`)
}

// TODO npm tool came back with highest 1.x.x, investigate
const getHighestMatch = (versions) => versions.sort(rcompare)[0]

const matcher = (versions, testValue) => {
  // TODO check versions and length
  // eslint-disable-next-line
  const regexMajMin = /([\^\~]?)(\d+\.[\dxX]+\.[\dxX]+)/
  const match = testValue.match(regexMajMin)
  if (match && match[1] === '~') {
    return getMinor(versions, match[2])
  } else if (match && match[1] === '^') {
    return getMajor(versions, match[2])
  } else if (match && !testValue.match(/([\^\~]?)(\d+\.[xX]+\.[xX]+)/) && !testValue.match(/\>\=.*/)) {
    return getExact(versions, testValue)
  } else if (testValue.match(/(\^?)(\d+)/)) {
    return getSingle(versions, testValue)
  } else if (testValue === '*') {
    return getHighestMatch(versions)
  } else if (testValue.match(/>=.*/)) {
    return getHighestMatch(versions)
  }
}

export { matcher as default, getMinor, getMajor, getExact, getSingle, getHighestMatch }
