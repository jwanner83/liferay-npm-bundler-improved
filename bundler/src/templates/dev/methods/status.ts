import { ConnectionStatus } from '../enums/ConnectionStatus'

export enum StatusIcons {
  LOADING = 'reload',
  SUCCESS = 'check-circle',
  ERROR = 'exclamation-full'
}

export function getStatusIcon(status: ConnectionStatus) {
  let icon = StatusIcons.LOADING

  switch (status) {
    case ConnectionStatus.CONNECTED:
      icon = StatusIcons.SUCCESS
      break
    case ConnectionStatus.UPDATED:
    case ConnectionStatus.UPDATING:
    case ConnectionStatus.RECONNECTING:
      icon = StatusIcons.LOADING
      break
    case ConnectionStatus.DISCONNECTED:
    case ConnectionStatus.ERROR:
      icon = StatusIcons.ERROR
      break
  }

  return icon
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
    case ConnectionStatus.UPDATING:
      text = 'portlet is updating'
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
