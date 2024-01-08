export interface PortletEntryParams {
  portletElementId: string
  contextPath: string
  portletNamespace: string
  configuration: {
    system: Record<string, never>
    portletInstance: Record<string, never>
  }
}
