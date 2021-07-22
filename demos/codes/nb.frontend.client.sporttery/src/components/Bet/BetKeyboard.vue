<template>
  <bet-cover-box class="nb-bet-keyboard" :index="199999" :show="show" @close="hideFun" animate >
    <div class="bet-keyboard-close flex-end">
      <bet-cover-close :color="closeColor" />
    </div>
    <div class="bet-keyboard-body">
      <div class="body-title flex-between">
        <div class="bet-item flex-center">
          <span v-if="!norSport">{{$t(`pageBet.otherObj.${sportID}`)}}</span>
          <span v-else-if="inObj.title">{{inObj.title}}</span>
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
          <div class="bet-show-num flex-center" :style="{ color: oddsColor }" v-if="balAct">{{balance | NumFmt}}</div>
          <div class="bet-show-num flex-center" v-else>- - -</div>
        </div>
        <div class="body-show-item flex-center">
          <div class="bet-show-item flex-center">{{$t('pageBet.odds')}}</div>
          <div class="bet-show-num flex-center" :style="{ color: oddsColor }">{{(type ? right.o : oddsv) | NumFmt(true, 3)}}</div>
        </div>
        <div class="body-show-item flex-center">
          <div class="bet-show-item flex-center">{{$t('pageBet.retn')}}</div>
          <div v-if="bAmt" class="bet-show-num  flex-start" :style="{ color: oddsColor }">{{(type ? right.m : right.s) | NumFmt}}</div>
          <div v-else class="bet-show-null flex-center">- - -</div>
        </div>
      </div>
      <div class="body-keyboard flex-start">
        <div class="keyboard-btn-box" :style="v.o" v-for="(v, k) in btnDis" :key="k">
          <bet-flex-box class="btn-del-box flex-center" v-if="/del/i.test(v.t)" @start="sDelFun">
            <v-touch :class="delClass" class="flex-center" :style="v.i" @tap="clickFun(v.t)">
              <bet-input-delete />
            </v-touch>
          </bet-flex-box>
          <v-touch class="btn-active flex-center" :style="getBtnStyle(v.i)" v-else-if="/ok/i.test(v.t)" @tap="clickFun(v.t)">
            {{$t('pageBet.finish')}}
          </v-touch>
          <v-touch class="btn-normal flex-center" :style="v.i" v-else @tap="clickFun(v.t)">{{v.t}}</v-touch>
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
      balance: 0,
      range: { rtn: 0, odds: 0, mOdds: 1 },
      btns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0, 'ok'],
      btnDis: [],
      delSel: 0,
      right: Object.assign({ s: 0, m: 0, o: '1.00' }, { lock: false }),
      oddsv: '',
      maxInput: 0,
    };
  },
  props: { show: Boolean, type: Boolean },
  computed: {
    ...mapState({
      bCnt: state => state.bet.betCount,
      qObj: state => state.bet.quoteObj,
      qArr: state => state.bet.quoteMultArr,
      uBal: state => state.bet.usedBalance,
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
    sportID() {
      const rArr = this.$route.path.split('/');
      return rArr.length ? rArr[rArr.length - 1] : 10;
    },
    norSport() {
      return !/^[5-9]\d{2}$/.test(this.sportID);
    },
    delClass() {
      return `btn-del-${this.delSel ? 'active' : 'normal'}`;
    },
    balAct() {
      return !!(this.user && this.user.balance !== undefined);
    },
    closeColor() {
      const defColor = /black/i.test(this.theme) ? '#bababa' : '#ddd';
      return /blue/i.test(this.theme) ? '#bababa' : defColor;
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
    iphX() {
      this.setBottomStyle();
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
    ...mapMutations(['changeKeyStatus', 'changeBetAmount']),
    ...mapMutations('app', ['getUserInfo']),
    getBtnStyle(vi) {
      return Object.assign({ background: this.btnColor }, vi);
    },
    changeMinMax() {
      const userBal = this.user && this.user.balance !== undefined ? this.user.balance : 100000;
      const [bal, odds] = [userBal - (this.uBal || 0), this.inObj.odds];
      [this.range.odds, this.range.mOdds, this.range.gtp] = [odds || this.qObj.odds || 1, odds || this.qObj.mOdds || 1, this.qObj.gtp || 0];
      const [oddOld, oddNew] = [this.range.odds, oddsFormat(this.range.odds, this.range.gtp)];
      const newOddv = oddNew - oddOld > 0.5 ? oddOld + 1 : oddOld;
      [this.range.rtn, this.right.lock, this.oddsv] = [this.qObj.rtn, bal < this.inObj.min, newOddv];
      return bal;
    },
    changeBalance() {
      const [amt, num] = [this.bAmt || 0, this.inObj.num > 1 ? this.inObj.num : this.bCnt];
      const [cnt, bal] = [this.inObj.cnt || 1, this.changeMinMax()];
      this.right.o = this.range.mOdds;
      let [srtn, mrtn, mipt] = [amt * (this.range.odds + 1), amt * this.range.mOdds, this.inObj.max];
      srtn = srtn <= this.range.rtn ? srtn : this.range.rtn;
      if (num === 1) {
        mipt = this.range.rtn / (this.range.odds + 1);
      } else if (num > 1) {
        let [saveRtn, find] = [mrtn, false];
        if (this.qArr && this.qArr.length) {
          for (let i = 0; i < this.qArr.length; i += 1) {
            if (`${this.qArr[i].betN}_${this.qArr[i].betM}` === `${num}_1`) {
              [saveRtn, find] = [this.qArr[i].maxReturn || saveRtn, !!this.qArr[i].maxReturn];
              break;
            }
          }
        }
        if (this.user && this.user.rtn && !find) {
          for (let i = num; i >= 2; i -= 1) {
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
        [mrtn, mipt] = [mrtn > saveRtn ? saveRtn : mrtn, saveRtn / this.range.mOdds];
      }
      this.maxInput = parseInt(mipt, 10);
      [this.right.s, this.right.m, this.balance] = [srtn, mrtn, bal - amt * cnt];
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
        this.changeBetAmount({ amt: amt ? +amt : '' });
      } else {
        amt = `${amt}${v}`.replace(/^0+/, '');
        if (!this.inObj.title && +amt > bal) {
          if (this.user && this.user.balance !== undefined) this.$toast(this.$t('pageBet.balToast'));
        } else if (+amt > this.inObj.max) {
          this.$toast(this.inObj.toast || this.$t('pageBet.outToast'));
        } else {
          if (+amt > this.maxInput) {
            this.$toast(`${this.$t('pageBet.leftToast')} ${this.maxInput} ${this.$t('pageBet.rightToast')}`);
            amt = this.maxInput;
          }
          this.changeBetAmount({ amt: +amt });
        }
      }
      this.delSel = 0;
    },
    checkKey(event) {
      if (!event || !event.keyCode || !this.show) return;
      const code = +event.keyCode;
      if (/^(13|8)$/.test(code) || (code > 95 && code < 106)) {
        const cStr = code > 10 ? 'ok' : 'del';
        this.clickFun(code > 90 ? `${code - 96}` : cStr);
      }
    },
    setBottomStyle() {
      for (let i = 0; i < this.btnDis.length; i += 1) {
        const obj = this.btnDis[i];
        if (/(ok|del|0)/i.test(obj.t)) {
          obj.o.height = this.iphX ? '.71rem' : '.56rem';
          obj.i = this.iphX ? { paddingBottom: '.15rem' } : { };
          this.$set(this.btnDis, i, obj);
        }
      }
    },
  },
  mounted() {
    this.getUserInfo();
    this.changeBalance();
    this.btnDis = [];
    for (let i = 0; i < this.btns.length; i += 1) {
      this.btnDis.push({ t: this.btns[i], o: { height: '.56rem' }, i: { } });
    }
    this.setBottomStyle();
    document.addEventListener('keyup', this.checkKey);
  },
};
</script>

<style lang="less">
.white .nb-bet-keyboard .nb-bet-public-box-body .bet-keyboard-body {
  background: #FFFFFF;
  box-shadow: 0 -.02rem .2rem 0 rgba(236,236,236,0.50);
  .body-title { border-bottom: .01rem solid #ECEBEB;
    .bet-item { background: #F9F9F9; color:#909090; }
    .bet-amount .amount-text { color: #666; }
  }
  .body-shows {
    background: #FFF;
    .body-show-item .bet-show-item, .body-show-item .bet-show-null { color: #909090; }
  }
  .body-keyboard {
    border-top: .01rem solid #ECEBEB;
    .keyboard-btn-box .btn-normal { color: #2E2F34; }
    .keyboard-btn-box .btn-active { color: #FFF; }
  }
}
.black .nb-bet-keyboard .nb-bet-public-box-body .bet-keyboard-body {
  background: linear-gradient(to bottom, #3a393f, #333238);
  .body-title {
    border-bottom: .01rem solid #2e2f34;
    .bet-item { background: linear-gradient(to bottom, #323237, #29292e); color: #909090; }
    .bet-amount .amount-text { color: #666; }
  }
  .body-shows {
    background: linear-gradient(to bottom, #3a393f, #333238);
    .body-show-item .bet-show-item, .body-show-item .bet-show-null { color: #909090; }
  }
  .body-keyboard {
    border-top: .01rem solid #2e2f34;
    .keyboard-btn-box .btn-normal { border-bottom: .01rem solid #2e2f34; color: #bababa; }
    .keyboard-btn-box .btn-active { color: #FFF; }
  }
}
.blue .nb-bet-keyboard .nb-bet-public-box-body .bet-keyboard-body {
  background: linear-gradient(to bottom, #3a393f, #333238);
  .body-title {
    border-bottom: .01rem solid #2e2f34;
    .bet-item { background: linear-gradient(to bottom, #323237, #29292e); color: #909090; }
    .bet-amount .amount-text { color: #666; }
  }
  .body-shows {
    background: linear-gradient(to bottom, #3a393f, #333238);
    .body-show-item .bet-show-item, .body-show-item .bet-show-null { color: #909090; }
  }
  .body-keyboard {
    border-top: .01rem solid #2e2f34;
    .keyboard-btn-box .btn-normal { border-bottom: .01rem solid #2e2f34; color: #bababa; }
    .keyboard-btn-box .btn-active { color: #FFF; }
  }
}
.nb-bet-keyboard .nb-bet-public-box-body {
  bottom: 0;
  .bet-keyboard-close { width: 3.75rem; height: .54rem; margin: 0 auto; padding: 0 .12rem; }
  .bet-keyboard-body {
    width: 3.75rem;
    margin: 0 auto;
    .body-title {
      width: 100%;
      height: .5rem;
      .bet-item { width: 1.4rem; height: 100%; font-size: .16rem; }
      .bet-amount { width: 2.35rem; height: 100%; .amount-text { width: .45rem; height: 100%; font-size: .14rem; } .amount-num { width: 1.45rem; height: .32rem; } }
    }
    .body-shows {
      width: 100%;
      height: .4rem;
      padding: 0 .12rem;
      .body-show-item {
        height: 100%;
        .bet-show-item, .bet-show-null { font-size: .14rem; }
        .bet-show-num { font-size: .16rem; }
        .bet-show-num, .bet-show-null { min-width: .5rem; }
      }
    }
    .body-keyboard {
      width: 3.75rem;
      flex-wrap: wrap;
      .keyboard-btn-box {
        width: 1.25rem;
        .btn-normal, .btn-active, .btn-del-box, .btn-del-normal, .btn-del-active { width: 100%; height: 100%; font-size: .21rem; }
        .btn-del-active { border: .01rem solid transparent; }
      }
    }
  }
}
</style>
