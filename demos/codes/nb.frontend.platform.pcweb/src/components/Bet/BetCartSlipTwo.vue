<template>
<div class="nb-bet-slip-two" >
  <div class="nb-bet-slip-head flex-center-col" v-if="show" >
    <div class="keyboard-result flex-around-col" :style="{ color: alertColor }" >
      <div class="body-title flex-center">
        <div class="title-flag-box flex-center">
          <bet-slip-success v-if="/succ/i.test(title)" size="22" />
          <bet-slip-failure v-else-if="/fail/i.test(title)" size="22" />
          <bet-slip-process v-else size="30" />
        </div>
        <span class="body-title-text flex-stast" v-if="/fail/i.test(title) && errObj && errObj.title">{{errObj.title}}{{errStr}}</span>
        <span class="body-title-text flex-stast" v-else-if="/(succ|fail)/i.test(title)">
          {{$t('pageBet.betAct')}}
          <span class="body-title-text-alert flex-center">{{$t(`pageBet.bet${title}`)}}</span>{{errStr}}
        </span>
        <span class="body-title-text flex-stast" v-else>{{$t(`pageBet.bet${title}`)}}{{errStr}}</span>
        <span class="body-title-num flex-center" v-if="/^-1$/.test(slipSts)">{{t.count}}</span>
        <span class="body-title-sec" v-if="/^-1$/.test(slipSts)">{{$t('pageBet.second')}}</span>
      </div>
      <div class="body-alert flex-center" v-if="/fail/i.test(title) && errObj && errObj.explan">{{errObj.explan}}</div>
    </div>
    <div class="slip-head-history flex-center" :style="{ color: oddsColor }" @click="historyFun">
      {{$t('pageBet.viewHistory')}}
    </div>
  </div>
  <div class="nb-bet-slip-content" v-if="show" >
    <div class="slip-content-row flex-between">
      <div class="slip-content-row-item flex-start">
        <span class="slip-content-item-text">{{$t('pageBet.totalAmt')}}</span>
        <span class="slip-content-item-num" :style="{ color: oddsColor }">{{changeType(slipObj.tAmt || 0)}}</span>
      </div>
      <div class="slip-content-row-item flex-start">
        <span class="slip-content-item-text">{{$t('pageBet.maxTotalRtn')}}</span>
        <span class="slip-content-item-num" :style="{ color: oddsColor }">{{changeType(slipObj.tRtn || 0)}}</span>
      </div>
    </div>
    <div class="slip-content-row flex-between" v-for="(item, i) in getSlipArr" :key="i">
      <div class="slip-content-arr-item flex-start" :style="{ color: oddsColor }" v-for="(v, k) in item" :key="k">
        <span class="slip-content-arr-txt" :style="{ color: oddsColor }">{{getHisItemName(v)}}</span>
        <span class="slip-content-arr-num" :style="{ color: oddsColor }">({{v && v.cnt ? v.cnt : 0}})</span>
      </div>
    </div>
  </div>
  <perfect-scrollbar class="nb-bet-slip-item-box" v-if="show" >
    <div class="bet-page-item" v-for="(v, k) in slipObj.opts" :key="k">
      <bet-option-box :data="v" :showId="multFlag" isResult />
    </div>
    <div class="nb-bet-slip-continue flex-center" :style="{ background: btnColor }" @click="continueFun" >
      {{$t('pageBet.slipClose')}}
    </div>
  </perfect-scrollbar>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { changeNumType } from '@/utils/betUtils';
import BetOptionBox from '@/components/Bet/BetComps/BetOptionBox';
import BetSlipProcess from '@/components/Bet/BetComps/BetSlipProcess';
import BetSlipSuccess from '@/components/Bet/BetComps/BetSlipSuccess';
import BetSlipFailure from '@/components/Bet/BetComps/BetSlipFailure';

export default {
  data() {
    return { t: { timer: null, count: 0, cntMax: 5 } };
  },
  props: { show: Boolean },
  computed: {
    ...mapState({
      slipObj: state => state.bet.slipObj,
      errCode: state => state.bet.errorCode,
      slipSts: state => state.bet.slipStatus,
    }),
    ...mapState('app', ['userinfo', 'theme', 'bettingMode', 'bettingStyle']),
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
    title() {
      let rt = /^[2389]$/.test(this.slipSts) ? 'Succ' : 'Fail';
      rt = /^-1$/.test(this.slipSts) ? 'Live' : rt;
      return /^-[2-9]$/.test(this.slipSts) ? 'Proc' : rt;
    },
    errStr() {
      return /^[04567]$/.test(this.slipSts) ? `(${this.errCode})` : '';
    },
    errObj() {
      const errLanObj = this.$t('pageBet.betErrObj');
      if (/^[04567]$/.test(this.slipSts) && this.errCode && errLanObj[this.errCode]) {
        return errLanObj[this.errCode];
      }
      return null;
    },
    getSlipArr() {
      const cArr = [[]];
      if (this.slipObj && this.slipObj.arr && this.slipObj.arr.length) {
        for (let i = 0; i < this.slipObj.arr.length; i += 1) {
          if (cArr[cArr.length - 1].length >= 3) {
            cArr.push([]);
          }
          cArr[cArr.length - 1].push(this.slipObj.arr[i]);
        }
      }
      return cArr;
    },
    multFlag() {
      for (let i = 0; i < this.getSlipArr.length; i += 1) {
        const itemArr = this.getSlipArr[i];
        for (let j = 0; j < itemArr.length; j += 1) {
          if (itemArr[j] && itemArr[j].num && itemArr[j].num > 1) {
            return true;
          }
        }
      }
      return false;
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
    alertColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BET_ALERT_COLOR ? pSet.BLACK_BET_ALERT_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_BET_ALERT_COLOR ? pSet.WHITE_BET_ALERT_COLOR : '#ff5353';
    },
  },
  components: {
    BetOptionBox,
    BetSlipProcess,
    BetSlipSuccess,
    BetSlipFailure,
  },
  watch: {
    slipObj() {
      this.startCount();
    },
  },
  methods: {
    ...mapMutations(['showBetHistory', 'changeSlipObj']),
    ...mapActions(['getNBUser', 'quoteBetCart']),
    ...mapMutations('app', ['getUserInfo']),
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
    startCount() {
      clearInterval(this.t.timer);
      if (this.show && this.slipObj && /^-1$/.test(this.slipSts)) {
        this.t.count = this.t.cntMax;
        this.t.timer = setInterval(() => {
          this.t.count = this.t.count > 0 ? this.t.count - 1 : this.t.cntMax;
        }, 1000);
      }
    },
    getMultName(num, fld) {
      const [lan, nFld] = [this.$t('pageBet.betMoney'), fld || 1];
      const nunStr = !/[a-z]+/i.test(lan) ? '一二三四五六七八九十' : '';
      if (nunStr) {
        const beStr = num < 11 ? '一二三四五六七八九十'.substr(num - 1, 1) : num;
        const afStr = nFld < 11 ? '一二三四五六七八九十'.substr(nFld - 1, 1) : nFld;
        return this.betCheck ? `${num}串${nFld}` : `${beStr}串${afStr}`;
      }
      return `${num} Folds${fld && fld > 1 ? ` ${fld}` : ''}`;
    },
    getHisItemName(v) {
      return `${!v || !v.num || v.num < 2 ? this.$t('pageBet.single') : this.getMultName(v.num, v.fld)}`;
    },
    historyFun() {
      this.continueFun();
      this.showBetHistory(true);
    },
    continueFun() {
      this.changeSlipObj();
      this.updateBal();
      clearInterval(this.t.timer);
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
    clearInterval(this.t.timer);
  },
  beforeDestroy() {
    clearInterval(this.t.timer);
  },
};
</script>

<style lang="less">
.nb-bet-slip-two {
  width: 100%;
  .ps__rail-y, .ps__rail-y:hover { background: transparent; .ps__thumb-y { width: 4px; background-color: transparent; } }
  .bet-page-item { width: 310px; margin: 10px auto; border-radius: 10px; overflow: hidden; }
  .nb-bet-slip-head { width: 100%; min-height: 81px; }
  .nb-bet-slip-content { width: 100%; }
  .nb-bet-slip-item-box { width: 100%; padding: 4px 0 20px 0; }
  .keyboard-result {
    width: 100%;
    .title-flag-box { margin-right: 6px; padding-top: 1px; }
    .body-title { width: 100%; height: 30px; margin-top: 8px; }
    .body-title-text, .body-title-num, .body-title-text-alert { font-size: 18px; height: 100%; }
    .body-title-text-alert { padding: 0 0 0 2px; }
    .body-title-num { padding: 0 4px 0 6px; }
    .body-title-sec { font-size: 12px; padding-top: 3px; }
    .body-alert { width: 100%; height: 20px; font-size: 10px; }
  }
  .slip-head-history { width: 40%; height: 30px; margin: 0 auto 5px; font-size: 12px; text-decoration: underline; cursor: pointer; }
  .slip-content-row { width: 100%; height: 35px; padding: 0 20px; }
  .slip-content-row-item { min-width: 45%; height: 100%; font-size: 14px; }
  .slip-content-arr-item { min-width: 25%; height: 100%; font-size: 14px; }
  .slip-content-item-text { margin-right: 4px; font-size: 12px; }
  .slip-content-arr-txt { margin-right: 10px; }
  .nb-bet-slip-continue { width: 290px; height: 40px; margin: 20px auto 0; font-size: 16px; border-radius: 6px; cursor: pointer; }
}
.black .nb-bet-slip-two {
  .bet-page-item { border: 1px solid #2e2f34; box-shadow: 0 10px 20px 0 rgba(0, 0, 0, .1); background: linear-gradient(to bottom, #3a393f, #333238); }
  .nb-bet-slip-head { border-bottom: 1px solid #4a4a4a; }
  .nb-bet-slip-content { border-bottom: 1px solid #4a4a4a; }
  .slip-content-item-text { color: #ecebeb; }
  .keyboard-result .body-alert { color: #909090; }
  .nb-bet-slip-continue { color: #fff; }
}
.white .nb-bet-slip-two {
  .bet-page-item { border: 1px solid #EBE9E9; box-shadow: 0 10px 20px 0 rgba(223,222,223,.5); background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%); }
  .nb-bet-slip-head { border-bottom: 1px solid #bababa; }
  .nb-bet-slip-content { border-bottom: 1px solid #bababa; }
  .slip-content-item-text { color: #909090; }
  .keyboard-result .body-alert { color: #909090; }
  .nb-bet-slip-continue { color: #fff; }
}
</style>
