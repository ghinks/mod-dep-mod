"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _isomorphicFetch = _interopRequireDefault(require("isomorphic-fetch"));

var _registryUrl = _interopRequireDefault(require("registry-url"));

var _npmPackageArg = _interopRequireDefault(require("npm-package-arg"));

var _packageMatcher = _interopRequireDefault(require("../packageMatcher"));

var _ora = _interopRequireDefault(require("ora"));

let spinner;
const cache = {};
let fetchCount = 0;

const registryDeps =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (dependency) {
    if (!spinner) spinner = (0, _ora.default)('...fetching').start();
    const registry = (0, _registryUrl.default)();
    const escapedName = (0, _npmPackageArg.default)(`${dependency.module}`).escapedName;
    const url = `${registry}${escapedName}`;
    let response;

    if (!cache[url]) {
      try {
        fetchCount += 1;
        spinner.text = `fetch count ${fetchCount} now fetching ${url} `;
        const options = {
          method: 'get',
          timeout: 20000
        };
        const data = yield (0, _isomorphicFetch.default)(url, options);
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
      const match = (0, _packageMatcher.default)(Object.keys(response.versions), dependency.version);

      if (!response.versions[match] && !dependency.version.match(/.*(gz|git)/)) {
        console.error(` no match for ${dependency.module} ${dependency.version}`);
        return {};
      }

      return response.versions[match].dependencies || {};
    }

    return {};
  });

  return function registryDeps(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = registryDeps;
exports.default = _default;