<template>
  <div>
    <h1>{{ title }}</h1>
    <scene />
  </div>
</template>

<script>
import scene from './scene.vue'

export default {
  components: { scene },
  data () {
    return {
      title: 'Title'
    }
  }
}
</script>
