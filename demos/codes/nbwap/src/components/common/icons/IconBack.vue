<template>
  <i ref="icon" class="icon icon-back"></i>
</template>
<script>
export default {
}
</script>

<style lang="less" scoped>
  .icon-back {
    width: .1rem;
    height: .17rem;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      display: block;
      border-bottom: .025rem solid #fff;
      border-left: .025rem solid #fff;
      box-sizing: border-box;
      top: .025rem;
      left: .025rem;
      width: 0.13rem;
      height: 0.13rem;
      transform: rotate(45deg) scale(.925);
    }
  }
</style>

