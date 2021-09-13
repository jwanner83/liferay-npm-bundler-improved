import React  from 'react'
import ReactDOM from 'react-dom'
import AppComponent from './components/AppComponent'
import LiferayParams from './types/LiferayParams'


export default function main(liferayParams: LiferayParams): void {
  ReactDOM.render(
    <React.StrictMode>
      <AppComponent
          portletNamespace={liferayParams.portletNamespace}
          contextPath={liferayParams.contextPath}
          portletElementId={liferayParams.portletElementId}
          configuration={liferayParams.configuration}
      />
    </React.StrictMode>,
    document.getElementById(liferayParams.portletElementId),
  )
}
