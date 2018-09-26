"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const createDepsList = deps => {
  if (!deps) return [];
  return Object.keys(deps).map(k => ({
    module: k,
    version: deps[k]
  }));
};

const collateDepends = packageJson => {
  const collated = [...createDepsList(packageJson.dependencies), ...createDepsList(packageJson.devDependencies)];
  return collated;
};

var _default = collateDepends;
exports.default = _default;