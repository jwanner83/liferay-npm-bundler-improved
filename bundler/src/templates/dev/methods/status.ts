import { ConnectionStatus } from '../enums/ConnectionStatus'

export function getStatusColor (status: ConnectionStatus) {
  let color = '#a8a8a8'

  switch (status) {
    case ConnectionStatus.CONNECTED:
      color = '#65bb7f'
      break
    case ConnectionStatus.UPDATED:
      color = '#97c3e3'
      break
    case ConnectionStatus.DISCONNECTED:
    case ConnectionStatus.RECONNECTING:
    case ConnectionStatus.ERROR:
      color = '#f16268'
      break
  }

  return color
}

export function getStatusText (status: ConnectionStatus) {
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
