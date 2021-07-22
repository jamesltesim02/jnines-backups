<template>
<div :class="ctClass" :style="cartStyle" >
  <div class="nb-bet-cart-box-blank" :style="{ background: btnColor }" v-if="redBlockShow"></div>
  <bet-cart-slip-three class="nb-bet-cart-content" :style="contStyle" :show="sThreeShow" />
  <bet-cart-slip-two class="nb-bet-cart-content" :style="contStyle" :show="sTwoShow" />
  <bet-cart-three class="nb-bet-cart-content" :style="contStyle" :show="bThreeShow" />
  <bet-cart-two class="nb-bet-cart-content" :style="contStyle" :show="bTwoShow" />
</div>
</template>

<script>
import { mapState } from 'vuex';
import BetCartTwo from '@/components/Bet/BetCartTwo';
import BetCartThree from '@/components/Bet/BetCartThree';
import BetCartSlipTwo from '@/components/Bet/BetCartSlipTwo';
import BetCartSlipThree from '@/components/Bet/BetCartSlipThree';

export default {
  data() {
    return { cartStyle: { }, contStyle: { } };
  },
  computed: {
    ...mapState('app', ['theme', 'bettingMode', 'bettingStyle']),
    ...mapState({
      slipObj: state => state.bet.slipObj,
      betCnt: state => state.bet.betCount,
      btObj: state => state.bet.bettingObj,
      inputFocused: state => state.bet.inputFocused,
    }),
    modeCheck() {
      return /^3$/.test(this.bettingMode);
    },
    betCheck() {
      return /^1$/.test(this.bettingStyle) || this.modeCheck;
    },
    ctClass() {
      return `nb-bet-cart-box${!this.inputFocused ? ' high-light-first' : ''}`;
    },
    sThreeShow() {
      return !!(this.btObj && this.betCheck);
    },
    sTwoShow() {
      return !!(!this.sThreeShow && this.slipObj);
    },
    bThreeShow() {
      return !!(!this.sThreeShow && !this.sTwoShow && this.modeCheck && this.betCnt > 0);
    },
    bTwoShow() {
      return !!(!this.sThreeShow && !this.sTwoShow && !this.bThreeShow && this.betCnt > 0);
    },
    redBlockShow() {
      return !!(this.sThreeShow || this.sTwoShow || this.bThreeShow || this.bTwoShow);
    },
    btnColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BOTTON_BACKGROUND ? pSet.BLACK_BOTTON_BACKGROUND : '#ff5353';
      }
      return pSet && pSet.WHITE_BOTTON_BACKGROUND ? pSet.WHITE_BOTTON_BACKGROUND : '#ff5353';
    },
  },
  components: {
    BetCartTwo,
    BetCartThree,
    BetCartSlipTwo,
    BetCartSlipThree,
  },
  methods: {
    setMaxHeight() {
      const bodyHeadEle = document.querySelector('.container .app .head-bar');
      let maxHeight = document.documentElement.clientHeight;
      maxHeight -= bodyHeadEle ? parseFloat(window.getComputedStyle(bodyHeadEle).height) / 3 : 0;
      this.cartStyle = { maxHeight: `${maxHeight}px` };
      this.contStyle = { maxHeight: `${maxHeight - 7}px` };
    },
  },
  mounted() {
    this.setMaxHeight();
    window.addEventListener('resize', this.setMaxHeight);
  },
};
</script>

<style lang="less">
.nb-bet-cart-box {
  position: fixed;
  width: 333px;
  height: auto;
  right: 0;
  bottom: 0;
  z-index: 2;
  &.high-light-first .bet-page-item:nth-child(2) input,
  &.high-light-first .nb-bet-keyboard-multiple > div .input-touch-box:first-child input {
    animation: boder-blink-animate linear 1.6s infinite;
  }
  .nb-bet-cart-box-blank { width: 100%; height: 7px; }
  .nb-bet-cart-content { display: flex; flex-direction: column; width: 330px; height: 100%; margin-left: 1px; }
}
.white .nb-bet-cart-box {
  background: linear-gradient(to bottom, #ca1010, #eecaa8);
  .nb-bet-cart-content { background: #f5f4f5; }
}

.dark .nb-bet-cart-box {
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
  background-image: linear-gradient(to bottom, #302f35, #323137);
  &.high-light-first .bet-page-item:nth-child(2) input,
  &.high-light-first .nb-bet-keyboard-multiple > div .input-touch-box:first-child input {
    animation: dark-boder-blink-animate linear 1.6s infinite;
  }
  .nb-bet-cart-box-blank {
    background-image: linear-gradient(93deg, #00ffd8, #00e5fe) !important;
  }
}
</style>
