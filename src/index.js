#!/usr/bin/env node

import program from 'commander'
import walk from './walkDeps'

program
  .version('0.0.2')
  .option('-m, --module [value]', 'find root module that requires this module')
  .parse(process.argv)

if (program.module) console.log(`Find root module that requires ${program.module}`)

const getDependencyTree = async () => {
  if (!program.module) {
    console.log('useage -m or --module moduleName')
    process.exit(0)
  }
  await walk(program.module)
}

getDependencyTree()
