import React, { useEffect } from 'react'
import { PortletEntryParams } from '../types/liferay.types'


const Index = ({ portletNamespace, portletElementId, configuration, contextPath }: PortletEntryParams) => {
  // required for portlet to register initializer method
  // @ts-ignore
  window.module = { exports }

  const developmentNodeId = `${portletElementId}development`
  const styleNodeId = `${portletElementId}-style`

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:{{port}}')

    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
    socket.addEventListener('close', onClose)

    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [])

  const onMessage = (event: MessageEvent<string>) => {
    console.log('liferay-npm-bundler-improved: message', event)

    const { script, style } = JSON.parse(event.data)

    const styleNode = document.getElementById(styleNodeId)
    styleNode.innerHTML = `<style>${style}</style>`

    eval(script)

    render()
  }

  const onOpen = () => {
    console.log('liferay-npm-bundler-improved: open')
  }

  const onClose = () => {
    console.log('liferay-npm-bundler-improved: close')
  }

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

  return <div>
    <div id={styleNodeId}></div>
    <div id={developmentNodeId}></div>
  </div>
}

export default Index
