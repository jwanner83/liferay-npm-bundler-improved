import { ConnectionStatus } from '../enums/ConnectionStatus'

export enum StatusColors {
  GREEN = '#00dc38',
  BLUE = '#0066ff',
  RED = '#f32028',
  GRAY = '#a8a8a8'
}

export function getStatusColor(status: ConnectionStatus) {
  let color = StatusColors.GRAY

  switch (status) {
    case ConnectionStatus.CONNECTED:
      color = StatusColors.GREEN
      break
    case ConnectionStatus.UPDATED:
      color = StatusColors.BLUE
      break
    case ConnectionStatus.DISCONNECTED:
    case ConnectionStatus.RECONNECTING:
    case ConnectionStatus.ERROR:
      color = StatusColors.RED
      break
  }

  return color
}

export function getStatusText(status: ConnectionStatus) {
  let text = 'watch mode connecting'

  switch (status) {
    case ConnectionStatus.CONNECTED:
      text = 'watch mode connected'
      break
    case ConnectionStatus.UPDATED:
      text = 'portlet has been updated'
      break
    case ConnectionStatus.DISCONNECTED:
      text = 'watch mode not connected'
      break
    case ConnectionStatus.RECONNECTING:
      text = 'trying to reconnect'
      break
    case ConnectionStatus.ERROR:
      text = 'error in application'
      break
  }

  return text
}

export function getIsActive(status: ConnectionStatus) {
  return (
    status === ConnectionStatus.UPDATED ||
    status === ConnectionStatus.DISCONNECTED ||
    status === ConnectionStatus.RECONNECTING ||
    status === ConnectionStatus.ERROR ||
    status === ConnectionStatus.CONNECTED
  )
}

export function getShouldDisappear(status: ConnectionStatus) {
  return (
    status === ConnectionStatus.UPDATED ||
    status === ConnectionStatus.CONNECTED ||
    ConnectionStatus.ERROR
  )
}
