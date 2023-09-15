import { PortletEntryParams } from '@/types/liferay.types'
import Title from './Title'

const App = (params: PortletEntryParams): any => {
  return (
    <div>
      <Title />
      <div className="mb-2">
        <span className="font-mono font-bold">{String(Liferay.Language.get('portlet-namespace'))}:</span>
        <span className="font-mono"> {params.portletNamespace}</span>
      </div>
      <div className="mb-2">
        <span className="font-mono font-bold">{String(Liferay.Language.get('context-path'))}:</span>
        <span className="font-mono"> {params.contextPath}</span>
      </div>
      <div className="mb-2">
        <span className="font-mono font-bold">{String(Liferay.Language.get('portlet-element-id'))}:</span>
        <span className="font-mono"> {params.portletElementId}</span>
      </div>
      <div className="mb-2">
        <span className="font-mono font-bold">{String(Liferay.Language.get('configuration'))}:</span>
        <span className="font-mono block"><pre>{JSON.stringify(params.configuration, null, 2)}</pre></span>
      </div>
    </div>
  )
}

export default App
