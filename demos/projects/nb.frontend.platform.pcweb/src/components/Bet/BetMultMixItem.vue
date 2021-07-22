<template>
  <div class="mix-bet-multiple-body" @click="clickOptFun" >
    <div class="mix-bet-multiple-body-main" >
      <div class="mix-multiple-title-box" >
        <div class="mix-multiple-title-txt flex-start" v-if="data.nm < 2">{{$t('pageBet.singleFold')}}</div>
        <div class="mix-multiple-title-txt flex-start" v-else>{{data.nm}}{{$t('pageBet.betFolds')}}{{data.fld}}</div>
        <div class="mix-multiple-return-box flex-start">
          <span class="mix-multiple-return-txt">{{$t('pageBet.willRtn')}}</span>
          <span class="mix-multiple-return-num">{{changeType(btAmt * data.odds, true)}}</span>
        </div>
      </div>
      <div class="mix-multiple-odds-box flex-center" >
        <span class="multiple-odds-txt">@</span>
        <span class="multiple-odds-num">{{changeType(data.odds / (data.mct || 1), true, 3)}}</span>
      </div>
      <div class="mix-multiple-input-box flex-end" >
        <span class="mix-multiple-input-num mix-multiple-toggle">{{data.mct}}</span>
        <span class="mix-multiple-input-txt mix-multiple-toggle">x</span>
        <div class="bet-show-input-box" >
          <div class="bet-show-input-place flex-center" v-if="!btAmt" >{{getPlaceStr}}</div>
          <input type="text" :class="getIptClass" v-model="data.sAmt" :style="{ color: oddsColor }" autocomplete="off"
          @focus="focusFun" @input="inputFun" @blur="blurFun" maxLength="6" v-if="data.nm < 2" />
          <input type="text" :class="getIptClass" v-model="data.amt" :style="{ color: oddsColor }" autocomplete="off"
          @focus="focusFun" @input="inputFun" @blur="blurFun" maxLength="6" v-else />
        </div>
      </div>
    </div>
    <div class="mix-bet-multiple-body-toggle mix-multiple-toggle flex-start-wrap" v-if="data.toggle" >
      <span class="mix-multiple-toggle-item flex-start" :style="data.toggleStyle" v-for="(tItem, tk) in data.toggleArr" :key="tk">
        {{tItem.oids.join('/')}}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { changeNumType } from '@/utils/betUtils';

export default {
  inheritAttrs: false,
  name: 'BetMultMixItem',
  props: { data: Object },
  data() {
    return { active: false };
  },
  computed: {
    ...mapState({
      cFlag: state => state.bet.cartFlag,
      betList: state => state.bet.betList,
    }),
    ...mapState('app', ['theme']),
    btList() {
      return this.betList.filter(v => !v.type && /^7$/.test(v.betStatus));
    },
    btAmt() {
      return +(this.data.amt || this.data.sAmt || 0);
    },
    btMax() {
      let bkNum = 1000000000;
      for (let i = 0; i < this.btList.length; i += 1) {
        bkNum = this.btList[i].max < bkNum ? this.btList[i].max : bkNum;
      }
      return bkNum;
    },
    getPlaceStr() {
      return `${this.data.min}-${this.data.max}`;
    },
    getIptClass() {
      return `box-item-like-input${this.active || this.btAmt ? ' focus' : ''}`;
    },
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
  },
  methods: {
    ...mapMutations(['changeInputFlag', 'changeInputFocused']),
    ...mapActions(['quoteBetCart']),
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
    clickOptFun() {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (!/like-input/i.test(cName)) {
        const dt = JSON.parse(JSON.stringify(this.data));
        dt.toggle = !dt.toggle;
        this.$emit('change', dt);
      }
    },
    focusFun() {
      if (!this.cFlag) this.quoteBetCart({ });
      this.changeInputFocused(true);
      this.changeInputFlag(true);
      this.active = true;
    },
    inputFun() {
      const dt = JSON.parse(JSON.stringify(this.data));
      const vStr = `${(dt.nm < 2 ? dt.sAmt : dt.amt) || ''}`;
      let [val, flag] = [vStr.replace(/[^\d]/g, '').replace(/^0+/, ''), 0];
      if (+val > +(dt.max || this.btMax)) {
        [val, flag] = [`${this.data.max || this.btMax}`, 1];
      }
      if ((+val) * dt.odds > dt.maxRtn) {
        [val, flag] = [`${parseInt(dt.maxRtn / (dt.odds || 1), 10)}`, flag || 2];
      }
      if (flag) this.$toast(this.$t(`pageBet.${flag < 2 ? 'maxToast' : 'rightToast'}`));
      if (`${vStr}` !== `${dt.oldAmt}`) {
        if (dt.nm < 2) {
          dt.sAmt = val;
        } else {
          dt.amt = val;
        }
        this.$emit('change', dt);
      }
    },
    blurFun() {
      this.$emit('check', this.data);
      this.active = false;
    },
  },
};
</script>

<style lang="less">
.mix-bet-multiple-body {
  width: 100%;
  .mix-bet-multiple-body-main { width: 100%; height: 54px; position: relative; z-index: 100; padding: 0 10px; }
  .mix-multiple-title-box { position: absolute; z-index: 110; left: 10px; right: 10px; height: 100%; }
  .mix-multiple-title-txt { width: 100%; height: 30px; font-size: 16px; }
  .mix-multiple-return-box { width: 100%; height: 17px; margin-top: 2px; }
  .mix-multiple-return-txt, .mix-multiple-return-num { font-size: 12px; padding-right: 5px; }
  .mix-multiple-odds-box { position: absolute; z-index: 120; left: 10px; right: 10px; height: 100%; font-size: 14px; font-weight: 500; padding: 0 25% 2px 0; }
  .multiple-odds-txt { font-family: PingFangSC; padding-right: 1px; }
  .mix-multiple-input-box { position: absolute; z-index: 120; left: 10px; right: 10px; height: 100%; padding-right: 1px; }
  .bet-show-input-box { position: relative; width: 104px; height: 30px; z-index: 10; }
  .bet-show-input-place { position: absolute; width: 100%; height: 100%; z-index: 20; font-size: 12px; }
  .box-item-like-input { position: absolute; width: 100%; height: 100%; z-index: 30; border-radius: 4px; background: transparent; padding: 0 10px; box-sizing: border-box; text-align: center; font-size: 12px; }
  .mix-multiple-input-txt, .mix-multiple-input-num { font-size: 13px; padding-right: 10px; }
  .mix-multiple-input-txt { padding-bottom: 1px; }
  .mix-bet-multiple-body-toggle { width: 100%; padding: 0 10px; }
  .mix-multiple-toggle-item { width: 100%; height: 30px; font-size: 12px; }
}
.black .mix-bet-multiple-body {
  .mix-multiple-title-txt { color: #ecebeb; font-weight: 500; }
  .mix-multiple-return-txt { color: #9b9b9b; }
  .mix-multiple-return-num { color: #ff5353; font-weight: 500; }
  .mix-multiple-odds-box { color: #ff5353; }
  .box-item-like-input { border: 1px solid #716d6d; }
  .bet-show-input-place { color: #909090; }
  .mix-multiple-input-num { color: #bababa; padding-bottom: 1px; }
  .mix-multiple-input-txt { color: #9b9b9b; }
  .mix-bet-multiple-body-toggle { border-top: 1px solid #2e2f34; color: #bababa; }
}
.white .mix-bet-multiple-body {
  .mix-multiple-title-txt { color: #2e2f34; font-weight: 600; }
  .mix-multiple-return-txt { color: #909090; }
  .mix-multiple-return-num { color: #ff5353; font-weight: 500; }
  .mix-multiple-odds-box { color: #ff5353; }
  .box-item-like-input { border: 1px solid #ecebeb; }
  .bet-show-input-place { color: #bababa; }
  .mix-multiple-input-num { color: #909090; padding-bottom: 1px; }
  .mix-multiple-input-txt { color: #bababa; }
  .mix-bet-multiple-body-toggle { border-top: 1px solid #ecebeb; color: #bababa; }
}
</style>
