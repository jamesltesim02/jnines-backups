<template>
  <img :src="url" />
</template>
<script>
const resourceUrl = window.NBConfig.RESOURCE_URL;
const staticUrl = window.NBConfig.STATIC_URL;

export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    local: {
      type: Boolean,
      default: false,
    },
    remote: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    url() {
      if (/^https?:\/\//i.test(this.src)) {
        return this.src;
      }

      if (this.src.indexOf('data:image/') === 0) {
        return this.src;
      }

      if (!this.remote) {
        if (process.env.NODE_ENV === 'production') {
          return staticUrl + this.src;
        }
        return this.src;
      }

      return resourceUrl + this.src;
    },
  },
};
</script>
