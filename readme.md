# mod-dep-mod

A tool to list which dependencies depend on a module.

## Usage

```
npm install -g mod-dep-mod

cd rootFolderWithPackageJson

mod-dep-mod -m debug

```

Listing top level dependencies that use the module

```
mod-dep-mod => nyc --> test-exclude --> micromatch --> snapdragon --> debug
mod-dep-mod => nyc --> test-exclude --> micromatch --> nanomatch --> snapdragon --> debug
mod-dep-mod => nock --> debug
mod-dep-mod => mocha --> debug
```
## features

- uses the registry set by npm
- takes regular expression string
- fetches the dependency data from the registry not locally installed modules
- isolates rogue module inclusion path quickly

## help

```

  Usage: index [options]


  Options:

    -V, --version         output the version number
    -m, --module [value]  find root module that requires this module
    -h, --help            output usage information
```



Instead of having to do binary cuts on your dependencies to find out which one is depending on your problem package. You simple query the package.json to
get the dependency path.

Sometimes you are using a different registry to the one in which the code was written and some module is
not available. Run the mod-dep-mod to see which top level package.json dependency is using that module.

This tool will use the registry you see from

npm config list

```
...
metrics-registry = "http://registry.bigco.net/"
...
```

mod-dep-mod will use the registry in the npm config.

