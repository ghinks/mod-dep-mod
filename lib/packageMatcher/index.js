'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHighestMatch = exports.getSingle = exports.getExact = exports.getMajor = exports.getMinor = exports.default = undefined;

var _semver = require('semver');

var getMinor = function getMinor(versions, testValue) {
  var regex = /(\d+)\.([\d]+)\.([\dxX]+)/;
  var testValueMatch = testValue.replace(/x/ig, '0').match(regex);
  return versions.reduce(function (acc, cur) {
    var versionMatch = cur.match(regex);
    if (versionMatch[1] === testValueMatch[1] & versionMatch[2] === testValueMatch[2]) {
      if (!acc) {
        return cur;
      }
      var accMatch = acc.match(regex);
      if (versionMatch[3] > accMatch[3]) {
        return cur;
      }
    }
    return acc;
  }, undefined);
};

var getMajor = function getMajor(versions, testValue) {
  var regex = /(\d+)\.([\dxX]+)\.([\dxX]+)/;
  var testValueMatch = testValue.replace(/x/ig, '0').match(regex);
  return versions.reduce(function (acc, cur) {
    var versionMatch = cur.match(regex);
    if (versionMatch[1] === testValueMatch[1]) {
      if (versionMatch[2] < testValueMatch[2]) {
        return acc;
      }
      if (!acc && versionMatch[2] >= testValueMatch[2]) {
        return cur;
      }
      var accMatch = acc.match(regex);
      if (versionMatch[2] === testValueMatch[2] && versionMatch[3] > accMatch[3]) {
        return cur;
      }
      if (versionMatch[2] >= testValueMatch[2] && versionMatch[2] > accMatch[2]) {
        return cur;
      }
      if (versionMatch[2] >= testValueMatch[2] && versionMatch[3] > accMatch[3]) {
        return cur;
      }
    }
    return acc;
  }, undefined);
};

var getExact = function getExact(versions, testValue) {
  if (versions.includes(testValue)) {
    return testValue;
  }
  return undefined;
};

var getSingle = function getSingle(versions, testValue) {
  var regexSingleDigit = /(\^?)(\d+)/;
  var match = testValue.match(regexSingleDigit);
  if (match[2]) return getMajor(versions, `${match[2]}.x.x`);
};

// TODO npm tool came back with highest 1.x.x, investigate
var getHighestMatch = function getHighestMatch(versions) {
  return versions.sort(_semver.rcompare)[0];
};

var matcher = function matcher(versions, testValue) {
  // TODO check versions and length
  // eslint-disable-next-line
  var regexMajMin = /([\^\~]?)(\d+\.[\dxX]+\.[\dxX]+)/;
  var match = testValue.match(regexMajMin);
  if (match && (match[1] === '~' || testValue.match(/(\d+\.\d+\.[xX]+)/))) {
    return getMinor(versions, match[2]);
  } else if (match && match[1] === '^') {
    return getMajor(versions, match[2]);
    // eslint-disable-next-line
  } else if (match && !testValue.match(/([\^\~]?)(\d+\.[xX]+\.[xX]+)/) && !testValue.match(/\>\=.*/)) {
    return getExact(versions, testValue);
  } else if (testValue.match(/(\^?)(\d+)/)) {
    return getSingle(versions, testValue);
  } else if (testValue === '*') {
    return getHighestMatch(versions);
  } else if (testValue.match(/>=.*/)) {
    return getHighestMatch(versions);
  }
};

exports.default = matcher;
exports.getMinor = getMinor;
exports.getMajor = getMajor;
exports.getExact = getExact;
exports.getSingle = getSingle;
exports.getHighestMatch = getHighestMatch;