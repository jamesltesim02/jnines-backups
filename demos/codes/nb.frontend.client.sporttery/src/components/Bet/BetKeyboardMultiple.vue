<template>
  <div class="nb-bet-keyboard-multiple">
    <div class="input-box-item">
      <v-touch class="input-touch-box" v-for="v in bets" :key="v.nm" @tap="touchFun(v)">
        <div class="input-box-item-box flex-between">
          <div :class="`input-box-item-title${v.active ? '-active' : ''} flex-start`">
            <span class="box-item-title-point"></span>
            <span class="box-item-title-text">{{getMultName(v.nm, v.fld)}}</span>
          </div>
          <div class="input-box-item-body flex-end">
            <span class="input-box-item-count">
              {{`${$t('pageBet.total')}${v.mct}${$t('pageBet.count')}`}}
            </span>
            <div class="box-item-like-input flex-center">
              <span class="like-input-text" :style="{ color: oddsColor }" v-if="v.value">{{v.value}}</span>
              <span v-if="!v.value" class="like-input-place">{{$t('pageBet.betMoney')}}</span>
            </div>
          </div>
        </div>
        <transition name="toggle">
          <bet-box-toggle v-if="v.toggle" :data="v" :opts="data" />
        </transition>
      </v-touch>
    </div>
    <div class="body-shows flex-between">
      <div class="body-show-item flex-center">
        <div class="bet-show-item flex-center">{{$t('pageBet.balance')}}</div>
        <div class="bet-show-num flex-center" :style="{ color: oddsColor }" v-if="balAct">{{balance | NumFmt}}</div>
        <div class="bet-show-num flex-center" v-else>- - -</div>
      </div>
      <div class="body-show-item flex-center">
        <div class="bet-show-item flex-center">{{$t('pageBet.odds')}}</div>
        <div v-if="showOdds" class="bet-show-num flex-center" :style="{ color: oddsColor }">{{odds[1] | NumFmt(true, 3)}}</div>
        <div v-else class="bet-show-null flex-center">- - -</div>
      </div>
      <div class="body-show-item flex-center">
        <div class="bet-show-item flex-center">{{$t('pageBet.retn')}}</div>
        <div v-if="showOdds && mBAmt" class="bet-show-num flex-center" :style="{ color: oddsColor }">{{maxRtn | NumFmt}}</div>
        <div v-else class="bet-show-null flex-center">- - -</div>
      </div>
    </div>
    <v-touch :class="`keyboard-multiple-submit${actBet ? '-active' : ''} flex-center`" :style="btnStyle" @tap="betFun">
      {{$t(`pageBet.${bAlt ? 'noBalance' : oAlt ? 'oddsChange' : 'sureBet'}`)}}
      <div class="bet-foot-odds-box flex-center" v-if="!bAlt && oAlt"
      :style="`transform:rotate(${oAlt < 0 ? 180 : 0}deg)`">
        <bet-odds-flag class="bet-foot-odds-change" size="0.4" />
      </div>
    </v-touch>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { toSeries } from '@/utils/betUtils';
import { toPoralUrlByKey } from '@/utils/PortalUtils';
import BetBoxToggle from './BetComps/BetBoxToggle';
import BetOddsFlag from './BetComps/BetOddsFlag';

export default {
  inheritAttrs: false,
  name: 'BetKeyboardMultiple',
  data() {
    return {
      bets: [],
      data: [],
      btime: 0,
      balance: 0,
      odds: [0, '0.000'],
      maxRtn: '',
      mBAmt: '',
      bAlt: false,
    };
  },
  computed: {
    ...mapState({
      bCnt: state => state.bet.betCount,
      qObj: state => state.bet.quoteObj,
      qArr: state => state.bet.quoteMultArr,
      oAlt: state => state.bet.oddsAlert,
      keySts: state => state.bet.keyStatus,
      betList: state => state.bet.betList,
      inputObj: state => state.bet.betInputObj,
    }),
    ...mapState('app', {
      bettingMode: state => state.bettingMode,
      user: state => state.userinfo,
      theme: state => state.theme,
    }),
    allowSame() {
      return !!window.NBConfig.ALLOW_SAME_MATCH;
    },
    bAmt() {
      return this.inputObj.amt;
    },
    showOdds() {
      if (!this.allowSame) {
        return this.bets.filter(v => v.active).length === 1;
      }
      return this.bets.length === 1 || this.bets.filter(v => v.value).length;
    },
    actBet() {
      const amt = !this.allowSame ? +(this.bAmt || 0) : +(this.mBAmt || 0);
      const rst = amt && (this.allowSame || !this.betList.filter(v => v.same).length);
      return rst && amt >= this.qObj.min && amt <= this.qObj.max;
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
      return this.actBet ? { background: this.btnColor, border: `.01rem solid ${this.btnColor}` } : { };
    },
  },
  watch: {
    user() {
      this.changeBalance();
    },
    betList() {
      this.toSeriesFun();
    },
    bAmt() {
      for (let i = 0; i < this.bets.length; i += 1) {
        if (`${this.bets[i].nm}` === `${this.inputObj.num}`) {
          const bt = this.bets[i];
          bt.value = this.bAmt;
          this.$set(this.bets, i, bt);
          break;
        }
      }
      this.changeBalance();
    },
    keySts() {
      if (!this.keySts && `${this.bAmt}` === '') {
        const bt = this.bets;
        for (let i = 0; i < bt.length; i += 1) {
          bt[i].active = true;
        }
        this.bets = bt;
      }
    },
  },
  components: { BetBoxToggle, BetOddsFlag },
  methods: {
    ...mapMutations(['changeBetAmount', 'changeKeyStatus', 'changeUsedBalance']),
    ...mapMutations('app', ['getUserInfo']),
    ...mapActions(['doBetAction']),
    changeBalance() {
      if (this.showOdds) {
        const actArr = this.bets.filter(v => v.active);
        this.getMultOdds(actArr[0]);
      }
      const amt = this.bAmt || 0;
      const bal = this.user && this.user.balance !== undefined ? this.user.balance : 100000;
      [this.bAlt, this.odds[1]] = [bal < this.qObj.min, this.odds[0]];
      let [mrtn, tRtn, tAmt] = [amt * this.odds[0], 0, 0];
      if (this.inputObj.num > 1) {
        for (let i = 0; i < this.bets.length; i += 1) {
          tAmt += (this.bets[i].mct || 1) * (this.bets[i].value || 0);
          tRtn += (this.bets[i].odds || 1) * (this.bets[i].value || 0);
        }
      }
      if (this.inputObj.num > 1) {
        let [saveRtn, find] = [mrtn, false];
        if (this.qArr && this.qArr.length) {
          for (let i = 0; i < this.qArr.length; i += 1) {
            if (`${this.qArr[i].betN}_${this.qArr[i].betM}` === `${this.inputObj.num}_1`) {
              [saveRtn, find] = [this.qArr[i].maxReturn || saveRtn, !!this.qArr[i].maxReturn];
              break;
            }
          }
        }
        if (this.user && this.user.rtn && !find) {
          for (let i = this.inputObj.num; i >= 2; i -= 1) {
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
      this.mBAmt = this.inputObj.num > 1 ? tAmt : amt;
      [this.maxRtn, this.balance] = [!this.allowSame ? mrtn : tRtn, bal - this.mBAmt];
    },
    getBetObj() {
      const bArr = [];
      for (let i = 0; i < this.bets.length; i += 1) {
        if (this.bets[i].nm && this.bets[i].mct && +this.bets[i].value) {
          bArr.push({ num: this.bets[i].nm, cnt: this.bets[i].mct, amt: +this.bets[i].value });
        }
      }
      return this.allowSame && bArr.length > 1 ? { bets: bArr } : { };
    },
    async betFun() {
      this.getUserInfo();
      if (!this.user || !this.user.token) {
        if (this.actBet) this.$toast(this.$t('pageBet.notLogin'));
      } else if (this.bAlt) {
        toPoralUrlByKey('DEPOSIT_PAGE_URL');
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const rtn = await this.doBetAction({ code: 0, data: this.getBetObj() });
        if (rtn) {
          this.$toast(this.$t(`pageBet.${/^1$/.test(rtn) ? 'betWrong' : 'userWrong'}`));
        } else {
          this.changeBetAmount({ amt: '' });
        }
      }
    },
    getMultName(num, fld) {
      const [lan, nFld] = [this.$t('pageBet.betMoney'), fld || 1];
      const nunStr = !/[a-z]+/i.test(lan) ? '一二三四五六七八九十' : '';
      if (nunStr) {
        const beStr = num < 11 ? '一二三四五六七八九十'.substr(num - 1, 1) : num;
        const afStr = nFld < 11 ? '一二三四五六七八九十'.substr(nFld - 1, 1) : nFld;
        return /^3$/.test(this.bettingMode) ? `${num}串${nFld}` : `${beStr}串${afStr}`;
      }
      return `${num} Folds${fld && fld > 1 ? ` ${fld}` : ''}`;
    },
    getMultOdds(obj) {
      const [bts, v] = [this.bets, obj || this.bets[0] || ''];
      for (let i = 0; i < bts.length; i += 1) {
        const isSel = this.allowSame || `${bts[i].nm}` === `${v.nm}`;
        [bts[i].value, bts[i].active] = [isSel ? bts[i].value : '', isSel];
      }
      [this.bets, this.odds[0]] = [bts, this.getOdds(bts)];
    },
    getOdds(bts) {
      let [tCnt, tAmt, tRtn] = [0, 0, 0];
      for (let i = 0; i < bts.length; i += 1) {
        tCnt += bts[i].value ? (bts[i].mct || 1) : 0;
        tAmt += (bts[i].mct || 1) * (bts[i].value || 0);
        tRtn += (bts[i].odds || 1) * (bts[i].value || 0);
      }
      return (tRtn / (tAmt / (tCnt || 1) || 1)) || bts[0].odds || 1;
    },
    getOtherAmt(v) {
      let tAmt = 0;
      for (let i = 0; i < this.bets.length; i += 1) {
        const val = v && `${this.bets[i].nm}` === `${v.nm}` ? 0 : (this.bets[i].value || 0);
        tAmt += (this.bets[i].mct || 1) * val;
      }
      return this.allowSame ? tAmt : 0;
    },
    touchFun(v) {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/like-input/i.test(cName)) {
        this.changeUsedBalance(this.getOtherAmt(v));
        this.getMultOdds(v);
        this.setKeySetting(v);
        this.changeKeyStatus(true);
      } else {
        for (let i = 0; i < this.bets.length; i += 1) {
          if (`${this.bets[i].nm}` === `${v.nm}`) {
            const bt = this.bets[i];
            bt.toggle = !bt.toggle;
            this.$set(this.bets, i, bt);
            break;
          }
        }
      }
    },
    toSeriesFun() {
      const [dt, bt, bList] = [[], [], JSON.parse(JSON.stringify(this.betList))];
      for (let i = 0; i < bList.length; i += 1) {
        const obj = bList[i];
        obj.odds = obj.odds ? obj.odds + 1 : 1;
        dt.push(obj);
      }
      this.data = dt.filter(v => /^7$/.test(v.betStatus));
      this.series = toSeries(this.data);
      for (let i = 0; i < this.series.length; i += 1) {
        bt.push(Object.assign({ value: '', active: true, toggle: false }, this.series[i]));
      }
      this.bets = bt.filter(v => v.nm > 1);
      this.setKeySetting();
      this.changeBalance();
    },
    setKeySetting(bet) {
      let obj = { num: bet && bet.nm ? bet.nm : 1, amt: bet && bet.value ? bet.value : '', toast: this.toast || this.$t('pageBet.outToast') };
      obj = Object.assign({ cnt: bet && bet.mct ? bet.mct : 1, title: this.title || '', action: this.action || '' }, obj);
      [obj.min, obj.max, obj.odds] = [this.qObj.min || 0, this.qObj.max || 1000, bet && bet.odds ? bet.odds : 0];
      let find = false;
      if (this.qArr && this.qArr.length && obj.num > 1) {
        for (let i = 0; i < this.qArr.length; i += 1) {
          if (`${this.qArr[i].betN}_${this.qArr[i].betM}` === `${obj.num}_1`) {
            obj.min = this.qArr[i].minBet !== undefined ? this.qArr[i].minBet : obj.min;
            obj.max = this.qArr[i].maxBet !== undefined ? this.qArr[i].maxBet : obj.max;
            find = true;
            break;
          }
        }
      }
      if (this.user && this.user.rtn && !find) {
        for (let i = obj.num; i >= 2; i -= 1) {
          if (this.user.rtn[`mut${i}`]) {
            const userRtnObj = this.user.rtn[`mut${i}`];
            if (typeof userRtnObj === 'object' && userRtnObj.maxBet !== undefined) {
              obj.max = +userRtnObj.maxBet;
            }
            break;
          }
        }
      }
      this.changeBetAmount(obj);
    },
  },
  mounted() {
    setTimeout(this.toSeriesFun, 10);
  },
};
</script>

<style lang="less">
.toggle-enter-active, .toggle-leave-active { transition: all 0.15s linear; }
.toggle-enter, .toggle-leave-active { transform: scaleY(0); }
.white .nb-bet-keyboard-multiple {
  border: .01rem solid #ECEBEB;
  background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
  .input-box-item-title {
    .box-item-title-point { background: #716d6d; opacity: 0.3; }
    .box-item-title-text { color: #716d6d; opacity: 0.3; }
  }
  .input-box-item-title-active {
    .box-item-title-point {
      background: #ff5353;
      box-shadow: 0 .02rem .06rem 0 rgba(255, 83, 83, 0.5);
    }
    .box-item-title-text { color: #2e2f34; }
  }
  .input-box-item-count { color: #999999; }
  .box-item-like-input {
    border: .01rem solid #ecebeb;
    .like-input-place { color: #bababa; }
  }
  .body-shows {
    border-top: .01rem solid #ecebeb;
    .body-show-item .bet-show-item, .body-show-item .bet-show-null { color: #909090; }
  }
  .keyboard-multiple-submit { border: .01rem solid #ecebeb; color: #aaaaaa; }
  .keyboard-multiple-submit-active { color: #fff; }
}
.black .nb-bet-keyboard-multiple {
  box-shadow: 0 .02rem .12rem 0 rgba(0, 0, 0, 0.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
  .input-box-item-title, .input-box-item-title-active {
    .box-item-title-point { background: #fff; }
    .box-item-title-text { color: #ecebeb; }
  }
  .input-box-item-title {
    .box-item-title-point, .box-item-title-text { opacity: 0.3; }
  }
  .input-box-item-count { color: #bababa; }
  .box-item-like-input {
    border: .01rem solid #716d6d;
    .like-input-place { color: #999999; }
  }
  .body-shows {
    border-top: .01rem solid #2e2f34;
    .body-show-item .bet-show-item, .body-show-item .bet-show-null { color: #909090; }
  }
  .keyboard-multiple-submit { border: .01rem solid #716d6d; color: #716d6d; }
  .keyboard-multiple-submit-active { color: #fff; }
}
.blue .nb-bet-keyboard-multiple {
  box-shadow: 0 .02rem .12rem 0 rgba(0, 0, 0, 0.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
  .input-box-item-title, .input-box-item-title-active {
    .box-item-title-point { background: #fff; }
    .box-item-title-text { color: #ecebeb; }
  }
  .input-box-item-title {
    .box-item-title-point, .box-item-title-text { opacity: 0.3; }
  }
  .input-box-item-count { color: #bababa; }
  .box-item-like-input {
    border: .01rem solid #716d6d;
    .like-input-place { color: #999999; }
  }
  .body-shows {
    border-top: .01rem solid #2e2f34;
    .body-show-item .bet-show-item, .body-show-item .bet-show-null { color: #909090; }
  }
  .keyboard-multiple-submit { border: .01rem solid #716d6d; color: #716d6d; }
  .keyboard-multiple-submit-active { color: #fff; }
}
.nb-bet-keyboard-multiple {
  width: 100%;
  border-radius: .1rem;
  padding: .05rem 0;
  .input-box-item {
    width: 100%;
    .input-touch-box {
      width: 100%;
      .input-box-item-box {
        width: 100%;
        height: .4rem;
        padding: 0 .1rem;
        .input-box-item-title, .input-box-item-title-active {
          width: .8rem;
          height: 100%;
          .box-item-title-point { width: .08rem; height: .08rem; border-radius: 100%; }
          .box-item-title-text { padding-left: .07rem; font-size: 16px; font-weight: 500; }
        }
        .input-box-item-body {
          width: 2.2rem;
          height: 100%;
          .input-box-item-count { padding-right: .11rem; font-size: .13rem; }
          .box-item-like-input {
            width: 1rem;
            height: .3rem;
            border-radius: .04rem;
            .like-input-text { font-size: .18rem; font-weight: 500; }
            .like-input-place { font-size: .14rem; opacity: 0.5; }
          }
        }
      }
    }
    .input-touch-box:last-child .nb-bet-box-toggole { border-bottom: none !important; }
  }
  .body-shows {
    width: 100%;
    height: .4rem;
    margin-top: .05rem;
    padding: 0 .05rem;
    .body-show-item {
      height: 100%;
      .bet-show-item, .bet-show-null { font-size: .12rem; }
      .bet-show-num { font-size: .14rem; }
      .bet-show-num, .bet-show-null { min-width: .5rem; }
    }
  }
  .keyboard-multiple-submit, .keyboard-multiple-submit-active {
    position: relative;
    width: 3.33rem;
    height: .48rem;
    margin: 0 auto .05rem;
    font-size: .16rem;
    border-radius: .06rem;
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
