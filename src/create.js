export function getJavaScript (pack, code) {
  return `Liferay.Loader.define('${pack.name}@${pack.version}/index', ['module', 'exports', 'require'], function (module, exports, require) {
    var define = undefined;
    var global = window;
    {
      ${code}
    }
  });`
}

export function getManifestJSON (pack) {
  return JSON.stringify({
    "packages": {
      "/": {
        "dest": {
          "dir": "./build",
          "id": "/",
          "name": pack.name,
          "version": pack.version
        },
        "src": {
          "dir": ".",
          "id": "/",
          "name": pack.name,
          "version": pack.version
        }
      }
    }
  })
}

export function getManifestMF (pack) {
  return `Manifest-Version: 1.0
Bundle-ManifestVersion: 2
Bundle-Name: ${pack.description}
Bundle-SymbolicName: ${pack.name}
Bundle-Version: ${pack.version}
Provide-Capability: osgi.webresource;osgi.webresource=old;version:Version="1.0.0"
Require-Capability: osgi.extender;filter:="(&(osgi.extender=liferay.frontend.js.portlet)(version>=1.0.0))"
Tool: liferay-npm-bundler-2.25.0
Web-ContextPath: /${pack.name}`
}