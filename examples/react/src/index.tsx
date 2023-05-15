import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
  const container = document.getElementById(portletElementId)
  const root = createRoot(container)

  root.render(
    <StrictMode>
      <App
        portletNamespace={portletNamespace}
        contextPath={contextPath}
        portletElementId={portletElementId}
        configuration={configuration}
      />
    </StrictMode>
  )

  const socket = new WebSocket('ws://localhost:3012')

  socket.addEventListener('open', () => {
    console.log('open')
  })

  socket.addEventListener('message', (event ) => {
    console.log('message', event)
  })
}
