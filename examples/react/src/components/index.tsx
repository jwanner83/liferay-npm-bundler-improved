import React from 'react'
import LiferayParams from '../types/LiferayParams'

const App = (liferayParams: LiferayParams): any => {
  return (
    <div>
      <div>
        <span className="tag">
          portlet-namespace:
        </span>
        <span className="value">
            {liferayParams.portletNamespace}
        </span>
      </div>
      <div>
        <span className="tag">
          context-path:
        </span>
        <span className="value">
            {liferayParams.contextPath}
        </span>
      </div>
      <div>
        <span className="tag">
          portlet-element-id:
        </span>
        <span className="value">
            {liferayParams.portletElementId}
        </span>
      </div>
      <div>
        <span className="tag">
          configuration:
        </span>
        <span className="value pre">
          {JSON.stringify(liferayParams.configuration, null, 2)}
        </span>
      </div>
    </div>
  )
}

export default App
