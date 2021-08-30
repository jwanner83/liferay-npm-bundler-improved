import Vue from 'vue'
import App from './components/index.vue'

export default function main ({ portletNamespace, contextPath, portletElementId, configuration }) {
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
        render: h => h(App)
    })
}