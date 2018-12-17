"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const findNamedModule = (obj, name, tree) => {
  if (!obj || !name) return [];
  const regex = new RegExp(name);

  const mappingFunc = k => ({
    name: `${tree ? tree + '.' + k : k}`,
    version: obj[k].version
  });

  let matchingKeys = Object.keys(obj).filter(k => k.match(regex)).map(mappingFunc);
  Object.keys(obj).filter(k => !k.match(regex) && obj[k] instanceof Object).forEach(k => {
    matchingKeys = [...matchingKeys, ...findNamedModule(obj[k], name, `${tree ? tree + '.' + k : k}`)];
  });
  return matchingKeys.map(m => ({
    name: m.name,
    version: m.version
  }));
};

var _default = findNamedModule;
exports.default = _default;