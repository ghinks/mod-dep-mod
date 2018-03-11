'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _readPackageJson = require('read-package-json');

var _readPackageJson2 = _interopRequireDefault(_readPackageJson);

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const read = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (file) {
    if (!_fs2.default.existsSync(file)) {
      return _promise2.default.reject(new Error('file not found'));
    }
    const pj = (0, _pify2.default)(_readPackageJson2.default);

    var _ref2 = yield pj(file);

    const dependencies = _ref2.dependencies,
          devDependencies = _ref2.devDependencies,
          name = _ref2.name;

    return { dependencies, devDependencies, name };
  });

  return function read(_x) {
    return _ref.apply(this, arguments);
  };
})();

exports.default = read;