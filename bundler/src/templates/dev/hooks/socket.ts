import React from 'react'
import { render } from '../methods/render'
import { PortletEntryParams } from '../types/liferay.types'
import { ConnectionStatus } from '../enums/ConnectionStatus'
import { ErrorPayload } from '../types/portlet.types'

interface useSocketParams extends PortletEntryParams {
  developmentNodeId: string,
  developmentContainerNodeId: string,
  styleNodeId: string
}

export function useSocket ({ portletElementId, portletNamespace, configuration, contextPath, developmentNodeId, developmentContainerNodeId, styleNodeId }: useSocketParams) {
  const [status, setStatus] = React.useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED)
  const [error, setError] = React.useState<ErrorPayload | undefined>(undefined)

  React.useEffect(() => {
    connect()
  }, [])

  const connect = () => {
    setStatus(ConnectionStatus.RECONNECTING)

    const socket = new WebSocket('ws://localhost:{{port}}')
    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
    socket.addEventListener('close', onClose)

    setTimeout(() => {
      if (socket.OPEN) {
        return
      }
      connect()
    }, 2000)
  }

  const onMessage = (event: MessageEvent<string>) => {
    const payload = JSON.parse(event.data)

    if (payload.name !== '{{name}}@{{version}}') {
      console.info('liferay-npm-bundler-improved:info', '{{name}}@{{version}} is not the current package. ignoring payload.')
      return
    }

    if (payload.error) {
      setStatus(ConnectionStatus.ERROR)

      const message = payload.error.message.replace(payload.error.location + ': ', '').split('\n')[0]
      const stack = payload.error.message.split('\n\n').slice(1).join('\n\n')

      setError({
        message: message,
        stack: stack,
        location: payload.error.location
      })

      console.info('liferay-npm-bundler-improved:error', {
        message: message,
        stack: stack,
        location: payload.error.location
      })

      return
    } else {
      resetError()
    }

    if (payload.updating) {
      setStatus(ConnectionStatus.UPDATING)
      return
    }

    performRender(payload)

    setStatus(ConnectionStatus.UPDATED)

    setTimeout(() => {
      setStatus(ConnectionStatus.CONNECTED)
    }, 2500)
  }

  const onOpen = () => {
    setStatus(ConnectionStatus.CONNECTED)
  }

  const onClose = () => {
    setStatus(ConnectionStatus.DISCONNECTED)

    setTimeout(() => {
      setStatus(ConnectionStatus.RECONNECTING)
      connect()
    }, 2000)
  }

  const performRender = (payload: { script: string, style: string }) => {
    const styleNode = document.getElementById(styleNodeId)
    styleNode.innerHTML = `<style>${payload.style}</style>`

    const developmentContainerNode = document.getElementById(developmentContainerNodeId)
    developmentContainerNode.innerHTML = `
      <div id="${developmentNodeId}"></div>
    `

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
