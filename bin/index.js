#!/usr/bin/env node

var program = require('commander')
var walk = require('../lib/walkDeps').default

program
  .option('-m, --module [value]', 'find root module that requires this module')
  .option('-p --package [value]', 'fully qualified path to a package.json file')
  .parse(process.argv)

const isTestEnv = () => process.env.NODE_ENV === 'test'

if (program.module && isTestEnv()) console.log(`Find root module that requires ${program.module}`)
if (program.package && isTestEnv()) console.log(`Use ${program.package} as dependency source`)

process.on('unhandledRejection', up => { throw new Error('uncaught!') })

var getDependencyTree = function run() {
  if (!program.module) {
    console.log('useage -m or --module moduleName')
    process.exit(0)
  }
  walk(program.module, program.package || 'package.json', process.env.NODE_ENV, () => process.exit())
    .then(() => null)
    .catch(err => console.log(err.message))
}

getDependencyTree()
