<template>
<div :class="['x-basketball-cup', side]"></div>
</template>
<script>
export default {
  props: {
    side: {
      type: String,
      default: 'left',
    },
  },
};

// 382
</script>
<style lang="less">
.x-basketball-cup {
  position: fixed;
  height: 100%;
  width: calc((100% - 1440px)/2);
  top: 0;
  overflow: hidden;
  background-size: auto 100%;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  &.left {
    left: 0;
    background-color: #a13036;
    background-image: url(./images/background-left.jpg);
  }
  &.right {
    right: 0;
    background-color: #68161a;
    background-image: url(./images/background-right.jpg);
  }
}
.webp .x-basketball-cup.left {
  background-image: url(./images/background-left.webp);
}
.webp .x-basketball-cup.right {
  background-image: url(./images/background-right.webp);
}
</style>
