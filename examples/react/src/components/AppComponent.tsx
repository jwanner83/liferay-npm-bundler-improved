import React from 'react'
import LiferayParams from '../types/LiferayParams'

declare const Liferay: any

const AppComponent = (liferayParams: LiferayParams): any => {
  return (
    <div>
      <div>
        <span className="tag">
          {Liferay.Language.get('portlet-namespace')}
          :
        </span>
        <span className="value">{liferayParams.portletNamespace}</span>
      </div>
      <div>
        <span className="tag">
          {Liferay.Language.get('context-path')}
          :
        </span>
        <span className="value">{liferayParams.contextPath}</span>
      </div>
      <div>
        <span className="tag">
          {Liferay.Language.get('portlet-element-id')}
          :
        </span>
        <span className="value">{liferayParams.portletElementId}</span>
      </div>
      <div>
        <span className="tag">
          {Liferay.Language.get('configuration')}
          :
        </span>
        <span className="value pre">
          {JSON.stringify(liferayParams.configuration, null, 2)}
        </span>
      </div>
    </div>
  )
}

export default AppComponent
