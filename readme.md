# mod-dep-mod

A tool to list which dependencies depend on a module.

[![NPM](https://nodei.co/npm/mod-dep-mod.png)](https://nodei.co/npm/mod-dep-mod/)

<p align="center">
	<img src="https://cdn.rawgit.com/ghinks/mod-dep-mod/92a90f92/mod-dep-mod.gif">
</p>

## Usage

```
npm install -g mod-dep-mod

cd rootFolderWithPackageJson

mod-dep-mod debug

```

Listing top level dependencies that use the module

```
mod-dep-mod => nyc --> test-exclude --> micromatch --> snapdragon --> debug
mod-dep-mod => nyc --> test-exclude --> micromatch --> nanomatch --> snapdragon --> debug
mod-dep-mod => nock --> debug
mod-dep-mod => mocha --> debug
```

### Multiple Searches
```
mod-dep-mod jsx eslint
```



```
mod-dep-mod => standard --> eslint --> espree --> acorn-jsx
mod-dep-mod => standard --> eslint-plugin-react

```

## features

- uses the registry set by npm
- takes regular expression string
- fetches the dependency data from the registry not locally installed modules
- isolates rogue module inclusion path quickly
- tested on node 6 onwards
- gives total count of all dependencies fetched
- caches each registry fetch to speed up on duplicates
- multiple searches with multiple arguments

## help

```
  Usage: index [options]


  Options:
    -p  fully qualified path to a package.json file
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

