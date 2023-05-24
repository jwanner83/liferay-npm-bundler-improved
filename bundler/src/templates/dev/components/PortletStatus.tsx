import Convert from 'ansi-to-html'
import React from 'react'
import { createPortal } from 'react-dom'

const convert = new Convert({
  newline: true
})

type StatusParams = {
  message: string
  location: string
}

export default function PortletStatus({ message, location }: StatusParams) {
  return (
    <>
      {createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)'
          }}
        >
          <div
            style={{
              height: '300px',
              width: '500px',
              transition: '150ms',
              border: '2px solid #f16268',
              borderRadius: '3px',
              backgroundColor: 'rgba(210, 112, 116, 0.31)',
              padding: '20px',
              overflow: 'auto'
            }}
          >
            <h3
              style={{
                marginBottom: '15px'
              }}
            >
              error in the {'{{name}}'} portlet
            </h3>
            <p>There appears to be an error inside your code. Please check the stacktrace below.</p>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
            >
              {location}
            </p>
            <pre
              style={{
                margin: 0,
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
              dangerouslySetInnerHTML={{ __html: convert.toHtml(message) }}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
