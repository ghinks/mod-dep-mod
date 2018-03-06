#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = exports.isCircularDependency = undefined;

var _isExtensible = require('babel-runtime/core-js/object/is-extensible');

var _isExtensible2 = _interopRequireDefault(_isExtensible);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

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
  return _get__('isCircularDependency')({ parent: ancestor.parent, dependency });
};

var walker = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(task, cb) {
    var circular, regDeps, __depends, newDeps;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            circular = _get__('isCircularDependency')(task);

            if (!circular) {
              _context.next = 4;
              break;
            }

            task.results[task.dependency.module] = { circular };
            return _context.abrupt('return', cb(null, null, null, null));

          case 4:
            _context.next = 6;
            return _get__('getRegistryDeps')(task.dependency);

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
            return _get__('getDepends')('package.json');

          case 2:
            packageJsonDeps = _context2.sent;
            name = packageJsonDeps.name;
            collatedDeps = _get__('collate')(packageJsonDeps);
            results = { __depends: collatedDeps };
            q = _get__('async').queue(_get__('walker'), 10);

            q.drain = function () {
              results = _get__('cleanPrivProps')(results);
              var matches = _get__('findNamedModule')(results, moduleToFind, undefined);
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

exports.default = _get__('walkDeps');

function _getGlobalObject() {
  try {
    if (!!global) {
      return global;
    }
  } catch (e) {
    try {
      if (!!window) {
        return window;
      }
    } catch (e) {
      return this;
    }
  }
}

;
var _RewireModuleId__ = null;

function _getRewireModuleId__() {
  if (_RewireModuleId__ === null) {
    var globalVariable = _getGlobalObject();

    if (!globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__) {
      globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0;
    }

    _RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;
  }

  return _RewireModuleId__;
}

function _getRewireRegistry__() {
  var theGlobalVariable = _getGlobalObject();

  if (!theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__) {
    theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = (0, _create2.default)(null);
  }

  return __$$GLOBAL_REWIRE_REGISTRY__;
}

function _getRewiredData__() {
  var moduleId = _getRewireModuleId__();

  var registry = _getRewireRegistry__();

  var rewireData = registry[moduleId];

  if (!rewireData) {
    registry[moduleId] = (0, _create2.default)(null);
    rewireData = registry[moduleId];
  }

  return rewireData;
}

(function registerResetAll() {
  var theGlobalVariable = _getGlobalObject();

  if (!theGlobalVariable['__rewire_reset_all__']) {
    theGlobalVariable['__rewire_reset_all__'] = function () {
      theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = (0, _create2.default)(null);
    };
  }
})();

var INTENTIONAL_UNDEFINED = '__INTENTIONAL_UNDEFINED__';
var _RewireAPI__ = {};

(function () {
  function addPropertyToAPIObject(name, value) {
    (0, _defineProperty2.default)(_RewireAPI__, name, {
      value: value,
      enumerable: false,
      configurable: true
    });
  }

  addPropertyToAPIObject('__get__', _get__);
  addPropertyToAPIObject('__GetDependency__', _get__);
  addPropertyToAPIObject('__Rewire__', _set__);
  addPropertyToAPIObject('__set__', _set__);
  addPropertyToAPIObject('__reset__', _reset__);
  addPropertyToAPIObject('__ResetDependency__', _reset__);
  addPropertyToAPIObject('__with__', _with__);
})();

function _get__(variableName) {
  var rewireData = _getRewiredData__();

  if (rewireData[variableName] === undefined) {
    return _get_original__(variableName);
  } else {
    var value = rewireData[variableName];

    if (value === INTENTIONAL_UNDEFINED) {
      return undefined;
    } else {
      return value;
    }
  }
}

function _get_original__(variableName) {
  switch (variableName) {
    case 'isCircularDependency':
      return isCircularDependency;

    case 'getRegistryDeps':
      return _registryDeps2.default;

    case 'getDepends':
      return _fileDeps2.default;

    case 'collate':
      return _collate2.default;

    case 'async':
      return _async2.default;

    case 'walker':
      return walker;

    case 'cleanPrivProps':
      return _cleanPrivateProps2.default;

    case 'findNamedModule':
      return _findNamedModule2.default;

    case 'walkDeps':
      return walkDeps;
  }

  return undefined;
}

function _assign__(variableName, value) {
  var rewireData = _getRewiredData__();

  if (rewireData[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return rewireData[variableName] = value;
  }
}

function _set_original__(variableName, _value) {
  switch (variableName) {}

  return undefined;
}

function _update_operation__(operation, variableName, prefix) {
  var oldValue = _get__(variableName);

  var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

  _assign__(variableName, newValue);

  return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
  var rewireData = _getRewiredData__();

  if (typeof variableName === 'object') {
    (0, _keys2.default)(variableName).forEach(function (name) {
      rewireData[name] = variableName[name];
    });
  } else {
    if (value === undefined) {
      rewireData[variableName] = INTENTIONAL_UNDEFINED;
    } else {
      rewireData[variableName] = value;
    }

    return function () {
      _reset__(variableName);
    };
  }
}

function _reset__(variableName) {
  var rewireData = _getRewiredData__();

  delete rewireData[variableName];

  if ((0, _keys2.default)(rewireData).length == 0) {
    delete _getRewireRegistry__()[_getRewireModuleId__];
  }

  ;
}

function _with__(object) {
  var rewireData = _getRewiredData__();

  var rewiredVariableNames = (0, _keys2.default)(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      rewireData[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = rewireData[variableName];
      rewireData[variableName] = object[variableName];
    });
    var result = callback();

    if (!!result && typeof result.then == 'function') {
      result.then(reset).catch(reset);
    } else {
      reset();
    }

    return result;
  };
}

var _typeOfOriginalExport = typeof walkDeps;

function addNonEnumerableProperty(name, value) {
  (0, _defineProperty2.default)(walkDeps, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && (0, _isExtensible2.default)(walkDeps)) {
  addNonEnumerableProperty('__get__', _get__);
  addNonEnumerableProperty('__GetDependency__', _get__);
  addNonEnumerableProperty('__Rewire__', _set__);
  addNonEnumerableProperty('__set__', _set__);
  addNonEnumerableProperty('__reset__', _reset__);
  addNonEnumerableProperty('__ResetDependency__', _reset__);
  addNonEnumerableProperty('__with__', _with__);
  addNonEnumerableProperty('__RewireAPI__', _RewireAPI__);
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;