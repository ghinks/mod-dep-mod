import semver from 'semver'
const { compare, maxSatisfying, validRange } = semver

const getRange = (versions, testValue) => {
  const descVers = versions.sort(compare)
  return maxSatisfying(descVers, testValue)
}

const matcher = (versions, testValue) => {
  if (validRange(testValue)) {
    return getRange(versions, testValue)
  }
}

export { matcher as default, getRange }
