import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/index'
import PortletEntryParams from './types/PortletEntryParams'

/**
 * Main portlet entrypoint for Liferay.
 *
 * @param portletNamespace
 * @param contextPath
 * @param portletElementId
 * @param configuration
 */
export default function main({
  portletNamespace,
  contextPath,
  portletElementId,
  configuration
}: PortletEntryParams): void {
  ReactDOM.render(
    <React.StrictMode>
      <App
        portletNamespace={portletNamespace}
        contextPath={contextPath}
        portletElementId={portletElementId}
        configuration={configuration}
      />
    </React.StrictMode>,
    document.getElementById(portletElementId)
  )
}
