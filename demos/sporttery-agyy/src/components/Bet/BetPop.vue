<template>
  <div class="nb-bet-pop">
    <bet-single :show="singleShow" />
    <bet-double :show="doubleShow" />
    <bet-multiple :show="multipleShow" />
    <bet-keyboard :show="bCnt > 0 && kSts" :type="!!mtpye" />
    <bet-succ-fail :show="/^(-[1-9]|[02-9])$/.test(slSts)" :type="slSts" @close="closeSucc" />
    <bet-early-cash @close="closeEarly" />
    <bet-jump-page />
    <check-mobile />
    <bind-bank-card />
    <picker :data.sync="pickerData" @select="selFun" @change="changeFun" />
    <div class="bet-ball"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { getMultMaxBetList } from '@/api/quote';
import { getBetBalance } from '@/api/bet';
import { AppModes } from '@/config/constants';
import BetSingle from '@/components/Bet/BetSingle';
import BetDouble from '@/components/Bet/BetDouble';
import BetMultiple from '@/components/Bet/BetMultiple';
import BetKeyboard from '@/components/Bet/BetKeyboard';
import BetSuccFail from '@/components/Bet/BetSuccFail';
import BetEarlyCash from '@/components/Bet/BetEarlyCash';
import BetJumpPage from '@/components/Bet/BetJumpPage';
import CheckMobile from '@/components/QueryAndBank/CheckMobile';
import BindBankCard from '@/components/QueryAndBank/BindBankCard';
import Picker from '@/components/QueryAndBank/Picker';

export default {
  inheritAttrs: false,
  name: 'BetPop',
  data() {
    return {
      ballRun: false,
      posit: [0, 0],
      succShow: true,
      sTimer: null,
      pickerData: { },
    };
  },
  computed: {
    ...mapState({
      slSts: state => state.bet.slipStatus,
      betFlag: state => state.bet.betFlag,
      betList: state => state.bet.betList,
      bCnt: state => state.bet.betCount,
      pushData: state => state.bet.pushData,
      kSts: state => state.bet.keyStatus,
      suSts: state => state.bet.subStatus,
      sucSts: state => state.bet.succStatus,
      needShow: state => state.bet.needShowSingle,
    }),
    ...mapState('app', {
      userinfo: state => state.userinfo,
      toastStr: state => state.toastStr,
      isLoged: state => state.isLoged,
      mtpye: state => state.multType,
      betMode: state => state.bettingMode,
    }),
    ...mapState('query', {
      pickData: state => state.pickData,
    }),
    rout() {
      return this.$route.path;
    },
    appMode() {
      return window.NBConfig.APP_MODE;
    },
    singleShow() {
      if (!/^2$/.test(this.betMode)) {
        return this.bCnt > 0 && !this.kSts && !this.suSts && (this.needShow || !this.mtpye);
      }
      return this.bCnt > 0 && !this.kSts && !this.suSts && this.needShow;
    },
    multipleShow() {
      let rst = this.bCnt > 0 && !this.kSts && /^[13]$/.test(this.appMode) && !this.singleShow;
      rst = rst && !this.suSts && /^([23]0|31)0$/.test(this.$route.meta.index);
      return !/^2$/.test(this.betMode) ? rst && !!this.mtpye : rst;
    },
    doubleShow() {
      const rst = !this.kSts && !this.suSts && /^2$/.test(this.appMode) && !this.singleShow;
      return rst && /^([23]0|31)0$/.test(this.$route.meta.index);
    },
  },
  watch: {
    userinfo() {
      this.checkLogin(false);
      const idx = this.$route.meta.index;
      if (!this.isLoged && /^[45]\d{2}$/.test(idx) && AppModes.SEAMLESS !== this.appMode) {
        this.$router.replace('/login');
      }
    },
    betMode() {
      this.clearBetItem();
    },
    betFlag() {
      this.startPush();
    },
    rout() {
      this.checkIsIphoneX();
      this.changeEarlyStatus();
      this.changeEarlySuccess();
      this.clearEarlyTimer();
      this.changeBalAlert();
      this.changeOddsAlert(0);
      this.checkLogin(this.mtpye && /^\/(bet|master|detail|matchs)(\/\d+)*$/i.test(this.rout), true);
    },
    mtpye() {
      if (!/^2$/.test(this.betMode)) this.clearBetItem();
      this.changeShowIndex();
    },
    bCnt(n, o) {
      this.startPush();
      if (n > o && (this.doubleShow || this.multipleShow)) {
        this.addAnimation();
      }
    },
    sucSts() {
      clearTimeout(this.sTimer);
      if (this.sucSts && /^\/history/i.test(this.rout)) {
        this.sTimer = setTimeout(() => { this.changeSuccStatus(); }, 10000);
      }
    },
    toastStr() {
      if (this.toastStr) {
        this.$toast(this.$t(this.toastStr));
      }
    },
    singleShow() {
      this.setSingleBetStatus(this.singleShow);
    },
    pickData() {
      this.pickerData = JSON.parse(JSON.stringify(this.pickData));
    },
  },
  components: {
    BetSingle,
    BetDouble,
    BetMultiple,
    BetKeyboard,
    BetSuccFail,
    BetEarlyCash,
    BetJumpPage,
    CheckMobile,
    BindBankCard,
    Picker,
  },
  methods: {
    ...mapMutations([
      'changeSlipStatus',
      'pushBetOption',
      'clearBetItem',
      'clearEarlyTimer',
      'changeSuccStatus',
      'changeBalAlert',
      'changeOddsAlert',
      'changeEarlyStatus',
      'changeEarlySuccess',
      'checkIsIphoneX',
      'changeShowIndex',
    ]),
    ...mapActions(['makePushPara']),
    ...mapMutations('app', ['getUserInfo', 'updateUserinfo', 'setSingleBetStatus']),
    ...mapActions('app', ['reloadBalance']),
    ...mapMutations('query', ['setPickerSelect', 'setPickChange']),
    selFun(obj) {
      this.setPickerSelect(obj);
    },
    changeFun(obj) {
      this.setPickChange(obj);
    },
    closeEarly() {
      this.changeEarlyStatus();
    },
    closeSucc() {
      this.changeSlipStatus(1);
      if (!this.userinfo || !this.userinfo.token) {
        return;
      }
      if (AppModes.SEAMLESS === this.appMode) {
        this.getNBUser(true);
        return;
      }
      this.reloadBalance();
    },
    checkLogin(isMulBet, flag) {
      if (!this.isLoged && !isMulBet && !/^2$/.test(this.betMode)) {
        this.clearBetItem();
      }
      if (flag) {
        this.checkMaxRtn();
        this.getNBUser();
      }
    },
    async checkMaxRtn() {
      if (!this.userinfo || !this.userinfo.token) return;
      const [user, nowt, maxt] = [this.userinfo, Date.now(), 43200000];
      if (!user.rtn || !user.rtn.t || nowt - user.rtn.t > maxt) {
        try {
          const data = await getMultMaxBetList();
          if (this.userinfo && this.userinfo.token) {
            user.rtn = Object.assign({}, user.rtn || {}, data || {}, { t: nowt });
            this.updateUserinfo(user);
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    async getNBUser(flag) {
      if (!this.userinfo || !this.userinfo.token) return;
      const [user, nowt, maxt] = [this.userinfo, Date.now(), 43200000];
      if (flag || !user.nbUser || !user.t || nowt - user.t > maxt) {
        try {
          const data = await getBetBalance();
          if (this.userinfo && this.userinfo.token) {
            user.balance = data && data.balance !== undefined ? data.balance : user.balance;
            [user.nbUser, user.t] = [data && data.nbUser ? data.nbUser : '', nowt];
            this.updateUserinfo(user);
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    startPush() {
      this.checkLogin(true, true);
      this.makePushPara();
      this.$regpush(this.pushData, (msg) => { this.pushBetOption(msg); }, true);
    },
    getLeft(el) {
      if (el.offsetParent && !/nb-bet-(multiple|double)/i.test(el.offsetParent.className)) {
        return el.offsetLeft + this.getLeft(el.offsetParent);
      }
      return el.offsetLeft;
    },
    getTop(el) {
      return el.offsetParent ? el.offsetTop + this.getTop(el.offsetParent) : el.offsetTop;
    },
    getPosit(e) {
      let touch = e.targetTouches ? e.targetTouches[0] : e;
      touch = e.changedTouches ? e.changedTouches[0] : touch;
      return [touch.pageX, touch.pageY];
    },
    copyTarget(e, ev) {
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      const input = document.getElementById('hide-input-for-copy');
      const [x, y] = this.getPosit(e);
      this.posit = [x, y];
      const pass = Date.now() - ev.t < ev.max && Math.abs(x - ev.x) < 5 && Math.abs(y - ev.y) < 5;
      if (pass && /copy-flag/i.test(cName)) {
        const target = e.target.parentNode.querySelector('.copy-target') || e.target;
        const alert = e.target.parentNode.querySelector('.copy-alert');
        input.value = target.innerText;
        input.focus();
        input.setSelectionRange(0, input.value.length);
        document.execCommand('Copy');
        input.value = '';
        input.blur();
        this.$toast(alert ? alert.innerText : this.$t('pageBet.copySucc'));
      }
    },
    addAnimation() {
      const btm = this.$el.querySelector('.nb-bet-multiple,.nb-bet-double');
      const ball = this.$el.querySelector('.bet-ball');
      const target = this.$el.querySelector('.num-cnt');
      if (!target || !btm || !ball || this.ballRun || this.posit[1] < 50) return;
      const [tLeft, tBottom] = [this.getLeft(target) + target.offsetHeight * 0.08, btm.offsetHeight * 0.6];
      [this.ballRun, ball.style.transition] = [true, 'none'];
      [ball.style.width, ball.style.height] = ['.05rem', '.05rem'];
      const bottom = window.screen.height - this.posit[1];
      [ball.style.left, ball.style.bottom] = [`${this.posit[0]}px`, `${bottom}px`];
      setTimeout(() => {
        ball.style.transition = 'width .5s linear,height .5s linear,left .5s linear,bottom .5s cubic-bezier(.6,-.2,.7,.1)';
        [ball.style.width, ball.style.height] = ['.12rem', '.12rem'];
        [ball.style.left, ball.style.bottom] = [`${tLeft}px`, `${tBottom}px`];
        setTimeout(() => {
          [ball.style.transition, this.ballRun] = ['none', false];
          [ball.style.width, ball.style.height] = [0, 0];
        }, 500);
      }, 20);
    },
  },
  created() {
    this.checkIsIphoneX();
  },
  mounted() {
    if (!/^2$/.test(this.betMode)) this.clearBetItem();
    this.startPush();
    const ev = Object.assign({ t: 0, max: 300, touch: false }, { x: 0, y: 0 });
    document.addEventListener('touchstart', (e) => {
      [ev.t, ev.touch] = [e.touches.length > 1 ? 0 : Date.now(), true];
      [ev.x, ev.y] = this.getPosit(e);
    });
    document.addEventListener('mousedown', (e) => {
      if (!ev.touch) {
        ev.t = Date.now();
        [ev.x, ev.y] = this.getPosit(e);
      }
    });
    document.addEventListener('touchend', (e) => {
      this.copyTarget(e, ev);
    });
    document.addEventListener('mouseup', (e) => {
      if (!ev.touch) this.copyTarget(e, ev);
    });
  },
};
</script>

<style lang="less">
.bet-ball {
  position: fixed;
  z-index: 9999999;
  border-radius: 100%;
  background: #ff5353;
}
</style>
