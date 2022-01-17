#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))
var walk = require('../src/walkDeps').default

if (argv._.length === 0) {
  console.log('no args given')
  console.log('example mod-dep-mod debug')
  process.exit()
}

process.on('unhandledRejection', up => { throw new Error('uncaught!') })

var getDependencyTree = function run(modules, fullyQualPck, urlToPck) {
  const pck = fullyQualPck || urlToPck || 'package.json'
  walk(modules, pck, process.env.NODE_ENV, () => process.exit())
    .then(() => null)
    .catch(err => console.log(err.message))
}

// p path to package.json
// u url to package.json
getDependencyTree(argv._, argv.p, argv.u)
