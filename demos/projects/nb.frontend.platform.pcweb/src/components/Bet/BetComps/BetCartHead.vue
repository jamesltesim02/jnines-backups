<template>
<div :class="`nb-bet-cart-head${betCheck ? '-mix' : ''} flex-between`" v-if="cartSts">
  <div :class="getBtnClass(0)" :style="getBtnStyle(0)" @click="changeBetMult(0)">
    <div class="nb-cart-head-text-box flex-center">
      {{$t('pageBet.single')}}
      <span class="nb-cart-head-count flex-center" :style="countStyle" v-if="betCnt">{{betCnt}}</span>
    </div>
  </div>
  <div :class="getBtnClass(1)" :style="getBtnStyle(1)" @click="changeBetMult(1)">
    <div class="nb-cart-head-text-box flex-center">{{$t('pageBet.multiple')}}</div>
  </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  inheritAttrs: false,
  name: 'BetCartHead',
  computed: {
    ...mapState('app', ['theme', 'bettingMode', 'bettingStyle']),
    ...mapState({
      betCnt: state => state.bet.betCount,
      betMult: state => state.bet.betMult,
      cartSts: state => state.bet.cartStatus,
    }),
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    btnColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BOTTON_BACKGROUND ? pSet.BLACK_BOTTON_BACKGROUND : '#ff5353';
      }
      return pSet && pSet.WHITE_BOTTON_BACKGROUND ? pSet.WHITE_BOTTON_BACKGROUND : '#ff5353';
    },
    countStyle() {
      const dfOneBkColor = /white/i.test(this.theme) ? '#ffffff' : '#5f5e60';
      const dfOneFtColor = /white/i.test(this.theme) ? '#aaaaaa' : '#ebe9e9';
      const dfTwoBkColor = /white/i.test(this.theme) ? '#ecebeb' : '#202024';
      const dfTwoFtColor = /white/i.test(this.theme) ? '#909090' : '#909090';
      const dfBkColor = this.betCheck ? dfTwoBkColor : dfOneBkColor;
      const dfFtColor = this.betCheck ? dfTwoFtColor : dfOneFtColor;
      const bkColor = !this.betMult ? this.btnColor : dfBkColor;
      const ftColor = !this.betMult ? '#ebe9e9' : dfFtColor;
      return { background: bkColor, color: ftColor };
    },
  },
  watch: {
    betMult() {
      this.quoteBetCart({ });
      this.changeInputFocused(false);
    },
  },
  methods: {
    ...mapMutations(['changeBetMult', 'changeInputFocused']),
    ...mapActions(['quoteBetCart']),
    getBtnClass(num) {
      const pass = (!this.betMult && !num) || (this.betMult && num);
      const clsName = `change-item-${!pass ? 'normal' : 'active'} `;
      return `${clsName}change-${!num ? 'no' : 'yes'} flex-center`;
    },
    getBtnStyle(num) {
      const pass = (!this.betMult && !num) || (this.betMult && num);
      return pass ? { color: this.oddsColor } : { };
    },
  },
};
</script>

<style lang="less">
.nb-bet-cart-head, .nb-bet-cart-head-mix {
  width: 100%;
  height: 40px;
  cursor: pointer;
  .change-item-normal, .change-item-active { width: 50%; height: 39px; cursor: pointer; }
  .nb-cart-head-text-box { position: relative; width: 100%; height: 100%; font-size: 14px; user-select: none; }
  .nb-cart-head-count { position: absolute; width: 20px; height: 20px; top: 11px; right: 35px; border-radius: 10px; padding: 0 1px 1px 0; font-size: 12px; font-weight: 100; }
  .change-no { border-left: none !important; }
  .change-yes { border-right: none !important; }
}
.nb-bet-cart-head-mix .change-item-active { transform: translateZ(10px); }
.black .nb-bet-cart-head {
  border-bottom: 1px solid #4a4a4a;
  .change-item-normal { background: #2a2a2c; color: #716d6d; }
  .change-item-active { background: linear-gradient(to bottom, #47464e, #333238); }
}
.white .nb-bet-cart-head {
  border-top: 1px solid #ECEBEB;
  border-bottom: 1px solid #ECEBEB;
  .change-item-normal { background: #ECEBEB; color: #AAA; }
  .change-item-active { background: #FFF; }
}
.white .nb-bet-cart-head-mix {
  border-top: 1px solid #ECEBEB;
  border-bottom: 1px solid #ECEBEB;
  .change-item-normal, .change-item-active { box-shadow: 0 10px 20px 0 rgba(223,222,223,.5); background: linear-gradient(to top, #f9f9f9, #fff); }
  .change-item-normal { color: #716d6d; border-left: solid 1px transparent; border-right: solid 1px transparent; }
  .change-item-active { color: #ff5353; border-left: solid 1px #f2f1f1; border-right: solid 1px #f2f1f1; }
}
.dark .nb-bet-cart-head-mix {
  border-top: 1px solid #27282E;
  border-bottom: 1px solid #2e2f34;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2);

  .change-item-active {
    color: #53fffd !important;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2);
    background-image: linear-gradient(to bottom, #2f2e33, #313035);
    .nb-cart-head-count {
      color: #53fffd !important;
      background: #383838 !important;
    }
  }
}
</style>
