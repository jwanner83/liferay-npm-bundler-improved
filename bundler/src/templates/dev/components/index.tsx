import React from 'react'
import { ConnectionStatus } from '../enums/ConnectionStatus'
import { useSocket } from '../hooks/socket'
import { PortletEntryParams } from '../types/liferay.types'
import ErrorOverlay from './ErrorOverlay'
import StatusOverlay from './StatusOverlay'

export default function App({
  portletNamespace,
  portletElementId,
  configuration,
  contextPath
}: PortletEntryParams) {
  const developmentContainerNodeId = `${portletElementId}development-container`
  const developmentNodeId = `${portletElementId}development`
  const styleNodeId = `${portletElementId}style`

  const { status, error, resetError } = useSocket({
    portletNamespace,
    portletElementId,
    configuration,
    contextPath,
    developmentNodeId,
    developmentContainerNodeId,
    styleNodeId
  })

  return (
    <React.Fragment>
      <div id={styleNodeId}></div>
      <div id={developmentContainerNodeId} style={status === ConnectionStatus.UPDATING ? {
        opacity: 0.5,
        transition: '150ms'
      } : {
        transition: '150ms'
      }}>
        <div id={developmentNodeId}></div>
      </div>

      <StatusOverlay status={status} />

      {error && <ErrorOverlay error={error} close={resetError} />}
    </React.Fragment>
  )
}
