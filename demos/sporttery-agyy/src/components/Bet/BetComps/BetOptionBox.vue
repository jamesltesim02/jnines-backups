<template>
  <v-touch tag="div" class="nb-history-option-box flex-center-col" @tap="eFun(data)">
    <bet-history-option :data="data" :showId="showId" isSingle />
    <transition name="option">
      <div class="page-item-keyboard" v-if="showKey">
        <bet-keyboard-simple :min="data.min" :max="data.max" :lock="right.lock" :odds="data.odds"
        :toast="$t('pageBet.maxToast')" :place="$t('pageBet.betRange')" :check="addCheck" />
        <div class="content-shows flex-between">
          <div class="bet-show-item flex-start">
            <span class="show-item-txt">{{$t('pageBet.balance')}}</span>
            <span class="show-item-odds" v-if="balAct">{{balance}}</span>
            <span class="show-item-odds" v-else>- - -</span>
          </div>
          <div class="bet-show-get flex-end">
            <div class="show-get-txt flex-center">{{$t('pageBet.ifRight')}}</div>
            <div v-if="bAmt" class="show-get-num flex-start">{{right.s}}</div>
            <div v-else class="show-get-null flex-center">- - -</div>
          </div>
        </div>
        <div :class="`keyboard-bet-submit${actBet ? '-active' : ''} flex-center`">
          {{$t(`pageBet.${right.lock || bAlt ? 'noBalance' : data.alert ? 'oddsChange' : 'sureBet'}`)}}
          <div class="bet-foot-odds-box flex-center" v-if="!right.lock && !bAlt && data.alert"
          :style="`transform:rotate(${data.alert < 0 ? 180 : 0}deg)`">
            <bet-odds-flag class="bet-foot-odds-change" size="0.4" />
          </div>
        </div>
      </div>
    </transition>
    <div class="page-item-close flex-center">
      <bet-cover-close size="0.16" :color="/black/i.test(theme) ? '#909090' : '#BABABA'" />
    </div>
    <div class="page-item-cover" v-if="!/^7$/.test(data.betStatus)"></div>
    <div class="page-item-line" v-if="data.same && showId"></div>
  </v-touch>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import oddsFormat from '@/filters/oddsFormat';
import BetKeyboardSimple from '@/components/Bet/BetKeyboardSimple';
import BetCoverClose from '@/components/Bet/BetComps/BetCoverClose';
import BetHistoryOption from '@/components/Bet/BetComps/BetHistoryOption';
import BetOddsFlag from '@/components/Bet/BetComps/BetOddsFlag';

export default {
  inheritAttrs: false,
  name: 'BetOptionBox',
  data() {
    return {
      btime: 0,
      balance: '0.00',
      right: { s: 0, lock: false },
    };
  },
  props: {
    data: Object,
    showId: Boolean,
  },
  computed: {
    ...mapState({
      bAmt: state => state.bet.betInputObj.amt,
      bAlt: state => state.bet.balAlert,
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
  },
  watch: {
    user() {
      this.changeBalance();
    },
    bAmt() {
      this.changeBalAlert();
      this.changeBalance();
    },
  },
  components: {
    BetCoverClose,
    BetHistoryOption,
    BetKeyboardSimple,
    BetOddsFlag,
  },
  methods: {
    ...mapMutations(['clearBetItem', 'changeBalAlert', 'changeShowIndex', 'changebetAmount']),
    ...mapActions(['doBetAction']),
    ...mapMutations('app', ['getUserInfo']),
    eFun(v) {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/submit/i.test(cName)) {
        this.betFun([v]);
      } else if (/close/i.test(cName)) {
        this.clearBetItem(v);
      } else if (/^2$/.test(this.betMode) && !this.showId) {
        if (/^7$/.test(v.betStatus)) this.changeShowIndex(v.idx);
      } else if (v.matchID && /^7$/.test(v.betStatus)) {
        this.$router.push(`/detail/${v.sportID}/${v.matchID}`);
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
        this.$router.push('/payment');
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const rtn = await this.doBetAction(arr);
        if (rtn) {
          this.$toast(this.$t(`pageBet.${/^1$/.test(rtn) ? 'betWrong' : 'userWrong'}`));
        } else {
          this.changeShowIndex();
          this.changebetAmount({ amt: '' });
        }
      }
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
      [this.right.lock, this.oddsv] = [bal < this.data.min, oddsFormat(this.data.odds, this.data.gameType)];
      if (this.right.lock) this.changeBalAlert(true);
      return bal;
    },
    changeBalance() {
      const amt = this.bAmt || 0;
      const bal = this.changeMinMax();
      let xrtn = amt * (this.data.odds + 1);
      xrtn = xrtn <= this.data.rtn ? xrtn : this.data.rtn;
      this.right.s = this.changeType(xrtn);
      this.balance = this.changeType(bal - amt);
    },
  },
  mounted() {
    this.getUserInfo();
    this.changeBalance();
  },
};
</script>

<style lang="less">
.option-enter-active, .option-leave-active {
  transition: all 0.15s linear;
}
.option-enter, .option-leave-active {
  transform: scaleY(0);
}
.white .nb-history-option-box {
  .page-item-cover {
    background-image: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
  }
  .page-item-keyboard {
    border-top: .01rem solid #ecebeb;
    .content-shows .bet-show-item .show-item-txt {
      color: #909090;
    }
    .content-shows .bet-show-item .show-item-odds {
      color: #FF5353;
    }
    .content-shows .bet-show-get {
      .show-get-txt, .show-get-null {
        color: #909090;
      }
      .show-get-num {
        color: #FF5353;
      }
    }
    .keyboard-bet-submit {
      color: #aaaaaa;
      border: .01rem solid #ecebeb;
    }
    .keyboard-bet-submit-active {
      background: #ff5353;
      color: #FFF;
      border: .01rem solid #ff5353;
    }
  }
}
.black .nb-history-option-box {
  .page-item-cover {
    background-image: linear-gradient(to bottom, #3a393f, #333238);
  }
  .page-item-keyboard {
    border-top: .01rem solid #2e2f34;
    .content-shows .bet-show-item .show-item-txt {
      color: #909090;
    }
    .content-shows .bet-show-item .show-item-odds {
      color: #FF5353;
    }
    .content-shows .bet-show-get {
      .show-get-txt, .show-get-null {
        color: #909090;
      }
      .show-get-num {
        color: #FF5353;
      }
    }
    .keyboard-bet-submit {
      color: #716d6d;
      border: .01rem solid #716d6d;
    }
    .keyboard-bet-submit-active {
      background: #ff5353;
      color: #FFF;
      border: .01rem solid #2e2f34;
    }
  }
}
.nb-history-option-box {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: .86rem;
  padding-bottom: .05rem;
  overflow: hidden;
  border-radius: .1rem;
  .page-item-cover {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    z-index: 15;
    opacity: .5;
  }
  .page-item-close {
    position: absolute;
    width: .34rem;
    height: .34rem;
    top: 0;
    right: 0;
    z-index: 20;
  }
  .page-item-line {
    position: absolute;
    width: .05rem;
    height: 100%;
    background: #ff5353;
    left: 0;
    top: 0;
    z-index: 5;
  }
  .page-item-keyboard {
    width: 100%;
    margin-top: .1rem;
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
}
</style>
