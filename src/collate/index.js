const createDepsList = (deps) => Object.keys(deps).map(k => ({module: k, version: deps[k]}))

const collateDepends = (packageJson) => {
  const collated = [...createDepsList(packageJson.dependencies),
    ...createDepsList(packageJson.devDependencies)]
  return collated
}

export default collateDepends
