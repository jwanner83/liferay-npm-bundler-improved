import { PortletEntryParams } from '../types/liferay.types'
import Sub from './Sub'

const App = (params: PortletEntryParams): any => {
  return (
    <div className="react">
      <Sub />
      <div>
        <span className="tag">{String(Liferay.Language.get('portlet-namespace'))}:</span>
        <span className="value"> {params.portletNamespace}</span>
      </div>
      <div>
        <span className="tag">{String(Liferay.Language.get('context-path'))}:</span>
        <span className="value"> {params.contextPath}</span>
      </div>
      <div>
        <span className="tag">{String(Liferay.Language.get('portlet-element-id'))}:</span>
        <span className="value"> {params.portletElementId}</span>
      </div>
      <div>
        <span className="tag">{String(Liferay.Language.get('configuration'))}:</span>
        <span className="value pre"> {JSON.stringify(params.configuration, null, 2)}</span>
      </div>
    </div>
  )
}

export default App
