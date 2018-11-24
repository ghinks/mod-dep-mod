# mod-dep-mod

[![NPM](https://nodei.co/npm/mod-dep-mod.png)](https://nodei.co/npm/mod-dep-mod/)

A tool to list which dependencies depend on a module.

Have you ever been doing an install and you see a module being installed and you don't know why it is being pulled in. What is requiring it? Well this is the tool to tell you.

**What modules use debug in your package.json?**

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

### URL search
```
mod-dep-mod -u https://raw.githubusercontent.com/expressjs/express/master/package.json cookie
```

```
--------------------------------------------------------------------------------------------------
express => cookie-signature
express => cookie
express => cookie-session
express => cookie-parser
express => express-session --> cookie
express => express-session --> cookie-signature
express => supertest --> superagent --> cookiejar
--------------------------------------------------------------------------------------------------
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
- directly search from github package.json via url

## help

```
  Usage: index [options]


  Options:
    -p  fully qualified path to a package.json file
    -u  url to package.json
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

