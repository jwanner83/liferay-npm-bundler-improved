import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ConnectionStatus } from '../enums/ConnectionStatus'
import { getIsActive, getShouldDisappear, getStatusColor, getStatusText } from '../methods/status'

type StatusParams = {
  status: ConnectionStatus
}

export default function GlobalStatus ({ status }: StatusParams) {
  const color = getStatusColor(status)
  const text = getStatusText(status)

  const [active, setActive] = useState(getIsActive(status))

  useEffect(() => {
    setActive(getIsActive(status))

    if (active && getShouldDisappear(status)) {
      setTimeout(() => {
        setActive(false)
      }, 3000)
    }
  }, [status])

  return (
    <>
      {createPortal(
        <div
          className={`lnbi-global-status ${active ? 'active' : ''}`}
          style={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            margin: '30px',
            padding: '10px 13px',
            borderRadius: '3px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 10px 10px'
          }}
        >
          <div
            style={{
              height: '20px',
              width: '20px',
              transition: '150ms',
              borderRadius: '10px',
              background: color,
              margin: '0 4px'
            }}
          />

          <div className="lnbi-global-status-text" style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span style={{
              fontSize: '10px',
              color: '#7B7B7BFF',
              fontStyle: 'italic',
              width: '175px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              paddingLeft: '10px'
            }}>
              {`{{name}}-{{version}}`}
            </span>
            <span style={{
              fontSize: '12px',
              textTransform: 'lowercase',
              fontWeight: 'bold',
              width: '175px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              paddingLeft: '10px'
            }}>
              {text}
            </span>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
