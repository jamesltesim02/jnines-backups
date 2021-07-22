<template>
  <div class="nb-bet-body-ani-box">
    <bet-arrow-box class="nb-bet-body-ani-arrow" type="down" size="12" v-if="!flag" />
    <bet-history-body-show class="nb-bet-body-ani-show" :txt="txt" :num="num" end v-else />
  </div>
</template>

<script>
import BetArrowBox from './BetArrowBox';
import BetHistoryBodyShow from './BetHistoryBodyShow';

export default {
  inheritAttrs: false,
  name: 'BetHistoryBodyAni',
  props: { txt: String, num: String, flag: Boolean },
  components: { BetArrowBox, BetHistoryBodyShow },
};
</script>

<style lang="less">
.nb-bet-body-ani-box {
  position: relative;
  z-index: 10;
  height: 28px;
  flex-grow: 1;
  .nb-bet-body-ani-show { position: absolute; height: 100%; right: 0; top: 0; z-index: 20; }
  .nb-bet-body-ani-arrow { position: absolute; width: 12px; height: 100%; right: 0; top: 0; z-index: 30; }
}
</style>
