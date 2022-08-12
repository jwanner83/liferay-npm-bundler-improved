import Vue, { CreateElement } from 'vue'
import App from './components/index.vue'
import PortletEntryParams from './types/PortletEntryParams'

/**
 * Main portlet entrypoint for Liferay.
 *
 * @param portletNamespace
 * @param contextPath
 * @param portletElementId
 * @param configuration
 */
export default function main ({ portletNamespace, contextPath, portletElementId, configuration }: PortletEntryParams) {
    new Vue({
        el: `#${portletElementId}`,
        data: {
            portletNamespace,
            contextPath,
            portletElementId,
            configuration
        },
        components: {
            App
        },
        render: (h: CreateElement) => {
            return h(App)
        }
    })
}
