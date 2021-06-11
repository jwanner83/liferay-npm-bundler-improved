# liferay-npm-bundler-improved
This is a highly experimental and non-official module which uses rollup to bundle javascript and provides it to liferay 
through a jar file.

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
