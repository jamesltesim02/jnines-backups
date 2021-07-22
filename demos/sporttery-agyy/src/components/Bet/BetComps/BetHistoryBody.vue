<template>
  <transition name="history">
    <div class="nb-history-body" v-if="data.show">
      <div class="nb-history-body-box">
        <div class="history-body-status flex-start">
          <v-touch tag="div" class="body-status-cash flex-center" v-if="data.cashObj && data.cashout && data.cash" @tap="eFun">
            <div class="status-cash-text flex-start">{{$t('pageBet.earlyCash')}}</div>
            <div class="status-cash-num flex-center">{{data.cash >= 100 ? data.cash : changeType(data.cash, true)}}</div>
          </v-touch>
          <div class="body-status-win-lose flex-start" v-else-if="/(3|8|9)/.test(data.wst) || hisType">
            <div class="body-status-win flex-center" v-if="/9/.test(data.wst) && x.rtn > x.amt">
              {{$t('pageBet.earlyCash')}}
            </div>
            <div class="body-status-lose flex-center" v-else-if="/9/.test(data.wst) && x.rtn < x.amt">
              {{$t('pageBet.earlyCash')}}
            </div>
            <div class="body-status-win flex-center" v-else-if="x.rtn > x.amt">{{$t('pageBet.win100')}}</div>
            <div class="body-status-lose flex-center" v-else-if="x.rtn < x.amt">{{$t('pageBet.lose100')}}</div>
            <div class="body-status-none flex-center" v-else>{{$t('pageBet.win0')}}</div>
          </div>
          <div class="body-status-cancel flex-center" v-else-if="/(0|4|5|6|7)/.test(data.wst)">
            {{$t('pageBet.betFail')}}
          </div>
        </div>
        <div :class="moneyClass" class="flex-center-col">
          <div class="body-money-bet flex-end">{{$t('pageBet.moneyBet')}}{{changeType(x.amt)}}</div>
          <div class="body-money-rtn-win flex-end" v-if="x.rtn >= x.amt">
            {{$t(`pageBet.${getRtnStr(data.wst)}`)}}{{changeType(x.rtn)}}
          </div>
          <div class="body-money-rtn-lose flex-end" v-else>
            {{$t(`pageBet.${getRtnStr(data.wst)}`)}}{{changeType(x.rtn)}}
          </div>
        </div>
        <div v-for="(v, k) in data.opts" :key="k">
          <bet-history-option :data="v" :isSingle="isSingle" />
          <div class="history-body-short" v-if="!isSingle && k < data.opts.length - 1"></div>
          <div class="history-body-long" v-if="!isSingle && k >= data.opts.length - 1"></div>
        </div>
      </div>
      <v-touch tag="div" class="history-body-mult" v-if="!isSingle" @tap="changeFun">
        <div class="body-mult-item flex-start">
          <span class="mult-item-title">{{getMultName(data.bets[0].num)}}</span>
          <span class="mult-item-count">{{data.bets[0].cnt}} {{$t('pageBet.bets')}}</span>
        </div>
        <bet-history-list :data="data" />
      </v-touch>
      <div class="history-body-slip flex-start copy-flag">{{$t('pageBet.slipNum')}}{{data.mstid}}</div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetHistoryList from '@/components/Bet/BetComps/BetHistoryList';
import BetHistoryOption from '@/components/Bet/BetComps/BetHistoryOption';

export default {
  inheritAttrs: false,
  name: 'BetHistoryBody',
  data() {
    return {
      x: { amt: 0, rtn: 0 },
    };
  },
  props: {
    data: Object,
  },
  computed: {
    ...mapState({
      hisType: state => state.bet.hisType,
    }),
    isSingle() {
      return `${this.data.title}` === `${this.$t('pageBet.sinBet')}`;
    },
    moneyClass() {
      return `history-body-money-${this.isSingle ? 'single' : 'multiple'}`;
    },
  },
  components: {
    BetHistoryList,
    BetHistoryOption,
  },
  methods: {
    ...mapMutations([
      'changeEarlyStatus',
    ]),
    changeFun() {
      const dt = this.data;
      dt.detail = !dt.detail;
      this.$emit('change', dt);
    },
    getRtnStr() {
      return this.hisType ? 'moneyRtn' : 'willRtn';
    },
    getRtn() {
      [this.x.amt, this.x.rtn] = [0, 0];
      for (let i = 0; i < this.data.bets.length; i += 1) {
        const bet = this.data.bets[i];
        this.x.amt += bet.tamt;
        this.x.rtn += this.hisType ? bet.tamt + bet.win : bet.mxp;
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
    eFun() {
      this.changeEarlyStatus({ mstid: this.data.mstid, money: this.data.cash });
    },
    getMultName(num) {
      const lan = this.$t('pageBet.betMoney');
      const nunStr = !/[a-z]+/i.test(lan) ? '一二三四五六七八九十' : '';
      if (nunStr && num < 11) {
        return `${'一二三四五六七八九十'.substr(num - 1, 1)}串一`;
      }
      return nunStr ? `${num}串一` : `${num} Folds`;
    },
  },
  mounted() {
    this.getRtn();
  },
};
</script>

<style lang="less">
.history-enter-active, .history-leave-active {
  transition: all 0.15s linear;
}
.history-enter, .history-leave-active {
  transform: scaleY(0);
}
.white .nb-history-body {
  border-top: .01rem solid #ECEBEB;
  .body-status-cash {
    box-shadow: 0 .02rem .06rem 0 #ff535369;
    background-color: #ff5353;
    .status-cash-text { color: #FFF; }
    .status-cash-num { color: #FFF; }
  }
  .body-status-cancel {
    border: .01rem solid #979797;
    color: #909090;
  }
  .body-status-win {
    box-shadow: 0 .02rem .1rem 0 #fe9a9a;
    border: .01rem solid #ff5353;
    color: #ff5353;
  }
  .body-status-lose {
    box-shadow: 0 .02rem .1rem 0 #8cc871;
    border: .01rem solid #428723;
    color: #428723;
  }
  .body-status-none { color: #bababa; border: .01rem solid #ecebeb; }
  .body-money-bet { color: #909090; }
  .body-money-rtn-win { color: #ff5353; }
  .body-money-rtn-lose { color: #428723; }
  .history-body-short { border-bottom: .01rem solid #F7F7F7; }
  .history-body-long { border-bottom: .01rem solid #ECEBEB; }
  .history-body-mult .body-mult-item {
    border-bottom: .01rem solid #ECEBEB;
    .mult-item-title { color: #909090; }
    .mult-item-count { color: #ff5353; }
  }
  .history-body-slip { color: #BBB; }
}
.black .nb-history-body {
  border-top: .01rem solid #2e2f34;
  .body-status-cash {
    box-shadow: 0 .02rem .06rem 0 #ff535369;
    background-color: #ff5353;
    .status-cash-text { color: #FFF; }
    .status-cash-num { color: #FFF; }
  }
  .body-status-cancel {
    border: .01rem solid #979797;
    color: #bababa;
  }
  .body-status-win {
    border: .01rem solid #ff5353;
    color: #ff5353;
  }
  .body-status-lose {
    border: .01rem solid #428723;
    color: #428723;
  }
  .body-status-none { color: #bababa; border: .01rem solid #979797; }
  .body-money-bet { color: #bababa; }
  .body-money-rtn-win { color: #ff5353; }
  .body-money-rtn-lose { color: #428723; }
  .history-body-short { border-bottom: .01rem solid #2e2f34; }
  .history-body-long { border-bottom: .01rem solid #2e2f34; }
  .history-body-mult .body-mult-item {
    border-bottom: .01rem solid #2e2f34;
    .mult-item-title { color: #bababa; }
    .mult-item-count { color: #ff5353; }
  }
  .history-body-slip { color: #909090; }
}
.nb-history-body {
  width: 100%;
  .nb-history-body-box {
    width: 100%;
    position: relative;
    .history-body-status {
      position: absolute;
      min-width: .4rem;
      height: .35rem;
      top: .1rem;
      right: .12rem;
      .body-status-cash {
        height: .3rem;
        padding: 0 .08rem;
        border-radius: .06rem;
        .status-cash-text {
          width: .5rem;
          font-size: .12rem;
        }
        .status-cash-num {
          padding-left: .05rem;
          min-width: .6rem;
          font-size: .16rem;
        }
      }
      .body-status-cancel {
        width: .6rem;
        height: .24rem;
        font-size: .12rem;
      }
      .body-status-win-lose {
        min-width: .4rem;
        height: .35rem;
        .body-status-win, .body-status-lose, .body-status-none {
          min-width: .24rem;
          height: .24rem;
        }
        .body-status-win, .body-status-lose {
          padding: 0 .04rem;
          border-radius: .12rem;
          font-size: .14rem;
        }
        .body-status-none {
          padding: 0 .06rem;
          border-radius: .02rem;
          font-size: .12rem;
        }
      }
    }
    .history-body-money-single, .history-body-money-multiple {
      position: absolute;
      min-width: 1.1rem;
      height: .4rem;
      right: .12rem;
      .body-money-bet, .body-money-rtn-win, .body-money-rtn-lose {
        width: 100%;
        height: 50%;
        font-size: .12rem;
      }
    }
    .history-body-money-single { bottom: -0.24rem; }
    .history-body-money-multiple { bottom: .08rem; }
  }
  .history-body-short {
    width: 1.8rem;
    height: .1rem;
  }
  .history-body-long {
    width: 100%;
    height: .1rem;
  }
  .history-body-mult {
    width: 100%;
    .body-mult-item {
      width: 100%;
      height: .36rem;
      padding: 0 .12rem;
      .mult-item-title {
        font-size: .14rem;
        user-select: none;
      }
      .mult-item-count {
        padding-left: .2rem;
        font-size: .12rem;
        user-select: none;
      }
    }
  }
  .history-body-slip {
    width: 100%;
    height: .28rem;
    padding: 0 .12rem;
    font-size: .11rem;
  }
}
</style>
