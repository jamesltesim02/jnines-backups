<template>
  <bet-cover-box class="nb-bet-keyboard-flw" :index="199999" :show="show" @close="hideFun" animate >
    <div class="bet-keyboard-flw-body">
      <div class="body-title flex-between">
        <div class="body-title-tp flex-start">
          <span class="send-title">{{sendTitle}}</span>
          <div class="send-min-box flex-center">
            <span class="send-txt">{{$t('share.minFlw')}}</span>
            <span class="send-num">{{(kData.followMinBet || 0) | NumFmt}}</span>
            <span class="send-txt">{{$t('share.rmb')}}</span>
          </div>
          <div class="send-odds-box flex-center" v-if="kData.ensureOdds">
            <span class="send-txt">{{$t('share.ensure')}}</span>
            <span class="send-num">{{(kData.ensureOdds || 0) | NumFmt(true)}}</span>
          </div>
        </div>
        <div class="body-show-item flex-end">
          <div class="bet-show-item flex-center">{{$t('share.balance')}}</div>
          <div class="bet-show-num flex-center" :style="{ color: oddsColor }" v-if="balAct">{{balance | NumFmt}}</div>
          <div class="bet-show-num flex-center" v-else>- - -</div>
        </div>
      </div>
      <div class="body-shows flex-between">
        <bet-new-like-input class="amount-num" :min="kData.minBet" :max="kData.maxBet" :focus="isFocus" @focus="focusFun" />
        <v-touch class="body-no-reward-card flex-end" v-if="!(coupons && coupons.length)" @tap="toRewardFun" >
          <span class="show-box-rwd flex-start">{{$t('share.toReward')}}</span>
        </v-touch>
        <v-touch class="body-show-card flex-end" v-else @tap="showCardFun">
          <span>{{$t('share.using')}}{{useCardName}}</span>
          <div :class="`select-arrow-${/^2$/.test(type) ? 'tp' : 'btm'} flex-center`">
            <svg width=".12rem" height=".12rem" style="width:.12rem;height:.12rem" viewBox="0 0 100 100" version="1.1">
              <path d="M 0 14.5 L 100 14.5 L50 85.5 Z"></path>
            </svg>
          </div>
        </v-touch>
      </div>
      <div class="body-btns flex-start" :style="btnsStyle" v-if="!type">
        <v-touch class="body-btn-cancel flex-center" :style="btnStyle" @tap="hideFun">{{$t('share.cancel')}}</v-touch>
        <v-touch class="body-btn-submit flex-center" :style="btnStyle" @tap="submitFun">{{$t('share.flwSubmit')}}</v-touch>
      </div>
      <div class="body-keyboard-box" v-else-if="/^1$/.test(type)" >
        <div class="content-btns flex-between">
          <bet-flex-box class="content-btn-box" v-for="mon in moneys" :key="mon.k" @start="sFun(mon.k)">
            <v-touch :class="getBtnClass('btn', mon.c)" :style="getBtnStyle(mon.c)" @tap="addMoney(mon)">
              <span class="btn-number" :style="getTextColor(mon.c)">{{mon.v}}</span>
            </v-touch>
          </bet-flex-box>
        </div>
        <div class="body-keyboard flex-start" >
          <div class="keyboard-btn-box" :style="v.o" v-for="(v, k) in btnDis" :key="k">
            <bet-flex-box class="btn-del flex-center" v-if="/del/i.test(v.t)" @start="sDelFun">
              <v-touch class="btn-del-icon flex-center" :style="v.i" @tap="clickFun(v.t)">
                <bet-input-delete />
              </v-touch>
            </bet-flex-box>
            <v-touch class="btn-active flex-center" :style="getFinStyle(v.i)" v-else-if="/ok/i.test(v.t)" @tap="clickFun(v.t)">
              {{$t('pageBet.finish')}}
            </v-touch>
            <v-touch class="btn-normal flex-center" :style="v.i" v-else @tap="clickFun(v.t)">{{v.t}}</v-touch>
          </div>
        </div>
      </div>
      <div class="body-card" :style="cardStyle" v-else-if="/^2$/.test(type)">
        <div class="body-card-box">
          <swiper class="nb-card-swipe" v-if="coupons && coupons.length">
            <swiper-slide v-for="(v, k) in coupons" :key="k">
              <div class="comp-card-box flex-center" >
                <bet-comp-card :data="v" :valid="isCardValid(v)" :select="isUsedCard(v)" @tap="selectCardFun" />
              </div>
            </swiper-slide>
          </swiper>
          <div class="nb-no-card flex-center" v-else>{{$t('share.noCompCard')}}</div>
        </div>
        <v-touch class="comp-card-sure flex-center" @tap="cardSureFun">{{$t('share.cardSure')}}</v-touch>
      </div>
    </div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { postFollowPlan } from '@/api/bet';
import BetCompCard from './BetCompCard';
import BetCoverBox from './BetComps/BetCoverBox';
import BetFlexBox from './BetComps/BetFlexBox';
import BetInputDelete from './BetComps/BetInputDelete';
import BetNewLikeInput from './BetComps/BetNewLikeInput';

export default {
  inheritAttrs: false,
  name: 'BetKeyboard',
  data() {
    return {
      moneys: [{ k: 0, v: 50, c: 0 }, { k: 1, v: 500, c: 0 }, { k: 2, v: 1500, c: 0 }, { k: 3, v: 'MAX', c: 0 }],
      btns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0, 'ok'],
      useCard: null,
      btnsStyle: { },
      cardStyle: { },
      btnStyle: { },
      timer: null,
      btnDis: [],
      delSel: 0,
      bAmt: 0,
      type: 0,
    };
  },
  computed: {
    ...mapState({
      kSts: state => state.bet.keyStatus,
      kObj: state => state.bet.keyObject,
      iphX: state => state.bet.isIphoneX,
    }),
    ...mapState('app', {
      user: state => state.userinfo,
      theme: state => state.theme,
    }),
    ...mapState('setting', ['currency']),
    kData() {
      return this.kObj || { };
    },
    show() {
      return !!(this.kSts && this.kData && this.kData.ticketId && this.kData.userId);
    },
    isFocus() {
      return /^1$/.test(this.type);
    },
    isLogin() {
      return !!(this.user && this.user.token && this.user.nbUser);
    },
    coupons() {
      return this.kData && this.kData.coupons && this.kData.coupons.length ? this.kData.coupons : [];
    },
    useCardName() {
      return this.useCard && this.useCard.couponName ? this.useCard.couponName : this.$t('share.noUseCard');
    },
    sendTitle() {
      return this.kData && /^2$/.test(this.kData.betType) ? this.$t('share.flwMultiple') : this.$t('share.flwSingle');
    },
    balAct() {
      return !!(this.user && this.user.balance !== undefined);
    },
    balNum() {
      return this.user && this.user.balance !== undefined ? this.user.balance : 100000;
    },
    balance() {
      const cardAmt = this.useCard && this.useCard.money ? +this.useCard.money : 0;
      return this.balNum - this.bAmt - cardAmt;
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
    show() {
      [this.type, this.bAmt] = [this.show ? 1 : 0, 0];
      this.changeBetAmount({ amt: '' });
    },
    iphX() {
      this.setBottomStyle();
    },
    bAmt() {
      this.smtSelCouponCard();
    },
    coupons() {
      this.smtSelCouponCard();
    },
  },
  components: {
    swiper,
    swiperSlide,
    BetCoverBox,
    BetFlexBox,
    BetCompCard,
    BetInputDelete,
    BetNewLikeInput,
  },
  methods: {
    ...mapMutations(['changeKeyStatus', 'changeKeyObject', 'changeBetAmount', 'changeKeySubSuc', 'setFinishTask', 'changeSuccStatus']),
    ...mapMutations('app', ['getUserInfo', 'setShareTarget']),
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
    isUsedCard(v) {
      return !!(this.useCard && `${this.useCard.licenseCode}` === `${v.licenseCode}`);
    },
    getCompDate(v) {
      return `${v && v.endDate ? v.endDate : ''}`.replace(/\.\d+$/, '');
    },
    toRewardFun() {
      this.hideFun();
      this.$router.push('/reward');
    },
    hideFun() {
      this.changeKeyStatus();
      this.changeKeyObject();
      this.changeBetAmount({ amt: '' });
    },
    sDelFun() {
      this.delSel = 1;
    },
    focusFun() {
      this.type = 1;
    },
    showCardFun() {
      this.type = /^2$/.test(this.type) ? 0 : 2;
    },
    cardSureFun() {
      this.type = 0;
    },
    getDateValid(v) {
      const dtStr = this.getCompDate(v).replace(/-/g, '/');
      return !!(dtStr && new Date(dtStr).getTime() - new Date().getTime() > 0);
    },
    getCardValid(v) {
      return !!(v && /^\d+(\.\d+)?$/.test(v.minBet) && +this.bAmt >= +v.minBet);
    },
    isCardValid(v) {
      return !!(this.getCardValid(v) && this.getDateValid(v));
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
    addMoney(obj) {
      clearTimeout(this.timer);
      if (/^max$/i.test(obj.v)) {
        this.checkMoney(+this.balNum > +this.kData.maxBet ? this.kData.maxBet : this.balNum);
      } else {
        this.checkMoney(+(this.bAmt || 0) + (+obj.v));
      }
      this.clearC(-1);
    },
    selectCardFun(v) {
      if (this.useCard && `${this.useCard.licenseCode}` === `${v.licenseCode}`) {
        this.useCard = null;
      } else if (!this.getDateValid(v)) {
        this.$toast(this.$t('share.cardUnAva'));
      } else if (!this.getCardValid(v)) {
        this.$toast(this.$t('share.noReach'));
      } else {
        this.useCard = v;
      }
    },
    followSucFun() {
      const content = this;
      this.setFinishTask({
        title: content.$t('share.flwBetSucc'),
        detail: [{
          text: content.$t('share.flwDetailOne'),
          style: { fontSize: '.2rem', fontWeight: 500 },
        }, {
          text: content.$t('share.flwDetailTwo'),
          style: { fontSize: '.16rem', marginTop: '.12rem' },
        }],
        button: {
          text: content.$t('share.shareNow'),
          fun: () => {
            content.setShareTarget('follow');
          },
        },
      });
    },
    async submitFun() {
      if (!this.isLogin) {
        this.$toast(this.$t('pageBet.notLogin'));
      } else if (!this.kData || !this.kData.followMinBet || !this.kData.ticketId) {
        this.$toast(this.$t('share.paraErr'));
        this.$router.go(-1);
        this.hideFun();
      } else if (+this.bAmt < +this.kData.minBet) {
        this.$toast(this.$t('share.noReach'));
      } else {
        const params = { planId: this.kData.ticketId, amount: +this.bAmt, cry: this.currency };
        const ua = window.navigator.userAgent;
        let ctp = /(android|mobile|MQQBrowser)/i.test(ua) ? 3 : 1;
        ctp = /(phone|pad|pod|ios)/i.test(ua) ? 2 : ctp;
        params.ctp = +(`2${ctp}${/\s+nb\//i.test(ua) ? 1 : 0}6`);
        params.licenseCode = `${this.useCard && this.useCard.licenseCode ? this.useCard.licenseCode : 0}`;
        try {
          const rst = await postFollowPlan(params);
          if (rst && rst.ticketId) {
            this.followSucFun();
            this.changeKeySubSuc();
            this.changeSuccStatus(true);
          } else {
            this.$toast(this.$t('share.flwBetFail'));
          }
        } catch (ev) {
          this.$toast(ev && ev.msg ? ev.msg : this.$t('share.flwBetFail'));
        } finally {
          this.hideFun();
        }
      }
    },
    checkMoney(amt) {
      if (+amt > +(this.balNum || 0)) {
        this.$toast(this.$t('pageBet.balToast'));
      } else if (+amt > +this.kData.maxBet) {
        this.$toast(this.$t('pageBet.outToast'));
      } else {
        this.bAmt = +(amt || 0);
        this.changeBetAmount({ amt: amt ? +amt : '' });
      }
    },
    clickFun(v) {
      let amt = `${this.bAmt || 0}`;
      if (/ok/i.test(v)) {
        this.type = 0;
      } else if (/del/i.test(v)) {
        amt = amt.slice(0, -1);
        this.bAmt = +(amt || 0);
        this.changeBetAmount({ amt: amt ? +amt : '' });
      } else {
        this.checkMoney(`${amt}${v}`.replace(/^0+/, ''));
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
      this.cardStyle = this.iphX ? { height: '2.95rem', paddingBottom: '.15rem' } : { height: '2.8rem' };
      this.btnsStyle = this.iphX ? { height: '.71rem' } : { height: '.56rem' };
      this.btnStyle = this.iphX ? { paddingBottom: '.15rem' } : { };
      for (let i = 0; i < this.btnDis.length; i += 1) {
        const obj = this.btnDis[i];
        if (/(ok|del|0)/i.test(obj.t)) {
          obj.o.height = this.iphX ? '.71rem' : '.56rem';
          obj.i = this.iphX ? { paddingBottom: '.15rem' } : { };
          this.$set(this.btnDis, i, obj);
        }
      }
    },
    smtSelCouponCard() {
      let sel = null;
      if (this.coupons && this.coupons.length) {
        const dt = JSON.parse(JSON.stringify(this.coupons));
        for (let i = 0; i < dt.length; i += 1) {
          const vDate = `${dt[i] && dt[i].endDate ? dt[i].endDate : ''}`.replace(/\.\d+$/, '').replace(/-/g, '/');
          const dValid = !!(vDate && new Date(vDate).getTime() - new Date().getTime() > 0);
          const cValid = !!(dt[i] && /^\d+(\.\d+)?$/.test(dt[i].minBet) && +this.bAmt > +dt[i].minBet);
          if (dValid && cValid && (!sel || (dt[i] && +sel.money < +dt[i].money))) {
            sel = dt[i];
          }
        }
      }
      this.useCard = sel;
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
    document.addEventListener('keyup', this.checkKey);
  },
};
</script>

<style lang="less">
.nb-bet-keyboard-flw .nb-bet-public-box-body {
  bottom: 0;
  .bet-keyboard-flw-body {
    width: 3.75rem;
    margin: 0 auto;
    background: #FFFFFF;
    box-shadow: 0 .07rem .2rem 0 #909090;
    .body-title { position: relative; width: 100%; height: .6rem; border-bottom: .01rem solid #ecebeb; }
    .body-title-tp { width: 100%; height: 100%; padding: 0 .12rem; }
    .body-show-item { position: absolute; width: 50%; height: 100%; top: 0; right: 0; padding: 0 .14rem; }
    .send-title { font-size: .18rem; font-weight: 500; color: #2e2f34; }
    .send-min-box { height: .2rem; margin-left: .08rem; padding: 0 .08rem; border-radius: .1rem; border: .01rem solid #6eb4ff; background: rgba(110,180,255,.1); color: #6eb4ff; }
    .send-odds-box { height: .2rem; margin-left: .07rem; padding: 0 .08rem; border-radius: .1rem; border: .01rem solid #ff5353; background: rgba(255,83,83,.1); color: #ff5353; }
    .send-txt { font-size: .12rem; line-height: .18rem; }
    .send-num { font-size: .14rem; line-height: .18rem; padding: 0 .01rem; font-family: DIN; }
    .bet-show-item { padding-right: .06rem; font-size: .16rem; color: #909090; }
    .bet-show-num { font-weight: 500; font-size: .18rem; color: #ff5353; }
    .body-shows { width: 100%; height: .56rem; padding: 0 .14rem 0 .12rem; border-bottom: .01rem solid #ecebeb; }
    .amount-num { width: 1.72rem; height: .37rem; font-size: .18rem; }
    .body-show-card { height: 100%; padding: 0 .01rem; span { font-size: .14rem; color: #2e2f34; } .select-arrow-tp, .select-arrow-btm { width: .14rem; height: 100%; svg path { fill: #d8d8d8; } } }
    .body-no-reward-card { height: 100%; padding: 0 .01rem; span { font-size: .14rem; color: #ff5353; border-bottom: .01rem solid #ff5353; } }
    .select-arrow-tp { transform: rotate(180deg); }
    .body-btn-cancel { width: 40%; height: 100%; font-size: .16rem; background: #eeeeee; color: #999999; }
    .body-btn-submit { width: 60%; height: 100%; font-size: .16rem; background: #ff5353; color: #ffffff; }
    .body-card-box { width: 100%; .nb-no-card { width: 100%; height: 1.2rem; font-size: .24rem; color: #ff5353; } }
    .comp-card-box { width: 3.75rem; height: 1.2rem; }
    .comp-card-sure { width: 3.35rem; height: .42rem; margin: .66rem auto 0; border-radius: .06rem; font-size: .16rem; background: #ff5353; color: #ffffff; }
    .content-btns {
      width: 100%;
      height: .56rem;
      padding: 0 3.2%;
      border-bottom: 0.01rem solid #ecebeb;
      .content-btn-box {
        width: 23.65%;
        height: .36rem;
        .content-btn, .content-btn-active {  width: 100%; height: 100%; border-radius: .04rem; font-size: .17rem; }
      }
      .content-btn { border: .01rem solid #ECEBEB; color: #909090; background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%); }
    }
    .body-keyboard {
      width: 3.75rem;
      flex-wrap: wrap;
      .keyboard-btn-box {
        width: 1.25rem;
        .btn-normal, .btn-active, .btn-del { width: 100%; height: 100%; font-size: .21rem; }
        .btn-normal { color: #2E2F34; }
        .btn-active { color: #FFF; }
        .btn-del { background: #f6f6f6; }
      }
    }
  }
}
.blue .nb-bet-keyboard-flw .nb-bet-public-box-body .bet-keyboard-flw-body {
  box-shadow: 0 -.1rem .2rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
  .body-title { border-bottom: .01rem solid #2e2f34; }
  .send-title { color: #ecebeb; }
  .send-min-box { border: .01rem solid #53fffd; background: rgba(83,255,253,.1); color: #53fffd; }
  .send-odds-box { border: .01rem solid #ff5353; background: rgba(255,83,83,.1); color: #ff5353; }
  .bet-show-item { color: #909090; }
  .bet-show-num { color: #53fffd; }
  .body-shows { border-bottom: .01rem solid #2e2f34; }
  .body-show-card { span { color: #909090; } .select-arrow-tp, .select-arrow-btm { svg path { fill: #909090; } } }
  .body-no-reward-card { span { color: #53fffd; border-bottom: .01rem solid #53fffd; } }
  .body-btn-cancel { background: #2e2f34; color: #909090; }
  .body-btn-submit { background: #00b5b3; color: #ffffff; }
  .body-card-box .nb-no-card { color: #53fffd; }
  .comp-card-cant-use { background: rgba(0,0,0,.3); }
  .comp-card-detail-tp, .comp-card-detail-btm { color: #ffffff; }
  .comp-card-amt { color: #ffffff; }
  .comp-card-round { background: linear-gradient(54deg, rgba(238,238,238,.3), rgba(255,255,255,.1)); }
  .comp-card-sure { background: #00b5b3; color: #ffffff; }
  .content-btns {
    border-bottom: 0.01rem solid #4a4a4a;
    .content-btn { border: .01rem solid #606060; color: #909090; background: transparent; }
  }
  .body-keyboard .keyboard-btn-box {
    .btn-normal { color: #ecebeb; }
    .btn-active { color: #ecebeb; }
    .btn-del { background: transparent; }
  }
}
</style>
