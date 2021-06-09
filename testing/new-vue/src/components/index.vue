<template>
  <div>
    <h1>{{ title }}</h1>
    <jonas />
  </div>
</template>

<script>
import jonas from './jonas.vue'

export default {
  components: { jonas },
  data () {
    return {
      title: 'helloo'
    }
  }
}
</script>
