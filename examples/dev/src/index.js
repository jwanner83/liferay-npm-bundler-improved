/**
 * Main portlet entrypoint for Liferay.
 *
 * @param params
 */
function main({ portletElementId, contextPath, portletNamespace, configuration }) {
  window.module = { exports: undefined }

  const node = document.getElementById(portletElementId)

  const developmentNodeId = `${portletElementId}development`
  const scriptNodeId = `${portletElementId}-script`
  const styleNodeId = `${portletElementId}-style`

  const socket = new WebSocket('ws://localhost:3002')
  socket.addEventListener('open', function (event) {
    console.log('liferay-npm-bundler-improved: connected to server')
  })

  socket.addEventListener('close', function (event) {
    console.log('liferay-npm-bundler-improved: disconnected from server')
  })

  socket.addEventListener('message', function (event) {
    console.log('liferay-npm-bundler-improved: message from server ', event.data)

    const scriptNode = document.getElementById(scriptNodeId)
    const styleNode = document.getElementById(styleNodeId)

    const { script, style, method } = JSON.parse(event.data)
    styleNode.innerHTML = `<style>${style}</style>`

    eval(script)

    const render = () => {
      const main = module.exports

      console.log('liferay-npm-bundler-improved: main', main)

      let initializer = undefined
      if (typeof main === 'function') {
        initializer = main
      } else if (typeof main?.default === 'function') {
        initializer = main.default
      }

      console.log('liferay-npm-bundler-improved: params', {
        portletElementId: developmentNodeId,
        contextPath,
        portletNamespace,
        configuration
      })

      if (initializer) {
        initializer({
          portletElementId: developmentNodeId,
          contextPath,
          portletNamespace,
          configuration,
        })
      } else {
        console.error('liferay-npm-bundler-improved: no initializer function found in the main entrypoint.')
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
