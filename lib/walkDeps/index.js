'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCircularDependency = undefined;

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _readDependencyFile = require('../readDependencyFile');

var _readDependencyFile2 = _interopRequireDefault(_readDependencyFile);

var _collate = require('../collate');

var _collate2 = _interopRequireDefault(_collate);

var _fetchRegistryDependencies = require('../fetchRegistryDependencies');

var _fetchRegistryDependencies2 = _interopRequireDefault(_fetchRegistryDependencies);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _cleanPrivateProps = require('../cleanPrivateProps');

var _cleanPrivateProps2 = _interopRequireDefault(_cleanPrivateProps);

var _findNamedModule = require('../findNamedModule');

var _findNamedModule2 = _interopRequireDefault(_findNamedModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const circulars = [];

const isCircularDependency = exports.isCircularDependency = ({ parent: ancestor, dependency }) => {
  if (!ancestor || !ancestor.__name) return false;
  if (circulars.includes(dependency.module)) return true;
  const match = ancestor.__name === dependency.module;
  if (match) {
    circulars.push(dependency.module);
    return `Circular dependency parent ${ancestor.__name}`;
  }
  if (!ancestor.parent) return false;
  return isCircularDependency({ parent: ancestor.parent, dependency });
};

const walker = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (task, cb) {
    const circular = isCircularDependency(task);
    if (circular) {
      task.results[task.dependency.module] = { circular };
      return cb(null, null, null, null);
    }

    let regDeps;
    try {
      regDeps = yield (0, _fetchRegistryDependencies2.default)(task.dependency);
    } catch (err) {
      console.error(err.message);
    }

    task.results[task.dependency.module] = {};
    if (regDeps) {
      const __depends = [];
      (0, _getOwnPropertyNames2.default)(regDeps).forEach(function (depName) {
        if (depName) __depends.push({ module: depName, version: regDeps[depName] });
      });
      if (__depends.length > 0) {
        task.results[task.dependency.module] = { __name: task.dependency.module, __depends, __depth: task.__depth };
        const newDeps = __depends.map(function (dependency) {
          return { dependency, results: task.results[task.dependency.module], q: task.q, __depth: task.__depth + 1, parent: task.results };
        });
        // TODO cd error handling
        newDeps.forEach(function (nd) {
          return task.q.push(nd, function () {
            return null;
          });
        });
      }
    }
    cb(null, task.dependency.module, task.results[task.dependency.module], task.results);
  });

  return function walker(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const walkDeps = (() => {
  var _ref2 = (0, _asyncToGenerator3.default)(function* (moduleToFind, dependsFile, nodeEnv, done) {
    const packageJsonDeps = yield (0, _readDependencyFile2.default)(dependsFile);
    const name = packageJsonDeps.name;
    const collatedDeps = (0, _collate2.default)(packageJsonDeps);
    let results = { __depends: collatedDeps };
    const q = _async2.default.queue(walker, 10);
    q.drain = function () {
      results = (0, _cleanPrivateProps2.default)(results);
      const matches = (0, _findNamedModule2.default)(results, moduleToFind, undefined);
      if (nodeEnv !== 'test') matches.forEach(function (m) {
        return console.log(`${name} => ${m.replace(/\./g, ' --> ')}`);
      });
      if (done) done(results);
    };
    // TODO cb error handling
    // TODO take package@version as argument rather than package.json
    // TODO add package.json name to top of the tree
    collatedDeps.forEach(function (d) {
      return q.push({ dependency: d, results, q, __depth: 1, parent: undefined }, function () {
        return null;
      });
    });
  });

  return function walkDeps(_x3, _x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
})();

exports.default = walkDeps;