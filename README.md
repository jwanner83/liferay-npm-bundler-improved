# liferay-npm-bundler-improved
This is a highly experimental and non-official module which uses rollup to bundle javascript and provides it through a 
jar file to liferay.

### How to use
To use the bundler, you have to install it via npm or yarn `npm i --save-dev liferay-npm-bundler-improved` and create a
script tag in the `package.json` like so: `"build": "liferay-npm-bundler-improved"`.

The `package.json` has to contain the following properties:

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
  },
  "main": "index.js"
}
```

### Where is the official bundler?
- [github](https://github.com/liferay/liferay-frontend-projects/tree/master/projects/js-toolkit/packages/npm-bundler)
- [npm - @liferay/npm-bundler - v3](https://www.npmjs.com/package/@liferay/npm-bundler)
- [npm - liferay-npm-bundler - v2](https://www.npmjs.com/package/liferay-npm-bundler)

Version 3 of the official liferay npm bundler uses webpack to bundle the code which would be very good but unfortunately 
it [isn't officially released yet](https://github.com/liferay/liferay-frontend-projects/issues/570).