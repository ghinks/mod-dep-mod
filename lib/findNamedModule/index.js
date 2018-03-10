'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const findNamedModule = (obj, name, tree) => {
  if (!obj || !name) return [];
  const regex = new RegExp(name);
  let matchingKeys = (0, _keys2.default)(obj).filter(k => k.match(regex)).map(k => `${tree ? tree + '.' + k : k}`);
  (0, _keys2.default)(obj).filter(k => !k.match(regex) && obj[k] instanceof Object).forEach(k => {
    matchingKeys = [...matchingKeys, ...findNamedModule(obj[k], name, `${tree ? tree + '.' + k : k}`)];
  });
  return matchingKeys;
};

exports.default = findNamedModule;