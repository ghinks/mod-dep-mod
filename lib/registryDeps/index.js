'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _registryUrl = require('registry-url');

var _registryUrl2 = _interopRequireDefault(_registryUrl);

var _npmPackageArg = require('npm-package-arg');

var _npmPackageArg2 = _interopRequireDefault(_npmPackageArg);

var _packageMatcher = require('../packageMatcher');

var _packageMatcher2 = _interopRequireDefault(_packageMatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = {};

var registryDeps = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(dependency) {
    var registry, escapedName, url, response, data, match;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            registry = (0, _registryUrl2.default)();
            escapedName = (0, _npmPackageArg2.default)(`${dependency.module}`).escapedName;
            url = `${registry}${escapedName}`;
            response = void 0;
            // TODO handle the case when the call is pending and not yet cached

            if (cache[url]) {
              _context.next = 14;
              break;
            }

            _context.next = 7;
            return (0, _isomorphicFetch2.default)(url);

          case 7:
            data = _context.sent;
            _context.next = 10;
            return data.json();

          case 10:
            response = _context.sent;

            cache[url] = response;
            _context.next = 15;
            break;

          case 14:
            response = cache[url];

          case 15:
            if (!response.versions) {
              _context.next = 21;
              break;
            }

            match = (0, _packageMatcher2.default)((0, _keys2.default)(response.versions), dependency.version);

            if (response.versions[match]) {
              _context.next = 20;
              break;
            }

            console.error(`no match for ${dependency.module} ${dependency.version} in ${(0, _keys2.default)(response.versions)}`);
            return _context.abrupt('return', {});

          case 20:
            return _context.abrupt('return', response.versions[match].dependencies || {});

          case 21:
            return _context.abrupt('return', {});

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function registryDeps(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = registryDeps;