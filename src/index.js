import program from 'commander'
import walk from './walkDeps'

program
  .version('1.0.0')
  .option('-m, --module [value]', 'find root module that requires this module')
  .parse(process.argv)

if (program.module) console.log(`Find root module that requires ${program.module}`)

const getDependencyTree = async () => {
  await walk(program.module)
}

getDependencyTree()
