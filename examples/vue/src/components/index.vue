<template>
  <div class="vue">
    <div>
      <span class="tag"> {{ label.portletNamespace }}: </span>
      <span class="value">
        {{ $root.$data.portletNamespace }}
      </span>
    </div>
    <div>
      <span class="tag"> {{ label.contextPath }}: </span>
      <span class="value">
        {{ $root.$data.contextPath }}
      </span>
    </div>
    <div>
      <span class="tag"> {{ label.portletElementId }}: </span>
      <span class="value">
        {{ $root.$data.portletElementId }}
      </span>
    </div>
    <div>
      <span class="tag"> {{ label.configuration }}: </span>
      <span class="value pre">
        {{ JSON.stringify($root.$data.configuration, null, 2) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  data() {
    return {
      label: {
        portletNamespace: String(Liferay.Language.get('portlet-namespace')),
        contextPath: String(Liferay.Language.get('context-path')),
        portletElementId: String(Liferay.Language.get('portlet-element-id')),
        configuration: String(Liferay.Language.get('configuration'))
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.vue {
  .tag {
    font-weight: bold;
    font-family: monospace;
  }

  .value {
    font-family: monospace;
  }
}
</style>
