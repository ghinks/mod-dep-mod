"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.isCircularDependency = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _readDependencyFile = _interopRequireDefault(require("../readDependencyFile"));

var _collate = _interopRequireDefault(require("../collate"));

var _fetchRegistryDependencies = _interopRequireDefault(require("../fetchRegistryDependencies"));

var _async = _interopRequireDefault(require("async"));

var _cleanPrivateProps = _interopRequireDefault(require("../cleanPrivateProps"));

var _findNamedModule = _interopRequireDefault(require("../findNamedModule"));

const circulars = [];

const isCircularDependency = ({
  ancestry,
  dependency
}) => {
  if (!ancestry) return false;
  if (circulars.includes(dependency.module)) return true;
  if (!ancestry.includes(dependency.module)) return false;
  return true;
};

exports.isCircularDependency = isCircularDependency;

const walker =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (task, cb) {
    const circular = isCircularDependency(task);

    if (circular) {
      task.results[task.dependency.module] = {
        circular: `Circular dependency in tree`
      };
      return cb(null, null, null, null);
    }

    let regDeps;

    try {
      regDeps = yield (0, _fetchRegistryDependencies.default)(task.dependency);
    } catch (err) {
      console.error(err.message);
    }

    task.results[task.dependency.module] = {};

    if (regDeps) {
      const __depends = [];
      Object.getOwnPropertyNames(regDeps).forEach(depName => {
        __depends.push({
          module: depName,
          version: regDeps[depName]
        });
      });

      if (__depends.length > 0) {
        task.results[task.dependency.module] = {
          __name: task.dependency.module,
          __depends,
          __depth: task.__depth
        };

        const newDeps = __depends.map(dependency => ({
          dependency,
          results: task.results[task.dependency.module],
          q: task.q,
          __depth: task.__depth + 1,
          ancestry: [...task.ancestry, task.dependency.module]
        })); // TODO cd error handling


        newDeps.forEach(nd => task.q.push(nd, () => null));
      }
    }

    cb(null, task.dependency.module, task.results[task.dependency.module], task.results);
  });

  return function walker(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

const walkDeps =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (modules, dependsFile, nodeEnv, done) {
    const packageJsonDeps = yield (0, _readDependencyFile.default)(dependsFile);
    const name = packageJsonDeps.name;
    const collatedDeps = (0, _collate.default)(packageJsonDeps);
    let results = {
      __depends: collatedDeps
    };

    const q = _async.default.queue(walker, 10);

    q.drain = () => {
      results = (0, _cleanPrivateProps.default)(results);
      const matches = modules.reduce((acc, moduleToFind) => {
        const found = (0, _findNamedModule.default)(results, moduleToFind, undefined);
        return [...acc, ...found];
      }, []);

      if (nodeEnv !== 'test' && matches.length > 0) {
        console.log('');
        console.log(Array(50).join('--'));
        matches.forEach(m => console.log(`${name} => ${m.replace(/\./g, ' --> ')}`));
        console.log(Array(50).join('--'));
      } else if (nodeEnv !== 'test' && matches.length === 0) {
        console.log('');
        console.log(Array(50).join('--'));
        console.log('no matches found');
        console.log(Array(50).join('--'));
      }

      done(results);
    }; // TODO cb error handling
    // TODO take package@version as argument rather than package.json
    // TODO add package.json name to top of the tree


    collatedDeps.forEach(d => q.push({
      dependency: d,
      results,
      q,
      __depth: 1,
      ancestry: []
    }, () => null));
  });

  return function walkDeps(_x3, _x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = walkDeps;
exports.default = _default;