<template>
  <div class="nb-mult-btn-submit">
    <div class="content-shows flex-between">
      <div class="bet-show-get flex-start">
        <span class="show-get-txt">{{$t('pageBet.tMoneyBet')}} </span>
        <span class="show-get-num flex-center" :style="{ color: oddsColor }" v-if="tAmt">{{tAmt | NumFmt}}</span>
        <span class="show-get-null flex-center" v-else>- - -</span>
      </div>
      <div class="bet-show-get flex-end">
        <div class="show-get-txt flex-center">{{$t('pageBet.maxRtn')}}</div>
        <div class="show-get-num flex-start" :style="{ color: oddsColor }" v-if="tAmt">{{tRtn | NumFmt}}</div>
        <div class="show-get-null flex-center" v-else>- - -</div>
      </div>
    </div>
    <v-touch :class="`keyboard-bet-submit${actBet ? '-active' : ''} flex-center`" :style="btnStyle" @tap="betFun">
      {{$t(`pageBet.${lock || bAlt ? 'noBalance' : oAlt ? 'oddsChange' : 'sureBet'}`)}}
      <div class="bet-foot-odds-box flex-center" v-if="!lock && !bAlt && oAlt"
      :style="`transform:rotate(${oAlt < 0 ? 180 : 0}deg)`">
        <bet-odds-flag class="bet-foot-odds-change" size="0.4" />
      </div>
    </v-touch>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import oddsFormat from '@/filters/oddsFormat';
import { toPoralUrlByKey } from '@/utils/PortalUtils';
import BetOddsFlag from '@/components/Bet/BetComps/BetOddsFlag';

export default {
  inheritAttrs: false,
  name: 'BetOptionBtn',
  data() {
    return { btime: 0, lock: false };
  },
  computed: {
    ...mapState({
      bAlt: state => state.bet.balAlert,
      bList: state => state.bet.betList,
      oAlt: state => state.bet.oddsAlert,
    }),
    ...mapState('app', {
      theme: state => state.theme,
      user: state => state.userinfo,
    }),
    actBet() {
      const bArr = this.bList.filter(v => v.amt);
      const fArr = bArr.filter(v => v.amt < v.min || v.amt > v.max);
      return bArr.length && !fArr.length;
    },
    tMin() {
      let min = 999999999;
      for (let i = 0; i < this.bList.length; i += 1) {
        min = this.bList[i].min < min ? this.bList[i].min : min;
      }
      return min;
    },
    tAmt() {
      let tAmount = 0;
      for (let i = 0; i < this.bList.length; i += 1) {
        tAmount += this.bList[i].amt || 0;
      }
      return tAmount;
    },
    tRtn() {
      let tReturn = 0;
      for (let i = 0; i < this.bList.length; i += 1) {
        tReturn += (this.bList[i].amt || 0) * (1 + this.bList[i].odds);
      }
      return tReturn;
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
  },
  components: { BetOddsFlag },
  methods: {
    ...mapMutations(['changeBalAlert', 'changeShowIndex', 'changeBetAmount']),
    ...mapMutations('app', ['getUserInfo']),
    ...mapActions(['doBetAction']),
    async betFun() {
      this.getUserInfo();
      this.changeBalance();
      if (!this.user || !this.user.token) {
        if (this.actBet) this.$toast(this.$t('pageBet.notLogin'));
      } else if (this.lock || this.bAlt) {
        toPoralUrlByKey('DEPOSIT_PAGE_URL');
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const [arr, bets, opts] = [[], [], []];
        for (let i = 0; i < this.bList.length; i += 1) {
          const item = this.bList[i];
          if (item.amt && item.amt >= item.min && item.amt <= item.max) {
            arr.push(item);
            bets.push({ num: 1, cnt: 1, amt: +item.amt });
            opts.push({ oid: item.optionID, gpt: item.groupType, odv: oddsFormat(item.odds, item.gameType) });
          }
        }
        const rtn = await this.doBetAction({ code: 0, data: { arr, bets, opts } });
        if (rtn) {
          this.$toast(this.$t(`pageBet.${/^1$/.test(rtn) ? 'betWrong' : 'userWrong'}`));
        } else {
          this.changeShowIndex();
          this.changeBetAmount({ amt: '' });
        }
      }
    },
    changeBalance() {
      const bal = this.user && this.user.balance !== undefined ? this.user.balance : 100000;
      this.lock = bal < this.tMin;
      if (this.lock) this.changeBalAlert(true);
    },
  },
  mounted() {
    this.getUserInfo();
    this.changeBalance();
  },
};
</script>

<style lang="less">
.white .nb-mult-btn-submit {
  .content-shows .bet-show-item .show-item-txt { color: #909090; }
  .content-shows .bet-show-get { .show-get-txt, .show-get-null { color: #909090; } }
  .keyboard-bet-submit { color: #aaaaaa; border: .01rem solid #ecebeb; }
  .keyboard-bet-submit-active { color: #FFF; }
}
.black .nb-mult-btn-submit {
  .content-shows .bet-show-item .show-item-txt { color: #909090; }
  .content-shows .bet-show-get { .show-get-txt, .show-get-null { color: #909090; } }
  .keyboard-bet-submit { color: #716d6d; border: .01rem solid #716d6d; }
  .keyboard-bet-submit-active { color: #FFF; }
}
.blue .nb-mult-btn-submit {
  .content-shows .bet-show-item .show-item-txt { color: #909090; }
  .content-shows .bet-show-get { .show-get-txt, .show-get-null { color: #909090; } }
  .keyboard-bet-submit { color: #716d6d; border: .01rem solid #716d6d; }
  .keyboard-bet-submit-active { color: #FFF; }
}
.nb-mult-btn-submit {
  width: 100%;
  margin-top: .4rem;
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
  .keyboard-bet-submit, .keyboard-bet-submit-active {
    position: relative;
    width: 3.33rem;
    height: .48rem;
    border-radius: .06rem;
    font-size: .16rem;
    margin: .15rem auto .05rem;
    .bet-foot-odds-box {
      position: absolute;
      right: .5rem;
      top: 0;
      width: .42rem;
      height: .48rem;
      padding-top: .06rem;
    }
  }
}
</style>
