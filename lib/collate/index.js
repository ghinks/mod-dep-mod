"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createDepsList = function createDepsList(deps) {
  return (0, _keys2.default)(deps).map(function (k) {
    return { module: k, version: deps[k] };
  });
};

var collateDepends = function collateDepends(packageJson) {
  var collated = [].concat((0, _toConsumableArray3.default)(createDepsList(packageJson.dependencies)), (0, _toConsumableArray3.default)(createDepsList(packageJson.devDependencies)));
  return collated;
};

exports.default = collateDepends;