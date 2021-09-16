import React  from 'react'
import ReactDOM from 'react-dom'
import Index from './components'
import LiferayParams from './types/LiferayParams'

/**
 * This is the main entry point of the portlet.
 *
 * See https://tinyurl.com/js-ext-portlet-entry-point for the most recent
 * information on the signature of this function.
 *
 * @return {void}
 * @param liferayParams
 */
export default function main(liferayParams: LiferayParams): void {
  ReactDOM.render(
    <React.StrictMode>
      <Index
          portletNamespace={liferayParams.portletNamespace}
          contextPath={liferayParams.contextPath}
          portletElementId={liferayParams.portletElementId}
          configuration={liferayParams.configuration}
      />
    </React.StrictMode>,
    document.getElementById(liferayParams.portletElementId),
  )
}
