Liferay.Loader.define('{{name}}@{{version}}/{{main}}', ['module', 'exports', 'require'], function (module, exports, require) {
  function main({ portletElementId, contextPath, portletNamespace, configuration }) {
    window.module = { exports: undefined }

    const node = document.getElementById(portletElementId)

    const developmentNodeId = `${portletElementId}development`
    const styleNodeId = `${portletElementId}-style`

    const socket = new WebSocket('ws://localhost:{{port}}')

    socket.addEventListener('open', function (event) {
      console.log('liferay-npm-bundler-improved: connected to server')
      Liferay.Util.openToast({
        title: 'liferay-npm-bundler-improved',
        message: 'connected to server on port {{port}}',
        type: 'success'
      })
    })

    socket.addEventListener('close', function (event) {
      console.log('liferay-npm-bundler-improved: disconnected from server')
      Liferay.Util.openToast({
        title: 'liferay-npm-bundler-improved',
        message: 'connection to server lost on port {{port}}. reload page to try again',
        type: 'danger'
      })
    })

    socket.addEventListener('message', function (event) {
      console.log('liferay-npm-bundler-improved: update from server')
      Liferay.Util.openToast({
        title: 'liferay-npm-bundler-improved',
        message: 'new version of portlet {{name}}@{{version}} available',
        type: 'info'
      })
      const { script, style } = JSON.parse(event.data)

      const styleNode = document.getElementById(styleNodeId)
      styleNode.innerHTML = `<style>${style}</style>`

      eval(script)

      const render = () => {
        const main = module.exports

        let initializer = undefined
        if (typeof main === 'function') {
          initializer = main
        } else if (typeof main?.default === 'function') {
          initializer = main.default
        }

        if (initializer) {
          initializer({
            portletElementId: developmentNodeId,
            contextPath,
            portletNamespace,
            configuration,
          })
        } else {
          console.error('liferay-npm-bundler-improved: no initializer function found in the main entrypoint.', module.exports)
        }
      }

      render()
    })

    node.innerHTML = `
    <div id='${styleNodeId}'></div>
    <div id='${developmentNodeId}'></div>
  `
  }

  module.exports = main
});

