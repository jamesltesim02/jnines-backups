<template>
<bet-cover-box class="nb-bet-single" :index="99999" :show="show" @close="closeFun" animate>
  <div class="bet-single-close flex-end">
    <bet-cover-close :color="/black/i.test(theme) ? '#bababa' : '#ddd'" />
  </div>
  <div class="bet-single-body">
    <div class="body-title flex-between">
      <div class="bet-item flex-start">
        <span>{{$t('pageBet.betStr')}}</span>
        <span>{{getOptName()}}</span>
      </div>
      <div class="bet-amount flex-end">
        <div class="amount-text flex-end">{{$t('pageBet.balance')}}</div>
        <div class="amount-num flex-center" v-if="balAct">{{balance}}</div>
        <div class="amount-num flex-center" v-else>- - -</div>
      </div>
    </div>
    <div class="body-content">
      <bet-keyboard-simple :min="range.min" :max="range.max" :lock="right.lock"
      :toast="$t('pageBet.maxToast')" :place="$t('pageBet.betRange')" :check="addCheck" />
      <div class="content-shows flex-between">
        <div class="bet-show-item flex-start">
          <span class="show-item-txt">{{$t('pageBet.liveOdds')}}</span>
          <span class="show-item-odds">{{oddsv}}</span>
        </div>
        <div class="bet-show-get flex-end">
          <div class="show-get-txt flex-center">{{$t('pageBet.ifRight')}}</div>
          <div v-if="bAmt" class="show-get-num flex-center" align="start">{{right.s}}</div>
          <div v-else class="show-get-null flex-center">- - -</div>
        </div>
      </div>
    </div>
    <div class="body-foot flex-between" :style="st.o">
      <v-touch tag="div" class="bet-foot-cancel flex-center" :style="st.i" @tap="closeFun">
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
</bet-cover-box>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
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
      balance: '0.00',
      range: Object.assign({ min: 0, max: 0, rtn: 0 }, { odds: 0, mOdds: 0, gtp: 0 }),
      oddsv: '',
      right: { s: 0, lock: false },
      st: { o: {}, i: {} },
    };
  },
  props: {
    show: Boolean,
  },
  computed: {
    ...mapState({
      bShow: state => state.bet.betShow,
      qObj: state => state.bet.quoteObj,
      bAmt: state => state.bet.betInputObj.amt,
      bAlt: state => state.bet.balAlert,
      oAlt: state => state.bet.oddsAlert,
      iphX: state => state.bet.isIphoneX,
    }),
    ...mapState('app', {
      user: state => state.userinfo,
      theme: state => state.theme,
    }),
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
    show() {
      const obj = Object.assign({ num: 1, cnt: 1, amt: this.bAmt }, { title: '', action: '', odds: 0 });
      this.changebetAmount(obj);
    },
  },
  components: {
    BetCoverBox,
    BetOddsFlag,
    BetCoverClose,
    BetKeyboardSimple,
  },
  methods: {
    ...mapMutations([
      'clearBetItem',
      'changeKeyStatus',
      'changebetAmount',
      'changeBalAlert',
    ]),
    ...mapActions([
      'doBetAction',
    ]),
    ...mapMutations('app', [
      'getUserInfo',
    ]),
    getOptName() {
      let optName = '---';
      if (this.bShow) {
        const obj = toOptionName(this.bShow.gmt, this.bShow.bar, this.bShow.opt, true);
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
      [this.right.lock, this.oddsv] = [bal < this.range.min, oddsFormat(this.range.odds, this.range.gtp)];
      if (this.right.lock) this.changeBalAlert(true);
      return bal;
    },
    changeBalance() {
      const amt = this.bAmt || 0;
      const bal = this.changeMinMax();
      let xrtn = amt * (this.range.odds + 1);
      xrtn = xrtn <= this.range.rtn ? xrtn : this.range.rtn;
      this.right.s = this.changeType(xrtn);
      this.balance = this.changeType(bal - amt);
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
        this.$router.push('/payment');
        this.clearBetItem();
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const rtn = await this.doBetAction();
        if (rtn) this.$toast(this.$t(`pageBet.${/^1$/.test(rtn) ? 'betWrong' : 'userWrong'}`));
      }
    },
  },
  mounted() {
    this.getUserInfo();
    this.changeBalance();
    this.st.o.height = this.iphX ? '.65rem' : '.5rem';
    if (this.iphX) {
      this.st.i.paddingBottom = '.15rem';
    }
  },
};
</script>

<style lang="less">
.white .nb-bet-single .nb-bet-body-box .bet-single-body {
  background: #fff;
  .body-title {
    border-bottom: .01rem solid rgba(236,236,236,0.5);
    background-image: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
    .bet-item {
      color: #2E2F34;
    }
    .bet-amount .amount-text {
      color: #909090;
    }
    .bet-amount .amount-num {
      color: #FF5353;
    }
  }
  .body-content .content-shows .bet-show-item .show-item-txt {
    color: #909090;
  }
  .body-content .content-shows .bet-show-item .show-item-odds {
    color: #FF5353;
  }
  .body-content .content-shows .bet-show-get {
    .show-get-txt, .show-get-null {
      color: #909090;
    }
    .show-get-num {
      color: #FF5353;
    }
  }
  .body-foot .bet-foot-cancel {
    color: #909090;
    border-top: .01rem solid #ECEBEB;
  }
  .body-foot .bet-foot-confirm-normal {
    color: #909090;
    border-top: .01rem solid #ECEBEB;
    border-left: .01rem solid #ECEBEB;
  }
  .body-foot .bet-foot-confirm-active {
    color: #FFFFFF;
    background: #FF5353;
  }
}
.black .nb-bet-single .nb-bet-body-box .bet-single-body {
  background-image: linear-gradient(to bottom, #3a393f, #333238);
  .body-title {
    border-bottom: .01rem solid #2e2f34;
    background-image: linear-gradient(to bottom, #3a393f, #333238);
    .bet-item {
      color: #bababa;
    }
    .bet-amount .amount-text {
      color: #909090;
    }
    .bet-amount .amount-num {
      color: #FF5353;
    }
  }
  .body-content .content-shows .bet-show-item .show-item-txt {
    color: #909090;
  }
  .body-content .content-shows .bet-show-item .show-item-odds {
    color: #FF5353;
  }
  .body-content .content-shows .bet-show-get {
    .show-get-txt, .show-get-null {
      color: #909090;
    }
    .show-get-num {
      color: #FF5353;
    }
  }
  .body-foot .bet-foot-cancel {
    color: #716d6d;
    border-top: .01rem solid #2e2f34;
  }
  .body-foot .bet-foot-confirm-normal {
    color: #716d6d;
    border-top: .01rem solid #2e2f34;
    border-left: .01rem solid #2e2f34;
  }
  .body-foot .bet-foot-confirm-active {
    color: #FFFFFF;
    background: #FF5353;
  }
}
.nb-bet-single .nb-bet-body-box {
  bottom: 0;
  .bet-single-body {
    width: 3.75rem;
    border-top-left-radius: .1rem;
    border-top-right-radius: .1rem;
    .body-title {
      width: 100%;
      height: .44rem;
      padding: 0 .12rem;
      border-top-left-radius: .1rem;
      border-top-right-radius: .1rem;
      .bet-item {
        width: 1.5rem;
        height: 100%;
        font-size: .14rem;
      }
      .bet-amount {
        width: 1.8rem;
        height: 100%;
        .amount-text {
          width: .8rem;
          height: 100%;
          font-size: .14rem;
        }
        .amount-num {
          width: 1rem;
          height: 100%;
          font-size: .16rem;
        }
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
          .show-item-txt {
            font-size: .14rem;
          }
          .show-item-odds {
            font-size: .16rem;
          }
        }
        .bet-show-get {
          height: 100%;
          .show-get-txt, .show-get-null {
            font-size: .14rem;
          }
          .show-get-num {
            font-size: .16rem;
          }
          .show-get-num, .show-get-null {
            min-width: .5rem;
          }
        }
      }
    }
    .body-foot {
      width: 100%;
      .bet-foot-cancel {
        width: 1.4rem;
        height: 100%;
        font-size: .16rem;
      }
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
  .bet-single-close {
    width: 100%;
    height: .54rem;
    padding: 0 .12rem;
  }
}
</style>
