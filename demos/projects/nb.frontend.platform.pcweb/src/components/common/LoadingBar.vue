<template>
  <!-- style in common.less -->
  <div
    class="loading-bar"
    :class="{'full': full}"
  ><icon-loading /></div>
</template>
<script>
export default {
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
