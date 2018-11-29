"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRange = exports.default = void 0;

var _semver = require("semver");

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