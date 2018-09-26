"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _readPackageJson = _interopRequireDefault(require("read-package-json"));

var _pify = _interopRequireDefault(require("pify"));

var _fs = _interopRequireDefault(require("fs"));

const read =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (file) {
    if (!_fs.default.existsSync(file)) {
      return Promise.reject(new Error('file not found'));
    }

    const pj = (0, _pify.default)(_readPackageJson.default);

    const _ref2 = yield pj(file),
          dependencies = _ref2.dependencies,
          devDependencies = _ref2.devDependencies,
          name = _ref2.name;

    return {
      dependencies,
      devDependencies,
      name
    };
  });

  return function read(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = read;
exports.default = _default;