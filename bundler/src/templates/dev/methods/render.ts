type RenderParams = {
  developmentNodeId: string,
  contextPath: string
  portletNamespace: string
  configuration: {
    system: Record<string, never>
    portletInstance: Record<string, never>
  }
}

export function render({ developmentNodeId, portletNamespace, configuration, contextPath }: RenderParams) {
  const main = module.exports

  let initializer = undefined
  if (typeof main === 'function') {
    initializer = main
  } else if (typeof main?.default === 'function') {
    initializer = main.default
  }

  if (initializer) {
    initializer({
      portletElementId: developmentNodeId,
      contextPath,
      portletNamespace,
      configuration
    })
  } else {
    console.error(
      'liferay-npm-bundler-improved: no initializer function found in the main entrypoint.',
      module.exports
    )
  }
}
