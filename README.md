# liferay-npm-bundler-improved
A highly experimental, __ultra__ fast and non-official drop-in replacement for 
[`liferay-npm-bundler`](https://www.npmjs.com/package/liferay-npm-bundler)

## Reason for existence
There is one reason for its existence: speed. In comparison to the official `liferay-npm-bundler` it is up to 
**14 times faster** while bundling vue / react / vanilla js portlets. As a bonus, the `liferay-npm-bundler-improved` also 
works with `pnpm`, which is because of the usage of symlinks not supported by the official `liferay-npm-bundler`.

## Missing Features:
- Package Deduplication (not planned)
- Portlet Configuration Support (backlog)

## Usage
To use the bundler, you have to install it via pnpm, yarn or npm `pnpm i --D liferay-npm-bundler-improved` and edit your 
existing build command to use `liferay-npm-bundler-improved` instead of `liferay-npm-bundler`.

### Without bundle process
> See `examples/plain` for an example
#### Old
```
"build": "pnpm run copy-sources && liferay-npm-bundler"
```
#### New
```
"build": "liferay-npm-bundler-improved"
```

### With bundle process
> See `examples/react` or `examples/vue` for an example
#### Old
```
"build": "rollup -c && liferay-npm-bundler"
```
#### New
```
"build": "rollup -c && liferay-npm-bundler-improved"
```

## Additional Information
> Where is the official bundler?
> - [github](https://github.com/liferay/liferay-frontend-projects/tree/master/projects/js-toolkit/packages/npm-bundler)
> - [npm - liferay-npm-bundler - v2](https://www.npmjs.com/package/liferay-npm-bundler)
> - [npm - @liferay/npm-bundler - v3](https://www.npmjs.com/package/@liferay/npm-bundler)
>
> Version 3 of the official liferay npm bundler uses webpack to bundle the code which would be very good but unfortunately
> it [isn't officially released yet](https://github.com/liferay/liferay-frontend-projects/issues/570).
