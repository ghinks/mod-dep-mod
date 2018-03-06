'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = exports.getHighestMatch = exports.getSingle = exports.getExact = exports.getMajor = exports.getMinor = exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _semver = require('semver');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMinor = function getMinor(versions, testValue) {
  var regex = /(\d+)\.([\d]+)\.([\dxX]+)/;
  var testValueMatch = testValue.replace(/x/ig, '0').match(regex);
  return versions.reduce(function (acc, cur) {
    var versionMatch = cur.match(regex);
    if (versionMatch[1] === testValueMatch[1] & versionMatch[2] === testValueMatch[2]) {
      if (!acc) {
        return cur;
      }
      var accMatch = acc.match(regex);
      if (versionMatch[3] > accMatch[3]) {
        return cur;
      }
    }
    return acc;
  }, undefined);
};

var getMajor = function getMajor(versions, testValue) {
  var regex = /(\d+)\.([\dxX]+)\.([\dxX]+)/;
  var testValueMatch = testValue.replace(/x/ig, '0').match(regex);
  return versions.reduce(function (acc, cur) {
    var versionMatch = cur.match(regex);
    if (versionMatch[1] === testValueMatch[1]) {
      if (versionMatch[2] < testValueMatch[2]) {
        return acc;
      }
      if (!acc && versionMatch[2] >= testValueMatch[2]) {
        return cur;
      }
      var accMatch = acc.match(regex);
      if (versionMatch[2] === testValueMatch[2] && versionMatch[3] > accMatch[3]) {
        return cur;
      }
      if (versionMatch[2] >= testValueMatch[2] && versionMatch[2] > accMatch[2]) {
        return cur;
      }
      if (versionMatch[2] >= testValueMatch[2] && versionMatch[3] > accMatch[3]) {
        return cur;
      }
    }
    return acc;
  }, undefined);
};

var getExact = function getExact(versions, testValue) {
  if (versions.includes(testValue)) {
    return testValue;
  }
  return undefined;
};

var getSingle = function getSingle(versions, testValue) {
  var regexSingleDigit = /(\^?)(\d+)/;
  var match = testValue.match(regexSingleDigit);
  if (match[2]) return _get__('getMajor')(versions, `${match[2]}.x.x`);
};

// TODO npm tool came back with highest 1.x.x, investigate
var getHighestMatch = function getHighestMatch(versions) {
  return versions.sort(_get__('rcompare'))[0];
};

var matcher = function matcher(versions, testValue) {
  // TODO check versions and length
  // eslint-disable-next-line
  var regexMajMin = /([\^\~]?)(\d+\.[\dxX]+\.[\dxX]+)/;
  var match = testValue.match(regexMajMin);
  if (match && match[1] === '~') {
    return _get__('getMinor')(versions, match[2]);
  } else if (match && match[1] === '^') {
    return _get__('getMajor')(versions, match[2]);
  } else if (match && !testValue.match(/([\^\~]?)(\d+\.[xX]+\.[xX]+)/) && !testValue.match(/\>\=.*/)) {
    return _get__('getExact')(versions, testValue);
  } else if (testValue.match(/(\^?)(\d+)/)) {
    return _get__('getSingle')(versions, testValue);
  } else if (testValue === '*') {
    return _get__('getHighestMatch')(versions);
  } else if (testValue.match(/>=.*/)) {
    return _get__('getHighestMatch')(versions);
  }
};

exports.default = matcher;
exports.getMinor = getMinor;
exports.getMajor = getMajor;
exports.getExact = getExact;
exports.getSingle = getSingle;
exports.getHighestMatch = getHighestMatch;

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
    case 'getMajor':
      return getMajor;

    case 'rcompare':
      return _semver.rcompare;

    case 'getMinor':
      return getMinor;

    case 'getExact':
      return getExact;

    case 'getSingle':
      return getSingle;

    case 'getHighestMatch':
      return getHighestMatch;
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

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;