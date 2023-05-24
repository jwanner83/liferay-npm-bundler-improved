import { useEffect } from 'react'
import { PortletEntryParams } from '../types/liferay.types'
import { render } from '../methods/render'

const Index = ({
  portletNamespace,
  portletElementId,
  configuration,
  contextPath
}: PortletEntryParams) => {
  // required for portlet to register initializer method
  // @ts-ignore
  window.module = { exports }

  const developmentNodeId = `${portletElementId}development`
  const styleNodeId = `${portletElementId}style`

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

    render({
      developmentNodeId,
      configuration,
      contextPath,
      portletNamespace
    })
  }

  const onOpen = () => {
    console.log('liferay-npm-bundler-improved: open')
  }

  const onClose = () => {
    console.log('liferay-npm-bundler-improved: close')
  }

  return (
    <div>
      <div id={styleNodeId}></div>
      <div id={developmentNodeId}></div>
    </div>
  )
}

export default Index
