<template>
  <img
    v-bind="attrs"
    @click="e => $emit('click', e)"
  />
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
    remote: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    src(n, o) {
      URL.revokeObjectURL(o);
    },
  },
  beforeDestroy() {
    URL.revokeObjectURL(this.src);
  },
  computed: {
    url() {
      if (/undefined$/i.test(this.src)) {
        return null;
      }
      if (/^(https?:\/\/|data:image\/|blob:)/i.test(this.src)) {
        return this.src;
      }
      if (!this.remote) {
        return `${process.env.NODE_ENV === 'production' ? staticUrl : ''}${this.src}`;
      }
      return `${resourceUrl}${this.src}`;
    },
    attrs() {
      const urlStr = /^[a-z]+:\/\//i.test(this.url) ? this.url.replace(/([^:])\/\/+/g, '$1/') : this.url;
      return this.url ? { src: urlStr } : { };
    },
  },
};
</script>
