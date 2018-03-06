"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cleanPrivateProps = function cleanPrivateProps(obj) {
  var regex = /__(.*)/;
  (0, _keys2.default)(obj).forEach(function (k) {
    if (k.match(regex)) delete obj[k];
  });
  (0, _keys2.default)(obj).forEach(function (k) {
    if (obj[k] instanceof Object) cleanPrivateProps(obj[k]);
  });
  return obj;
};

exports.default = cleanPrivateProps;