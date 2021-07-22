<template>
<cimg
  :class="{
    'icon-loading': true,
    rolling: loading,
  }"
  :style="lStyle" src="./icon-loading.png"
  @click="$emit('click')"
/>
</template>
<script>
export default {
  props: {
    size: {},
    loading: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    lStyle() {
      return {
        width: `${this.size || 48}px`,
        height: `${this.size || 48}px`,
      };
    },
  },
};
</script>
