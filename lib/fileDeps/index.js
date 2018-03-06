'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _readPackageJson = require('read-package-json');

var _readPackageJson2 = _interopRequireDefault(_readPackageJson);

var _checkFile = require('../checkFile');

var _checkFile2 = _interopRequireDefault(_checkFile);

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var read = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(file) {
    var pj, _ref2, dependencies, devDependencies, name;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if ((0, _checkFile2.default)(file)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', _promise2.default.reject(new Error('file not found')));

          case 2:
            pj = (0, _pify2.default)(_readPackageJson2.default);
            _context.next = 5;
            return pj(file);

          case 5:
            _ref2 = _context.sent;
            dependencies = _ref2.dependencies;
            devDependencies = _ref2.devDependencies;
            name = _ref2.name;
            return _context.abrupt('return', { dependencies, devDependencies, name });

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function read(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = read;