# liferay-npm-bundler-improved

A non-official but **ultrafast** drop-in replacement for the
[`liferay-npm-bundler` \*](https://www.npmjs.com/package/liferay-npm-bundler)

## advantages

the two main advantages are _**speed**_ and _**traceability**_.

### speed

a build of an average portlet with the `liferay-npm-bundler-improved` takes about **_0.1s_** \*\*, no matter how big the
module is. if you worked with the official `liferay-npm-bundler` before, you know how much of an improvement this is.

### traceability

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

## missing features

the current implementation works for most use cases. but there are a few things which aren't currently working as the
original implementation.

- package deduplication - _not planned \*\*\*_
- system configuration - [gathering interest](https://github.com/jwanner83/liferay-npm-bundler-improved/issues/55) \
  ↳ portlet instance configuration works since 1.4.0 [#8](https://github.com/jwanner83/liferay-npm-bundler-improved/issues/8)

## usage

To use the bundler, you have to install it from the `npmjs.org` registry `pnpm i --D liferay-npm-bundler-improved`
and edit your existing build command to use `liferay-npm-bundler-improved` instead of `liferay-npm-bundler`. most of the
features will work out of the box.

### copy sources

if you have `lnbs-copy-sources` inside of your build command, remove it and add `--copy-sources` to the
`liferay-npm-bundler-improved` command.

### copy assets

if you have assets inside the `assets` folder which should be available through the web context url, remove the
`lnbs-copy-assets` command from your existing build command and add `--copy-assets` to the
`liferay-npm-bundler-improved` call

### configuration
portlet instance configuration will work the same way as in the official bundler. see the `examples/plain/features/configuration.json` 
file for all available options. it is also possible to add translated labels, descriptions and default values with 
language keys. the keys have to be defined inside the portlets own localization files. 

### examples

see the examples folder for an example on how to use the `liferay-npm-bundler-improved` in a `react`, `vue` and plain `js`
portlet.

\
_\* the official bundler is
[available on github](https://github.com/liferay/liferay-frontend-projects/tree/master/projects/js-toolkit/packages/npm-bundler)_
<br>
_\*\* on a apple m1 macbook pro. on windows it takes about 0.3s._<br>
_\*\*\* the package deduplication feature is currently not planned because of the cost/income ratio. if this feature would be
implemented, the speed of the bundler would decrease a lot and because we didn't use this feature anyway in the company
i worked, i left it out._
