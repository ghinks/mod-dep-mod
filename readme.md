# mod-dep-mod

[![NPM](https://nodei.co/npm/mod-dep-mod.png)](https://nodei.co/npm/mod-dep-mod/)

A tool to list which dependencies depend on a module.

Have you ever been doing an install and you see a module being installed and you don't know why it is being pulled in. Do you need to find a dependency that is using a module version that is not safe? What is requiring it? Well this is the tool to tell you.

**What modules use debug in your package.json?**

<p align="center">
	<img src="https://ghinks.github.io/mod-dep-mod/mod-dep-mod.gif">
</p>

## Usage

```
npm install -g mod-dep-mod

cd rootFolderWithPackageJson

mod-dep-mod babel

```

Listing top level dependencies that use the babel module

```
mod-dep-mod => @babel/runtime ^7.0.0
mod-dep-mod => @babel/plugin-proposal-do-expressions ^7.0.0
mod-dep-mod => @babel/plugin-proposal-class-properties ^7.0.0
mod-dep-mod => @babel/plugin-proposal-decorators ^7.0.0
mod-dep-mod => @babel/core ^7.0.0
...
mod-dep-mod => babel-eslint ^8.2.2
mod-dep-mod => standard --> eslint --> babel-code-frame ^6.22.0
mod-dep-mod => nyc --> istanbul-lib-instrument --> babel-types ^6.18.0
mod-dep-mod => nyc --> istanbul-lib-instrument --> babel-generator ^6.18.0
mod-dep-mod => nyc --> istanbul-lib-instrument --> babel-traverse ^6.18.0
mod-dep-mod => nyc --> istanbul-lib-instrument --> babel-template ^6.16.0
```

### Multiple Searches
```
mod-dep-mod jsx eslint
```



```
mod-dep-mod => standard --> eslint --> espree --> acorn-jsx ^1.2.3
mod-dep-mod => standard --> eslint-plugin-react ^1.2.3

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

