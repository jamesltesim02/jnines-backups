<template>
<cimg class="bet-slip-process rolling" :style="lStyle" src="./process-icon.png" />
</template>
<script>
export default {
  props: ['size'],
  computed: {
    lStyle() {
      return { width: `${this.size || 22}px`, height: `${this.size || 22}px` };
    },
  },
};
</script>
