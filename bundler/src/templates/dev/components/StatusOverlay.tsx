import { ConnectionStatus } from '../enums/ConnectionStatus'
import { getStatusIcon, getStatusText } from '../methods/status'
import React from 'react'
import { createPortal } from 'react-dom'

type StatusOverlayParams = {
  status: ConnectionStatus
}

export default function StatusOverlay({ status }: StatusOverlayParams) {
  const [container, setContainer] = React.useState<Element | null>(null)
  const [element, setElement] = React.useState<Element | null>(null)

  React.useEffect(() => {
    const ul = document.querySelector('.user-control-group > .control-menu-nav')

    if (ul) {
      setContainer(ul)
      const li = document.createElement('li')
      li.className = 'control-menu-nav-item'
      ul.prepend(li)
      setElement(li)
    } else {
      setElement(document.body)
    }

    return () => {
      if (container) {
        element.remove()
        setElement(null)
      }
    }
  }, [])

  if (!element) {
    return <React.Fragment />
  } else {
    return createPortal(
      <div
        className="control-menu-nav-item"
        style={{
          marginRight: '20px'
        }}
      >
        <div
          className="control-menu-icon lfr-icon-item taglib-icon"
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <svg
            aria-hidden="true"
            className="lexicon-icon"
            focusable="false"
            style={
              status === ConnectionStatus.RECONNECTING || status === ConnectionStatus.UPDATED || status === ConnectionStatus.UPDATING ? {
                animation: 'loading-animation-circle 2500ms'
              } : {}
            }
          >
            <use href={`/o/classic-theme/images/clay/icons.svg#${getStatusIcon(status)}`}></use>
          </svg>
          <div
            style={{
              textAlign: 'left',
              width: '150px'
            }}
          >
            <h4
              style={{
                fontSize: '10px',
                margin: '0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >{`{{name}}@{{version}}`}</h4>
            <p
              style={{
                fontSize: '10px',
                margin: '0',
                lineHeight: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {getStatusText(status)}
            </p>
          </div>
        </div>
      </div>,
      element
    )
  }
}
