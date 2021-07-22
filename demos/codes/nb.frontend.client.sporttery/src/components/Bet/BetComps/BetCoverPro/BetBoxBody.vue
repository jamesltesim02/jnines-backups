<template>
  <div :class="`nb-bet-public-box-body ${animate ? 'ani-normal' : 'ani-disable'}`" :style="{ 'z-index': index }" >
    <div class="nb-bet-public-box-body-posit"><slot /></div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetBoxBody',
  props: { index: Number, animate: Boolean },
};
</script>

<style lang="less">
.nb-bet-public-box-body { position: absolute; width: 100%; left: 50%; transition: all .15s linear; }
.nb-bet-public-box-body .nb-bet-public-box-body-posit { position: relative; width: 100%; }
.nb-bet-public-cover-box.box-show .nb-bet-public-box-body { transform: translate3d(-50%, 0, 0); }
.nb-bet-public-cover-box.box-hide .nb-bet-public-box-body.ani-disable { transform: translate3d(-50%, 0, 0); }
.nb-bet-public-cover-box.box-hide .nb-bet-public-box-body.ani-normal { transform: translate3d(-50%, 3rem, 0); }
</style>
