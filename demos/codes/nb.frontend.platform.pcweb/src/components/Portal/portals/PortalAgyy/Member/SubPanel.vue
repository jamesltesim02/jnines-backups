<template>
  <scroll-panel class="agyy-sub-view">
    <template slot="header">
      <h2 class="sub-view-header">{{title}}</h2>
      <slot name="header" />
    </template>
    <slot />
    <template slot="footer">
      <slot name="footer" />
    </template>
  </scroll-panel>
</template>
<script>
import ScrollPanel from '../common/ScrollPanel';

export default {
  props: ['title'],
  components: {
    ScrollPanel,
  },
};
</script>
<style lang="less">
.agyy-sub-view {
  .sub-view-header {
    line-height: 100px;
    padding-left: 46px;
    font-size: 24px;
    color: #eee;
    letter-spacing: 0;
    background-image: url('./images/bg-subview.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
.webp .agyy-sub-view .sub-view-header {
  background-image: url('./images/bg-subview.webp');
}
</style>
