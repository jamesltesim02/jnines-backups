<template>
  <div class="nb-bet-pop" :style="popStyle">
    <bet-single :show="!!singleShow" />
    <bet-double :show="!!doubleShow" />
    <bet-multiple :show="!!multipleShow" />
    <bet-mix-cart :show="!!mixBetShow" />
    <bet-keyboard :show="bCnt > 0 && kSts" :type="!!mtpye" />
    <bet-succ-fail :show="!!succShow" :type="slSts" @close="closeSucc" />
    <bet-succ-fail-mix :show="!!succMixShow" @close="closeSucc" @history="toHisFun" />
    <bet-match-his :flag="!!(succShow || succMixShow)" />
    <bet-early-cash @close="closeEarly" />
    <bet-open-lottery />
    <bet-teach-new />
    <bet-jump-page />
    <n-b-jump-page />
    <check-mobile />
    <bet-share />
    <bind-bank-card />
    <home-notice-detail />
    <bet-keyboard-follow />
    <picker :data.sync="pickerData" @select="selFun" @change="changeFun" @show="showFun" @filter="filterFun" />
    <div class="bet-ball" :style="{ background: btnColor }"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { AppModes } from '@/config/constants';
import { getMultMaxBetList } from '@/api/quote';
import BetSingle from '@/components/Bet/BetSingle';
import BetDouble from '@/components/Bet/BetDouble';
import BetMixCart from '@/components/Bet/BetMixCart';
import BetMultiple from '@/components/Bet/BetMultiple';
import BetKeyboard from '@/components/Bet/BetKeyboard';
import BetSuccFail from '@/components/Bet/BetSuccFail';
import BetMatchHis from '@/components/Bet/BetMatchHis';
import BetEarlyCash from '@/components/Bet/BetEarlyCash';
import BetSuccFailMix from '@/components/Bet/BetSuccFailMix';
import BetJumpPage from '@/components/Bet/BetJumpPage';
import NBJumpPage from '@/components/common/NBJumpPage';
import CheckMobile from '@/components/QueryAndBank/CheckMobile';
import BindBankCard from '@/components/QueryAndBank/BindBankCard';
import HomeNoticeDetail from '@/components/Home/HomeNoticeDetail';
import BetKeyboardFollow from '@/components/Bet/BetKeyboardFollow';
import BetOpenLottery from '@/components/Bet/BetOpenLottery';
import BetTeachNew from '@/components/Bet/BetTeachNew';
import BetShare from '@/components/Share/BetShare';
import Picker from '@/components/QueryAndBank/Picker';

export default {
  inheritAttrs: false,
  name: 'BetPop',
  data() {
    return {
      ballRun: false,
      posit: [0, 0],
      sTimer: null,
      pickerData: { },
      pickerShow: false,
      popStyle: { top: 0 },
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
      btObj: state => state.bet.bettingObj,
      sucSts: state => state.bet.succStatus,
      needShow: state => state.bet.needShowSingle,
    }),
    ...mapState('app', {
      userinfo: state => state.userinfo,
      toastStr: state => state.toastStr,
      isLoged: state => state.isLoged,
      mtpye: state => state.multType,
      betMode: state => state.bettingMode,
      theme: state => state.theme,
    }),
    ...mapState('query', { pickData: state => state.pickData }),
    rout() {
      return this.$route.path;
    },
    appMode() {
      return window.NBConfig.APP_MODE;
    },
    succShow() {
      return /^[12]$/.test(this.betMode) && /^(-[1-9]|[02-9])$/.test(this.slSts);
    },
    succMixShow() {
      return /^3$/.test(this.betMode) && this.btObj;
    },
    sShow() {
      return this.succShow || this.succMixShow;
    },
    singleShow() {
      if (/^1$/.test(this.betMode)) {
        return this.bCnt > 0 && !this.kSts && !this.suSts && !this.sShow && (this.needShow || !this.mtpye) && !this.pickerShow;
      }
      if (/^2$/.test(this.betMode)) {
        return this.bCnt > 0 && !this.kSts && !this.suSts && !this.sShow && this.needShow && !this.pickerShow;
      }
      return false;
    },
    multipleShow() {
      let rst = this.bCnt > 0 && !this.kSts && /^[13]$/.test(this.appMode) && !this.singleShow && !this.pickerShow;
      rst = rst && !this.suSts && !this.sShow && /^(200|3[02]\d)$/.test(this.$route.meta.index);
      return !/^2$/.test(this.betMode) ? rst && /^1$/.test(this.betMode) && !!this.mtpye : rst;
    },
    doubleShow() {
      const rst = !this.kSts && !this.suSts && !this.sShow && /^2$/.test(this.appMode) && !this.singleShow && !this.pickerShow;
      return rst && /^[12]$/.test(this.betMode) && /^(200|3[02]\d)$/.test(this.$route.meta.index);
    },
    mixBetShow() {
      const rst = /^3$/.test(this.betMode) && this.bCnt > 0 && !this.suSts && !this.sShow && !this.pickerShow;
      return rst && /^(200|3[02]\d)$/.test(this.$route.meta.index);
    },
    multDouble() {
      return !!(this.multipleShow || this.doubleShow || this.mixBetShow);
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
    userinfo() {
      this.checkLogin(false);
      const idx = this.$route.meta.index;
      if (!this.isLoged && /^[48]\d{2}$/.test(idx) && AppModes.SEAMLESS !== this.appMode) {
        this.toLoginPage(this);
      }
    },
    betMode() {
      this.clearBetItem();
    },
    betFlag() {
      this.startPush();
    },
    rout() {
      this.changeEarlyStatus();
      this.changeEarlySuccess();
      this.clearEarlyTimer();
      this.changeBalAlert();
      this.changeOddsAlert(0);
      this.checkLogin(this.mtpye && /^\/(bet|master|detail|matchs)(\/\d+)*$/i.test(this.rout), true);
    },
    mtpye() {
      if (/^1$/.test(this.betMode)) this.clearBetItem();
      this.changeShowIndex();
    },
    bCnt(n, o) {
      this.startPush();
      if (o > 0 && n === o + 1 && this.multDouble) {
        setTimeout(() => { this.addAnimation(); }, 10);
      }
    },
    sucSts() {
      clearTimeout(this.sTimer);
      if (this.sucSts && /^\/history\//i.test(this.rout)) {
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
    multDouble() {
      this.setPopStyle();
    },
  },
  components: {
    BetSingle,
    BetDouble,
    BetMixCart,
    BetMultiple,
    BetKeyboard,
    BetSuccFail,
    BetMatchHis,
    BetEarlyCash,
    BetJumpPage,
    NBJumpPage,
    CheckMobile,
    BindBankCard,
    BetSuccFailMix,
    HomeNoticeDetail,
    BetKeyboardFollow,
    BetOpenLottery,
    BetTeachNew,
    BetShare,
    Picker,
  },
  methods: {
    ...mapMutations(['changeSlipStatus', 'pushBetOption', 'clearBetItem', 'clearEarlyTimer', 'changeSuccStatus', 'changeBalAlert', 'changeOddsAlert', 'changeSucFaiArr', 'changeEarlyStatus', 'changeEarlySuccess', 'changeShowIndex']),
    ...mapMutations('app', ['getUserInfo', 'updateUserinfo', 'setSingleBetStatus', 'setNbFilterClass', 'setLockIOSSwipe']),
    ...mapMutations('query', ['setPickerSelect', 'setPickChange']),
    ...mapActions(['makePushPara', 'tranBalToNB', 'getNBUser']),
    ...mapActions('app', ['reloadBalance', 'toLoginPage']),
    selFun(obj) {
      this.setPickerSelect(obj);
    },
    changeFun(obj) {
      this.setPickChange(obj);
    },
    showFun(show) {
      this.pickerShow = !!show;
      this.setLockIOSSwipe(!!show);
    },
    filterFun(flag) {
      this.setNbFilterClass(!!flag);
    },
    closeEarly() {
      this.changeEarlyStatus();
    },
    setPopStyle() {
      this.popStyle = this.multDouble ? { bottom: 0 } : { top: 0 };
    },
    toHisFun() {
      if (this.userinfo && this.userinfo.token) {
        this.$router.push('/history/0');
      }
      this.closeSucc();
    },
    async closeSucc() {
      this.changeSucFaiArr();
      this.changeSlipStatus(1);
      if (this.userinfo && this.userinfo.token) {
        const tResult = await this.tranBalToNB(true);
        if (tResult) {
          this.getNBUser(true);
        } else {
          this.reloadBalance();
        }
      }
    },
    checkLogin(isMulBet, flag) {
      if (!this.isLoged && !isMulBet && /^1$/.test(this.betMode)) {
        this.clearBetItem();
      }
      if (flag && this.isLoged) {
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
    startPush() {
      this.checkLogin(true, true);
      this.makePushPara();
      this.$regpush(this.pushData, (msg) => { this.pushBetOption(msg); }, true);
    },
    getLeft(el) {
      if (el.offsetParent && !/nb-bet-(multiple|double|mix-bet)/i.test(el.offsetParent.className)) {
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
    copyTarget(e, ev, flag) {
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      const input = document.getElementById('hide-input-for-copy');
      const [x, y] = this.getPosit(e);
      if (!flag) this.posit = [x, y];
      const pass = Date.now() - ev.t < ev.max && Math.abs(x - ev.x) < 5 && Math.abs(y - ev.y) < 5;
      if (!e.button && pass && /copy-flag/i.test(cName)) {
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
      const btm = this.$el.querySelector('.nb-bet-multiple,.nb-bet-double,.nb-bet-mix-bet');
      const ball = this.$el.querySelector('.bet-ball');
      const target = this.$el.querySelector('.num-cnt');
      if (!target || !btm || !ball || this.ballRun || this.posit[1] < 50) return;
      const [tLeft, tBottom] = [this.getLeft(target) + target.offsetHeight * 0.08, btm.offsetHeight * 0.6];
      [this.ballRun, ball.style.transition] = [true, 'none'];
      [ball.style.width, ball.style.height] = ['.05rem', '.05rem'];
      const bottom = window.innerHeight - this.posit[1];
      [ball.style.left, ball.style.bottom] = [`${this.posit[0]}px`, `${bottom}px`];
      setTimeout(() => {
        ball.style.transition = 'width .5s linear,height .5s linear,left .5s linear,bottom .5s cubic-bezier(.6,-.2,.7,.1)';
        [ball.style.width, ball.style.height] = ['.12rem', '.12rem'];
        [ball.style.left, ball.style.bottom] = [`${tLeft}px`, `${tBottom}px`];
        setTimeout(() => {
          [ball.style.transition, this.ballRun] = ['none', false];
          [ball.style.width, ball.style.height] = [0, 0];
        }, 500);
      }, 30);
    },
  },
  mounted() {
    if (/^1$/.test(this.betMode)) this.clearBetItem();
    this.startPush();
    this.pickTime = Date.now();
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
      if (!ev.touch) this.copyTarget(e, ev, true);
    });
    setTimeout(this.setPopStyle, 20);
  },
};
</script>

<style lang="less">
.nb-bet-pop { position: fixed; left: 0; right: 0; z-index: 99; }
.bet-ball { position: fixed; z-index: 9999999; border-radius: 100%; }
</style>
