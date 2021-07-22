<template>
<div class="nb-bet-cart-two" >
  <div class="nb-bet-cart-content-head" v-if="show" >
    <div class="nb-bet-cart-title flex-center" :style="{ color: oddsColor }" @click="toggleCart">
      <div class="nb-bet-cart-flag flex-center" :style="rotateStyle"><icon-cart-toggle :fill="oddsColor" /></div>
      {{$t('pageBet.mySelect')}}
      <span class="nb-bet-cart-count flex-center" :style="{ background: btnColor }" v-if="!cartSts">{{betCnt}}</span>
    </div>
  </div>
  <bet-cart-head v-if="show && cartSts" />
  <perfect-scrollbar class="nb-bet-cart-content-body" v-if="show && cartSts" >
    <div :class="`bet-box-none${betCheck ? '-mix' : ''} flex-center-col`" v-if="noData">
      <icon-none :inColor="inCol" :outColor="ouCol" />
      <p class="bet-box-none-text flex-center">{{$t('pageBet.noTicket')}}</p>
    </div>
    <div class="bet-box-detail" v-else >
      <div class="page-box-title flex-between">
        <span class="page-box-title-text" v-if="betMult" >{{$t('pageBet.fldItem')}}</span>
        <span class="page-box-title-text" v-else >{{$t('pageBet.betItem')}}</span>
        <span class="page-box-title-clear flex-center" @click="clearFun" >{{$t('pageBet.clearAll')}}</span>
      </div>
      <bet-mult-keyboard class="page-box-mult" v-if="betMult" />
      <div class="page-box-title flex-between" v-if="betMult" >
        <span class="page-box-title-text">{{$t('pageBet.betItem')}}</span>
        <span class="page-box-title-alert flex-between" v-if="sameAlert" >
          <bet-box-alert size="14" color="#ff5353" />
          <span class="page-box-title-alert-text flex-none">{{$t('pageBet.mixFoldAlert')}}</span>
        </span>
      </div>
      <div class="bet-page-item" v-for="(v, k) in btList" :key="k">
        <bet-option-box :data="v" :showId="!!betMult" @check="checkInputFun" />
      </div>
    </div>
  </perfect-scrollbar>
  <bet-single-submit class="bet-single-submit" v-if="show && cartSts && !noData && !betMult" />
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import IconNone from '@/components/common/icons/IconNone';
import BetSingleSubmit from '@/components/Bet/BetSingleSubmit';
import BetMultKeyboard from '@/components/Bet/BetMultKeyboard';
import BetCartHead from '@/components/Bet/BetComps/BetCartHead';
import BetBoxAlert from '@/components/Bet/BetComps/BetBoxAlert';
import BetOptionBox from '@/components/Bet/BetComps/BetOptionBox';
import IconCartToggle from '@/components/common/icons/IconCartToggle';

export default {
  props: { show: Boolean },
  computed: {
    ...mapState({
      betCnt: state => state.bet.betCount,
      betList: state => state.bet.betList,
      betMult: state => state.bet.betMult,
      mthArr: state => state.bet.matchIDArr,
      cartSts: state => state.bet.cartStatus,
      inputFocused: state => state.bet.inputFocused,
    }),
    ...mapState('app', ['userinfo', 'theme', 'bettingMode', 'bettingStyle']),
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
    btList() {
      return this.betList.filter(v => !v.type);
    },
    sameAlert() {
      return this.btList.filter(v => v.same).length > 0;
    },
    noData() {
      if (!this.betMult) {
        return this.btList.length < 1;
      }
      return this.mthArr.length < 2;
    },
    inCol() {
      return !/^white$/i.test(this.theme) ? '#434448' : '#d0d0d0';
    },
    ouCol() {
      return !/^white$/i.test(this.theme) ? '#55565A' : '#c2c2c2';
    },
    rotateStyle() {
      return !this.cartSts ? { transform: 'rotate(180deg)' } : { };
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
  },
  components: {
    IconNone,
    BetBoxAlert,
    BetCartHead,
    BetOptionBox,
    IconCartToggle,
    BetSingleSubmit,
    BetMultKeyboard,
  },
  watch: {
    show() {
      if (this.show) this.updateBal();
    },
    betMult() {
      if (this.show) this.updateBal();
    },
    betCnt(n, o) {
      if (this.show && !o && n === 1) {
        this.changeCartStatus(true);
        this.changeInputFocused(false);
      } else if (this.show && !n && o) {
        this.changeCartStatus(false);
      }
      if (this.show) this.quoteBetCart({ });
    },
  },
  methods: {
    ...mapMutations(['clearBetItem', 'changeCartStatus', 'changeBetMult', 'changeInputFocused']),
    ...mapActions(['getNBUser', 'quoteBetCart']),
    ...mapMutations('app', ['getUserInfo']),
    toggleCart() {
      this.changeCartStatus(!!(!this.cartSts && this.betCnt));
      const multNum = this.btList.length > 1 && !this.noData ? 1 : 0;
      if (!this.cartSts && this.betCnt) this.changeBetMult(multNum);
      if (this.cartSts) this.updateBal();
      this.changeInputFocused(false);
    },
    clearFun() {
      this.clearBetItem({ type: '' });
    },
    checkInputFun() {
      let fPass = false;
      for (let i = 0; i < this.btList.length; i += 1) {
        fPass = !!(fPass || this.btList[i].amt);
      }
      this.changeInputFocused(fPass);
    },
    updateBal() {
      if (this.show) {
        this.quoteBetCart({ });
        if (this.userinfo && this.userinfo.token) {
          this.getNBUser(true);
        }
      }
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>

<style lang="less">
.nb-bet-cart-two {
  width: 100%;
  .nb-bet-cart-content-head { position: relative; width: 100%; z-index: 30; }
  .nb-bet-cart-content-body { position: relative; width: 100%; height: 100%; z-index: 10; overflow: auto; }
  .ps__rail-y, .ps__rail-y:hover { background: transparent; .ps__thumb-y { width: 4px; background-color: transparent; } }
  .nb-bet-cart-title { position: relative; width: 100%; height: 43px; font-size: 16px; font-weight: 600; }
  .nb-bet-cart-flag { position: absolute; top: 0; left: 0; width: 69px; height: 100%; cursor: pointer; }
  .nb-bet-cart-count { position: absolute; width: 20px; height: 20px; top: 11.5px; right: 100px; border-radius: 10px; padding-right: 2px; font-size: 12px; font-weight: 100; }
  .page-box-title { width: 310px; height: 22px; margin: 10px auto; }
  .page-box-title-text { font-size: 13px; }
  .page-box-title-clear { line-height: 22px; padding: 0 10px; border-radius: 11px; font-size: 12px; cursor: pointer; }
  .page-box-title-alert-text { font-size: 12px; padding: 0 2px 0 4px; }
  .page-box-mult { margin: 10px auto; }
  .bet-page-item { width: 310px; margin: 10px auto; border-radius: 10px; overflow: hidden; }
  .bet-box-none { min-height: 279px; }
  .bet-box-none-mix { min-height: 272px; }
  .bet-single-submit { margin: 0 auto; }
}
.white .nb-bet-cart-two {
  .nb-bet-cart-count { color: #ebe9e9; }
  .bet-box-none-text { color: #2E2F34; }
  .page-box-title-text { color: rgba(46,47,52,0.7); }
  .page-box-title-clear { border: 1px solid #bababa; color: rgba(46,47,52,.5); }
  .page-box-title-alert-text { color: rgba(46,47,52,0.5); }
  .bet-page-item { border: 1px solid #EBE9E9; box-shadow: 0 10px 20px 0 rgba(223,222,223,.5); background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%); }
}

.dark .nb-bet-cart-two {
  .nb-bet-cart-flag {
    svg > g > g {
      fill: #53fffd;
    }
  }
  .page-box-title-text {
    font-size: 12px;
  }
  .page-box-title-clear {
    border: solid 1px #434249;
    transition: all 0.25s ease-out;
    &:hover {
      background: #00b5b3;
      color: #fff;
    }
  }
  .nb-bet-cart-title {
    color: #53fffd !important;
  }
  .nb-bet-cart-count {
    background: #383838 !important;
  }
  .bet-page-item {
    background-image: linear-gradient(to bottom, #3a393f, #333238);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
