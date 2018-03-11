'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let spinner;
if (process.env.NODE_ENV !== 'test') spinner = (0, _ora2.default)('...fetching').start();
const cache = {};
let fetchCount = 0;

const registryDeps = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (dependency) {
    const registry = (0, _registryUrl2.default)();
    const escapedName = (0, _npmPackageArg2.default)(`${dependency.module}`).escapedName;
    const url = `${registry}${escapedName}`;
    let response;
    // TODO handle the case when the call is pending and not yet cached
    if (!cache[url]) {
      try {
        fetchCount += 1;
        if (spinner) spinner.text = `fetch count ${fetchCount} now fetching ${url}`;
        const options = { method: 'get', timeout: 20000 };
        const data = yield (0, _isomorphicFetch2.default)(url, options);
        response = yield data.json();
        cache[url] = response;
      } catch (err) {
        console.error(`Module ${dependency.module} was not found ${err.message}`);
        return {};
      }
    } else {
      response = cache[url];
    }
    if (response.versions) {
      const match = (0, _packageMatcher2.default)((0, _keys2.default)(response.versions), dependency.version);
      if (!response.versions[match] && !dependency.version.match(/.*(gz|git)/)) {
        console.error(` no match for ${dependency.module} ${dependency.version}`);
        return {};
      }
      // handle no dependencies
      return response.versions[match].dependencies || {};
    }

    return {};
  });

  return function registryDeps(_x) {
    return _ref.apply(this, arguments);
  };
})();

exports.default = registryDeps;