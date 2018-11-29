"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRange = exports.default = void 0;

var _semver = require("semver");

/*const getMinor = (versions, testValue) => {
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
  if (match && match[2]) return getMajor(versions, `${match[2]}.x.x`)
}

// TODO npm tool came back with highest 1.x.x, investigate
const getMax = (versions) => versions.sort(rcompare)[0]

const getHighestMatch = (versions, testValue) => {
  const ascVersions = versions.sort(compare)
  const match = testValue.match(/(\D?)(\d+.*)/)
  for (let i = 0; i < ascVersions.length; i++) {
    if (gte(ascVersions[i], match[2])) {
      return ascVersions[i]
    }
  }
}*/
const getRange = (versions, testValue) => {
  const descVers = versions.sort(_semver.compare);
  return (0, _semver.maxSatisfying)(descVers, testValue);
};

exports.getRange = getRange;

const matcher = (versions, testValue) => {
  if ((0, _semver.validRange)(testValue)) {
    return getRange(versions, testValue);
  }
};

exports.default = matcher;