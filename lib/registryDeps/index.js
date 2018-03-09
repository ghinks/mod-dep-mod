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
    var registry, escapedName, url, response, data, match, _match;

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
              _context.next = 21;
              break;
            }

            _context.prev = 5;
            _context.next = 8;
            return (0, _isomorphicFetch2.default)(url);

          case 8:
            data = _context.sent;
            _context.next = 11;
            return data.json();

          case 11:
            response = _context.sent;

            cache[url] = response;
            _context.next = 19;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](5);

            console.error(`Module ${dependency.module} was not found`);
            return _context.abrupt('return', {});

          case 19:
            _context.next = 22;
            break;

          case 21:
            response = cache[url];

          case 22:
            _context.prev = 22;

            if (!response.versions) {
              _context.next = 29;
              break;
            }

            match = (0, _packageMatcher2.default)((0, _keys2.default)(response.versions), dependency.version);

            if (response.versions[match]) {
              _context.next = 28;
              break;
            }

            console.error(`no match for ${dependency.module} ${dependency.version}`);
            return _context.abrupt('return', {});

          case 28:
            return _context.abrupt('return', response.versions[match].dependencies || {});

          case 29:
            if (!response.versions) {
              _context.next = 35;
              break;
            }

            _match = (0, _packageMatcher2.default)((0, _keys2.default)(response.versions), dependency.version);

            if (response.versions[_match]) {
              _context.next = 34;
              break;
            }

            console.error(`no match for ${dependency.module} ${dependency.version}`);
            return _context.abrupt('return', {});

          case 34:
            return _context.abrupt('return', response.versions[_match].dependencies || {});

          case 35:
            _context.next = 40;
            break;

          case 37:
            _context.prev = 37;
            _context.t1 = _context['catch'](22);

            console.log(`error getting semver match ${_context.t1.message}`);

          case 40:
            return _context.abrupt('return', {});

          case 41:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[5, 15], [22, 37]]);
  }));

  return function registryDeps(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = registryDeps;