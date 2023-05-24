import React, { useEffect, useState } from 'react'
import { ConnectionStatus } from '../enums/ConnectionStatus'
import { render } from '../methods/render'
import { PortletEntryParams } from '../types/liferay.types'
import GlobalStatus from './GlobalStatus'
import PortletStatus from './PortletStatus'

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
  const [error, setError] = useState<{ message: string; location: string }>(undefined)
  let first = true

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
    if (!first) {
      setStatus(ConnectionStatus.UPDATING)
    }

    const payload = JSON.parse(event.data)

    if (payload.error) {
      console.log(payload)
      setError(payload.error)
      setStatus(ConnectionStatus.ERROR)
      return
    } else {
      setError(undefined)
    }

    const { script, style } = payload

    const styleNode = document.getElementById(styleNodeId)
    styleNode.innerHTML = `<style>${style}</style>`

    eval(script)

    render({
      developmentNodeId,
      configuration,
      contextPath,
      portletNamespace
    })

    if (!first) {
      setStatus(ConnectionStatus.UPDATED)
    }

    setTimeout(() => {
      setStatus(ConnectionStatus.CONNECTED)
    }, 1500)

    first = false
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
    }, 2000)

    setTimeout(() => {
      connect()
    }, 3000)
  }

  return (
    <>
      <div id={styleNodeId}></div>
      <div id={developmentNodeId}></div>

      <GlobalStatus status={status} />
      {error && <PortletStatus message={error.message} location={error.location} onClose={() => setError(undefined)} />}
    </>
  )
}
