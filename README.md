# liferay-npm-bundler-improved
A highly experimental and non-official module which uses rollup to bundle javascript and provides it to liferay 
through a jar file.

## Disclaimer
In this state, the `liferay-npm-bundler-improved` isn't intended to be used as a replacement of the original 
liferay-npm-bundler. It is currently lacking features like the support for Portlet configurations, localization or 
package deduplication which are essential.

### Reason for existence
Although some essential features are missing, it can be really useful for development because of one thing: speed. In
comparison to the default liferay-npm-bundler it is up to **14 times faster** while bundling vue / react / vanilla js
portlets.

If you want to develop a portlet, and you are not able to use a life-reload module like 
(lfr-js-start)[https://github.com/faragos/lfr-js-portlet-utils] because you need to be able to use the portlet like a 
normal one, you can just use the liferay-npm-bundler-improved to do so. For production although, it is highly advised 
to use the official liferay-npm-bundler.

### Missing Features:
- Package Deduplication
- Portlet Configuration Support
- Portlet Translation Support

### Usage
#### 1. Install via npm
To use the bundler, you have to install it via npm or yarn `npm i --save-dev liferay-npm-bundler-improved` and create a
script tag in the `package.json` like so: `"build": "liferay-npm-bundler-improved"`.

#### 2. Set package.json properties
The `package.json` has to contain the following properties. These are exactly the same as you would have to set if you 
use the official bundler. Because of that, the migration should be very easy.
```json
{
  "name": "portlet-name",
  "description": "Portlet Name",
  "version": "1.0.0",
  "portlet": {
    "com.liferay.portlet.display-category": "category.sample",
    "com.liferay.portlet.instanceable": true,
    "javax.portlet.name": "portlet-name",
    "javax.portlet.security-role-ref": "power-user,user",
    "javax.portlet.display-name": "Portlet Name"
  }
}
```

#### 3. Add rollup.config.js
If you use a framework in your portlet, you'll need a custom rollup.config.js file. See the 
[rollup docs](https://rollupjs.org/guide/en/) for more information on how to use this file.

In the following code block you see the minimal required and highly advised configuration which can be extended to fit 
the custom needs.
```js
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  plugins: [
    ...
    terser()
  ],
  output: [
    {
      file: 'dist/index.js',
      exports: 'default',
      format: 'cjs'
    }
  ]
}
```

#### 4. Enable deployment
The bundler also supports the functionality to move the created jar file to a specified directory automatically. To 
enable it, you have to add a `-d` or `-deploy` after the call of the bundler: 
``"deploy": "liferay-npm-bundler-improved -d"``

The path can be specified either in a `.npmbuildrc` file the same way the official liferay npm bundler needs it: 
```json
{
	"liferayDir": "/path/to/liferay/root"
}
``` 

or through the parameter in the call of the bundler:
``"deploy": "liferay-npm-bundler-improved -d /path/to/liferay/root/deploy"``

(the `.npmbuildrc` only needs the root of the liferay directory and adds a `/deploy` automatically. If you specify the 
path with the parameter, you need to specify the `deploy` folder specifically.)

### Additional Information
> Where is the official bundler?
> - [github](https://github.com/liferay/liferay-frontend-projects/tree/master/projects/js-toolkit/packages/npm-bundler)
> - [npm - liferay-npm-bundler - v2](https://www.npmjs.com/package/liferay-npm-bundler)
> - [npm - @liferay/npm-bundler - v3](https://www.npmjs.com/package/@liferay/npm-bundler)
>
> Version 3 of the official liferay npm bundler uses webpack to bundle the code which would be very good but unfortunately
> it [isn't officially released yet](https://github.com/liferay/liferay-frontend-projects/issues/570).
