# liferay-npm-bundler-improved

`liferay-npm-bundler-improved` is a **high-speed**, unofficial drop-in replacement for the [`liferay-npm-bundler`](https://www.npmjs.com/package/liferay-npm-bundler) with added watch mode functionality.

## description

`liferay-npm-bundler-improved` is a bundler for liferay portlets that consolidates all dependencies into a single file. Additionally, it copies assets into the `build` folder and provides access to them through the web context URL. The tool also offers a watch mode that rebuilds the portlet upon file changes.

## getting started

### installation

To install, run the following command:

```bash
pnpm i --D liferay-npm-bundler-improved
```

### existing portlet

To use `liferay-npm-bundler-improved` in an existing portlet, replace instances of `liferay-npm-bundler` with `liferay-npm-bundler-improved` in your build command.

#### copy sources

If your build command includes `lnbs-copy-sources`, remove it and add `--copy-sources` to the `liferay-npm-bundler-improved` command.

#### copy assets

For assets located in the `assets` folder that need to be available through the web context URL, remove the `lnbs-copy-assets` command from your existing build command and add `--copy-assets` to the `liferay-npm-bundler-improved` call.

### new portlet

Refer to the examples folder for guidance on using `liferay-npm-bundler-improved` in a `react`, `vue`, or plain `js` portlet.

## advantages

The main advantages of using `liferay-npm-bundler-improved` are enhanced **speed** and a better **developer experience**.

### speed

The build time for an average portlet with `liferay-npm-bundler-improved` is approximately **0.1s**, regardless of module size. This represents a significant improvement over the official `liferay-npm-bundler`.

### developer experience

`liferay-npm-bundler-improved` offers detailed error reporting, aiding developers in identifying and resolving issues. Examples include identifying missing keys in `package.json` and detecting missing entry files.

### watch mode

`liferay-npm-bundler-improved` supports a watch mode, allowing automatic portlet rebuilds upon file changes. This is invaluable for immediate feedback during portlet development.

> [!IMPORTANT]  
> The watch mode currently works exclusively with Vite as the build tool. It is highly efficient for smaller bundles but may not be as effective for larger ones (taking more than 10 seconds to complete).

### deploy mode

When the `--deploy` option or `-d` is set, the bundler deploys the portlet to the server after the build, using the path specified in the `.env` file under `LIFERAY_DEPLOYMENT_PATH`.

## missing features

While the current implementation is suitable for most use cases, there are a few features from the original implementation that are not yet supported:

- Package deduplication (not planned for implementation)
- System configuration - Gathering interest for implementation ([link](https://github.com/jwanner83/liferay-npm-bundler-improved/issues/55))

<br>

_\* The official bundler is [available on GitHub](https://github.com/liferay/liferay-frontend-projects/tree/master/projects/js-toolkit/packages/npm-bundler)_

_\*\* Timings are based on an Apple M1 MacBook Pro. On Windows, the timing is approximately 0.3s._

_\*\*\* The package deduplication feature is not planned due to its potential impact on bundler speed and the perceived low usage in practice._
