#!/usr/bin/env node

var program = require('commander')
var walk = require('../lib/walkDeps').default

program
  .version('0.0.5')
  .option('-m, --module [value]', 'find root module that requires this module')
  .parse(process.argv)

if (program.module) console.log(`Find root module that requires ${program.module}`)

var getDependencyTree = function run() {
  if (!program.module) {
    console.log('useage -m or --module moduleName')
    process.exit(0)
  }
  walk(program.module)
    .then(() => null)
    .catch(err => console.log(err.message))
}

getDependencyTree()
