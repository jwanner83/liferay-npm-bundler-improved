<template>
  <div>
    <div>
      <div>
        <span class="tag">
          portlet-namespace:
        </span>
        <span class="value">
          {{ $root.$data.portletNamespace }}
        </span>
      </div>
      <div>
        <span class="tag">
          context-path:
        </span>
        <span class="value">
          {{ $root.$data.contextPath }}
        </span>
      </div>
      <div>
        <span class="tag">
          portlet-element-id:
        </span>
        <span class="value">
          {{ $root.$data.portletElementId }}
        </span>
      </div>
      <div>
        <span class="tag">
          configuration:
        </span>
        <span class="value pre">
          {{ JSON.stringify($root.$data.configuration, null, 2) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App'
})
</script>
