<template>
<bet-cover-box class="nb-bet-single" :index="99999" :show="show" @close="closeFun" animate>
  <div class="bet-single-close flex-end">
    <bet-cover-close :color="closeColor" />
  </div>
  <div class="bet-single-body">
    <div class="body-title flex-between">
      <div class="bet-item flex-start">
        <span>{{$t('pageBet.betStr')}}</span>
        <span v-if="norSport">{{getOptName()}}</span>
        <span v-else>{{$t(`pageBet.otherObj.${sportID}`)}}</span>
      </div>
      <div class="bet-amount flex-end">
        <div class="amount-text flex-end">{{$t('pageBet.balance')}}</div>
        <div class="amount-num flex-center" v-if="balAct" :style="{ color: oddsColor }">{{balance | NumFmt}}</div>
        <div class="amount-null flex-center" v-else>- - -</div>
      </div>
    </div>
    <div class="body-content">
      <bet-keyboard-simple :min="range.min" :max="range.max" :num="singleNum" :lock="right.lock || lockInput" :alert="alertFun"
      :title="singleTitle" :toast="$t('pageBet.maxToast')" :place="$t('pageBet.betRange')" :check="addCheck" />
      <div class="content-shows flex-between">
        <div class="bet-show-item flex-start">
          <span class="show-item-txt">{{$t('pageBet.liveOdds')}}</span>
          <span class="show-item-odds" :style="{ color: oddsColor }">{{oddsv | NumFmt(true, 3)}}</span>
        </div>
        <div class="bet-show-get flex-end">
          <div class="show-get-txt flex-center">{{$t('pageBet.ifRight')}}</div>
          <div v-if="bAmt" class="show-get-num flex-center" :style="{ color: oddsColor }">{{right.s | NumFmt}}</div>
          <div v-else class="show-get-null flex-center">- - -</div>
        </div>
      </div>
    </div>
    <div class="body-foot flex-between" :style="st.o">
      <v-touch class="bet-foot-cancel flex-center" :style="st.i" @tap="closeFun">{{$t('pageBet.cancel')}}</v-touch>
      <v-touch :class="betClass" :style="btnStyle" @tap="betFun">
        {{$t(`pageBet.${right.lock || bAlt ? 'noBalance' : oAlt ? 'oddsChange' : 'betNow'}`)}}
        <div class="bet-foot-odds-box flex-center" v-if="!right.lock && !bAlt && oAlt" :style="`transform:rotate(${oAlt < 0 ? 180 : 0}deg)`">
          <bet-odds-flag class="bet-foot-odds-change" size="0.4" />
        </div>
      </v-touch>
    </div>
  </div>
</bet-cover-box>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { toPoralUrlByKey } from '@/utils/PortalUtils';
import oddsFormat from '@/filters/oddsFormat';
import BetCoverBox from './BetComps/BetCoverBox';
import BetKeyboardSimple from './BetKeyboardSimple';
import BetCoverClose from './BetComps/BetCoverClose';
import toOptionName from '../common/GameOption/toOptionName';
import BetOddsFlag from './BetComps/BetOddsFlag';

export default {
  inheritAttrs: false,
  name: 'BetSingle',
  data() {
    return {
      btime: 0,
      balance: 0,
      lockInput: false,
      range: Object.assign({ min: 0, max: 0, rtn: 0 }, { odds: 0, mOdds: 0, gtp: 0 }),
      oddsv: '',
      right: { s: 0, lock: false },
      st: { o: {}, i: {} },
      maxInput: 0,
    };
  },
  props: { show: Boolean },
  computed: {
    ...mapState({
      bCnt: state => state.bet.betCount,
      bShow: state => state.bet.betShow,
      qObj: state => state.bet.quoteObj,
      qArr: state => state.bet.quoteMultArr,
      bAmt: state => state.bet.betInputObj.amt,
      bAlt: state => state.bet.balAlert,
      oAlt: state => state.bet.oddsAlert,
      iphX: state => state.bet.isIphoneX,
    }),
    ...mapState('app', { user: state => state.userinfo, theme: state => state.theme }),
    actBet() {
      const amt = +(this.bAmt || 0);
      return amt && amt >= this.range.min && amt <= this.range.max;
    },
    betClass() {
      return `bet-foot-confirm-${this.right.lock || this.bAlt || this.actBet ? 'active' : 'normal'} flex-center`;
    },
    balAct() {
      return !!(this.user && this.user.balance !== undefined);
    },
    sportID() {
      const rArr = this.$route.path.split('/');
      return rArr.length ? rArr[rArr.length - 1] : 10;
    },
    norSport() {
      return !/^[5-9]\d{2}$/.test(this.sportID);
    },
    singleNum() {
      return /^8{3}$/.test(this.sportID) ? this.bCnt : 1;
    },
    singleTitle() {
      return this.norSport ? '' : this.$t(`pageBet.otherObj.${this.sportID}`);
    },
    closeColor() {
      const defColor = /black/i.test(this.theme) ? '#bababa' : '#ddd';
      return /blue/i.test(this.theme) ? '#bababa' : defColor;
    },
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
    btnColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BOTTON_BACKGROUND ? pSet.BLACK_BOTTON_BACKGROUND : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_BOTTON_BACKGROUND ? pSet.BLUE_BOTTON_BACKGROUND : '#00b5b3';
      }
      return pSet && pSet.WHITE_BOTTON_BACKGROUND ? pSet.WHITE_BOTTON_BACKGROUND : '#ff5353';
    },
    btnStyle() {
      const obj = /active/i.test(this.betClass) ? { background: this.btnColor } : { };
      return Object.assign(obj, this.st.i);
    },
  },
  watch: {
    user() {
      this.changeBalance();
    },
    bAmt() {
      this.changeBalAlert();
      this.changeBalance();
    },
    qObj() {
      this.changeBalance();
    },
    iphX() {
      this.setBottomStyle();
    },
    async show(n, o) {
      this.lockInput = true;
      const obj = Object.assign({ num: this.singleNum, cnt: 1, amt: this.bAmt }, { title: '', action: '', odds: 0 });
      [obj.min, obj.max] = [this.range.min, this.range.max];
      this.changeBetAmount(obj);
      this.getUserInfo();
      if (this.show && this.user && this.user.token) {
        const tResult = await this.tranBalToNB(true);
        if (tResult) {
          this.getNBUser(true);
        } else {
          this.reloadBalance();
        }
      }
      setTimeout(() => { this.lockInput = false; }, 500);
      if (!n && o && this.user && this.user.token) {
        this.transferToNB();
      }
    },
  },
  components: {
    BetCoverBox,
    BetOddsFlag,
    BetCoverClose,
    BetKeyboardSimple,
  },
  methods: {
    ...mapMutations(['clearBetItem', 'changeKeyStatus', 'changeBetAmount', 'changeBalAlert']),
    ...mapActions(['doBetAction', 'tranBalToNB', 'getNBUser']),
    ...mapActions('app', ['reloadBalance', 'transferToNB']),
    ...mapMutations('app', ['getUserInfo']),
    getOptName() {
      let optName = '---';
      if (this.bShow) {
        const obj = toOptionName(this.bShow.gmt, this.bShow.bar, this.bShow.opt);
        optName = obj.key_s ? this.$t(`common.optionNames.${obj.key_s}`) : '';
        optName += obj.prefix ? `${/-/.test(obj.prefix) ? '' : '+'}${obj.prefix} ` : '';
        optName += obj.key_e ? this.$t(`common.optionNames.${obj.key_e}`) : '';
        optName += !obj.key_s && obj.key ? this.$t(`common.optionNames.${obj.key}`) : '';
        optName += `${obj.value || ''}${obj.suffix || ''}`;
      }
      return optName;
    },
    closeFun() {
      this.clearBetItem();
    },
    showKey() {
      this.changeKeyStatus(1);
    },
    changeMinMax() {
      const bal = this.user && this.user.balance !== undefined ? this.user.balance : 100000;
      [this.range.rtn, this.range.max, this.range.min] = [this.qObj.rtn, this.qObj.max, this.qObj.min];
      [this.range.odds, this.range.mOdds, this.range.gtp] = [this.qObj.odds || 1, this.qObj.mOdds || 1, this.qObj.gtp || 0];
      const [oddOld, oddNew] = [this.range.odds, oddsFormat(this.range.odds, this.range.gtp)];
      let newOddv = oddNew - oddOld > 0.5 ? oddOld + 1 : oddOld;
      newOddv = /^8{3}$/.test(this.sportID) ? this.range.mOdds : newOddv;
      [this.right.lock, this.oddsv] = [bal < this.range.min, newOddv];
      if (this.right.lock) this.changeBalAlert(true);
      return bal;
    },
    changeBalance() {
      const amt = this.bAmt || 0;
      const bal = this.changeMinMax();
      let xrtn = amt * (this.range.odds + 1);
      xrtn = xrtn <= this.range.rtn ? xrtn : this.range.rtn;
      let [saveRtn, find] = [this.range.rtn, false];
      let mrtn = amt * this.range.mOdds;
      if (this.bCnt > 1) {
        if (this.qArr && this.qArr.length) {
          for (let i = 0; i < this.qArr.length; i += 1) {
            if (`${this.qArr[i].betN}_${this.qArr[i].betM}` === `${this.bCnt}_1`) {
              [saveRtn, find] = [this.qArr[i].maxReturn || saveRtn, !!this.qArr[i].maxReturn];
              break;
            }
          }
        }
        if (this.user && this.user.rtn && !find) {
          for (let i = this.bCnt; i >= 2; i -= 1) {
            if (this.user.rtn[`mut${i}`]) {
              const userRtnObj = this.user.rtn[`mut${i}`];
              if (typeof userRtnObj === 'object' && userRtnObj.maxReturn) {
                saveRtn = +userRtnObj.maxReturn;
              } else {
                saveRtn = +userRtnObj;
              }
              break;
            }
          }
        }
        mrtn = mrtn > saveRtn ? saveRtn : mrtn;
      }
      const rtnNum = /^8{3}$/.test(this.sportID) ? mrtn : xrtn;
      const mInput = /^8{3}$/.test(this.sportID) ? saveRtn / (this.range.mOdds || 1) : this.range.rtn / (this.range.odds + 1);
      [this.maxInput, this.right.s, this.balance] = [parseInt(mInput, 10), rtnNum, bal - amt];
    },
    alertFun(amt) {
      if (+amt > this.maxInput) {
        this.$toast(`${this.$t('pageBet.leftToast')} ${this.maxInput} ${this.$t('pageBet.rightToast')}`);
        return this.maxInput;
      }
      return amt;
    },
    addCheck(amt) {
      const bal = this.changeMinMax();
      if (amt > bal) this.changeBalAlert(true);
      return amt <= bal;
    },
    async betFun() {
      this.getUserInfo();
      this.changeMinMax();
      if (!this.user || !this.user.token) {
        if (this.actBet) this.$toast(this.$t('pageBet.notLogin'));
      } else if (this.right.lock || this.bAlt) {
        toPoralUrlByKey('DEPOSIT_PAGE_URL');
        this.clearBetItem();
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const rtn = await this.doBetAction({ code: 0, data: { } });
        if (rtn) this.$toast(this.$t(`pageBet.${/^1$/.test(rtn) ? 'betWrong' : 'userWrong'}`));
      }
    },
    setBottomStyle() {
      this.st.o.height = this.iphX ? '.65rem' : '.5rem';
      if (this.iphX) {
        this.st.i.paddingBottom = '.15rem';
      }
    },
  },
  mounted() {
    this.getUserInfo();
    this.changeBalance();
    this.setBottomStyle();
  },
};
</script>

<style lang="less">
.white .nb-bet-single .nb-bet-public-box-body .bet-single-body {
  background: #fff;
  .body-title {
    border-bottom: .01rem solid rgba(236,236,236,0.5);
    background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
    .bet-item { color: #2E2F34; }
    .bet-amount .amount-text { color: #909090; }
    .bet-amount .amount-null { color: #909090; }
  }
  .body-content .content-shows .bet-show-item .show-item-txt { color: #909090; }
  .body-content .content-shows .bet-show-get {
    .show-get-txt, .show-get-null { color: #909090; }
  }
  .body-foot .bet-foot-cancel { color: #909090; border-top: .01rem solid #ECEBEB; }
  .body-foot .bet-foot-confirm-normal {
    color: #909090;
    border-top: .01rem solid #ECEBEB;
    border-left: .01rem solid #ECEBEB;
  }
  .body-foot .bet-foot-confirm-active { color: #FFFFFF; }
}
.black .nb-bet-single .nb-bet-public-box-body .bet-single-body {
  background: linear-gradient(to bottom, #3a393f, #333238);
  .body-title {
    border-bottom: .01rem solid #2e2f34;
    background: linear-gradient(to bottom, #3a393f, #333238);
    .bet-item { color: #bababa; }
    .bet-amount .amount-text { color: #909090; }
    .bet-amount .amount-null { color: #909090; }
  }
  .body-content .content-shows .bet-show-item .show-item-txt { color: #909090; }
  .body-content .content-shows .bet-show-get {
    .show-get-txt, .show-get-null { color: #909090; }
  }
  .body-foot .bet-foot-cancel { color: #716d6d; border-top: .01rem solid #2e2f34; }
  .body-foot .bet-foot-confirm-normal {
    color: #716d6d;
    border-top: .01rem solid #2e2f34;
    border-left: .01rem solid #2e2f34;
  }
  .body-foot .bet-foot-confirm-active { color: #FFFFFF; }
}
.blue .nb-bet-single .nb-bet-public-box-body .bet-single-body {
  background: linear-gradient(to bottom, #3a393f, #333238);
  .body-title {
    border-bottom: .01rem solid #2e2f34;
    background: linear-gradient(to bottom, #3a393f, #333238);
    .bet-item { color: #bababa; }
    .bet-amount .amount-text { color: #909090; }
    .bet-amount .amount-null { color: #909090; }
  }
  .body-content .content-shows .bet-show-item .show-item-txt { color: #909090; }
  .body-content .content-shows .bet-show-get {
    .show-get-txt, .show-get-null { color: #909090; }
  }
  .body-foot .bet-foot-cancel { color: #716d6d; border-top: .01rem solid #2e2f34; }
  .body-foot .bet-foot-confirm-normal {
    color: #716d6d;
    border-top: .01rem solid #2e2f34;
    border-left: .01rem solid #2e2f34;
  }
  .body-foot .bet-foot-confirm-active { color: #FFFFFF; }
}
.nb-bet-single .nb-bet-public-box-body {
  bottom: 0;
  .bet-single-body {
    width: 3.75rem;
    margin: 0 auto;
    border-top-left-radius: .1rem;
    border-top-right-radius: .1rem;
    .body-title {
      width: 100%;
      height: .44rem;
      padding: 0 .12rem;
      border-top-left-radius: .1rem;
      border-top-right-radius: .1rem;
      .bet-item { width: 1.5rem; height: 100%; font-size: .14rem; }
      .bet-amount {
        width: 1.8rem;
        height: 100%;
        .amount-text { width: .8rem; height: 100%; font-size: .14rem; }
        .amount-num, .amount-null { width: 1rem; height: 100%; font-size: .16rem; }
      }
    }
    .body-content {
      width: 100%;
      height: 1.5rem;
      .content-shows {
        width: 100%;
        height: .22rem;
        padding: 0 .12rem;
        .bet-show-item {
          height: 100%;
          .show-item-txt { font-size: .14rem; }
          .show-item-odds { font-size: .16rem; }
        }
        .bet-show-get {
          height: 100%;
          .show-get-txt, .show-get-null { font-size: .14rem; }
          .show-get-num { font-size: .16rem; }
          .show-get-num, .show-get-null { min-width: .5rem; }
        }
      }
    }
    .body-foot {
      width: 100%;
      .bet-foot-cancel { width: 1.4rem; height: 100%; font-size: .16rem; }
      .bet-foot-confirm-normal, .bet-foot-confirm-active {
        width: 2.35rem;
        height: 100%;
        font-size: .16rem;
        position: relative;
        .bet-foot-odds-box {
          position: absolute;
          right: 0;
          top: 0;
          width: .42rem;
          height: .5rem;
          padding-top: .06rem;
        }
      }
    }
  }
  .bet-single-close { width: 3.75rem; height: .54rem; margin: 0 auto; padding: 0 .12rem; }
}
</style>
