import program from 'commander'
import getDepends from './fileDeps'
import collate from './collate'
import treeify from 'treeify'
import registryDeps from './registryDeps'

program
  .version('1.0.0')
  .option('-m, --module [value]', 'find root module that requires this module')
  .parse(process.argv)

if (program.module) console.log(`Find root module that requires ${program.module}`)

const getDependencyTree = async () => {
  let depends = await getDepends('package.json')
  collate(depends).forEach(d => console.log(treeify.asTree(d, true)))
  depends = await registryDeps()
}

getDependencyTree()
