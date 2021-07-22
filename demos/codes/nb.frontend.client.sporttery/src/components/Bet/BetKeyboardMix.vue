<template>
<transition name="keyMixAni">
  <div class="nb-bet-keyboard-mix" v-if="show" >
    <div class="alert-box flex-start">
      <publish-alert :color="altColor" />
      <span>{{$t('share.singleBet')}}{{1000}}{{$t('share.betAbove')}}</span>
    </div>
    <div class="content-btns flex-between">
      <bet-flex-box class="content-btn-box" v-for="mon in moneys" :key="mon.k" @start="sFun(mon.k)">
        <v-touch :class="getBtnClass('btn', mon.c)" :style="getBtnStyle(mon.c)" @tap="addMoney(mon)">
          <span class="btn-number" :style="getTextColor(mon.c)">{{mon.v}}</span>
        </v-touch>
      </bet-flex-box>
    </div>
    <div class="body-keyboard flex-start">
      <div class="keyboard-btn-box" :style="v.o" v-for="(v, k) in btnDis" :key="k">
        <v-touch class="btn-del flex-center" :style="v.i" v-if="/del/i.test(v.t)" @tap="clickFun(v.t)">
          <bet-input-delete />
        </v-touch>
        <v-touch class="btn-active flex-center" :style="getFinStyle(v.i)" v-else-if="/ok/i.test(v.t)" @tap="clickFun(v.t)">
          {{$t('pageBet.finish')}}
        </v-touch>
        <v-touch class="btn-normal flex-center" :style="v.i" v-else @tap="clickFun(v.t)">{{v.t}}</v-touch>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetFlexBox from './BetComps/BetFlexBox';
import BetInputDelete from './BetComps/BetInputDelete';
import PublishAlert from '@/components/Publish/PublishAlert';

export default {
  inheritAttrs: false,
  name: 'BetKeyboardMix',
  data() {
    return {
      moneys: [{ k: 0, v: 50, c: 0 }, { k: 1, v: 500, c: 0 }, { k: 2, v: 1500, c: 0 }, { k: 3, v: 'MAX', c: 0 }],
      btns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0, 'ok'],
      btnDis: [],
      timer: null,
    };
  },
  computed: {
    ...mapState({
      bCnt: state => state.bet.betCount,
      kObj: state => state.bet.keyObject,
      iphX: state => state.bet.isIphoneX,
    }),
    ...mapState('app', {
      betMode: state => state.bettingMode,
      user: state => state.userinfo,
      theme: state => state.theme,
    }),
    show() {
      return !!(/^3$/.test(this.betMode) && this.bCnt > 0 && this.kObj);
    },
    altColor() {
      return /blue/.test(this.theme) ? '#53fffd' : '#ff5353';
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
  components: { BetFlexBox, BetInputDelete, PublishAlert },
  watch: {
    iphX() {
      this.setBottomStyle();
    },
  },
  methods: {
    ...mapMutations(['changeKeyObject']),
    ...mapMutations('app', ['getUserInfo']),
    getBtnClass(text, flag) {
      return `content-${text}${flag ? '-active' : ''} flex-center`;
    },
    getBtnStyle(flag) {
      return flag ? { border: `.01rem solid ${this.oddsColor}` } : { };
    },
    getFinStyle(vi) {
      return Object.assign({ background: this.btnColor }, vi);
    },
    getTextColor(flag) {
      return flag ? { color: this.oddsColor } : { };
    },
    clearC(k) {
      const mon = this.moneys;
      for (let i = 0; i < mon.length; i += 1) {
        mon[i].c = `${mon[i].k}` === `${k}` ? 1 : 0;
      }
      this.moneys = mon;
    },
    sFun(k) {
      this.clearC(k);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => { this.clearC(-1); }, 300);
    },
    checkMoney(numStr, flag) {
      const item = this.kObj;
      const itemBal = parseInt(item.balance / (item.mct || 1), 10);
      let calMon = +(`${numStr}`.replace(/^0+/, '') || 0);
      const backNum = +(`${calMon}`.slice(0, -1) || 0);
      let toastStr = '';
      if (calMon > item.max) {
        calMon = flag ? backNum : item.max;
        toastStr = `${this.$t('pageBet.leftToast')}${item.max}`;
      }
      if (calMon > item.mxRtn) {
        calMon = flag ? backNum : item.mxRtn;
        toastStr = `${this.$t('pageBet.mixLfToast')}${item.mxRtn}${this.$t('pageBet.mixRtToast')}`;
      }
      if (calMon > itemBal) {
        calMon = flag ? backNum : itemBal;
        toastStr = this.$t('pageBet.balToast');
      }
      item.amount = calMon;
      if (toastStr) this.$toast(toastStr);
      this.changeKeyObject(JSON.parse(JSON.stringify(item)));
    },
    addMoney(obj) {
      const item = this.kObj;
      clearTimeout(this.timer);
      if (/^max$/i.test(obj.v)) {
        const itemBal = parseInt(item.balance / (item.mct || 1), 10);
        const maxMon = itemBal > item.max ? item.max : itemBal;
        item.amount = maxMon > item.mxRtn ? item.mxRtn : maxMon;
        this.changeKeyObject(JSON.parse(JSON.stringify(item)));
      } else {
        this.checkMoney(item.amount + (+obj.v));
      }
      this.clearC(-1);
    },
    hideFun() {
      if (!this.kObj.amount || this.kObj.amount >= this.kObj.min) {
        this.changeKeyObject();
      } else {
        this.$toast(`${this.$t('pageBet.mixMinToast')}${this.kObj.min}`);
      }
    },
    clickFun(v) {
      if (/ok/i.test(v)) {
        this.hideFun();
      } else if (/del/i.test(v)) {
        this.checkMoney(`${this.kObj.amount}`.slice(0, -1) || 0, true);
      } else if (/^\d+$/.test(v)) {
        this.checkMoney(`${this.kObj.amount}${v}`, true);
      }
    },
    checkKeyMix(event) {
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
    this.btnDis = [];
    let lColor = /^black$/i.test(this.theme) ? '#2e2f34' : '#f6f6f6';
    lColor = /^blue$/i.test(this.theme) ? '#4a4a4a' : lColor;
    for (let i = 0; i < this.btns.length; i += 1) {
      this.btnDis.push({ t: this.btns[i], o: { height: '.56rem' }, i: { borderBottom: `.01rem solid ${lColor}` } });
    }
    this.setBottomStyle();
    document.addEventListener('keyup', this.checkKeyMix);
  },
};
</script>

<style lang="less">
.keyMixAni-enter-active, .keyMixAni-leave-active { transition: all 0.15s linear; }
.keyMixAni-enter, .keyMixAni-leave-active { transform: translateY(3rem); }
.white .nb-bet-keyboard-mix {
  background: #FFFFFF;
  box-shadow: 0 .07rem .2rem 0 #909090;
  .alert-box { color: #909090; }
  .content-btns .content-btn { border: .01rem solid #ECEBEB; color: #909090; background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%); }
  .body-keyboard {
    border-top: .01rem solid #ECEBEB;
    .keyboard-btn-box .btn-normal { color: #2E2F34; }
    .keyboard-btn-box .btn-active { color: #FFF; }
    .btn-del { background: #f6f6f6; }
  }
}
.black .nb-bet-keyboard-mix {
  background: linear-gradient(to bottom, #3a393f, #333238);
  box-shadow: 0 .07rem .2rem 0 rgba(0,0,0,.5);
  border-top: .01rem solid #2e2f34;
  .alert-box { color: #bababa; }
  .content-btns .content-btn { border: .01rem solid #716d6d; color: #bababa; }
  .body-keyboard {
    border-top: .01rem solid #2e2f34;
    .keyboard-btn-box .btn-normal { color: #bababa; }
    .keyboard-btn-box .btn-active { color: #FFF; }
    .btn-del { background: #333238; }
  }
}
.blue .nb-bet-keyboard-mix {
  background: #3f3e44;
  box-shadow: 0 .07rem .2rem 0 rgba(0,0,0,.35);
  border-top: .01rem solid #2e2f34;
  .alert-box { color: #909090; }
  .content-btns .content-btn { border: .01rem solid #606060; color: #909090; }
  .body-keyboard {
    border-top: .01rem solid #4a4a4a;
    .keyboard-btn-box .btn-normal { color: #ecebeb; }
    .keyboard-btn-box .btn-active { color: #ecebeb; }
  }
}
.nb-bet-keyboard-mix {
  position: absolute;
  z-index: 9999998;
  left: 0;
  bottom: 0;
  width: 3.75rem;
  margin: 0 auto;
  .alert-box { width: 100%; height: .27rem; padding: .1rem .13rem 0 .13rem; font-size: .12rem; span { padding-left: .04rem; } }
  .content-btns { width: 100%; height: .56rem; padding: 0 3.2%; .content-btn-box { width: 23.65%; height: .36rem; } }
  .content-btn, .content-btn-active {  width: 100%; height: 100%; border-radius: .04rem; font-size: .17rem; }
  .body-keyboard { width: 3.75rem; flex-wrap: wrap; .keyboard-btn-box { width: 1.25rem; } }
  .btn-normal, .btn-active, .btn-del { width: 100%; height: 100%; font-size: .21rem; }
  .btn-del-active { border: .01rem solid transparent; }
}
</style>
