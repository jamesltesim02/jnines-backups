<template>
  <div
    class="expand-box"
    :class="{
      expaned: expanded,
      animationing: animationing,
      hidden: !expanded,
    }"
    :style="{
      height: height,
    }"
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
      animationing: false,
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
      this.animationing = false;
      this.$emit('change', { expanded: this.expanded });
    });
  },
  methods: {
    expandClose() {
      this.height = `${this.el.scrollHeight}px`;
      this.animationing = true;
      setTimeout(() => {
        this.height = '0px';
      }, 30);
    },
    async expand() {
      this.animationing = true;
      this.height = `${this.el.scrollHeight}px`;
    },
  },
};
</script>
<style lang="less">
.expand-box {
  transition: height .35s ease-out;
  overflow: visible;
}

.expand-box.animationing,.expand-box.hidden {
  overflow: hidden;
}
</style>
