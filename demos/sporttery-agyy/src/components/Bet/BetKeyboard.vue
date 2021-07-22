<template>
  <bet-cover-box class="nb-bet-keyboard" :index="199999" :show="show" @close="hideFun">
    <div class="bet-keyboard-close flex-end">
      <bet-cover-close :color="/black/i.test(theme) ? '#bababa' : '#ddd'" />
    </div>
    <div class="bet-keyboard-body">
      <div class="body-title flex-between">
        <div class="bet-item flex-center">
          <span v-if="inObj.title">{{inObj.title}}</span>
          <span v-else-if="type">{{inObj.num || bCnt}}{{$t('pageBet.betFolds')}}1</span>
          <span v-else>{{$t('pageBet.single')}}</span>
        </div>
        <div class="bet-amount flex-center">
          <div class="amount-text flex-center">{{inObj.action || $t('pageBet.betting')}}</div>
          <bet-like-input class="amount-num" :min="inObj.min" :max="inObj.max" flag />
          <div class="amount-text flex-center">{{$t('pageBet.money')}}</div>
        </div>
      </div>
      <div class="body-shows flex-between" v-if="!inObj.title">
        <div class="body-show-item flex-center">
          <div class="bet-show-item flex-center">{{$t('pageBet.balance')}}</div>
          <div class="bet-show-num flex-center" v-if="balAct">{{balance}}</div>
          <div class="bet-show-num flex-center" v-else>- - -</div>
        </div>
        <div class="body-show-item flex-center">
          <div class="bet-show-item flex-center">{{$t('pageBet.odds')}}</div>
          <div class="bet-show-num flex-center">{{type ? right.o : oddsv}}</div>
        </div>
        <div class="body-show-item flex-center">
          <div class="bet-show-item flex-center">{{$t('pageBet.retn')}}</div>
          <div v-if="bAmt" class="bet-show-num flex-start">{{type ? right.m : right.s}}</div>
          <div v-else class="bet-show-null flex-center">- - -</div>
        </div>
      </div>
      <div class="body-keyboard flex-start">
        <div class="keyboard-btn-box" :style="v.o" v-for="(v, k) in btnDis" :key="k">
          <bet-flex-box class="btn-del-box flex-center" v-if="/del/i.test(v.t)" @start="sDelFun">
            <v-touch tag="div" :class="delClass" class="flex-center" :style="v.i" @tap="clickFun(v.t)">
              <bet-input-delete />
            </v-touch>
          </bet-flex-box>
          <v-touch tag="div" class="btn-active flex-center" :style="v.i" v-else-if="/ok/i.test(v.t)" @tap="clickFun(v.t)">
            {{$t('pageBet.finish')}}
          </v-touch>
          <v-touch tag="div" class="btn-normal flex-center" :style="v.i" v-else @tap="clickFun(v.t)">{{v.t}}</v-touch>
        </div>
      </div>
    </div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import oddsFormat from '@/filters/oddsFormat';
import BetCoverBox from './BetComps/BetCoverBox';
import BetFlexBox from './BetComps/BetFlexBox';
import BetLikeInput from './BetComps/BetLikeInput';
import BetInputDelete from './BetComps/BetInputDelete';
import BetCoverClose from './BetComps/BetCoverClose';

export default {
  inheritAttrs: false,
  name: 'BetKeyboard',
  data() {
    return {
      balance: '0.00',
      range: { rtn: 0, odds: 0, mOdds: 1 },
      btns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0, 'ok'],
      btnDis: [],
      delSel: 0,
      right: Object.assign({ s: 0, m: 0, o: '1.00' }, { lock: false }),
      oddsv: '',
    };
  },
  props: {
    show: Boolean,
    type: Boolean,
  },
  computed: {
    ...mapState({
      bCnt: state => state.bet.betCount,
      qObj: state => state.bet.quoteObj,
      inObj: state => state.bet.betInputObj,
      iphX: state => state.bet.isIphoneX,
    }),
    ...mapState('app', {
      user: state => state.userinfo,
      theme: state => state.theme,
    }),
    bAmt() {
      return this.inObj.amt;
    },
    delClass() {
      return `btn-del-${this.delSel ? 'active' : 'normal'}`;
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
    show() {
      this.changeBalance();
    },
  },
  components: {
    BetCoverBox,
    BetFlexBox,
    BetLikeInput,
    BetInputDelete,
    BetCoverClose,
  },
  methods: {
    ...mapMutations([
      'changeKeyStatus',
      'changebetAmount',
    ]),
    ...mapMutations('app', [
      'getUserInfo',
    ]),
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
      const [bal, odds] = [this.user && this.user.balance !== undefined ? this.user.balance : 100000, this.inObj.odds];
      [this.range.odds, this.range.mOdds, this.range.gtp] = [odds || this.qObj.odds || 1, odds || this.qObj.mOdds || 1, this.qObj.gtp || 0];
      [this.range.rtn, this.right.lock, this.oddsv] = [this.qObj.rtn, bal < this.inObj.min, oddsFormat(this.range.odds, this.range.gtp)];
      return bal;
    },
    changeBalance() {
      const [amt, num] = [this.bAmt || 0, this.inObj.num > 1 ? this.inObj.num : this.bCnt];
      const bal = this.changeMinMax();
      this.right.o = this.changeType(this.range.mOdds, true);
      let [srtn, mrtn] = [amt * (this.range.odds + 1), amt * this.range.mOdds];
      srtn = srtn <= this.range.rtn ? srtn : this.range.rtn;
      if (this.user && this.user.rtn && num > 1) {
        let saveRtn = mrtn;
        for (let i = num; i >= 2; i -= 1) {
          if (this.user.rtn[`mut${i}`] && +this.user.rtn[`mut${i}`]) {
            saveRtn = +this.user.rtn[`mut${i}`];
            break;
          }
        }
        mrtn = mrtn > saveRtn ? saveRtn : mrtn;
      }
      this.right.s = this.changeType(srtn);
      this.right.m = this.changeType(mrtn);
      this.balance = this.changeType(bal - amt);
    },
    hideFun() {
      this.changeKeyStatus();
    },
    sDelFun() {
      this.delSel = 1;
    },
    clickFun(v) {
      const bal = this.changeMinMax();
      let amt = `${this.bAmt || 0}`;
      if (/ok/i.test(v)) {
        this.hideFun();
      } else if (/del/i.test(v)) {
        amt = amt.slice(0, -1);
        this.changebetAmount({ amt: amt ? +amt : '' });
      } else {
        amt = `${amt}${v}`.replace(/^0+/, '');
        if (!this.inObj.title && +amt > bal) {
          if (this.user && this.user.balance !== undefined) this.$toast(this.$t('pageBet.balToast'));
        } else if (+amt > this.inObj.max) {
          this.$toast(this.inObj.toast || this.$t('pageBet.outToast'));
        } else {
          this.changebetAmount({ amt: +amt });
        }
      }
      this.delSel = 0;
    },
  },
  mounted() {
    this.getUserInfo();
    this.changeBalance();
    this.btnDis = [];
    for (let i = 0; i < this.btns.length; i += 1) {
      const needAdd = this.iphX && /(ok|del|0)/i.test(this.btns[i]);
      const obj = { t: this.btns[i], o: {}, i: {} };
      obj.o.height = needAdd ? '.71rem' : '.56rem';
      if (needAdd) {
        obj.i.paddingBottom = '.15rem';
      }
      this.btnDis.push(obj);
    }
  },
};
</script>

<style lang="less">
.white .nb-bet-keyboard .nb-bet-body-box .bet-keyboard-body {
  background: #FFFFFF;
  box-shadow: 0 -.02rem .2rem 0 rgba(236,236,236,0.50);
  .body-title {
    border-bottom: .01rem solid #ECEBEB;
    .bet-item {
      background: #F9F9F9;
      color:#909090;
    }
    .bet-amount .amount-text {
      color: #666;
    }
  }
  .body-shows {
    background: #FFF;
    .body-show-item .bet-show-item, .body-show-item .bet-show-null {
      color: #909090;
    }
    .body-show-item .bet-show-num {
      color: #FF5353;
    }
  }
  .body-keyboard {
    border-top: .01rem solid #ECEBEB;
    .keyboard-btn-box .btn-normal {
      color: #2E2F34;
    }
    .keyboard-btn-box .btn-active {
      background: #FF5353;
      color: #FFF;
    }
  }
}
.black .nb-bet-keyboard .nb-bet-body-box .bet-keyboard-body {
  background-image: linear-gradient(to bottom, #3a393f, #333238);
  .body-title {
    border-bottom: .01rem solid #2e2f34;
    .bet-item {
      background-image: linear-gradient(to bottom, #323237, #29292e);
      color: #909090;
    }
    .bet-amount .amount-text {
      color: #666;
    }
  }
  .body-shows {
    background-image: linear-gradient(to bottom, #3a393f, #333238);
    .body-show-item .bet-show-item, .body-show-item .bet-show-null {
      color: #909090;
    }
    .body-show-item .bet-show-num {
      color: #FF5353;
    }
  }
  .body-keyboard {
    border-top: .01rem solid #2e2f34;
    .keyboard-btn-box .btn-normal {
      border-bottom: .01rem solid #2e2f34;
      color: #bababa;
    }
    .keyboard-btn-box .btn-active {
      background: #FF5353;
      color: #FFF;
    }
  }
}
.nb-bet-keyboard .nb-bet-body-box {
  bottom: 0;
  .bet-keyboard-close {
    width: 3.75rem;
    height: .54rem;
    padding: 0 .12rem;
  }
  .bet-keyboard-body {
    width: 3.75rem;
    .body-title {
      width: 100%;
      height: .5rem;
      .bet-item {
        width: 1.4rem;
        height: 100%;
        font-size: .16rem;
      }
      .bet-amount {
        width: 2.35rem;
        height: 100%;
        .amount-text {
          width: .45rem;
          height: 100%;
          font-size: .14rem;
        }
        .amount-num {
          width: 1.45rem;
          height: .32rem;
        }
      }
    }
    .body-shows {
      width: 100%;
      height: .4rem;
      padding: 0 .12rem;
      .body-show-item {
        height: 100%;
        .bet-show-item, .bet-show-null {
          font-size: .14rem;
        }
        .bet-show-num {
          font-size: .16rem;
        }
        .bet-show-num, .bet-show-null {
          min-width: .5rem;
        }
      }
    }
    .body-keyboard {
      width: 3.75rem;
      flex-wrap: wrap;
      .keyboard-btn-box {
        width: 1.25rem;
        .btn-normal, .btn-active, .btn-del-box, .btn-del-normal, .btn-del-active {
          width: 100%;
          height: 100%;
          font-size: .21rem;
        }
        .btn-del-active {
          border: .01rem solid transparent;
        }
      }
    }
  }
}
</style>
