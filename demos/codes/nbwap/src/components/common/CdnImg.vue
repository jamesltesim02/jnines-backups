<template>
  <img :src="imgData" />
</template>
<script>
const staticUrl = window.NBConfig.URL_STATIC
export default {
  props: ['src'],
  data () {
    return {
      staticUrl: staticUrl
    }
  },
  computed: {
    imgData () {
      if (this.src.indexOf('data:image/') === 0) {
        return this.src
      }
      return this.staticUrl + this.src
    }
  }
}
</script>
