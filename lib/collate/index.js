"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createDepsList = deps => (0, _keys2.default)(deps).map(k => ({ module: k, version: deps[k] }));

const collateDepends = packageJson => {
  const collated = [...createDepsList(packageJson.dependencies), ...createDepsList(packageJson.devDependencies)];
  return collated;
};

exports.default = collateDepends;