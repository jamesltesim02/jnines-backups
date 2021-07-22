<template>
  <row class="nav-bar">
    <a class="button-back"><icon-back /></a>
    体育投注
  </row>
</template>
<style lang="less" scoped>
.nav-bar {
  position: relative;
  background: @navBarBgColor;
  box-shadow: 0 0 0 0 rgba(0,0,0,0.25);
  height: .44rem;
  line-height: .44rem;
  text-align: center;
  font-size: .17rem;

  .button-back {
    position: absolute;
    left: 0;
    top: 0;
    padding: 0.13rem 0.15rem 0.13rem;
    display: inline-block;
    line-height: 0;
  }
}
</style>
