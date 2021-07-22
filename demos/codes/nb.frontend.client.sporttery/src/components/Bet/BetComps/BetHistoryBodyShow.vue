<template>
<transition name="bodyShow" >
  <div :class="`nb-bet-body-show-box flex-${end ? 'end' : 'start'}`" >
    <span class="nb-bet-body-show-txt flex-center">{{txt}}</span>
    <span class="nb-bet-body-show-num flex-center" :style="{ color: oddsColor }">{{num}}</span>
  </div>
</transition>
</template>

<script>
import { mapState } from 'vuex';

export default {
  inheritAttrs: false,
  name: 'BetHistoryBodyShow',
  props: { txt: String, num: String, end: Boolean },
  computed: {
    ...mapState('app', ['theme', 'bettingMode']),
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_OPTION_COLOR ? pSet.BLUE_OPTION_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
  },
};
</script>

<style lang="less">
.bodyShow-enter-active, .bodyShow-leave-active { transition: all 0.15s linear; }
.bodyShow-enter, .bodyShow-leave-active { opacity: 0; }
.white .nb-bet-body-show-box {
  .nb-bet-body-show-txt { color: #909090; }
}
.black .nb-bet-body-show-box {
  .nb-bet-body-show-txt { color: #909090; }
}
.blue .nb-bet-body-show-box {
  .nb-bet-body-show-txt { color: #909090; }
}
.nb-bet-body-show-box {
  .nb-bet-body-show-txt { margin-right: .06rem; font-size: .12rem; }
  .nb-bet-body-show-num { font-size: .14rem; }
}
</style>
