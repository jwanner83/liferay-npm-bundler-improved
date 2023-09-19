import React from 'react'
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
  const developmentNodeId = `${portletElementId}development`
  const styleNodeId = `${portletElementId}style`

  const { status, error, resetError, connect } = useSocket({
    portletNamespace,
    portletElementId,
    configuration,
    contextPath,
    developmentNodeId,
    styleNodeId
  })

  return (
    <React.Fragment>
      <div id={styleNodeId}></div>
      <div id={developmentNodeId}></div>

      <StatusOverlay status={status} connect={() => connect(true)} />

      {error && (
        <ErrorOverlay error={error} close={resetError} />
      )}
    </React.Fragment>
  )
}
