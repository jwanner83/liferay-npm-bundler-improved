# liferay-npm-bundler-improved

A non-official, **ultrafast** drop-in replacement for the
[`liferay-npm-bundler`\*](https://www.npmjs.com/package/liferay-npm-bundler)
with a watch mode.

## description

the `liferay-npm-bundler-improved` is a drop-in replacement for the official `liferay-npm-bundler` with a few
improvements. it is a bundler for liferay portlets which bundles all dependencies into a single file. it also copies
the assets into the `build` folder and makes them available through the web context url. it also supports a watch mode
which rebuilds the portlet if a file changes.

## getting started

### installation

`pnpm i --D liferay-npm-bundler-improved`

### existing portlet

replace `liferay-npm-bundler` with `liferay-npm-bundler-improved` in your build command. 

#### copy sources

if you have `lnbs-copy-sources` inside of your build command, remove it and add `--copy-sources` to the
`liferay-npm-bundler-improved` command.

#### copy assets

if you have assets inside the `assets` folder which should be available through the web context url, remove the
`lnbs-copy-assets` command from your existing build command and add `--copy-assets` to the
`liferay-npm-bundler-improved` call

### new portlet

have a look at the examples folder for an example on how to use the `liferay-npm-bundler-improved` in a `react`, `vue`
and plain `js` portlet.

## advantages

the two main advantages are _**speed**_ and _**developer experience**_.

### speed

a build of an average portlet with the `liferay-npm-bundler-improved` takes about **_0.1s_** \*\*, no matter how big the
module is. if you worked with the official `liferay-npm-bundler` before, you know how much of an improvement this is.

### developer experience

the `liferay-npm-bundler-improved` tries its best to tell you, if you do something wrong. this helps the developer a
lot if he is trying to figure out why something isn't working as expected. some examples.

#### missing key in `package.json`

if you forgot a required key in the `package.json`, it tells you which key you're missing and lets the build fail.
for example, if you forgot the `name` key, the console output would look something like this:

```
Error in 0.01s: bundler failed. invalid-package-exception: required property "name" doesn't exist in the package.json file.
```

#### missing entry file

if, for some reason, the in the `main` property defined entry js file is missing, the bundler will show the following
output. _(the original bundler wouldn't even fail if the entry file was not found. it would just tell you that its
finished.)_

with the `--copy-sources` option activated:

```
Error in 0.01s: bundler failed. copy-sources-exception: sources could not be copied from "src/entry.js"
```

without:

```
Error in 0.01s: bundler failed. missing-entry-file-exception: entry file doesn't exist in "build/entry.js". if there is no build step and you need the source entry file, you may want to enable the copy sources option: '--copy-sources'
```

#### missing css file if `header-portlet-css` is enabled

if the `header-portlet-css` option is active and the defined css file can't be found, the bundler doesn't fail but shows
a warning after the build is done.

```
Success in 0.04s: bundler done with one warning
↳ the 'com.liferay.portlet.header-portlet-css' property is set but the according css file can't either be found in 'src/index.css' or in 'build/index.css'. please make sure, the css file is present in one of the directories or remove the property.
```

### watch mode

the `liferay-npm-bundler-improved` also supports a watch mode. if you add the `--watch` option or `-w` to the build command, the bundler first will deploy a special development portlet but with the same specifiers as the normal one and then starts watching the files. 

if a file changes, it will rebuild the code and push it automatically to the development portlet via websocket. 

this is especially useful if you're developing a portlet and want to see the changes immediately.

> [!IMPORTANT]  
> the watch mode currently only works if you use vite as your build tool. if you use anything else, it will not work. as well the watch mode only works if the bundle is not to big (the complete build should not take more than 10 seconds, otherwise it won't be as useful)

### deploy mode

if the `--deploy` option or `-d` is set, the bundler will deploy the portlet to the server after the build is done, if you have a `.env` file which contains the following variable: `LIFERAY_DEPLOYMENT_PATH`. this variable should contain the path to the liferay deployment folder.


## missing features

the current implementation works for most use cases. but there are a few things which aren't currently working as the
original implementation.

- package deduplication - _not planned \*\*\*_
- system configuration - [gathering interest](https://github.com/jwanner83/liferay-npm-bundler-improved/issues/55) \
  ↳ portlet instance configuration works since 1.4.0 [#8](https://github.com/jwanner83/liferay-npm-bundler-improved/issues/8)

\
_\* the official bundler is
[available on github](https://github.com/liferay/liferay-frontend-projects/tree/master/projects/js-toolkit/packages/npm-bundler)_
<br>
_\*\* on a apple m1 macbook pro. on windows it takes about 0.3s._<br>
_\*\*\* the package deduplication feature is currently not planned because of the cost/income ratio. if this feature would be
implemented, the speed of the bundler would decrease a lot and because we didn't use this feature anyway in the company
i worked, i left it out._
