"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.isUrl = exports.getPckFromUrl = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _readPackageJson = _interopRequireDefault(require("read-package-json"));

var _pify = _interopRequireDefault(require("pify"));

var _fs = _interopRequireDefault(require("fs"));

var _isomorphicFetch = _interopRequireDefault(require("isomorphic-fetch"));

const isUrl = pckUrl => {
  try {
    const tgtUrl = new URL(pckUrl);
    return tgtUrl;
  } catch (err) {
    return undefined;
  }
};

exports.isUrl = isUrl;

const getPckFromUrl =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (url) {
    const options = {
      method: 'get',
      timeout: 10000
    };
    const data = yield (0, _isomorphicFetch.default)(url, options);

    const _ref2 = yield data.json(),
          dependencies = _ref2.dependencies,
          devDependencies = _ref2.devDependencies,
          name = _ref2.name;

    return {
      dependencies,
      devDependencies,
      name
    };
  });

  return function getPckFromUrl(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getPckFromUrl = getPckFromUrl;

const read =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2.default)(function* (file) {
    if (isUrl(file)) {
      return getPckFromUrl(file);
    } else if (!_fs.default.existsSync(file)) {
      return Promise.reject(new Error('file not found'));
    }

    const pj = (0, _pify.default)(_readPackageJson.default);

    const _ref4 = yield pj(file),
          dependencies = _ref4.dependencies,
          devDependencies = _ref4.devDependencies,
          name = _ref4.name;

    return {
      dependencies,
      devDependencies,
      name
    };
  });

  return function read(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

var _default = read;
exports.default = _default;