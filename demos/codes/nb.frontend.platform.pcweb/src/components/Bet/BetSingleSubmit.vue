<template>
  <div :class="`nb-bet-single-submit${betCheck ? '-mix' : ''}`">
    <div :class="`submit-box-top-show${betCheck ? '-mix' : ''} flex-between`">
      <div class="submit-shows flex-start">
        <span class="submit-shows-text-p" v-if="betCheck">{{$t('pageBet.totalAmtP')}}</span>
        <span class="submit-shows-text" v-else>{{$t('pageBet.totalAmt')}}</span>
        <span class="submit-shows-num" :style="willStyle">{{totalAmt || betCheck ? changeType(totalAmt, true) : '...............'}}</span>
      </div>
      <div class="submit-shows flex-end">
        <span class="submit-shows-text-p" v-if="betCheck">{{$t('pageBet.totalRtnP')}}</span>
        <span class="submit-shows-text" v-else>{{$t('pageBet.maxTotalRtn')}}</span>
        <span class="submit-shows-num" :style="willStyle">{{totalRtn || betCheck ? changeType(totalRtn, true) : '...............'}}</span>
      </div>
    </div>
    <div :class="`single-submit${betCheck ? '-mix' : ''}${actBet ? '-active' : ''} flex-center`" :style="btnStyle" @click="betFun" >
      {{$t(`pageBet.${balAlt ? 'noBalance' : oddsAlt ? `oddsChange${betCheck ? 'M' : ''}` : 'sureBet'}`)}}
      <div class="bet-foot-odds-box flex-center" v-if="!betCheck && !balAlt && oddsAlt" :style="`transform:rotate(${oddsAlt < 0 ? 180 : 0}deg)`">
        <bet-odds-flag class="bet-foot-odds-change" size="40" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { toPortalUrlByKey, getSettings } from '@/utils/PortalUtils';
import { changeNumType } from '@/utils/betUtils';
import oddsFormat from '@/filters/oddsFormat';
import BetOddsFlag from './BetComps/BetOddsFlag';

export default {
  inheritAttrs: false,
  name: 'BetSingleSubmit',
  data() {
    return { btime: 0 };
  },
  computed: {
    ...mapState({ betList: state => state.bet.betList }),
    ...mapState('app', ['userinfo', 'theme', 'bettingMode', 'bettingStyle']),
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
    balAct() {
      return !!(this.userinfo && this.userinfo.balance !== undefined);
    },
    curBal() {
      return this.balAct ? this.userinfo.balance : 100000;
    },
    betOpts() {
      return this.betList.filter(v => !v.type && /^7$/.test(v.betStatus));
    },
    oddsAlt() {
      let [oOdds, nOdds, aFlag] = [1, 1, 0];
      for (let i = 0; i < this.betOpts.length; i += 1) {
        aFlag = aFlag || this.betOpts[i].alert;
        oOdds += this.betOpts[i].oOdds || 0;
        nOdds += this.betOpts[i].odds || 0;
      }
      return this.betCheck ? aFlag : (nOdds - oOdds);
    },
    totalAmt() {
      let tAmt = 0;
      for (let i = 0; i < this.betOpts.length; i += 1) {
        tAmt += +(this.betOpts[i].amt || 0);
      }
      return tAmt;
    },
    balAlt() {
      return this.curBal < this.totalAmt;
    },
    totalRtn() {
      let tRtn = 0;
      for (let i = 0; i < this.betOpts.length; i += 1) {
        tRtn += +(this.betOpts[i].amt || 0) * (1 + this.betOpts[i].odds);
      }
      return tRtn;
    },
    actBet() {
      const dt = JSON.parse(JSON.stringify(this.betOpts));
      let betPass = 2;
      for (let i = 0; i < dt.length; i += 1) {
        const iAmt = +(dt[i].amt || 0);
        betPass = betPass > 1 && iAmt ? 1 : betPass;
        if (iAmt && (iAmt < dt[i].min || iAmt > dt[i].max || (iAmt * (1 + dt[i].odds) > dt[i].rtn))) {
          betPass = 0;
        }
      }
      return !!((this.betCheck && this.oddsAlt) || betPass === 1);
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
    btnStyle() {
      const obj = { };
      if (!this.balAlt && this.betCheck && this.oddsAlt) {
        obj.background = 'linear-gradient(98deg, #ffa653, #ff5378)';
      } else if (this.actBet) {
        [obj.background, obj.border] = [this.btnColor, `1px solid ${this.btnColor}`];
      }
      return obj;
    },
    willStyle() {
      return this.totalAmt || this.betCheck ? { color: this.oddsColor } : { };
    },
  },
  components: { BetOddsFlag },
  methods: {
    ...mapActions(['doBetAction', 'doMixBetAction']),
    ...mapMutations('app', ['getUserInfo']),
    ...mapMutations('agyy', ['pushRouter']),
    ...mapMutations(['quoteBetOption']),
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
    getBetObj() {
      const [dt, obj] = [JSON.parse(JSON.stringify(this.betOpts)), { type: '', noClear: false, opts: [] }];
      obj.slip = { tAmt: this.totalAmt, tRtn: this.totalRtn };
      [obj.arr, obj.bets] = [[], []];
      let tCnt = 0;
      for (let i = 0; i < dt.length; i += 1) {
        const dAmt = +(dt[i].amt || 0);
        if (dAmt && dAmt >= dt[i].min && dAmt <= dt[i].max && (dAmt * (1 + dt[i].odds) <= dt[i].rtn)) {
          tCnt += 1;
          obj.arr.push(dt[i]);
          obj.bets.push({ num: 1, cnt: 1, amt: dAmt });
          obj.opts.push({ oid: dt[i].optionID, gpt: dt[i].groupType, odv: oddsFormat(dt[i].odds, dt[i].gameType) });
        }
      }
      [obj.slip.arr, obj.slip.opts] = [[{ num: 1, cnt: tCnt }], obj.arr];
      return obj;
    },
    getBettingObj() {
      const [bArr, optCpArr] = [[], JSON.parse(JSON.stringify(this.betOpts))];
      let [ttlAmt, ttlRtn] = [0, 0];
      for (let i = 0; i < optCpArr.length; i += 1) {
        optCpArr[i].alert = 0;
        const [obj, oAmt] = [optCpArr[i], optCpArr[i].amount || optCpArr[i].sAmount || optCpArr[i].amt || 0];
        if (oAmt) {
          const tRtn = (+oAmt) * (1 + obj.odds);
          [ttlAmt, ttlRtn] = [ttlAmt + (+oAmt), ttlRtn + tRtn];
          const bItem = Object.assign({ num: 1, fld: 1, cnt: 1 }, { amt: +oAmt, rtn: tRtn, odds: 1 + obj.odds });
          const defObj = Object.assign({ wid: '', slip: 1, code: -1 }, { amt: +oAmt, rtn: tRtn });
          bArr.push(Object.assign(defObj, { btp: 1, bets: [bItem], opts: [obj] }));
        }
      }
      return { amt: ttlAmt, rtn: ttlRtn, arr: bArr };
    },
    makeBetParams() {
      const [bArr, optCpArr] = [[], JSON.parse(JSON.stringify(this.betOpts))];
      for (let i = 0; i < optCpArr.length; i += 1) {
        const [obj, oAmt] = [optCpArr[i], optCpArr[i].amount || optCpArr[i].sAmount || optCpArr[i].amt || 0];
        if (oAmt) {
          const bItem = Object.assign({ num: 1, fld: 1, cnt: 1 }, { amt: +oAmt });
          bArr.push({ btp: 1, bets: [bItem], optArr: [obj] });
        }
      }
      return bArr;
    },
    async betFun() {
      this.getUserInfo();
      if (!this.userinfo || !this.userinfo.token) {
        if (this.betCheck && this.oddsAlt) {
          this.quoteBetOption({ data: this.betList });
        } else if (this.actBet) {
          toPortalUrlByKey('LOGIN_PAGE_URL');
        }
      } else if (this.balAlt) {
        const pSet = getSettings();
        if (pSet && pSet.USER_CENTER_URL && pSet.DEPOSIT_PAGE_URL) {
          toPortalUrlByKey('DEPOSIT_PAGE_URL');
        } else if (pSet && pSet.USER_CENTER_URL) {
          toPortalUrlByKey('USER_CENTER_URL');
        } else {
          this.pushRouter('/member/payment');
        }
      } else if (this.betCheck && this.oddsAlt) {
        this.quoteBetOption({ data: this.betList });
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        let rtn = null;
        if (this.betCheck) {
          rtn = await this.doMixBetAction({ data: this.makeBetParams(), set: this.getBettingObj() });
        } else {
          rtn = await this.doBetAction(this.getBetObj());
        }
        if (rtn) {
          let rtnStr = /^2$/.test(rtn) ? 'userWrong' : 'betWrong';
          rtnStr = /^3$/.test(rtn) ? 'noBetList' : rtnStr;
          this.$toast(this.$t(`pageBet.${rtnStr}`));
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
.nb-bet-single-submit, .nb-bet-single-submit-mix {
  width: 100%;
  margin: 0 auto;
  .submit-box-top-show { width: 100%; height: 44px; padding: 0 20px; }
  .submit-box-top-show-mix { width: 100%; height: 38px; padding: 0 22px; }
  .submit-shows { width: 100%; height: 100%; }
  .submit-shows-text, .submit-shows-text-p { font-size: 12px; }
  .submit-shows-text-p { padding-right: 5px; }
  .submit-shows-num { font-size: 16px; }
  .single-submit, .single-submit-active { position: relative; width: 290px; height: 40px; margin: 0 auto 12px; border-radius: 6px; font-size: 16px; }
  .single-submit-mix, .single-submit-mix-active { position: relative; width: 290px; height: 40px; margin: 0 auto 12px; border-radius: 6px; font-size: 16px; }
  .bet-foot-odds-box { position: absolute; right: 20px; top: 0; width: 42px; height: 48px; padding-top: 6px; }
}

.white .nb-bet-single-submit, .white .nb-bet-single-submit-mix {
  border-top: solid 1px #EBE9E9;
  box-shadow: 0 2px 12px 0 rgba(223,222,223,0.5);
  background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
  .submit-shows-text, .submit-shows-text-p { color: #909090; }
  .submit-shows-num { color: #909090; }
  .single-submit { border: 1px solid #ecebeb; color: #aaaaaa; }
  .single-submit-active { color: #fff; }
  .single-submit-mix { background: #bababa; color: #ffffff80; }
  .single-submit-mix-active { color: #fff; }
}
.white .nb-bet-single-submit { border-bottom: solid 1px #EBE9E9; }

.dark {
  .nb-bet-single-submit,
  .nb-bet-single-submit-mix {
    border-top: 1px solid #2e2f34;
    .submit-shows-num {
      color: #53fffd !important;
    }
    .single-submit-mix {
      background: #4d4c54;
      color: #888;
      cursor: pointer;
      transition: all .25s ease-out;
      &:active {
        background: #00b5b3;
        color: #fff;
      }
    }
  }
  .single-submit-mix-active {
    cursor: pointer;
    background: #00b5b3 !important;
    color: #fff !important;
    border-color: #00b5b3 !important;
  }
}
</style>
