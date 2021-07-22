<template>
  <cimg
    class="icon-head"
    :src="headSrc"
  />
</template>
<script>
const headImages = [
  require('./images/0.png'),
  require('./images/1.png'),
  require('./images/2.png'),
  require('./images/3.png'),
  require('./images/4.png'),
  require('./images/5.png'),
  require('./images/6.png'),
  require('./images/7.png'),
  require('./images/8.png'),
  require('./images/9.png'),
  require('./images/10.png'),
  require('./images/11.png'),
  require('./images/12.png'),
  require('./images/13.png'),
  require('./images/14.png'),
  require('./images/15.png'),
  require('./images/16.png'),
  require('./images/17.png'),
  require('./images/18.png'),
  require('./images/19.png'),
];

export default {
  props: {
    src: {
      default: 0,
    },
  },
  computed: {
    headSrc() {
      if (typeof this.src === 'string' && /^https?:\/\/.+/gi.test(this.src)) {
        return this.src;
      }
      return headImages[+this.src || 0];
    },
  },
};
</script>
<style lang="less">
.icon-head { width: 100%; height: 100%; }
</style>
