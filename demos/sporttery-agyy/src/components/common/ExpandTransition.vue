<template>
  <div
    class="expand-transition"
    :class="{
      expaned: expanded
    }"
    :style="{height: height}"
    ref="el"
  >
    <slot />
  </div>
</template>
<script>
export default {
  props: ['expanded'],
  data() {
    return {
      height: this.expanded ? 'auto' : 0,
      el: null,
      defaultHeight: 0,
    };
  },
  watch: {
    expanded(n) {
      if (!n) {
        this.expandClose();
      } else {
        this.expand();
      }
    },
  },
  mounted() {
    this.el = this.$refs.el;
    this.el.addEventListener('transitionend', () => {
      this.height = this.expanded ? 'auto' : '0px';
      this.$emit('change', { expanded: this.expanded });
    });
  },
  methods: {
    expandClose() {
      this.height = `${this.el.scrollHeight}px`;
      setTimeout(() => {
        this.height = '0px';
      });
    },
    async expand() {
      this.height = `${this.el.scrollHeight}px`;
    },
  },
};
</script>
<style lang="less">
.expand-transition {
  transition: height .15s;
  overflow: hidden;
}
</style>
