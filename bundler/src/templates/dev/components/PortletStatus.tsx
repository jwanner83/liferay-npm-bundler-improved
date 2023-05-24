import Convert from 'ansi-to-html'
import { createPortal } from 'react-dom'
import React from 'react'

const convert = new Convert({
  newline: true
})

type StatusParams = {
  message: string
  location: string
  onClose: () => void
}

export default function PortletStatus({ message, location, onClose }: StatusParams) {
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
              maxHeight: '350px',
              maxWidth: '80vw',
              width: '700px',
              transition: '150ms',
              border: '2px solid #f16268',
              borderRadius: '3px',
              backgroundColor: 'rgba(210, 112, 116, 0.31)',
              padding: '20px',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                padding: '15px',
                cursor: 'pointer'
              }}
              onClick={() => onClose()}
            >
              <svg
                style={{
                  height: '25px'
                }}
                clipRule="evenodd"
                fillRule="evenodd"
                strokeLinejoin="round"
                strokeMiterlimit="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
              </svg>
            </div>
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
