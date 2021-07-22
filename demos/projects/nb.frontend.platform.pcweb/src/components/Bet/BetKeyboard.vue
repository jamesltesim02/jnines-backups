<template>
  <div class="nb-bet-keyboard-type flex-between">
    <div class="keyboard-shows flex-around-col" v-if="!showResult">
      <span class="keyboard-shows-text">{{$t('pageBet.maybeRtn')}}</span>
      <span class="keyboard-shows-num" :style="willStyle"><i>￥</i>{{willRtn || betCheck ? changeType(willRtn, true) : '...............'}}</span>
    </div>
    <div :class="inputClass" :style="inputStyle" v-if="!showResult" >
      <div class="select-title arrow-title flex-center">
        <span class="sel-text arrow-text" :style="{ color: oddsColor }" >
          <input type="text" v-model="amount" :placeholder="placeStr" maxlength="5" />
        </span>
      </div>
      <div class="select-arrow flex-center" @click="showFun">
        <svg class="arrow-svg" width="10px" height="10px" style="width:10px;height:10px" viewBox="0 0 100 100">
          <path class="arrow-path" d="M 0 14.5 L 100 14.5 L50 85.5 Z" :fill="iconFill"></path>
        </svg>
      </div>
      <transition name="list-toggle" >
        <div class="select-list flex-between-col" :style="listStyle" v-if="selectShow">
          <div class="select-item flex-center" v-for="(v, k) in amtList" :key="k" @click="selectFun(v)"><i>￥</i><span>{{v}}</span></div>
        </div>
      </transition>
    </div>
    <div :class="`keyboard-submit${actBet || realBet ? '-active' : ''} flex-center`" :style="btnStyle" v-if="!showResult" @click="betFun">
      <icon-loading class="key-loading" size="18" v-if="realBet" />
      {{balAlt ? $t('pageBet.noBalance') : oddsStr}}
    </div>
    <div class="keyboard-result flex-around-col" :style="{ color: alertColor }" v-if="showResult">
      <div class="body-title flex-center">
        <div class="title-flag-box flex-center">
          <bet-slip-success v-if="/succ/i.test(title)" size="18" />
          <bet-slip-failure v-else-if="/fail/i.test(title)" size="18" />
          <bet-slip-process v-else size="24" />
        </div>
        <span class="body-title-text flex-stast" v-if="/fail/i.test(title) && errObj && errObj.title">{{errObj.title}}{{errStr}}</span>
        <span class="body-title-text flex-stast" v-else-if="/(succ|fail)/i.test(title)">
          {{$t('pageBet.betAct')}}
          <span class="body-title-text-alert flex-center">{{$t(`pageBet.bet${title}`)}}</span>{{errStr}}
        </span>
        <span class="body-title-text flex-stast" v-else>{{$t(`pageBet.bet${title}`)}}{{errStr}}</span>
        <span class="body-title-num flex-center" v-if="/^-1$/.test(slipSts)">{{count}}</span>
        <span class="body-title-sec" v-if="/^-1$/.test(slipSts)">{{$t('pageBet.second')}}</span>
      </div>
      <div class="body-alert flex-center" v-if="/fail/i.test(title) && errObj && errObj.explan">{{errObj.explan}}</div>
    </div>
    <div class="keyboard-history flex-center" v-if="showResult" @click="historyFun">{{$t('pageBet.toHistory')}}</div>
    <div class="keyboard-continue flex-center" v-if="showResult" @click="continueFun()">{{$t('pageBet.continueBet')}}</div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { changeNumType } from '@/utils/betUtils';
import { toPortalUrlByKey, getSettings } from '@/utils/PortalUtils';
import IconLoading from '@/components/common/icons/IconLoading';
import BetSlipProcess from '@/components/Bet/BetComps/BetSlipProcess';
import BetSlipSuccess from '@/components/Bet/BetComps/BetSlipSuccess';
import BetSlipFailure from '@/components/Bet/BetComps/BetSlipFailure';

export default {
  inheritAttrs: false,
  name: 'BetKeyboard',
  data() {
    return {
      showResult: false,
      inputTime: 0,
      amount: '',
      placeStr: '0',
      selectShow: false,
      balAlt: false,
      btime: 0,
      timer: null,
      count: 10,
      calObj: { },
    };
  },
  props: {
    opts: Array,
    type: String,
    clearAfter: Boolean,
    btnName: String,
  },
  computed: {
    ...mapState({
      betList: state => state.bet.betList,
      iptFlag: state => state.bet.inputFlag,
      errCode: state => state.bet.errorCode,
      slipSts: state => state.bet.slipStatus,
      betFlag: state => state.bet.bettingFlag,
      betType: state => state.bet.bettingType,
      quoteArr: state => state.bet.quoteMultTpArr,
    }),
    ...mapState('app', ['userinfo', 'theme', 'bettingMode', 'bettingStyle']),
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
    amtList() {
      const bSel = window.NBConfig && window.NBConfig.PORTAL_SETTING && window.NBConfig.PORTAL_SETTING.BET_SELECT;
      if (bSel && this.type && window.NBConfig.PORTAL_SETTING.BET_SELECT[this.type]) {
        return window.NBConfig.PORTAL_SETTING.BET_SELECT[this.type];
      }
      return [50, 100, 200, 300, 500];
    },
    realBet() {
      return !!(this.betFlag && Date.now() - this.btime < 500);
    },
    balAct() {
      return !!(this.userinfo && this.userinfo.balance !== undefined);
    },
    curBal() {
      return this.balAct ? this.userinfo.balance : 100000;
    },
    betOpts() {
      return this.betList.filter(v => `${v.type}` === `${this.type || ''}` && /^7$/.test(v.betStatus));
    },
    inputClass() {
      let cStr = `keyboard-inputs flex-between${this.selectShow ? ' active' : ''}`;
      cStr = `${cStr}${this.betOpts.length && !this.amount ? ' blingking' : ''}`;
      return `${cStr}${this.amount ? ' valued' : ''}`;
    },
    optOdds() {
      let tOdds = 1;
      for (let i = 0; i < this.betOpts.length; i += 1) {
        tOdds *= 1 + (this.betOpts[i].odds || 0);
      }
      return tOdds || 1;
    },
    willRtn() {
      const aVal = +(this.amount || 0);
      return aVal * this.optOdds;
    },
    oddsAlt() {
      let [oOdds, nOdds] = [1, 1];
      for (let i = 0; i < this.betOpts.length; i += 1) {
        [oOdds, nOdds] = [oOdds * (1 + (this.betOpts[i].oOdds || 0)), nOdds * (1 + (this.betOpts[i].odds || 0))];
      }
      return nOdds - oOdds;
    },
    oddsStr() {
      const defStr = this.btnName || this.$t('pageBet.sureBet');
      const bPro = this.realBet ? this.$t('pageBet.isBetting') : defStr;
      const oStr = this.oddsAlt < 0 ? this.$t('pageBet.oddsLower') : bPro;
      return this.oddsAlt > 0 ? this.$t('pageBet.oddsUpper') : oStr;
    },
    actBet() {
      const aVal = +(this.amount || 0);
      let rst = aVal && aVal >= this.calObj.min && aVal <= this.calObj.max;
      rst = rst && this.betOpts.length && this.willRtn <= this.calObj.rtn;
      if (this.opts && this.opts.length) {
        return rst && this.betOpts.length === this.opts.length;
      }
      return rst;
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
    btnStyle() {
      return this.actBet || this.realBet ? { background: this.btnColor, border: `1px solid ${this.btnColor}` } : { };
    },
    willStyle() {
      return this.willRtn ? { color: this.oddsColor } : { };
    },
    inputStyle() {
      return this.selectShow ? { border: `1px solid ${this.oddsColor}` } : { };
    },
    listStyle() {
      return this.selectShow ? { border: `1px solid ${this.oddsColor}`, borderBottom: 'none' } : { };
    },
    iconFill() {
      const defColor = !/^white$/i.test(this.theme) ? '#909090' : '#bababa';
      return this.selectShow ? this.oddsColor : defColor;
    },
  },
  watch: {
    balAct() {
      this.balAlt = this.balAct ? this.balAlt : false;
    },
    iptFlag() {
      if (Date.now() - this.inputTime > 100) {
        [this.amount, this.placeStr] = ['', '0'];
      }
    },
    betOpts(n, o) {
      this.getCalObj();
      this.balAlt = false;
      this.continueFun(n.length === o.length, true);
    },
    quoteArr() {
      this.getCalObj();
    },
    betFlag(n, o) {
      if (!n && o && Date.now() - this.btime < 2000) {
        this.startCount();
      }
    },
    slipSts() {
      const isCurrBet = `${this.betType}` === `${this.type || ''}` && !this.showResult;
      if (/^(-[1-9]|[02-9])$/.test(this.slipSts) && isCurrBet && Date.now() - this.btime < 2000) {
        this.startCount();
      }
    },
    selectShow() {
      if (this.selectShow) {
        this.changeAmtFlag();
        this.getNBUser(true);
      }
    },
  },
  components: {
    IconLoading,
    BetSlipProcess,
    BetSlipSuccess,
    BetSlipFailure,
  },
  methods: {
    ...mapMutations(['changeInputFlag', 'clearBetItem', 'saveList', 'showBetHistory', 'changeSlipStatus', 'changeAmtFlag', 'getNBUser']),
    ...mapActions(['quoteBetCart', 'doBetAction']),
    ...mapMutations('app', ['getUserInfo']),
    ...mapMutations('agyy', ['pushRouter']),
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
    startCount() {
      this.showResult = true;
      clearInterval(this.timer);
      if (/^-1$/.test(this.slipSts)) {
        this.count = 10;
        this.timer = setInterval(() => {
          this.count = this.count > 0 ? this.count - 1 : 10;
        }, 1000);
      }
    },
    getCalObj() {
      const qObj = { min: 0, max: 1000000000, rtn: 10000000000 };
      for (let i = 0; i < this.betOpts.length; i += 1) {
        qObj.min = this.betOpts[i].min > qObj.min ? this.betOpts[i].min : qObj.min;
        qObj.max = this.betOpts[i].max < qObj.max ? this.betOpts[i].max : qObj.max;
        qObj.rtn = this.betOpts[i].rtn < qObj.rtn ? this.betOpts[i].rtn : qObj.rtn;
      }
      if (this.betOpts.length > 1) {
        let [saveRtn, find] = [qObj.rtn, false];
        if (this.quoteArr && this.quoteArr.length && this.betOpts.length > 1) {
          for (let i = 0; i < this.quoteArr.length; i += 1) {
            if (`${this.quoteArr[i].betN}_${this.quoteArr[i].betM}` === `${this.betOpts.length}_1`) {
              qObj.min = this.quoteArr[i].minBet !== undefined ? this.quoteArr[i].minBet : qObj.min;
              qObj.max = this.quoteArr[i].maxBet !== undefined ? this.quoteArr[i].maxBet : qObj.max;
              [saveRtn, find] = [this.quoteArr[i].maxReturn || saveRtn, !!this.quoteArr[i].maxReturn];
              break;
            }
          }
        }
        if (this.userinfo && this.userinfo.rtn && !find) {
          for (let i = this.betOpts.length; i >= 2; i -= 1) {
            if (this.userinfo.rtn[`mut${i}`]) {
              const userRtnObj = this.userinfo.rtn[`mut${i}`];
              if (typeof userRtnObj === 'object' && userRtnObj.maxBet !== undefined) {
                qObj.max = +userRtnObj.maxBet;
              }
              if (typeof userRtnObj === 'object' && userRtnObj.maxReturn) {
                saveRtn = +userRtnObj.maxReturn;
              } else {
                saveRtn = +userRtnObj;
              }
              break;
            }
          }
        }
        qObj.rtn = saveRtn;
      }
      this.calObj = qObj;
    },
    async showFun() {
      const needQuote = !this.selectShow && this.type && !this.amount;
      if (!this.balAct && !this.amount) {
        if (!this.balAct) toPortalUrlByKey('LOGIN_PAGE_URL');
      } else if (this.opts && this.opts.length && needQuote) {
        this.clearBetItem({ type: this.type });
        const optsArr = [];
        for (let i = 0; i < this.opts.length; i += 1) {
          optsArr.push(this.opts[i]);
          optsArr[optsArr.length - 1].type = this.type;
          let fromNum = /fast/i.test(this.type) ? 1 : 0;
          fromNum = /blockade/i.test(this.type) ? 4 : fromNum;
          fromNum = /jackpot/i.test(this.type) ? 5 : fromNum;
          if (!this.type) {
            fromNum = /^\/detail\/\d{1,2}\/\d+$/i.test(this.$route.path) ? 3 : 2;
          }
          optsArr[optsArr.length - 1].from = fromNum;
        }
        this.saveList(optsArr.concat(this.betList));
        await this.quoteBetCart({ type: this.type });
        if (this.betOpts.length < this.opts.length) {
          this.clearBetItem({ type: this.type });
          this.$toast(this.$t('pageBet.cantBet'));
        } else {
          this.selectShow = !this.selectShow;
        }
      } else if (this.betOpts.length && (!this.opts || !this.opts.length) && needQuote) {
        await this.quoteBetCart({ type: this.type });
        if (this.betOpts.length) {
          this.selectShow = !this.selectShow;
        } else {
          this.$toast(this.$t('pageBet.cantBet'));
        }
      } else if (this.betOpts.length) {
        this.selectShow = !this.selectShow;
      } else {
        this.$toast(this.$t('pageBet.selOption'));
      }
    },
    selectFun(v) {
      this.inputTime = Date.now();
      this.changeInputFlag();
      this.changeVal(v);
    },
    getBetObj() {
      const obj = { type: this.type, noClear: !!this.clearAfter, mult: this.opts && this.opts.length > 1 ? 2 : 1 };
      return Object.assign(obj, { bets: [{ num: this.betOpts.length, cnt: 1, amt: +(this.amount || 0) }] });
    },
    async betFun() {
      this.getUserInfo();
      if (!this.userinfo || !this.userinfo.token) {
        if (this.actBet) toPortalUrlByKey('LOGIN_PAGE_URL');
      } else if (this.balAlt) {
        const pSet = getSettings();
        if (pSet && pSet.USER_CENTER_URL && pSet.DEPOSIT_PAGE_URL) {
          toPortalUrlByKey('DEPOSIT_PAGE_URL');
        } else if (pSet && pSet.USER_CENTER_URL) {
          toPortalUrlByKey('USER_CENTER_URL');
        } else {
          this.pushRouter('/member/payment');
        }
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const rtn = await this.doBetAction(this.getBetObj());
        if (rtn) {
          this.$toast(this.$t(`pageBet.${/^1$/.test(rtn) ? 'betWrong' : 'userWrong'}`));
        } else {
          [this.amount, this.placeStr] = ['', '0'];
        }
      }
    },
    findElem(el, fEle) {
      if (el === fEle) {
        return true;
      }
      return el.parentElement ? this.findElem(el.parentElement, fEle) : false;
    },
    historyFun() {
      this.continueFun();
      this.showBetHistory(true);
    },
    continueFun(keepFlag, clearFlag) {
      [this.amount, this.placeStr] = ['', '0'];
      this.showResult = false;
      clearInterval(this.timer);
      if (!keepFlag) this.changeSlipStatus(1);
      if (!clearFlag) this.clearBetItem({ type: this.type || '' });
      this.getNBUser(true);
      if (!clearFlag) this.addInputEvent();
    },
    changeVal(str) {
      let [val, flag] = [`${str}`.replace(/[^\d]/g, '').replace(/^0+/, ''), 0];
      val = this.betOpts && this.betOpts.length ? val : '';
      if (+(val || 0) > this.calObj.max) {
        [val, flag] = [`${this.calObj.max}`, 1];
      }
      if ((+(val || 0)) * this.optOdds > this.calObj.rtn) {
        [val, flag] = [`${parseInt(this.calObj.rtn / (this.optOdds || 1), 10)}`, flag || 2];
      }
      if (flag) this.$toast(this.$t(`pageBet.${flag < 2 ? 'maxToast' : 'rightToast'}`));
      if (`${this.amount}` !== `${val}`) {
        this.amount = val;
      }
      this.balAlt = !!(this.balAct && this.curBal < +(this.amount || 0));
      return val;
    },
    addInputEvent() {
      this.getUserInfo();
      setTimeout(() => {
        const [oInput, self] = [this.$el.querySelector('input'), this];
        if (oInput) {
          oInput.addEventListener('focus', () => {
            const needQuote = !self.selectShow && self.type && !self.amount;
            [self.inputTime, self.placeStr] = [Date.now(), ''];
            self.changeInputFlag();
            if (self.betOpts && self.betOpts.length && needQuote) self.quoteBetCart({ type: self.type });
            if (!self.betOpts || !self.betOpts.length) self.$toast(self.$t('pageBet.selOption'));
          });
          oInput.addEventListener('blur', () => { self.placeStr = '0'; });
          oInput.addEventListener('input', () => {
            const newVal = self.changeVal(oInput.value);
            if (`${oInput.value}` !== `${newVal}`) {
              oInput.value = newVal;
            }
          });
        }
      }, 50);
    },
  },
  mounted() {
    this.getCalObj();
    this.addInputEvent();
    document.addEventListener('click', (e) => {
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (!this.findElem(e.target, this.$el) || !/arrow/.test(cName)) {
        this.selectShow = false;
      }
    });
  },
};
</script>

<style lang="less">
.list-toggle-enter, .list-toggle-leave { transition: bottom 1.15s linear; }
.list-toggle-enter, .list-toggle-leave-active { bottom: 0; }
.nb-bet-keyboard-type {
  position: relative;
  z-index: 99;
  width: 100%;
  height: 44px;
  padding: 0 10px;
  .key-loading { margin-right: 10px; }
  i { font-size: 10px; font-style: normal; }
  .keyboard-shows { width: 29%; height: 100%; }
  .keyboard-shows-text { font-size: 12px; }
  .keyboard-shows-num { font-size: 16px; }
  .keyboard-inputs {
    position: relative;
    z-index: 5;
    width: 29%;
    height: 40px;
    border-radius: 6px;
    input { text-align: center; }
    &.blingking {
      animation: boder-blink-animate linear 1.5s infinite;
      .select-arrow { animation: boder-blink-animate linear 1.5s infinite; }
    }
  }
  .keyboard-inputs.active { border-top-left-radius: 0; border-top-right-radius: 0; }
  .keyboard-inputs .select-title, .keyboard-inputs .select-arrow { height: 100%; font-size: 16px; font-family: PingFangSC; }
  .keyboard-inputs .select-title { width: 70%; .sel-text, .sel-def { font-family: PingFangSC; } }
  .keyboard-inputs .select-title .sel-text {
    position: relative;
    font-size: 16px;
    &::before { content: "¥"; position: absolute; top: 60%; left: 10px; transform: translateY(-50%); font-size: 12px; }
    input { box-sizing: border-box; width: 100%; background: transparent; border: 0; padding-left: 10px; }
  }
  .keyboard-inputs .select-title .sel-def { font-size: 12px; }
  .keyboard-inputs .select-arrow { width: 30%; }
  .keyboard-inputs .select-list { position: absolute; z-index: 1; left: -1px; right: -1px; bottom: 39px; padding: 8px 0; border-top-left-radius: 6px; border-top-right-radius: 6px; }
  .keyboard-inputs .select-item { width: 100%; height: 28px; font-size: 14px; i { margin-top: 3px; } }
  .keyboard-inputs .select-item:hover { font-size: 18px; color: #ff5353; }
  .keyboard-submit, .keyboard-submit-active { width: 32%; height: 40px; font-size: 14px; border-radius: 6px; }
  .keyboard-submit:hover, .keyboard-history:hover, .keyboard-continue:hover { transition: all 0.15s; border-color: #ff5353; color: #ff5353; }
  .keyboard-result {
    width: 50%;
    height: 100%;
    .title-flag-box { margin-right: 4px; padding-top: 1px; }
    .body-title {
      width: 100%;
      height: 30px;
      .body-title-text, .body-title-num, .body-title-text-alert { font-size: 16px; height: 100%; }
      .body-title-text-alert { padding: 0 0 0 2px; }
      .body-title-num { padding: 0 4px 0 6px; }
      .body-title-sec { font-size: 12px; padding-top: 1px; }
    }
    .body-alert { width: 100%; height: 24px; font-size: 10px; }
  }
  .keyboard-history, .keyboard-continue { width: 22%; height: 40px; font-size: 14px; border-radius: 6px; }
}
.white .nb-bet-keyboard-type {
  .keyboard-shows-text { color: #909090; }
  .keyboard-shows-num { color: #bababa; }
  .keyboard-inputs { border: solid 1px #EBE9E9; background: #fff; }
  .keyboard-inputs .select-title .sel-def { color: #909090; }
  .keyboard-inputs .select-arrow { border-left: 1px solid #EBE9E9; }
  .keyboard-inputs .select-list { background: #fff; border: 1px solid #EBE9E9; }
  .keyboard-inputs .select-title .sel-text { color: #909090; }
  .keyboard-inputs .select-title .sel-text::before { color: #bababa; }
  .keyboard-inputs.valued { border-color: #ff5353; .select-arrow { border-color: #ff5353; svg path { fill: #ff5353; } } .select-title .sel-text::before { color: #ff5353; } }
  .keyboard-submit, .keyboard-history, .keyboard-continue { border: 1px solid #EBE9E9; color: #909090; }
  .keyboard-submit:hover, .keyboard-history:hover, .keyboard-continue:hover { transition: all 0.15s; border-color: #ff5353; color: #ff5353; }
  .keyboard-submit-active { color: #fff; }
  .keyboard-result .body-alert { color: #909090; }
}

.dark .nb-bet-keyboard-type {
  .keyboard-inputs.blingking {
    animation: dark-boder-blink-animate linear 1.5s infinite;
    .select-arrow {
      animation: dark-boder-blink-animate linear 1.5s infinite;
    }
  }
}
</style>
