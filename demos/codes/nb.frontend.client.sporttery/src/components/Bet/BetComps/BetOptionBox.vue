<template>
  <v-touch class="nb-history-option-box flex-center-col" @tap="eFun(data)">
    <bet-history-option :data="data" :showId="showId" isSingle />
    <div class="content-inputs flex-between" v-if="showAmt && !showKey">
      <div class="bet-show-get flex-start">
        <span class="show-get-txt">{{$t('pageBet.moneyBet')}} </span>
        <span class="show-get-num show-get-input flex-center" :style="{ color: oddsColor }" v-if="data.amt">{{data.amt | NumFmt}}</span>
        <span class="show-get-null show-get-input flex-center" v-else>- - -</span>
      </div>
      <div class="bet-show-get flex-end">
        <div class="show-get-txt flex-center">{{$t('pageBet.ifRight')}}</div>
        <div class="show-get-num flex-start" :style="{ color: oddsColor }" v-if="data.amt">{{data.amt * (1 + data.odds) | NumFmt}}</div>
        <div class="show-get-null flex-center" v-else>- - -</div>
      </div>
    </div>
    <transition name="option">
      <div class="page-item-keyboard" v-if="showKey">
        <bet-keyboard-simple :min="data.min" :max="data.max" :lock="right.lock" :odds="data.odds"
        :toast="$t('pageBet.maxToast')" :place="$t('pageBet.betRange')" :check="addCheck" />
        <div class="content-shows flex-between">
          <div class="bet-show-item flex-start">
            <span class="show-item-txt">{{$t('pageBet.balance')}}</span>
            <span class="show-item-odds" :style="{ color: oddsColor }" v-if="balAct">{{balance | NumFmt}}</span>
            <span class="show-item-odds" v-else>- - -</span>
          </div>
          <div class="bet-show-get flex-end">
            <div class="show-get-txt flex-center">{{$t('pageBet.ifRight')}}</div>
            <div v-if="bAmt" class="show-get-num flex-start" :style="{ color: oddsColor }">{{right.s | NumFmt}}</div>
            <div v-else class="show-get-null flex-center">- - -</div>
          </div>
        </div>
        <div :class="`keyboard-bet-submit${actBet ? '-active' : ''} flex-center`" :style="btnStyle" v-if="!showAmt">
          {{$t(`pageBet.${right.lock || bAlt ? 'noBalance' : data.alert ? 'oddsChange' : 'sureBet'}`)}}
          <div class="bet-foot-odds-box flex-center" v-if="!right.lock && !bAlt && data.alert"
          :style="`transform:rotate(${data.alert < 0 ? 180 : 0}deg)`">
            <bet-odds-flag class="bet-foot-odds-change" size="0.4" />
          </div>
        </div>
      </div>
    </transition>
    <div class="page-item-close flex-center">
      <bet-cover-close size="0.16" :color="closeColor" />
    </div>
    <div class="page-item-cover" v-if="!/^7$/.test(data.betStatus)"></div>
    <div class="page-item-line" v-if="data.same && showId"></div>
  </v-touch>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { toPoralUrlByKey } from '@/utils/PortalUtils';
import BetKeyboardSimple from '@/components/Bet/BetKeyboardSimple';
import BetCoverClose from '@/components/Bet/BetComps/BetCoverClose';
import BetHistoryOption from '@/components/Bet/BetComps/BetHistoryOption';
import BetOddsFlag from '@/components/Bet/BetComps/BetOddsFlag';

export default {
  inheritAttrs: false,
  name: 'BetOptionBox',
  data() {
    return { btime: 0, balance: 0, right: { s: 0, lock: false } };
  },
  props: { data: Object, showId: Boolean },
  computed: {
    ...mapState({
      bAmt: state => state.bet.betInputObj.amt,
      uBal: state => state.bet.usedBalance,
      bAlt: state => state.bet.balAlert,
      bList: state => state.bet.betList,
    }),
    ...mapState('app', {
      theme: state => state.theme,
      user: state => state.userinfo,
      betMode: state => state.bettingMode,
    }),
    actBet() {
      const amt = +(this.bAmt || 0);
      return amt && amt >= this.data.min && amt <= this.data.max;
    },
    showKey() {
      const dt = this.data;
      return dt.show && !this.showId && /^2$/.test(this.betMode) && /^7$/.test(dt.betStatus);
    },
    balAct() {
      return !!(this.user && this.user.balance !== undefined);
    },
    showAmt() {
      const con = window.NBConfig;
      return /^2$/.test(con.BETTING_MODE) && con.ALLOW_SAME_MATCH && con.ALLOW_MULT_OPTION && !this.showId;
    },
    closeColor() {
      const defColor = /black/i.test(this.theme) ? '#909090' : '#BABABA';
      return /blue/i.test(this.theme) ? '#909090' : defColor;
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
      return this.actBet ? { background: this.btnColor, border: `.01rem solid ${this.btnColor}` } : { };
    },
  },
  watch: {
    user() {
      this.changeBalance();
    },
    bAmt() {
      this.changeBalAlert();
      this.changeBalance();
      if (this.showKey) {
        const dt = JSON.parse(JSON.stringify(this.data));
        dt.amt = this.bAmt;
        this.updateList(dt);
      }
    },
  },
  components: {
    BetCoverClose,
    BetHistoryOption,
    BetKeyboardSimple,
    BetOddsFlag,
  },
  methods: {
    ...mapMutations(['clearBetItem', 'changeBalAlert', 'changeShowIndex', 'changeBetAmount', 'updateList', 'changeUsedBalance', 'changeSubStatus']),
    ...mapMutations('app', ['getUserInfo']),
    ...mapActions(['doBetAction']),
    eFun(v) {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/submit/i.test(cName)) {
        this.betFun([v]);
      } else if (/close/i.test(cName)) {
        this.clearBetItem(v);
      } else if (/^2$/.test(this.betMode) && !this.showId) {
        if (/^7$/.test(v.betStatus)) {
          this.changeShowIndex({ idx: v.idx, show: this.showAmt });
          this.changeUsedBalance(this.getOtherAmt());
          if (this.showAmt) {
            this.changeBetAmount({ amt: this.data.amt || '' });
          }
        }
      } else if (v.matchID && /^7$/.test(v.betStatus)) {
        this.$router.push(`/detail/${v.sportID}/${v.matchID}`);
        this.changeSubStatus(false);
      }
    },
    addCheck(amt) {
      const bal = this.changeMinMax();
      if (amt > bal) this.changeBalAlert(true);
      return amt <= bal;
    },
    async betFun(arr) {
      this.getUserInfo();
      this.changeMinMax();
      if (!this.user || !this.user.token) {
        if (this.actBet) this.$toast(this.$t('pageBet.notLogin'));
      } else if (this.right.lock || this.bAlt) {
        toPoralUrlByKey('DEPOSIT_PAGE_URL');
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const rtn = await this.doBetAction({ code: 0, data: { arr } });
        if (rtn) {
          this.$toast(this.$t(`pageBet.${/^1$/.test(rtn) ? 'betWrong' : 'userWrong'}`));
        } else {
          this.changeShowIndex();
          this.changeBetAmount({ amt: '' });
        }
      }
    },
    changeMinMax() {
      const userBal = this.user && this.user.balance !== undefined ? this.user.balance : 100000;
      const bal = userBal - (this.uBal || 0);
      this.right.lock = bal < this.data.min;
      if (this.right.lock) this.changeBalAlert(true);
      return bal;
    },
    getOtherAmt() {
      let tAmt = 0;
      for (let i = 0; i < this.bList.length; i += 1) {
        if (`${this.bList[i].optionID}` !== `${this.data.optionID}`) {
          tAmt += this.bList[i].amt || 0;
        }
      }
      return this.showAmt ? tAmt : 0;
    },
    changeBalance() {
      const amt = this.bAmt || 0;
      const bal = this.changeMinMax();
      let xrtn = amt * (this.data.odds + 1);
      xrtn = xrtn <= this.data.rtn ? xrtn : this.data.rtn;
      [this.right.s, this.balance] = [xrtn, bal - amt];
    },
  },
  mounted() {
    this.getUserInfo();
    this.changeBalance();
  },
};
</script>

<style lang="less">
.option-enter-active, .option-leave-active { transition: all 0.15s linear; }
.option-enter, .option-leave-active { transform: scaleY(0); }
.white .nb-history-option-box {
  .page-item-cover { background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%); }
  .page-item-keyboard {
    border-top: .01rem solid #ecebeb;
    .keyboard-bet-submit { color: #aaaaaa; border: .01rem solid #ecebeb; }
    .keyboard-bet-submit-active { color: #FFF; }
  }
  .page-item-line { background: #ff5353; }
  .bet-show-item .show-item-txt { color: #909090; }
  .bet-show-get { .show-get-txt, .show-get-null { color: #909090; } }
  .show-get-input { border: .01rem solid #ecebeb; }
}
.black .nb-history-option-box {
  .page-item-cover { background: linear-gradient(to bottom, #3a393f, #333238); }
  .page-item-keyboard {
    border-top: .01rem solid #2e2f34;
    .keyboard-bet-submit { color: #716d6d; border: .01rem solid #716d6d; }
    .keyboard-bet-submit-active { color: #FFF; }
  }
  .page-item-line { background: #ff5353; }
  .bet-show-item .show-item-txt { color: #909090; }
  .bet-show-get { .show-get-txt, .show-get-null { color: #909090; } }
  .show-get-input { border: .01rem solid #716d6d; }
}
.blue .nb-history-option-box {
  .page-item-cover { background: linear-gradient(to bottom, #3a393f, #333238); }
  .page-item-keyboard {
    border-top: .01rem solid #2e2f34;
    .keyboard-bet-submit { color: #716d6d; border: .01rem solid #716d6d; }
    .keyboard-bet-submit-active { color: #FFF; }
  }
  .page-item-line { background: #ff5353; }
  .bet-show-item .show-item-txt { color: #909090; }
  .bet-show-get { .show-get-txt, .show-get-null { color: #909090; } }
  .show-get-input { border: .01rem solid #716d6d; }
}
.nb-history-option-box {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: .86rem;
  padding-bottom: .05rem;
  overflow: hidden;
  border-radius: .1rem;
  .page-item-cover { position: absolute; width: 100%; top: 0; bottom: 0; z-index: 15; opacity: .5; }
  .page-item-close { position: absolute; width: .34rem; height: .34rem; top: 0; right: 0; z-index: 20; }
  .page-item-line { position: absolute; width: .05rem; height: 100%; left: 0; top: 0; z-index: 5; }
  .page-item-keyboard {
    width: 100%;
    margin-top: .1rem;
    .keyboard-bet-submit, .keyboard-bet-submit-active {
      position: relative;
      width: 3.33rem;
      height: .48rem;
      border-radius: .06rem;
      font-size: .16rem;
      margin: .15rem auto .05rem;
      .bet-foot-odds-box { position: absolute; right: .5rem; top: 0; width: .42rem; height: .48rem; padding-top: .06rem; }
    }
  }
  .content-shows, .content-inputs {
    width: 100%;
    padding: 0 .12rem;
    .bet-show-item { height: 100%; .show-item-txt { font-size: .14rem; } .show-item-odds { font-size: .16rem; } }
    .bet-show-get {
      height: 100%;
      .show-get-txt, .show-get-null { font-size: .14rem; }
      .show-get-num { font-size: .16rem; }
      .show-get-num, .show-get-null { min-width: .5rem; }
      .show-get-input { height: .25rem; margin: 0 .1rem; border-radius: .04rem; min-width: .85rem; }
    }
  }
  .content-shows { height: .22rem; }
  .content-inputs { height: .32rem; }
}
</style>
