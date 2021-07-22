<template>
  <div
    :class="{
      'no-records': true,
      minify: minify,
    }"
  >
    <cimg src="./no-records.png" />
    <p>
      <slot>暂无相关数据</slot>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    minify: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="less">
.no-records {
  margin: .15rem;
  text-align: center;
  padding: .3rem;
  background: #fff;
  img {
    width: 1.5rem;
  }
  p {
    color: #000;
    margin-top: .15rem;
    opacity: .33;
  }
  &.minify {
    margin: .15rem .05rem;
  }
}
</style>
