'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCircularDependency = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fileDeps = require('../fileDeps');

var _fileDeps2 = _interopRequireDefault(_fileDeps);

var _collate = require('../collate');

var _collate2 = _interopRequireDefault(_collate);

var _registryDeps = require('../registryDeps');

var _registryDeps2 = _interopRequireDefault(_registryDeps);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _cleanPrivateProps = require('../cleanPrivateProps');

var _cleanPrivateProps2 = _interopRequireDefault(_cleanPrivateProps);

var _findNamedModule = require('../findNamedModule');

var _findNamedModule2 = _interopRequireDefault(_findNamedModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isCircularDependency = exports.isCircularDependency = function isCircularDependency(_ref) {
  var ancestor = _ref.parent,
      dependency = _ref.dependency;

  if (!ancestor || !ancestor.__name) return false;
  var match = ancestor.__name === dependency.module;
  if (match) return `Circular dependency parent ${ancestor.__name}`;
  if (!ancestor.parent) return false;
  return isCircularDependency({ parent: ancestor.parent, dependency });
};

var walker = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(task, cb) {
    var circular, regDeps, __depends, newDeps;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            circular = isCircularDependency(task);

            if (!circular) {
              _context.next = 4;
              break;
            }

            task.results[task.dependency.module] = { circular };
            return _context.abrupt('return', cb(null, null, null, null));

          case 4:
            _context.next = 6;
            return (0, _registryDeps2.default)(task.dependency);

          case 6:
            regDeps = _context.sent;

            task.results[task.dependency.module] = {};
            if (regDeps) {
              __depends = [];

              (0, _getOwnPropertyNames2.default)(regDeps).forEach(function (depName) {
                if (depName) __depends.push({ module: depName, version: regDeps[depName] });
              });
              if (__depends.length > 0) {
                task.results[task.dependency.module] = { __name: task.dependency.module, __depends, __depth: task.__depth };
                newDeps = __depends.map(function (dependency) {
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

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function walker(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var walkDeps = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(moduleToFind, done) {
    var packageJsonDeps, name, collatedDeps, results, q;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _fileDeps2.default)('package.json');

          case 2:
            packageJsonDeps = _context2.sent;
            name = packageJsonDeps.name;
            collatedDeps = (0, _collate2.default)(packageJsonDeps);
            results = { __depends: collatedDeps };
            q = _async2.default.queue(walker, 10);

            q.drain = function () {
              results = (0, _cleanPrivateProps2.default)(results);
              var matches = (0, _findNamedModule2.default)(results, moduleToFind, undefined);
              matches.forEach(function (m) {
                return console.log(`${name} => ${m.replace(/\./g, ' --> ')}`);
              });
              if (done) done(results);
              process.exit();
            };
            // TODO cb error handling
            // TODO take package@version as argument rather than package.json
            // TODO add package.json name to top of the tree
            collatedDeps.forEach(function (d) {
              return q.push({ dependency: d, results, q, __depth: 1, parent: undefined }, function () {
                return null;
              });
            });

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function walkDeps(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

exports.default = walkDeps;