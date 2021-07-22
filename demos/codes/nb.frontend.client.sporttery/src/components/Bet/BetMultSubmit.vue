<template>
  <div class="nb-bet-mult-submit">
    <div class="mult-body-title flex-between">
      <div class="mult-bet-item flex-center">
        <span>{{bCnt}}{{$t('pageBet.betFolds')}}1</span>
      </div>
      <div class="mult-bet-amount flex-center">
        <div class="mult-amount-text flex-center">{{$t('pageBet.betting')}}</div>
        <bet-like-input class="mult-amount-num" :min="range.min" :max="range.max" :lock="right.lock" flag />
        <div class="mult-amount-text flex-center">{{$t('pageBet.money')}}</div>
      </div>
    </div>
    <div class="mult-body-shows flex-between">
      <div class="mult-body-show-item flex-center">
        <div class="mult-bet-show-item flex-center">{{$t('pageBet.balance')}}</div>
        <div class="mult-bet-show-num flex-center" :style="{ color: oddsColor }" v-if="balAct">{{balance | NumFmt}}</div>
        <div class="mult-bet-show-num flex-center" v-else>- - -</div>
      </div>
      <div class="mult-body-show-item flex-center">
        <div class="mult-bet-show-item flex-center">{{$t('pageBet.odds')}}</div>
        <div class="mult-bet-show-num flex-center" :style="{ color: oddsColor }">{{right.o | NumFmt(true, 3)}}</div>
      </div>
      <div class="mult-body-show-item flex-center">
        <div class="mult-bet-show-item flex-center">{{$t('pageBet.retn')}}</div>
        <div v-if="bAmt" class="mult-bet-show-num flex-center" :style="{ color: oddsColor }">{{right.m | NumFmt}}</div>
        <div v-else class="mult-bet-show-null flex-center">- - -</div>
      </div>
    </div>
    <div class="mult-body-foot flex-between" :style="st.o">
      <v-touch class="mult-bet-foot-cancel flex-center" :style="st.i" @tap="closeFun">{{$t('pageBet.cancel')}}</v-touch>
      <v-touch :class="betClass" :style="btnStyle" @tap="betFun">
        {{$t(`pageBet.${right.lock || bAlt ? 'noBalance' : oAlt ? 'oddsChange' : 'betNow'}`)}}
        <div class="bet-foot-odds-box flex-center" v-if="!right.lock && !bAlt && oAlt" :style="`transform:rotate(${oAlt < 0 ? 180 : 0}deg)`">
          <bet-odds-flag class="bet-foot-odds-change" size="0.4" />
        </div>
      </v-touch>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { toPoralUrlByKey } from '@/utils/PortalUtils';
import BetLikeInput from './BetComps/BetLikeInput';
import BetOddsFlag from './BetComps/BetOddsFlag';

export default {
  inheritAttrs: false,
  name: 'BetMultSubmit',
  data() {
    return {
      btime: 0,
      balance: 0,
      range: Object.assign({ min: 0, max: 0, rtn: 0 }, { odds: 0, mOdds: 0, gtp: 0 }),
      right: { m: 0, o: '1.00', lock: false },
      st: { o: {}, i: {} },
    };
  },
  computed: {
    ...mapState({
      bCnt: state => state.bet.betCount,
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
      return `mult-bet-foot-confirm-${this.right.lock || this.bAlt || this.actBet ? 'active' : 'normal'} flex-center`;
    },
    balAct() {
      return !!(this.user && this.user.balance !== undefined);
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
      this.changeBalance();
    },
    qObj() {
      this.changeBalance();
    },
    bCnt() {
      this.setKeySetting();
    },
  },
  components: { BetLikeInput, BetOddsFlag },
  methods: {
    ...mapMutations(['clearBetItem', 'changeBalAlert', 'changeBetAmount']),
    ...mapActions(['doBetAction']),
    ...mapMutations('app', ['getUserInfo']),
    closeFun() {
      this.clearBetItem();
    },
    changeMinMax() {
      const bal = this.user && this.user.balance !== undefined ? this.user.balance : 100000;
      [this.range.rtn, this.range.max, this.range.min] = [this.qObj.rtn, this.qObj.max, this.qObj.min];
      if (this.qArr && this.qArr.length && this.bCnt > 1) {
        for (let i = 0; i < this.qArr.length; i += 1) {
          if (`${this.qArr[i].betN}_${this.qArr[i].betM}` === `${this.bCnt}_1`) {
            [this.range.min, this.range.max] = [this.qArr[i].minBet || this.range.min, this.qArr[i].maxBet || this.range.max];
            break;
          }
        }
      }
      [this.range.odds, this.range.mOdds, this.range.gtp] = [this.qObj.odds || 1, this.qObj.mOdds || 1, this.qObj.gtp || 0];
      this.right.lock = bal < this.range.min;
      if (this.right.lock) this.changeBalAlert(true);
      return bal;
    },
    changeBalance() {
      const amt = this.bAmt || 0;
      const bal = this.changeMinMax();
      this.right.o = this.range.mOdds;
      let mrtn = amt * this.range.mOdds;
      if (this.bCnt > 1) {
        let [saveRtn, find] = [mrtn, false];
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
      [this.right.m, this.balance] = [mrtn, bal - amt];
    },
    async betFun() {
      this.getUserInfo();
      this.changeMinMax();
      if (!this.user || !this.user.token) {
        if (this.actBet) this.$toast(this.$t('pageBet.notLogin'));
      } else if (this.right.lock || this.bAlt) {
        toPoralUrlByKey('DEPOSIT_PAGE_URL');
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const rtn = await this.doBetAction({ code: 0, data: { } });
        if (rtn) this.$toast(this.$t(`pageBet.${/^1$/.test(rtn) ? 'betWrong' : 'userWrong'}`));
      }
    },
    setKeySetting() {
      let obj = { title: '', action: '', toast: this.$t('pageBet.maxToast') };
      obj = Object.assign({ num: this.bCnt, cnt: 1, amt: this.bAmt }, obj);
      [obj.min, obj.max, obj.odds] = [this.qObj.min, this.qObj.max, 0];
      this.changeBetAmount(obj);
    },
  },
  mounted() {
    this.getUserInfo();
    this.changeBalance();
    this.st.o.height = this.iphX ? '.65rem' : '.5rem';
    if (this.iphX) {
      this.st.i.paddingBottom = '.15rem';
    }
    setTimeout(this.setKeySetting, 10);
  },
};
</script>

<style lang="less">
.white .nb-bet-mult-submit {
  background: #FFF;
  border-top: .01rem solid #ECEBEB;
  .mult-body-title {
    border-bottom: .01rem solid #ECEBEB;
    .mult-bet-item { background: #F9F9F9; color:#909090; }
    .mult-bet-amount .mult-amount-text { color: #666; }
  }
  .mult-body-shows {
    background: #FFF;
    .mult-body-show-item .mult-bet-show-item, .mult-body-show-item .mult-bet-show-null { color: #909090; }
  }
  .mult-body-foot .mult-bet-foot-cancel { color: #909090; border-top: .01rem solid #ECEBEB; }
  .mult-body-foot .mult-bet-foot-confirm-normal { color: #909090; border-top: .01rem solid #ECEBEB; border-left: .01rem solid #ECEBEB; }
  .mult-body-foot .mult-bet-foot-confirm-active { color: #FFFFFF; }
}
.black .nb-bet-mult-submit {
  background: linear-gradient(to bottom, #3a393f, #333238);
  border-top: .01rem solid #2e2f34;
  .mult-body-title {
    border-bottom: .01rem solid #2e2f34;
    .mult-bet-item { background: linear-gradient(to bottom, #323237, #29292e); color: #909090; }
    .mult-bet-amount .mult-amount-text { color: #666; }
  }
  .mult-body-shows {
    background: linear-gradient(to bottom, #3a393f, #333238);
    .mult-body-show-item .mult-bet-show-item, .mult-body-show-item .mult-bet-show-null { color: #909090; }
  }
  .mult-body-foot .mult-bet-foot-cancel { color: #716d6d; border-top: .01rem solid #2e2f34; }
  .mult-body-foot .mult-bet-foot-confirm-normal { color: #716d6d; border-top: .01rem solid #2e2f34; border-left: .01rem solid #2e2f34; }
  .mult-body-foot .mult-bet-foot-confirm-active { color: #FFFFFF; }
}
.blue .nb-bet-mult-submit {
  background: linear-gradient(to bottom, #3a393f, #333238);
  border-top: .01rem solid #2e2f34;
  .mult-body-title {
    border-bottom: .01rem solid #2e2f34;
    .mult-bet-item { background: linear-gradient(to bottom, #323237, #29292e); color: #909090; }
    .mult-bet-amount .mult-amount-text { color: #666; }
  }
  .mult-body-shows {
    background: linear-gradient(to bottom, #3a393f, #333238);
    .mult-body-show-item .mult-bet-show-item, .mult-body-show-item .mult-bet-show-null { color: #909090; }
  }
  .mult-body-foot .mult-bet-foot-cancel { color: #716d6d; border-top: .01rem solid #2e2f34; }
  .mult-body-foot .mult-bet-foot-confirm-normal { color: #716d6d; border-top: .01rem solid #2e2f34; border-left: .01rem solid #2e2f34; }
  .mult-body-foot .mult-bet-foot-confirm-active { color: #FFFFFF; }
}
.nb-bet-mult-submit {
  width: 3.75rem;
  .mult-body-title {
    width: 100%;
    height: .5rem;
    .mult-bet-item { width: 1.4rem; height: 100%; font-size: .16rem; }
    .mult-bet-amount {
      width: 2.35rem;
      height: 100%;
      .mult-amount-text { width: .45rem; height: 100%; font-size: .14rem; }
      .mult-amount-num { width: 1.45rem; height: .32rem; }
    }
  }
  .mult-body-shows {
    width: 100%;
    height: .4rem;
    padding: 0 .12rem;
    .mult-body-show-item {
      height: 100%;
      .mult-bet-show-item, .mult-bet-show-null { font-size: .14rem; }
      .mult-bet-show-num { font-size: .16rem; }
      .mult-bet-show-num, .mult-bet-show-null { min-width: .5rem; }
    }
  }
  .mult-body-foot {
    width: 100%;
    .mult-bet-foot-cancel { width: 1.4rem; height: 100%; font-size: .16rem; }
    .mult-bet-foot-confirm-normal, .mult-bet-foot-confirm-active {
      position: relative;
      width: 2.35rem;
      height: 100%;
      font-size: .16rem;
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
</style>
