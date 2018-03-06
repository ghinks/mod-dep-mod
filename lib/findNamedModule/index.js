'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findNamedModule = function findNamedModule(obj, name, tree) {
  if (!obj || !name) return [];
  var regex = new RegExp(name);
  var matchingKeys = (0, _keys2.default)(obj).filter(function (k) {
    return k.match(regex);
  }).map(function (k) {
    return `${tree ? tree + '.' + k : k}`;
  });
  (0, _keys2.default)(obj).filter(function (k) {
    return !k.match(regex) && obj[k] instanceof Object;
  }).forEach(function (k) {
    matchingKeys = [].concat((0, _toConsumableArray3.default)(matchingKeys), (0, _toConsumableArray3.default)(findNamedModule(obj[k], name, `${tree ? tree + '.' + k : k}`)));
  });
  return matchingKeys;
};

exports.default = findNamedModule;