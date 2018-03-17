#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))
var walk = require('../lib/walkDeps').default

process.on('unhandledRejection', up => { throw new Error('uncaught!') })

var getDependencyTree = function run(modules, pck) {
  walk(modules, pck || 'package.json', process.env.NODE_ENV, () => process.exit())
    .then(() => null)
    .catch(err => console.log(err.message))
}

getDependencyTree(argv._, argv.p)
