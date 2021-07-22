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
        <div class="mult-bet-show-num flex-center" v-if="balAct">{{balance}}</div>
        <div class="mult-bet-show-num flex-center" v-else>- - -</div>
      </div>
      <div class="mult-body-show-item flex-center">
        <div class="mult-bet-show-item flex-center">{{$t('pageBet.odds')}}</div>
        <div class="mult-bet-show-num flex-center">{{right.o}}</div>
      </div>
      <div class="mult-body-show-item flex-center">
        <div class="mult-bet-show-item flex-center">{{$t('pageBet.retn')}}</div>
        <div v-if="bAmt" class="mult-bet-show-num flex-center" align="start">{{right.m}}</div>
        <div v-else class="mult-bet-show-null flex-center">- - -</div>
      </div>
    </div>
    <div class="mult-body-foot flex-between" :style="st.o">
      <v-touch tag="div" class="mult-bet-foot-cancel flex-center" :style="st.i" @tap="closeFun">
        {{$t('pageBet.cancel')}}
      </v-touch>
      <v-touch tag="div" :class="betClass" :style="st.i" @tap="betFun">
        {{$t(`pageBet.${right.lock || bAlt ? 'noBalance' : oAlt ? 'oddsChange' : 'betNow'}`)}}
        <div class="bet-foot-odds-box flex-center" v-if="!right.lock && !bAlt && oAlt"
        :style="`transform:rotate(${oAlt < 0 ? 180 : 0}deg)`">
          <bet-odds-flag class="bet-foot-odds-change" size="0.4" />
        </div>
      </v-touch>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import BetLikeInput from './BetComps/BetLikeInput';
import BetOddsFlag from './BetComps/BetOddsFlag';

export default {
  inheritAttrs: false,
  name: 'BetMultSubmit',
  data() {
    return {
      btime: 0,
      balance: '0.00',
      range: Object.assign({ min: 0, max: 0, rtn: 0 }, { odds: 0, mOdds: 0, gtp: 0 }),
      right: { m: 0, o: '1.00', lock: false },
      st: { o: {}, i: {} },
    };
  },
  computed: {
    ...mapState({
      bCnt: state => state.bet.betCount,
      qObj: state => state.bet.quoteObj,
      bAmt: state => state.bet.betInputObj.amt,
      bAlt: state => state.bet.balAlert,
      oAlt: state => state.bet.oddsAlert,
      iphX: state => state.bet.isIphoneX,
    }),
    ...mapState('app', { user: state => state.userinfo }),
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
  components: {
    BetLikeInput,
    BetOddsFlag,
  },
  methods: {
    ...mapMutations(['clearBetItem', 'changeBalAlert', 'changebetAmount']),
    ...mapActions(['doBetAction']),
    ...mapMutations('app', ['getUserInfo']),
    closeFun() {
      this.clearBetItem();
    },
    changeType(num, fnum) {
      const arr = `${Math.abs(num) + 0.000005}`.match(/^(\d+)(\.\d{2})/);
      const [len, flag] = [arr[1].length % 3, num < 0 ? '-' : ''];
      const str = `${new Array(len ? 4 - len : 1).join('0')}${arr[1]}`;
      let rtn = '';
      for (let i = 0; i < str.length; i += 3) {
        rtn += `${str.slice(i, i + 3)}${i === str.length - 3 ? '' : ','}`;
      }
      rtn = `${flag}${`${rtn}`.replace(/^0{1,2}/, '')}`;
      return fnum ? `${rtn}${arr[2]}` : `${rtn}${`${arr[2]}`.replace(/[.0]+$/, '')}`;
    },
    changeMinMax() {
      const bal = this.user && this.user.balance !== undefined ? this.user.balance : 100000;
      [this.range.rtn, this.range.max, this.range.min] = [this.qObj.rtn, this.qObj.max, this.qObj.min];
      [this.range.odds, this.range.mOdds, this.range.gtp] = [this.qObj.odds || 1, this.qObj.mOdds || 1, this.qObj.gtp || 0];
      this.right.lock = bal < this.range.min;
      if (this.right.lock) this.changeBalAlert(true);
      return bal;
    },
    changeBalance() {
      const amt = this.bAmt || 0;
      const bal = this.changeMinMax();
      this.right.o = this.changeType(this.range.mOdds, true);
      let mrtn = amt * this.range.mOdds;
      if (this.user && this.user.rtn && this.bCnt > 1) {
        let saveRtn = mrtn;
        for (let i = this.bCnt; i >= 2; i -= 1) {
          if (this.user.rtn[`mut${i}`] && +this.user.rtn[`mut${i}`]) {
            saveRtn = +this.user.rtn[`mut${i}`];
            break;
          }
        }
        mrtn = mrtn > saveRtn ? saveRtn : mrtn;
      }
      this.right.m = this.changeType(mrtn);
      this.balance = this.changeType(bal - amt);
    },
    async betFun() {
      this.getUserInfo();
      this.changeMinMax();
      if (!this.user || !this.user.token) {
        if (this.actBet) this.$toast(this.$t('pageBet.notLogin'));
      } else if (this.right.lock || this.bAlt) {
        this.$router.push('/payment');
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const rtn = await this.doBetAction();
        if (rtn) this.$toast(this.$t(`pageBet.${/^1$/.test(rtn) ? 'betWrong' : 'userWrong'}`));
      }
    },
    setKeySetting() {
      let obj = { title: '', action: '', toast: this.$t('pageBet.maxToast') };
      obj = Object.assign({ num: this.bCnt, cnt: 1, amt: this.bAmt }, obj);
      [obj.min, obj.max, obj.odds] = [this.qObj.min, this.qObj.max, 0];
      this.changebetAmount(obj);
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
    .mult-bet-item {
      background: #F9F9F9;
      color:#909090;
    }
    .mult-bet-amount .mult-amount-text {
      color: #666;
    }
  }
  .mult-body-shows {
    background: #FFF;
    .mult-body-show-item .mult-bet-show-item, .mult-body-show-item .mult-bet-show-null {
      color: #909090;
    }
    .mult-body-show-item .mult-bet-show-num {
      color: #FF5353;
    }
  }
  .mult-body-foot .mult-bet-foot-cancel {
    color: #909090;
    border-top: .01rem solid #ECEBEB;
  }
  .mult-body-foot .mult-bet-foot-confirm-normal {
    color: #909090;
    border-top: .01rem solid #ECEBEB;
    border-left: .01rem solid #ECEBEB;
  }
  .mult-body-foot .mult-bet-foot-confirm-active {
    color: #FFFFFF;
    background: #FF5353;
  }
}
.black .nb-bet-mult-submit {
  background-image: linear-gradient(to bottom, #3a393f, #333238);
  border-top: .01rem solid #2e2f34;
  .mult-body-title {
    border-bottom: .01rem solid #2e2f34;
    .mult-bet-item {
      background-image: linear-gradient(to bottom, #323237, #29292e);
      color: #909090;
    }
    .mult-bet-amount .mult-amount-text {
      color: #666;
    }
  }
  .mult-body-shows {
    background-image: linear-gradient(to bottom, #3a393f, #333238);
    .mult-body-show-item .mult-bet-show-item, .mult-body-show-item .mult-bet-show-null {
      color: #909090;
    }
    .mult-body-show-item .mult-bet-show-num {
      color: #FF5353;
    }
  }
  .mult-body-foot .mult-bet-foot-cancel {
    color: #716d6d;
    border-top: .01rem solid #2e2f34;
  }
  .mult-body-foot .mult-bet-foot-confirm-normal {
    color: #716d6d;
    border-top: .01rem solid #2e2f34;
    border-left: .01rem solid #2e2f34;
  }
  .mult-body-foot .mult-bet-foot-confirm-active {
    color: #FFFFFF;
    background: #FF5353;
  }
}
.nb-bet-mult-submit {
  width: 3.75rem;
  .mult-body-title {
    width: 100%;
    height: .5rem;
    .mult-bet-item {
      width: 1.4rem;
      height: 100%;
      font-size: .16rem;
    }
    .mult-bet-amount {
      width: 2.35rem;
      height: 100%;
      .mult-amount-text {
        width: .45rem;
        height: 100%;
        font-size: .14rem;
      }
      .mult-amount-num {
        width: 1.45rem;
        height: .32rem;
      }
    }
  }
  .mult-body-shows {
    width: 100%;
    height: .4rem;
    padding: 0 .12rem;
    .mult-body-show-item {
      height: 100%;
      .mult-bet-show-item, .mult-bet-show-null {
        font-size: .14rem;
      }
      .mult-bet-show-num {
        font-size: .16rem;
      }
      .mult-bet-show-num, .mult-bet-show-null {
        min-width: .5rem;
      }
    }
  }
  .mult-body-foot {
    width: 100%;
    .mult-bet-foot-cancel {
      width: 1.4rem;
      height: 100%;
      font-size: .16rem;
    }
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
