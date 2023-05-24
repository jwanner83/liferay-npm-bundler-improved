import React from 'react'
import { createPortal } from 'react-dom'
import { ConnectionStatus } from '../enums/ConnectionStatus'
import { getStatusColor, getStatusText } from '../methods/status'

type StatusParams = {
  status: ConnectionStatus
}

export default function Status ({ status }: StatusParams) {
  const color = getStatusColor(status)
  const text = getStatusText(status)

  return (
    <>
      {createPortal(
        <div
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
            gap: '12px',
          }}
        >
          <div
            style={{
              height: '20px',
              width: '20px',
              transition: '150ms',
              borderRadius: '10px',
              background: color
            }}
          />

          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span style={{
              fontSize: '10px',
              color: '#7B7B7BFF',
              fontStyle: 'italic',
              width: '175px',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}>
              {`{{name}}-{{version}}`}
            </span>
            <span style={{
              fontSize: '12px',
              textTransform: 'lowercase',
              fontWeight: 'bold',
              width: '175px',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
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
