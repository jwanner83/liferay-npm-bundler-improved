import React from 'react'
import { render } from '../methods/render'
import { PortletEntryParams } from '../types/liferay.types'
import { ConnectionStatus } from '../enums/ConnectionStatus'
import { ErrorPayload } from '../types/portlet.types'

interface useSocketParams extends PortletEntryParams {
  developmentNodeId: string,
  styleNodeId: string
}

export function useSocket ({ portletElementId, portletNamespace, configuration, contextPath, developmentNodeId, styleNodeId }: useSocketParams) {
  const [status, setStatus] = React.useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED)
  const [error, setError] = React.useState<ErrorPayload | undefined>(undefined)

  React.useEffect(() => {
    connect()
  }, [])

  const connect = (active?: boolean) => {
    if (active) {
      setStatus(ConnectionStatus.RECONNECTING)
    }

    const socket = new WebSocket('ws://localhost:{{port}}')

    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
    socket.addEventListener('close', onClose)
  }

  const onMessage = (event: MessageEvent<string>) => {
    console.log('liferay-npm-bundler-improved: message', event)
    setStatus(ConnectionStatus.UPDATING)
    const payload = JSON.parse(event.data)

    if (payload.error) {
      console.error('liferay-npm-bundler-improved: error', payload.error)
      setStatus(ConnectionStatus.ERROR)

      const message = payload.error.message.replace(payload.error.location + ': ', '').split('\n')[0]
      const stack = payload.error.message.split('\n\n').slice(1).join('\n\n')

      setError({
        message: message,
        stack: stack,
        location: payload.error.location
      })
      return
    } else {
      resetError()
    }

    localStorage.setItem('liferay-npm-bundler-improved:payload:{{name}}', JSON.stringify(payload))

    performRender(payload)

    setStatus(ConnectionStatus.UPDATED)

    setTimeout(() => {
      setStatus(ConnectionStatus.CONNECTED)
    }, 2500)
  }

  const onOpen = () => {
    console.log('liferay-npm-bundler-improved: open')
    setStatus(ConnectionStatus.CONNECTED)
  }

  const onClose = () => {
    console.log('liferay-npm-bundler-improved: close')
    setStatus(ConnectionStatus.DISCONNECTED)

    setTimeout(() => {
      console.log('liferay-npm-bundler-improved: reconnecting')
      setStatus(ConnectionStatus.RECONNECTING)
      connect()
    }, 3000)

    const oldPayload = localStorage.getItem('liferay-npm-bundler-improved:payload:{{name}}')
    if (oldPayload) {
      performRender(JSON.parse(oldPayload))
    }
  }

  const performRender = (payload: { script: string, style: string }) => {
    const styleNode = document.getElementById(styleNodeId)
    styleNode.innerHTML = `<style>${payload.style}</style>`

    eval(payload.script)

    render({
      developmentNodeId,
      configuration,
      contextPath,
      portletNamespace
    })
  }

  const resetError = () => {
    setError(undefined)
  }

  return {
    connect,
    error,
    resetError,
    status
  }
}
