<template>
  <div class="nb-bet-public-box-body" :style="{ 'z-index': index }" >
    <div class="nb-bet-public-box-body-posit"><slot /></div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetBoxBody',
  props: { index: Number },
};
</script>

<style lang="less">
.nb-bet-public-box-body {
  position: absolute;
  transition: all .15s linear;
}
.nb-bet-public-box-body .nb-bet-public-box-body-posit { position: relative; width: 100%; }
.nb-bet-public-cover-box.box-show .nb-bet-public-box-body { right: 0; }
.nb-bet-public-cover-box.box-hide .nb-bet-public-box-body { right: -700px; }

.dark .nb-bet-public-box-body {
  box-shadow: 0 2px 4px 0 rgba(37, 37, 37, 0.5);
  background-color: #2d2c32;
}
</style>
