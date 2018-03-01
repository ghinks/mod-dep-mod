const getMinor = (versions, testValue) => {
  const regex = /(\d+)\.([\d]+)\.([\d]+)/
  const testValueMatch = testValue.match(regex)
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
  const regex = /(\d+)\.([\d]+)\.([\d]+)/
  const testValueMatch = testValue.match(regex)
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

const matcher = (versions, testValue) => {
  // eslint-disable-next-line
  const regexMajMin = /([\^\~])(\d+\.[\d]+\.[\d]+)/
  const match = testValue.match(regexMajMin)
  if (match && match[1] === '~') {
    return getMinor(versions, match[2])
  } else if (match && match[1] === '^') {
    return getMajor(versions, match[2])
  } else {
    return getExact(versions, testValue)
  }
}

export { matcher as default, getMinor, getMajor, getExact }
