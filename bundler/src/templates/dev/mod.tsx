import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/index'
import { PortletEntryParams } from './types/liferay.types'

export default function main({
  portletNamespace,
  contextPath,
  portletElementId,
  configuration
}: PortletEntryParams): void {
  const container = document.getElementById(portletElementId)
  const root = createRoot(container)

  // required for portlet to register initializer method
  // @ts-ignore
  window.module = { exports }

  root.render(
    <React.StrictMode>
      <App
        portletNamespace={portletNamespace}
        contextPath={contextPath}
        portletElementId={portletElementId}
        configuration={configuration}
      />
    </React.StrictMode>
  )
}
