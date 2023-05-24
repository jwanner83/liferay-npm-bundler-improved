import React, { useEffect, useState } from 'react'
import { ConnectionStatus } from '../enums/ConnectionStatus'
import { render } from '../methods/render'
import { PortletEntryParams } from '../types/liferay.types'
import Status from './Status'

export default function App({
  portletNamespace,
  portletElementId,
  configuration,
  contextPath
}: PortletEntryParams) {
  // required for portlet to register initializer method
  // @ts-ignore
  window.module = { exports }

  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED)

  const developmentNodeId = `${portletElementId}development`
  const styleNodeId = `${portletElementId}style`

  useEffect(() => {
    connect()
  }, [])

  const connect = () => {
    const socket = new WebSocket('ws://localhost:{{port}}')

    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
    socket.addEventListener('close', onClose)
  }

  const onMessage = (event: MessageEvent<string>) => {
    console.log('liferay-npm-bundler-improved: message', event)
    setStatus(ConnectionStatus.UPDATING)

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

    setStatus(ConnectionStatus.UPDATED)

    setTimeout(() => {
      setStatus(ConnectionStatus.CONNECTED)
    }, 1500)
  }

  const onOpen = () => {
    setStatus(ConnectionStatus.CONNECTED)
    console.log('liferay-npm-bundler-improved: open')
  }

  const onClose = () => {
    setStatus(ConnectionStatus.DISCONNECTED)
    console.log('liferay-npm-bundler-improved: close')

    setTimeout(() => {
      setStatus(ConnectionStatus.RECONNECTING)
    }, 3000)

    setTimeout(() => {
      connect()
    }, 5000)
  }

  return (
    <div>
      <div id={styleNodeId}></div>
      <div id={developmentNodeId}></div>

      <Status status={status} />
    </div>
  )
}
