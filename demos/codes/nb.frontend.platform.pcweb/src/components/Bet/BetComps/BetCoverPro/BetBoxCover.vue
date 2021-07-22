<template>
  <div class="nb-bet-public-box-cover" :style="{ 'z-index': index }" ></div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetBoxCover',
  props: { index: Number },
};
</script>

<style lang="less">
.nb-bet-public-box-cover { position: absolute; left: 0; right: 0; top: 0; bottom: 0; transition: all .15s linear; }
.nb-bet-public-cover-box.box-hide .nb-bet-public-box-cover { background: rgba(0, 0, 0, 0); }
.nb-bet-public-cover-box.box-show .nb-bet-public-box-cover { background: rgba(0, 0, 0, 0.5); }
</style>
