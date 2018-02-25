import program from 'commander'
import getDepends from './getDepends'
import collate from './collateDepends'
import treeify from 'treeify'

program
  .option('-m, --module [value]', 'find root module that requires this module')
  .parse(process.argv)

if (program.module) console.log(`Find root module that requires ${program.module}`)

getDepends('package.json')
  .then(depends => {
    collate(depends).forEach(d => console.log(treeify.asTree(d, true)))
  })
