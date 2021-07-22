<template>
  <div :class="`nb-bet-history-head${betCheck ? '-mix' : ''} flex-between`">
    <div :class="`change-item-${hisType ? 'normal' : 'active'} change-item-no flex-center`" @click="handleChange(0)">
      {{$t('pageBet.setNo')}}
    </div>
    <div :class="`change-item-${hisType ? 'active' : 'normal'} change-item-yes flex-center`" @click="handleChange(1)">
      <div class="change-item-text flex-center">
        {{$t('pageBet.setYes')}}
        <i :style="{ background: flagColor }" v-if="earSucc"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  inheritAttrs: false,
  name: 'BetHistoryHead',
  data() {
    return { changeing: false };
  },
  computed: {
    ...mapState({
      hisType: state => state.bet.hisType,
      earSucc: state => state.bet.earlySuccess,
    }),
    ...mapState('app', ['theme', 'bettingMode', 'bettingStyle']),
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
    flagColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_TAB_COLOR ? pSet.BLACK_TAB_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_TAB_COLOR ? pSet.WHITE_TAB_COLOR : '#ff5353';
    },
  },
  methods: {
    ...mapMutations(['changeHisType']),
    handleChange(type) {
      if (this.changeing) {
        return;
      }
      this.changeing = true;
      this.changeHisType(type);
      setTimeout(() => {
        this.changeing = false;
      }, 500);
    },
  },
};
</script>

<style lang="less">
.nb-bet-history-head, .nb-bet-history-head-mix {
  width: 100%;
  height: 56px;
  .change-item-normal, .change-item-active {
    width: 50%;
    height: 100%;
    font-size: 16px;
    .change-item-text { position: relative; font-size: 16px; }
    .change-item-text i { position: absolute; display: block; top: 0; right: -25px; width: 10px; height: 10px; border-radius: 50%; }
  }
  .change-item-no { border-left: none !important; }
  .change-item-yes { border-right: none !important; }
}
.nb-bet-history-head-mix .change-item-active { transform: translateZ(10px); }
.white .nb-bet-history-head {
  background: #FFF;
  border-bottom: 1px solid #ECEBEB;
  .change-item-normal { background: #ECEBEB; color: #AAA; .change-item-text { color: #AAA; } }
  .change-item-active { background: #FFF; color: #2E2F34; .change-item-text { color: #2E2F34; } }
}
.white .nb-bet-history-head-mix {
  background: #FFF;
  border-bottom: 1px solid #ECEBEB;
  .change-item-normal, .change-item-active { box-shadow: 0 10px 20px 0 rgba(223,222,223,.5); background: linear-gradient(to top, #f9f9f9, #fff); }
  .change-item-normal { color: #716d6d; border-left: solid 1px transparent; border-right: solid 1px transparent; .change-item-text { color: #716d6d; } }
  .change-item-active { color: #ff5353; border-left: solid 1px #f2f1f1; border-right: solid 1px #f2f1f1; .change-item-text { color: #ff5353; } }
}

.dark .nb-bet-history-head-mix {
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(to bottom, #2f2e33, #313035);
  border-bottom: solid 1px #27282e;
  .change-item-active {
    background-image: linear-gradient(to bottom, #2f2e33, #313035);
    box-shadow: -6px 10px 20px 0 rgba(0, 0, 0, 0.2);
    color: #53fffd;
  }
}
</style>
