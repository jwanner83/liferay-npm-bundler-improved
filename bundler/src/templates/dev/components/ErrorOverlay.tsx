import Convert from 'ansi-to-html'
import React from 'react'
import { ErrorPayload } from '../types/portlet.types'

const convert = new Convert({
  newline: true
})

type ErrorOverlayParams = {
  error: ErrorPayload
  close: () => void
}

export default function ErrorOverlay({ error, close }: ErrorOverlayParams) {
  return (
    <React.Fragment>
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
            maxHeight: '500px',
            maxWidth: '80vw',
            width: '700px',
            transition: '150ms',
            border: '2px solid #f16268',
            borderRadius: '10px',
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
              padding: '26px',
              cursor: 'pointer'
            }}
            onClick={() => close()}
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
              marginBottom: '12px',
              marginTop: '6px',
              fontSize: '20px',
              fontWeight: 'bold',
              fontFamily: 'monospace'
            }}
          >
            error in the {'{{name}}'} portlet
          </h3>
          <p
            style={{
              fontFamily: 'monospace',
              marginBottom: '18px'
            }}
          >
            there appears to be an error inside the {error.location.split('/').pop()} file.
          </p>

          <div
            style={{
              padding: '20px',
              background: '#7d7d7d21',
              borderRadius: '10px'
            }}
          >
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '6px'
              }}
            >
              location
            </p>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                marginBottom: '16px'
              }}
            >
              {error.location}
            </p>

            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '6px'
              }}
            >
              message
            </p>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                marginBottom: '16px'
              }}
            >
              {error.message}
            </p>

            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '6px'
              }}
            >
              stack
            </p>
            <pre
              style={{
                margin: 0,
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
              dangerouslySetInnerHTML={{ __html: convert.toHtml(error.stack) }}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
