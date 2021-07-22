<template>
<div class="nb-bet-mix-bet" :style="openStyle" @touchmove.stop v-if="show" >
  <v-touch class="nb-bet-mix-blank" v-if="open || cdOpen" @touchmove.stop @tap="closeFun" ></v-touch>
  <transition name="betMixAni">
    <div class="mix-bet-item-box" v-if="open">
      <div class="top-red"></div>
      <div class="mix-bet-head flex-between">
        <div class="mix-bet-head-left flex-between">
          <v-touch class="mix-bet-can flex-center" @tap="clearFun">
            <bet-mult-can :color="canColor" size="0.17" />
          </v-touch>
          <span class="mix-bet-head-title flex-center">{{$t('pageBet.betSlpNew')}}</span>
          <span class="mix-bet-head-cnt flex-center">{{bCnt}}</span>
        </div>
        <div class="mix-bet-head-right flex-between">
          <div class="mix-bet-balance flex-center">
            <span class="mix-bet-balance-txt">{{$t('pageBet.balance')}}</span>
            <span class="mix-bet-balance-num" :style="{ color: oddsColor }" v-if="balAct">{{(balance - totalAmt) | NumFmt(true)}}</span>
            <span class="mix-bet-balance-num" v-else>- - -</span>
          </div>
          <v-touch class="mix-bet-down-flag flex-center" @tap="closeFun">
            <bet-arrow-box type="down" size="0.18" :color="oddsColor" noAnimate />
          </v-touch>
        </div>
      </div>
      <div class="mix-bet-body" ref="mixScrol" >
        <v-touch v-bind="getOptAttr(v, 0)" v-for="(v, k) in optsArr" :key="k" @tap="clickOptFun(v)" >
          <div class="mix-bet-single-body flex-between" v-if="!v.type">
            <div :class="`mix-single-${v.same ? 'red' : 'white'}-line`"></div>
            <div class="mix-single-del-idx flex-start-col">
              <div class="mix-single-close flex-center">
                <bet-cover-close size="0.14" :color="closeColor" />
              </div>
              <div class="mix-single-idx-box flex-start-col">
                <span class="mix-single-idx-txt" v-if="showID">{{v.idx}}</span>
              </div>
            </div>
            <div class="mix-single-body-box">
              <div class="mix-single-head flex-start">
                <span class="head-team">{{getOptName(v)}}</span>
                <div :class="`head-odds${v.alert ? '-alert' : ''} flex-center`" :style="getHeadOddsStyle(v)">
                  <span class="head-odds-txt">@</span>
                  <span class="head-odds-num">{{getOddv(v) | NumFmt(true, 3)}}</span>
                </div>
                <span class="head-alert flex-center" v-if="v.alert"><bet-odds-up :down="v.alert < 0" /></span>
                <span class="head-score" v-if="v.live || /^[12]$/.test(v.matchState)" :style="{ color: liveColor }">
                  {{v.msc || v.matchScore}}
                </span>
              </div>
              <div class="mix-single-game-box flex-start">
                <span class="mix-single-legal flex-center">{{v.tn || v.tournamentName || ''}}</span>
                <span class="mix-single-game flex-center">{{$t(`common.wf.wf_${getJoinStr(v)}`)}}</span>
              </div>
              <div class="mix-single-team-box flex-start">{{getCompName(v)}}</div>
            </div>
            <div class="mix-single-input-box">
              <div class="mix-single-input flex-end">
                <div :class="getInputClass(v)" :style="getInputStyle(v)" >
                  <span class="mix-input-text flex-center" :style="{ color: oddsColor }" v-if="v.active">{{v.amount || v.sAmount || ''}}</span>
                  <span class="mix-input-fill flex-center" :style="{ color: oddsColor }" v-else-if="v.amount || v.sAmount">{{v.amount || v.sAmount}}</span>
                  <span class="mix-input-place flex-center" v-if="!v.amount && !v.sAmount">{{v.min}}-{{v.max}}</span>
                </div>
              </div>
              <div class="mix-single-return flex-end">
                <span class="mix-single-return-txt">{{$t('pageBet.willRtn')}}</span>
                <span class="mix-single-return-num" :style="{ color: oddsColor }">{{((v.amount || v.sAmount || 0) * (1 + v.odds)) | NumFmt(true)}}</span>
              </div>
            </div>
          </div>
        </v-touch>
        <div class="mix-bet-fold-title-box flex-between" v-if="bCnt > 1" >
          <span class="fold-title-txt">{{$t('pageBet.mixFoldTitle')}}</span>
          <div class="fold-title-alert flex-end" v-if="sameAlert" >
            <bet-box-alert color="#ff5353" opacity="1" />
            <span class="fold-title-alt-txt">{{$t('pageBet.mixFoldAlert')}}</span>
          </div>
        </div>
        <div class="mix-bet-multiple-box" v-if="bCnt > 1" >
          <v-touch v-bind="getOptAttr(v, 1)" v-for="(v, k) in optsArr" :key="k" @tap="clickOptFun(v)" >
            <div class="mix-bet-multiple-body" v-if="v.type">
              <div class="mix-bet-multiple-body-main">
                <div class="mix-multiple-title-box" >
                  <div class="mix-multiple-title-txt flex-start" v-if="v.nm < 2">{{$t('pageBet.singleFold')}}</div>
                  <div class="mix-multiple-title-txt flex-start" v-else>{{v.nm}}{{$t('pageBet.betFolds')}}{{v.fld}}</div>
                  <div class="mix-multiple-return-box flex-start">
                    <span class="mix-multiple-return-txt">{{$t('pageBet.willRtn')}}</span>
                    <span class="mix-multiple-return-num" :style="{ color: oddsColor }">{{(v.amount * v.odds) | NumFmt(true)}}</span>
                  </div>
                </div>
                <div class="mix-multiple-odds-box flex-center" :style="{ color: oddsColor }" >
                  <span class="multiple-odds-txt">@</span>
                  <span class="multiple-odds-num">{{v.odds / (v.mct || 1) | NumFmt(true, 3)}}</span>
                </div>
                <div class="mix-multiple-input-box flex-end" >
                  <span class="mix-multiple-input-num mix-multiple-toggle">{{v.mct}}</span>
                  <span class="mix-multiple-input-txt mix-multiple-toggle">X</span>
                  <div :class="getInputClass(v)" :style="getInputStyle(v)" >
                    <span class="mix-input-text flex-center" :style="{ color: oddsColor }" v-if="v.active">{{v.amount || v.sAmount || ''}}</span>
                    <span class="mix-input-fill flex-center" :style="{ color: oddsColor }" v-else-if="v.amount || v.sAmount">{{v.amount || v.sAmount}}</span>
                    <span class="mix-input-place flex-center" v-if="!v.amount && !v.sAmount">{{v.min}}-{{v.max}}</span>
                  </div>
                </div>
              </div>
              <div class="mix-bet-multiple-body-toggle mix-multiple-toggle flex-start-wrap" v-if="v.toggle">
                <span class="mix-multiple-toggle-item flex-start" :style="v.toggleStyle" v-for="(tItem, tk) in v.toggleArr" :key="tk">
                  {{tItem.oids.join('/')}}
                </span>
              </div>
            </div>
          </v-touch>
        </div>
        <div class="mix-bet-body-set" :style="setStyle"></div>
      </div>
    </div>
  </transition>
  <div class="bet-mix-submit-box flex-between" :style="st.o" >
    <div class="submit-show-box flex-start" :style="st.i" >
      <transition :name="canTranName">
        <v-touch class="mix-bet-can-close flex-center" v-if="!open" @tap="clearFun">
          <bet-mult-can :color="canColor" size="0.17" />
        </v-touch>
      </transition>
      <div class="submit-show-txt-box flex-start-col" >
        <div class="show-box-top flex-start">
          <span class="mix-show-box-txt flex-start">{{$t('pageBet.tMixBet')}}</span>
          <span class="mix-show-box-num flex-start">{{totalAmt | NumFmt(true)}}</span>
        </div>
        <div class="show-box-bottom flex-start">
          <span class="mix-show-box-txt flex-start">{{$t('pageBet.tMixRtn')}}</span>
          <span class="mix-show-box-num flex-start" :style="{ color: oddsColor }">{{totalRtn | NumFmt(true)}}</span>
        </div>
        <v-touch class="show-box-reward flex-start" v-if="!(cardLst && cardLst.length)" @tap="toRewardFun" >
          <span class="mix-show-box-rwd flex-start">{{$t('share.toReward')}}</span>
        </v-touch>
        <v-touch class="show-box-reward flex-start" v-else @tap="showCardFun" >
          <span class="mix-show-box-txt flex-start" :style="{ color: oddsColor }" v-if="cardName">{{$t('share.using')}}{{cardName}}</span>
          <span class="mix-show-box-txt flex-start" v-else>{{$t('share.uHas')}}{{cardLst.length}}{{$t('share.cardCanUse')}}</span>
          <div :class="`select-arrow-${cdOpen ? 'down' : 'up'} flex-center`">
            <svg width=".12rem" height=".12rem" style="width:.12rem;height:.12rem" viewBox="0 0 100 100" version="1.1" >
              <path d="M 0 14.5 L 100 14.5 L50 85.5 Z"></path>
            </svg>
          </div>
        </v-touch>
      </div>
    </div>
    <div class="submit-btn-box flex-start" :style="st.i" >
      <v-touch :class="btnClass" :style="btnBackStyle" @tap="confilmFun">
        <div class="mix-bet-btn-text flex-center" v-if="!open">
          <span class="mix-bet-btn-txt">{{$t('pageBet.viewLst')}}</span>
          <span class="mix-bet-btn-num num-cnt flex-center" :style="{ color: btnColor }">{{aniCount}}</span>
        </div>
        <div class="mix-bet-btn-text flex-center" v-else-if="oddsChange">{{$t('pageBet.acptNew')}}</div>
        <div class="mix-bet-btn-text flex-center" v-else>{{$t('pageBet.sureBet')}}</div>
      </v-touch>
    </div>
  </div>
  <bet-keyboard-mix />
  <bet-card-select-mix />
</div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import oddsFormat from '@/filters/oddsFormat';
import { toSeries, toSerList } from '@/utils/betUtils';
import { findMyCouponList } from '@/api/activity';
import toOptionName from '@/components/common/GameOption/toOptionName';
import BetOddsUp from './BetComps/BetOddsUp';
import BetMultCan from './BetComps/BetMultCan';
import BetArrowBox from './BetComps/BetArrowBox';
import BetBoxAlert from './BetComps/BetBoxAlert';
import BetCoverClose from './BetComps/BetCoverClose';
import BetKeyboardMix from '@/components/Bet/BetKeyboardMix';
import BetCardSelectMix from '@/components/Bet/BetCardSelectMix';

export default {
  inheritAttrs: false,
  name: 'BetMixCart',
  data() {
    return {
      open: false,
      cdOpen: false,
      cardLst: [],
      cardTime: 0,
      aniCount: 0,
      optsArr: [],
      beforeTop: 0,
      setHeight: 0,
      scrollTime: 0,
      animateTimer: null,
      st: { o: {}, i: {} },
      canTranName: 'betCanNoAni',
    };
  },
  props: { show: Boolean },
  computed: {
    ...mapState({
      bLst: state => state.bet.betList,
      bCnt: state => state.bet.betCount,
      kObj: state => state.bet.keyObject,
      iphX: state => state.bet.isIphoneX,
      slCd: state => state.bet.selectCard,
      rObj: state => state.bet.rewardObject,
      qArr: state => state.bet.quoteMultArr,
    }),
    ...mapState('app', {
      user: state => state.userinfo,
      theme: state => state.theme,
    }),
    cardName() {
      return this.slCd && this.slCd.couponName ? this.slCd.couponName : '';
    },
    needSplit() {
      return !!window.NBConfig.FOLDS_NEED_SPLIT;
    },
    balAct() {
      return !!(this.user && this.user.balance !== undefined);
    },
    balance() {
      return this.balAct ? this.user.balance : 100000;
    },
    totalAmt() {
      let tNum = 0;
      for (let i = 0; i < this.optsArr.length; i += 1) {
        tNum += (this.optsArr[i].mct || 1) * (this.optsArr[i].amount || 0);
      }
      return tNum;
    },
    totalRtn() {
      let tNum = 0;
      for (let i = 0; i < this.optsArr.length; i += 1) {
        const nOds = this.optsArr[i].odds || 0;
        const tOds = this.optsArr[i].type ? (nOds || 1) : (1 + nOds);
        tNum += tOds * (this.optsArr[i].amount || 0);
      }
      return tNum;
    },
    avgOdds() {
      return this.totalAmt ? (this.totalRtn / this.totalAmt) : 1;
    },
    oddsChange() {
      return this.bLst.filter(v => !!v.alert).length;
    },
    showID() {
      return this.optsArr.filter(v => v.toggle).length > 0;
    },
    sameAlert() {
      return this.optsArr.filter(v => v.same).length > 0;
    },
    setStyle() {
      return { height: `${this.setHeight}rem` };
    },
    openStyle() {
      return this.open || this.cdOpen ? { height: `${window.innerHeight}px` } : { };
    },
    btnAct() {
      return !!(!this.open || this.oddsChange || this.totalAmt);
    },
    btnClass() {
      return `mix-bet-${this.btnAct ? 'active' : 'normal'} flex-center`;
    },
    oArrLen() {
      return this.optsArr.length;
    },
    canColor() {
      const defColor = /black/i.test(this.theme) ? '#4c4c4c' : '#999';
      return /blue/i.test(this.theme) ? '#909090' : defColor;
    },
    closeColor() {
      const defColor = /black/i.test(this.theme) ? '#909090' : 'rgba(102,102,102,.5)';
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
    liveColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_LIVE_FLAG_COLOR ? pSet.BLACK_LIVE_FLAG_COLOR : '#fe6246';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_LIVE_FLAG_COLOR ? pSet.BLUE_LIVE_FLAG_COLOR : '#fe6246';
      }
      return pSet && pSet.WHITE_LIVE_FLAG_COLOR ? pSet.WHITE_LIVE_FLAG_COLOR : '#fe6246';
    },
    btnBackStyle() {
      let defColor = 'linear-gradient(110deg, #ffa653, #ff5378)';
      defColor = /^blue$/i.test(this.theme) ? 'linear-gradient(130deg, #00c4a5, #00c0d5)' : defColor;
      const backColor = this.oddsChange && this.open ? defColor : this.btnColor;
      return this.btnAct ? { background: backColor } : { };
    },
  },
  watch: {
    iphX() {
      if (this.show) this.setBottomStyle();
    },
    show() {
      if (this.show) {
        this.loadCardFun();
        this.setBottomStyle();
      } else {
        this.open = false;
        this.setRewardObject();
      }
    },
    open() {
      if (this.show) this.quoteBetOption({ data: this.bLst });
      if (!this.open) {
        this.scrollTopTo();
        this.changeKeyObject();
        this.setLockIOSSwipe(!!(this.show && this.open));
      } else {
        setTimeout(() => { this.setLockIOSSwipe(!!(this.show && this.open)); }, 200);
      }
      this.smartSelectCard();
    },
    rObj() {
      this.cdOpen = !!(this.rObj && this.rObj.data && this.rObj.data.length);
    },
    bLst() {
      this.getOptsArr();
    },
    qArr() {
      if (this.qArr && this.qArr.length) this.getOptsArr();
    },
    bCnt(n, o) {
      if (this.show) {
        this.quoteBetCart();
        if (!o && n === 1) {
          setTimeout(this.openOne, 1);
          setTimeout(() => { this.canTranName = 'betCanAni'; }, 300);
        } else {
          this.canTranName = this.bCnt ? 'betCanAni' : 'betCanNoAni';
        }
        if (o && (n - o === 1)) {
          setTimeout(() => { this.aniCount = this.bCnt; }, 600);
        } else {
          this.aniCount = this.bCnt;
        }
      }
    },
    kObj() {
      this.updateAmt();
      if (!this.kObj) {
        this.scrollTopTo();
        for (let i = 0; i < this.optsArr.length; i += 1) {
          const obj = this.optsArr[i];
          if (obj.active) {
            obj.active = false;
            this.$set(this.optsArr, i, obj);
          }
        }
      }
      if (!this.kObj && this.bCnt === 1) {
        setTimeout(() => { this.setHeight = 0; }, 150);
      } else {
        this.setHeight = this.kObj ? 2.38 : 0;
      }
    },
    oddsChange() {
      if (this.oddsChange) this.changeKeyObject();
    },
    totalAmt() {
      this.smartSelectCard();
    },
    oArrLen() {
      this.smartSelectCard();
    },
  },
  components: {
    BetOddsUp,
    BetMultCan,
    BetArrowBox,
    BetBoxAlert,
    BetCoverClose,
    BetKeyboardMix,
    BetCardSelectMix,
  },
  methods: {
    ...mapMutations(['clearBetItem', 'changeSubStatus', 'quoteBetOption', 'changeKeyObject', 'setBettingObj', 'setSelectCard', 'setRewardObject']),
    ...mapMutations('app', ['getUserInfo', 'setLockIOSSwipe']),
    ...mapActions(['quoteBetCart', 'doMixBetAction']),
    getOddv(v) {
      if (v.odv) {
        return v.odv;
      }
      const oddOld = v.ods || v.odds;
      const oddNew = oddsFormat(oddOld, v.gmt || v.gameType);
      return oddNew - oddOld > 0.5 ? oddOld + 1 : oddOld;
    },
    getOptName(v) {
      const obj = toOptionName(v.gmt || v.gameType, v.bar || v.betBar, v.bop || v.betOption);
      let optName = obj.key_s ? this.$t(`common.optionNames.${obj.key_s}`) : '';
      optName += obj.prefix ? `${/-/.test(obj.prefix) ? '' : '+'}${obj.prefix} ` : '';
      optName += obj.key_e ? this.$t(`common.optionNames.${obj.key_e}`) : '';
      optName += !obj.key_s && obj.key ? this.$t(`common.optionNames.${obj.key}`) : '';
      return `${optName}${obj.value || ''}${obj.suffix || ''}`;
    },
    getCompName(v) {
      const cStr = v.mn || v.compName || '';
      return cStr && v.fmsc ? cStr.replace(/\s+vs\s+/i, ` ${v.fmsc.replace(':', ' vs ')} `) : cStr;
    },
    getJoinStr(v) {
      return `${v.sno || v.sportID}_${v.gpt || v.groupType || 0}_${v.stg || v.betStage || 0}_${v.gmt || v.gameType || 0}`;
    },
    getOptAttr(v, type) {
      let clsName = !v.type === !type && !type ? 'mix-bet-option-single' : 'mix-bet-option-null';
      clsName = !v.type === !type && type ? 'mix-bet-option-multiple' : clsName;
      let idStr = !v.type ? `bet_opt_${v.optionID}` : `bet_opt_${v.nm}_${v.fld}`;
      idStr = !v.type === !type ? idStr : `null_${idStr}`;
      return { class: clsName, id: idStr };
    },
    getInputClass(v) {
      const isAmt = v.amount || v.sAmount;
      return `nb-bet-mix-input${isAmt ? ' filled' : ''}${v.active ? ' active' : ''} flex-${isAmt ? 'center' : 'start'}`;
    },
    getInputStyle(v) {
      return (v.amount || v.sAmount || v.active) ? { border: `.01rem solid ${this.btnColor}` } : { };
    },
    getHeadOddsStyle(v) {
      return v.alert && !/^blue$/i.test(this.theme) ? { color: '#fff', background: this.btnColor } : { color: this.oddsColor };
    },
    openOne() {
      this.open = true;
      this.openKeyboard();
    },
    toRewardFun() {
      this.$router.push('/reward');
    },
    showCardFun() {
      if (!this.cdOpen && this.cardLst && this.cardLst.length) {
        const obj = { odds: this.avgOdds, data: this.cardLst, amt: this.totalAmt };
        [obj.rtn, obj.len] = [this.totalRtn, this.optsArr.length];
        this.setRewardObject(obj);
      } else {
        this.setRewardObject();
      }
    },
    clickOptFun(v) {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/close/i.test(cName)) {
        this.clearBetItem(v);
      } else if (/mix-multiple-toggle/i.test(cName)) {
        for (let i = 0; i < this.optsArr.length; i += 1) {
          const obj = JSON.parse(JSON.stringify(this.optsArr[i]));
          if (obj.type && `${v.nm}_${v.fld}` === `${obj.nm}_${obj.fld}`) {
            obj.toggle = !obj.toggle;
            this.$set(this.optsArr, i, obj);
          }
        }
      } else {
        this.openKeyboard(v);
      }
    },
    openKeyboard(v) {
      const [type, oid] = [!!(v && v.type), v ? v.optionID : ''];
      const id = type ? `${v.nm}_${v.fld}` : oid;
      for (let i = 0; i < this.optsArr.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.optsArr[i]));
        const check = `${id}` === `${obj.nm}_${obj.fld}` || `${id}` === `${obj.optionID}`;
        obj.active = false;
        if (!id || (!type === !obj.type && check)) {
          obj.amount = !obj.type ? obj.sAmount : obj.amount;
          [obj.active, obj.balance] = [true, this.getObjBalance(obj)];
          setTimeout(() => {
            this.scrollTopTo(!obj.type ? `${obj.optionID}` : `${obj.nm}_${obj.fld}`);
            this.changeKeyObject(JSON.parse(JSON.stringify(obj)));
          }, 20);
        }
        this.$set(this.optsArr, i, obj);
      }
    },
    scrollTopTo(id) {
      const mScrol = this.$refs ? this.$refs.mixScrol : null;
      if (!this.$el || !mScrol || Date.now() - this.scrollTime < 500) return;
      this.scrollTime = Date.now();
      const ele = this.$el.querySelector(`#bet_opt_${id}`);
      if (ele) {
        this.beforeTop = mScrol.scrollTop;
        const redEle = this.$el.querySelector('.top-red');
        const headEle = this.$el.querySelector('.mix-bet-head');
        const [ptEle, elOffTop] = [ele.parentElement, ele.offsetTop];
        const ptTop = /mix-bet-multiple-box/i.test(ptEle.className) ? ptEle.offsetTop : 0;
        const elTop = ptTop && elOffTop > ptTop ? (elOffTop - ptTop) : elOffTop;
        let afTop = elTop + ptTop - (redEle ? redEle.offsetHeight : 6);
        afTop -= headEle ? headEle.offsetHeight : 34;
        afTop -= parseFloat(window.getComputedStyle(mScrol).paddingTop);
        this.scrollAnimate(afTop);
      } else {
        const bfTop = this.beforeTop;
        this.scrollAnimate(bfTop);
      }
    },
    scrollAnimate(toPosit) {
      clearInterval(this.animateTimer);
      if (!this.$refs || !this.$refs.mixScrol) return;
      const mScrol = this.$refs.mixScrol;
      const nowPosit = mScrol.scrollTop;
      let step = (toPosit - nowPosit) / 5;
      step = step > 0 && step < 1 ? 1 : step;
      step = step > -1 && step < 0 ? -1 : step;
      clearInterval(this.animateTimer);
      this.animateTimer = setInterval(() => {
        const lastPosit = mScrol.scrollTop;
        let newPosit = lastPosit + step;
        newPosit = parseInt(newPosit * 100, 10) / 100;
        if ((toPosit - newPosit) * step <= 0) {
          newPosit = toPosit;
          clearInterval(this.animateTimer);
        }
        mScrol.scrollTop = newPosit;
        if (Math.abs(mScrol.scrollTop - lastPosit) < 0.2) {
          clearInterval(this.animateTimer);
        }
      }, 30);
    },
    getObjBalance(obj) {
      let tNum = 0;
      for (let i = 0; i < this.optsArr.length; i += 1) {
        const item = this.optsArr[i];
        let pass = !item.type && `${item.optionID}` === `${obj.optionID}`;
        pass = pass || (item.type && `${item.nm}` === `${obj.nm}`);
        pass = pass && !item.type === !obj.type;
        if (!pass) {
          tNum += (this.optsArr[i].mct || 1) * (this.optsArr[i].amount || 0);
        }
      }
      return this.balance - tNum;
    },
    getOptsArr() {
      const [cpArr, rtnArr] = [JSON.parse(JSON.stringify(this.bLst)), []];
      const [ftArr, dt] = [cpArr.filter(v => /^7$/.test(v.betStatus)), []];
      let [tMin, tMax, mRtn] = [0, 1000000000, 10000000000];
      for (let i = 0; i < ftArr.length; i += 1) {
        const sObj = JSON.parse(JSON.stringify(ftArr[i]));
        sObj.mxRtn = parseInt(sObj.rtn / (1 + (sObj.odds || 0)), 10);
        tMin = sObj.min > tMin ? sObj.min : tMin;
        tMax = sObj.max < tMax ? sObj.max : tMax;
        mRtn = sObj.mxRtn < mRtn ? sObj.mxRtn : mRtn;
        [sObj.type, sObj.mct, sObj.sAmount] = [0, 1, 0];
        [sObj.fld, sObj.amount, sObj.active] = [1, 0, false];
        for (let j = 0; j < this.optsArr.length; j += 1) {
          if (!this.optsArr[j].type && `${sObj.optionID}` === `${this.optsArr[j].optionID}`) {
            sObj.amount = this.optsArr[j].amount || 0;
            sObj.active = !!this.optsArr[j].active;
          }
        }
        rtnArr.push(sObj);
      }
      for (let i = 0; i < ftArr.length; i += 1) {
        const odObj = JSON.parse(JSON.stringify(ftArr[i]));
        odObj.odds = odObj.odds ? odObj.odds + 1 : 1;
        dt.push(odObj);
      }
      if (ftArr.length > 1) {
        const serArr = toSeries(dt);
        if (serArr.length > 2) {
          const serObj = Object.assign({ nm: 0, mct: 0, odds: 0 }, { fld: 0 });
          for (let j = 0; j < serArr.length; j += 1) {
            if (serArr[j].nm > 1) {
              [serObj.mct, serObj.odds] = [serObj.mct + serArr[j].mct, serObj.odds + serArr[j].odds];
              [serObj.nm, serObj.fld] = [serArr[j].nm > serObj.nm ? serArr[j].nm : serObj.nm, serObj.mct];
            }
          }
          serArr.push(serObj);
        }
        for (let i = 0; i < serArr.length; i += 1) {
          const obj = JSON.parse(JSON.stringify(serArr[i]));
          [obj.min, obj.max, obj.mxRtn] = [tMin, tMax, mRtn];
          [obj.type, obj.mct, obj.amount] = [1, obj.mct || 1, 0];
          [obj.active, obj.toggle, obj.fld] = [false, false, obj.fld || 1];
          for (let j = 0; j < this.optsArr.length; j += 1) {
            if (this.optsArr[j].type && obj.type && `${obj.nm}_${obj.fld}` === `${this.optsArr[j].nm}_${this.optsArr[j].fld}`) {
              obj.amount = this.optsArr[j].amount || 0;
              obj.active = !!this.optsArr[j].active;
              obj.toggle = !!this.optsArr[j].toggle;
            }
          }
          if (obj.nm && obj.nm > 1) {
            let [totalMxRtn, find] = [0, false];
            if (this.qArr && this.qArr.length) {
              for (let j = 0; j < this.qArr.length; j += 1) {
                if (`${this.qArr[j].betN}_${this.qArr[j].betM}` === `${obj.nm}_${obj.fld || 1}`) {
                  obj.min = this.qArr[j].minBet !== undefined ? this.qArr[j].minBet : obj.min;
                  obj.max = this.qArr[j].maxBet !== undefined ? this.qArr[j].maxBet : obj.max;
                  [obj.mxRtn, find] = [this.qArr[j].maxReturn || obj.mxRtn, !!this.qArr[j].maxReturn];
                  obj.mxRtn = parseInt(obj.mxRtn / (obj.odds || 1), 10);
                  break;
                }
              }
            }
            if (this.user && this.user.rtn && !find) {
              const nmSt = obj.fld && obj.fld > 1 ? 2 : obj.nm;
              for (let tm = obj.nm; tm >= nmSt; tm -= 1) {
                let rtnNum = 10000000000;
                for (let j = tm; j >= 2; j -= 1) {
                  if (this.user.rtn[`mut${j}`]) {
                    const userRtnObj = this.user.rtn[`mut${j}`];
                    if (typeof userRtnObj === 'object' && userRtnObj.maxBet !== undefined) {
                      obj.max = +userRtnObj.maxBet;
                    }
                    if (typeof userRtnObj === 'object' && userRtnObj.maxReturn) {
                      rtnNum = +userRtnObj.maxReturn;
                    } else {
                      rtnNum = +userRtnObj;
                    }
                    break;
                  }
                }
                totalMxRtn += parseInt(rtnNum / (obj.odds || 1), 10);
              }
              obj.mxRtn = totalMxRtn < obj.mxRtn ? totalMxRtn : obj.mxRtn;
            }
          }
          rtnArr.push(obj);
        }
      }
      for (let i = 0; i < rtnArr.length; i += 1) {
        if (rtnArr[i].active) {
          for (let j = i + 1; j < rtnArr.length; j += 1) {
            rtnArr[j].active = false;
          }
        }
      }
      this.optsArr = rtnArr;
      this.changeKeyObject();
      this.checkAmtShow();
      this.getToggleData();
    },
    getToggleData() {
      const tgOpts = this.optsArr.filter(w => !!w.optionID);
      const tgOptsArr = JSON.parse(JSON.stringify(tgOpts));
      for (let i = 0; i < tgOptsArr.length; i += 1) {
        [tgOptsArr[i].odds, tgOptsArr[i].win] = [tgOptsArr[i].odds + 1, tgOptsArr[i].odds + 1];
      }
      for (let i = 0; i < this.optsArr.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.optsArr[i]));
        if (obj.type && obj.nm) {
          const stNum = obj.fld > 1 ? 2 : obj.nm;
          let [tArr, wd] = [[], obj.nm >= 4 ? '33.333%' : '25%'];
          wd = obj.nm >= 7 ? '50%' : wd;
          wd = obj.nm >= 10 ? '100%' : wd;
          for (let j = stNum; j <= obj.nm; j += 1) {
            tArr = tArr.concat(toSerList(tgOptsArr, j, 1));
          }
          [obj.toggleStyle, obj.toggleArr] = [{ width: wd }, tArr];
          this.$set(this.optsArr, i, obj);
        }
      }
    },
    checkAmtShow() {
      let showNeed = 0;
      for (let i = 0; i < this.optsArr.length; i += 1) {
        if (this.optsArr[i].type && this.optsArr[i].nm === 1 && this.optsArr[i].amount) {
          showNeed = this.optsArr[i].amount;
        }
      }
      for (let i = 0; i < this.optsArr.length; i += 1) {
        const obj = this.optsArr[i];
        if (!obj.type) {
          obj.amount = showNeed ? 0 : (obj.amount || obj.sAmount);
          obj.sAmount = showNeed || obj.amount;
          this.$set(this.optsArr, i, obj);
        }
      }
    },
    updateAmt() {
      if (this.kObj) {
        for (let i = 0; i < this.optsArr.length; i += 1) {
          const obj = JSON.parse(JSON.stringify(this.optsArr[i]));
          const onePass = !this.kObj.type && obj.type && /^1_1$/.test(`${obj.nm}_${obj.fld}`);
          const twoPass = this.kObj.type && !obj.type && /^1_1$/.test(`${this.kObj.nm}_${this.kObj.fld}`);
          let objPass = !this.kObj.type && !obj.type && `${obj.optionID}` === `${this.kObj.optionID}`;
          objPass = objPass || (this.kObj.type && obj.type && `${obj.nm}_${obj.fld}` === `${this.kObj.nm}_${this.kObj.fld}`);
          obj.amount = objPass ? this.kObj.amount : obj.amount;
          obj.amount = onePass ? 0 : obj.amount;
          if (twoPass || (!this.kObj.type && objPass)) {
            obj.sAmount = this.kObj.amount;
          }
          if (objPass || onePass || twoPass) this.$set(this.optsArr, i, obj);
        }
        this.checkAmtShow();
      } else {
        for (let i = 0; i < this.optsArr.length; i += 1) {
          const obj = JSON.parse(JSON.stringify(this.optsArr[i]));
          const amt = obj.amount || obj.sAmount || 0;
          if (amt && amt < obj.min) {
            obj.amount = 0;
            if (!obj.type) {
              obj.sAmount = 0;
            }
            this.$set(this.optsArr, i, obj);
          }
        }
      }
    },
    clearFun() {
      this.clearBetItem();
    },
    closeFun() {
      this.open = false;
      this.setRewardObject();
    },
    getBettingObj() {
      let [ttlAmt, ttlRtn] = [0, 0];
      const [bArr, bets, opts] = [[], [], []];
      const optCpArr = JSON.parse(JSON.stringify(this.optsArr));
      for (let i = 0; i < optCpArr.length; i += 1) {
        optCpArr[i].alert = 0;
        const [obj, oAmt] = [optCpArr[i], optCpArr[i].amount || optCpArr[i].sAmount];
        if (!obj.type) {
          opts.push(obj);
          if (oAmt) {
            const tRtn = oAmt * (1 + obj.odds);
            [ttlAmt, ttlRtn] = [ttlAmt + oAmt, ttlRtn + tRtn];
            const bItem = Object.assign({ num: 1, fld: 1, cnt: 1 }, { amt: oAmt, rtn: tRtn, odds: 1 + obj.odds });
            const defObj = Object.assign({ wid: '', slip: 1, code: -1 }, { amt: oAmt, rtn: tRtn });
            bArr.push(Object.assign(defObj, { btp: 1, bets: [bItem], opts: [obj] }));
          }
        }
      }
      let [mutAmt, mutRtn] = [0, 0];
      for (let i = 0; i < optCpArr.length; i += 1) {
        const obj = optCpArr[i];
        if (obj.type && obj.nm > 1 && obj.amount) {
          const bObj = { num: obj.nm, fld: obj.fld, cnt: obj.mct };
          const [tAmt, tRtn] = [obj.amount * obj.mct, obj.amount * obj.odds];
          const btList = { amt: obj.amount, data: obj.toggleArr };
          [bObj.amt, bObj.rtn, bObj.list] = [tAmt, tRtn, btList];
          [ttlAmt, ttlRtn] = [ttlAmt + tAmt, ttlRtn + tRtn];
          [mutAmt, mutRtn] = [mutAmt + tAmt, mutRtn + tRtn];
          [bObj.odds, bObj.show] = [obj.odds, false];
          bets.push(bObj);
        }
      }
      if (bets.length > 0) {
        const defObj = { wid: '', slip: 1, code: -1 };
        [defObj.amt, defObj.rtn] = [mutAmt, mutRtn];
        bArr.push(Object.assign({ btp: 2, bets, opts }, defObj));
      }
      return { amt: ttlAmt, rtn: ttlRtn, arr: bArr };
    },
    getBettingObjSplit() {
      let [ttlAmt, ttlRtn] = [0, 0];
      const [bArr, opts] = [[], []];
      const optCpArr = JSON.parse(JSON.stringify(this.optsArr));
      for (let i = 0; i < optCpArr.length; i += 1) {
        optCpArr[i].alert = 0;
        const [obj, oAmt] = [optCpArr[i], optCpArr[i].amount || optCpArr[i].sAmount];
        if (!obj.type) {
          opts.push(obj);
          if (oAmt) {
            const tRtn = oAmt * (1 + obj.odds);
            [ttlAmt, ttlRtn] = [ttlAmt + oAmt, ttlRtn + tRtn];
            const bItem = Object.assign({ num: 1, fld: 1, cnt: 1 }, { amt: oAmt, rtn: tRtn, odds: 1 + obj.odds });
            const defObj = Object.assign({ wid: '', slip: 1, code: -1 }, { amt: oAmt, rtn: tRtn });
            bArr.push(Object.assign({ btp: 1, bets: [bItem], opts: [obj] }, defObj));
          }
        }
      }
      const wObj = Object.assign({ wid: '', slip: 1 }, { code: -1, btp: 2 });
      for (let i = 0; i < optCpArr.length; i += 1) {
        const obj = optCpArr[i];
        if (obj.type && obj.nm > 1 && obj.amount) {
          [ttlAmt, ttlRtn] = [ttlAmt + obj.amount * obj.mct, ttlRtn + obj.amount * obj.odds];
          const bObj = { num: obj.nm, fld: 1, cnt: 1 };
          for (let j = 0; j < obj.toggleArr.length; j += 1) {
            const [spObj, spOpts] = [obj.toggleArr[j], []];
            let spRtn = obj.amount;
            for (let k = 0; k < spObj.oids.length; k += 1) {
              for (let m = 0; m < opts.length; m += 1) {
                if (`${spObj.oids[k]}` === `${opts[m].idx}`) {
                  spOpts.push(opts[m]);
                  spRtn *= 1 + (opts[m].odds || 0);
                  break;
                }
              }
            }
            const spItem = Object.assign({ amt: obj.amount, rtn: spRtn }, { show: false, odds: spObj.win }, bObj);
            bArr.push(Object.assign({ amt: obj.amount, rtn: spRtn }, { bets: [spItem], opts: spOpts }, wObj));
          }
        }
      }
      return { amt: ttlAmt, rtn: ttlRtn, arr: bArr };
    },
    makeBetParams() {
      const optCpArr = JSON.parse(JSON.stringify(this.optsArr));
      const [bArr, bets, opts] = [[], [], []];
      for (let i = 0; i < optCpArr.length; i += 1) {
        const obj = optCpArr[i];
        if (!obj.type) {
          opts.push(obj);
          if (obj.amount || obj.sAmount) {
            const bItem = Object.assign({ num: 1, fld: 1, cnt: 1 }, { amt: obj.amount || obj.sAmount });
            bArr.push({ btp: 1, bets: [bItem], optArr: [obj] });
          }
        }
      }
      for (let i = 0; i < optCpArr.length; i += 1) {
        const obj = optCpArr[i];
        if (obj.type && obj.nm > 1 && obj.amount) {
          const bObj = { num: obj.nm, fld: obj.fld, cnt: obj.mct };
          bObj.amt = obj.amount;
          bets.push(bObj);
        }
      }
      if (bets.length > 0) {
        bArr.push({ btp: 2, bets, optArr: opts });
      }
      return bArr;
    },
    makeBetParamsSplit() {
      const optCpArr = JSON.parse(JSON.stringify(this.optsArr));
      const [bArr, opts] = [[], []];
      for (let i = 0; i < optCpArr.length; i += 1) {
        const obj = optCpArr[i];
        if (!obj.type) {
          opts.push(obj);
          if (obj.amount || obj.sAmount) {
            const bItem = Object.assign({ num: 1, fld: 1, cnt: 1 }, { amt: obj.amount || obj.sAmount });
            bArr.push({ btp: 1, bets: [bItem], optArr: [obj] });
          }
        }
      }
      for (let i = 0; i < optCpArr.length; i += 1) {
        const obj = optCpArr[i];
        if (obj.type && obj.nm > 1 && obj.amount) {
          const spItem = Object.assign({ num: obj.nm, fld: 1, cnt: 1 }, { amt: obj.amount });
          for (let j = 0; j < obj.toggleArr.length; j += 1) {
            const [spObj, spOpts] = [obj.toggleArr[j], []];
            for (let k = 0; k < spObj.oids.length; k += 1) {
              for (let m = 0; m < opts.length; m += 1) {
                if (`${spObj.oids[k]}` === `${opts[m].idx}`) {
                  spOpts.push(opts[m]);
                  break;
                }
              }
            }
            bArr.push({ btp: 2, bets: [spItem], optArr: spOpts });
          }
        }
      }
      return bArr;
    },
    async confilmFun() {
      this.getUserInfo();
      if (!this.open) {
        this.open = !this.open;
        this.quoteBetCart();
        if (this.bCnt === 1) {
          setTimeout(this.openKeyboard, 20);
        }
      } else if (this.oddsChange) {
        this.quoteBetOption({ data: this.bLst });
      } else if (this.user && this.user.token && this.totalAmt) {
        const paras = this.needSplit ? this.makeBetParamsSplit() : this.makeBetParams();
        const btSet = this.needSplit ? this.getBettingObjSplit() : this.getBettingObj();
        btSet.code = `${this.slCd && this.slCd.licenseCode ? this.slCd.licenseCode : ''}`;
        btSet.cAmt = +(this.slCd && this.slCd.money ? this.slCd.money : 0);
        const rtn = await this.doMixBetAction({ data: paras, set: btSet });
        this.setSelectCard();
        if (rtn) {
          let rtnStr = /^2$/.test(rtn) ? 'userWrong' : 'betWrong';
          rtnStr = /^3$/.test(rtn) ? 'noBetList' : rtnStr;
          this.$toast(this.$t(`pageBet.${rtnStr}`));
        }
      } else if (!this.user || !this.user.token) {
        this.$toast(this.$t('pageBet.notLogin'));
      }
    },
    setBottomStyle() {
      this.st.o.height = this.iphX ? '.85rem' : '.7rem';
      this.st.i = this.iphX ? { paddingBottom: '.15rem' } : { };
    },
    smartSelectCard() {
      this.setSelectCard();
      if (this.cardLst && this.cardLst.length && this.optsArr.length < 2) {
        const dt = JSON.parse(JSON.stringify(this.cardLst));
        let sel = null;
        for (let i = 0; i < dt.length; i += 1) {
          const vDate = `${dt[i] && dt[i].endDate ? dt[i].endDate : ''}`.replace(/\.\d+$/, '').replace(/-/g, '/');
          const dValid = !!(vDate && new Date(vDate).getTime() - new Date().getTime() > 0);
          const isNum = dt[i] && /^\d+(\.\d+)?$/.test(dt[i].minBet) && /^\d+(\.\d+)?$/.test(dt[i].minOdds);
          const cValid = !!(isNum && +this.totalAmt > +dt[i].minBet && +this.avgOdds > +dt[i].minOdds);
          if (dValid && cValid && (!sel || (dt[i] && +sel.money < +dt[i].money))) {
            sel = dt[i];
          }
        }
        if (sel) this.setSelectCard(sel);
      }
    },
    async loadCardFun() {
      if (this.user && this.user.token && this.user.nbUser && Date.now() - this.cardTime > 500) {
        const params = { userId: this.user.nbUser, state: 1 };
        [params.pageSize, params.pageIndex] = [1000, 1];
        this.cardTime = Date.now();
        this.setRewardObject();
        this.setSelectCard();
        try {
          let dt = await findMyCouponList(params);
          dt = dt && dt.length ? dt : [];
          this.cardLst = dt.filter(v => !!(/^2$/.test(v.couponType) && /^1$/.test(v.state)));
          this.smartSelectCard();
        } catch (ev) {
          console.log(ev);
        }
      }
    },
  },
  mounted() {
    this.getOptsArr();
    this.setBottomStyle();
    this.changeKeyObject();
    this.loadCardFun();
    this.aniCount = this.bCnt;
    this.canTranName = this.bCnt ? 'betCanAni' : 'betCanNoAni';
  },
};
</script>
<style lang="less">
.betMixAni-enter-active, .betMixAni-leave-active { transition: all 0.15s linear; }
.betMixAni-enter, .betMixAni-leave-active { transform: translateY(4.5rem); }
.betCanAni-enter-active, .betCanAni-leave-active { transition: all 0.15s linear; }
.betCanAni-enter, .betCanAni-leave-active { transform: translateX(-0.3rem); }
@keyframes whiteBlink { from { border-right: 2px solid rgba(255,83,83,1); } 50% { border-right: 2px solid rgba(255,83,83,0); } to { border-right: 2px solid rgba(255,83,83,1); } }
@keyframes blackBlink { from { border-right: 2px solid rgba(255,83,83,1); } 50% { border-right: 2px solid rgba(255,83,83,0); } to { border-right: 2px solid rgba(255,83,83,1); } }
@keyframes blueBlink { from { border-right: 2px solid rgba(0,181,179,1); } 50% { border-right: 2px solid rgba(0,181,179,0); } to { border-right: 2px solid rgba(0,181,179,1); } }
.white .nb-bet-mix-bet {
  .mix-bet-item-box { background: #f5f4f5; }
  .top-red { box-shadow: 0 -.02rem .08rem 0 rgba(40,39,45,.5); background: #ff5353; }
  .mix-bet-can, .mix-bet-can-close { background: #ececeb; }
  .mix-bet-head { background: #fff; box-shadow: 0 .01rem .06rem 0 rgba(236,236,236,.5); }
  .mix-bet-head-title { color: #2e2f34; }
  .mix-bet-head-cnt { background: #ececeb; color: #767477; }
  .mix-bet-balance { border-right: .01rem solid #ecebeb; }
  .mix-bet-balance-txt, .mix-bet-balance-num { color: #909090; }
  .fold-title-txt { color: #909090; }
  .fold-title-alt-txt { color: #909090; }
  .mix-bet-option-single { border: .01rem solid #ecebeb; background: linear-gradient(to top, #f9f9f9, #fff); box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1); }
  .mix-single-head .head-team { color: #2e2f34; font-weight: 600; }
  .mix-single-head .head-score { background: rgba(255,104,27,0.1); }
  .mix-single-idx-txt { color: #bababa; }
  .mix-single-legal { border-right: .01rem solid #ccc; color: #909090; }
  .mix-single-game { color: #909090; }
  .mix-single-team-box { color: #909090; }
  .nb-bet-mix-input { border: .01rem solid #bababa; }
  .mix-input-place { color: #bababa; }
  .mix-input-text { animation: whiteBlink 1000ms infinite; }
  .mix-single-return-txt { color: #909090; }
  .mix-single-return-num { font-weight: 500; }
  .mix-bet-multiple-box { background: #fff; border: .01rem solid #ecebeb; box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,.1); }
  .mix-bet-multiple-body { border-bottom: .01rem solid #ecebeb; }
  .mix-multiple-title-txt { color: #2e2f34; font-weight: 600; }
  .mix-multiple-return-txt { color: #909090; }
  .mix-multiple-return-num { font-weight: 500; }
  .mix-multiple-input-num { color: #909090; padding-bottom: .01rem; }
  .mix-multiple-input-txt { color: #bababa; }
  .mix-bet-multiple-body-toggle { border-top: .01rem solid #ecebeb; color: #bababa; }
  .bet-mix-submit-box { background: #FFF; box-shadow: 0 -.06rem .1rem 0 rgba(144,131,131,.25); }
  .mix-show-box-txt, .mix-show-box-num { color: #666; }
  .mix-show-box-rwd { color: #ff5353; border-bottom: .01rem solid #ff5353; }
  .select-arrow-up, .select-arrow-down { svg path { fill: #d8d8d8; } }
  .mix-bet-normal { background: #bababa; }
  .mix-bet-normal .mix-bet-btn-text { color: #fff; }
  .mix-bet-active .mix-bet-btn-text { color: #fff; }
  .mix-bet-btn-num { background: #fff; }
}
.black .nb-bet-mix-bet {
  .mix-bet-item-box { background: #28272d; }
  .top-red { box-shadow: 0 -.02rem .08rem 0 rgba(0,0,0,.5); background: #ff5353; }
  .mix-bet-can, .mix-bet-can-close { background: #28272d; }
  .mix-bet-head { background: linear-gradient(to bottom, #3a393f, #333238); box-shadow: 0 .01rem .06rem 0 rgba(37,37,37,.5); }
  .mix-bet-head-title { color: #ecebeb; }
  .mix-bet-head-cnt { background: #28272d; color: #9b9b9b; }
  .mix-bet-balance { border-right: .01rem solid #28272d; }
  .mix-bet-balance-txt, .mix-bet-balance-num { color: #9b9b9b; }
  .fold-title-txt { color: #9b9b9b; }
  .fold-title-alt-txt { color: #9b9b9b; }
  .mix-bet-option-single { background: linear-gradient(133deg, #3d4046, #35363c); border: .01rem solid #2e2f34; box-shadow: 0 .1rem .2rem 0 rgba(37,37,37,.5); }
  .mix-single-head .head-team { color: #ecebeb; font-weight: 500; }
  .mix-single-head .head-score { box-shadow: 0 .02rem .06rem 0 rgba(255,104,27,0.1); background: rgba(255,104,27,0.1); }
  .mix-single-idx-txt { color: #bababa; }
  .mix-single-legal { border-right: .01rem solid #ccc; color: #9b9b9b; }
  .mix-single-game { color: #9b9b9b; }
  .mix-single-team-box { color: #9b9b9b; }
  .nb-bet-mix-input { border: .01rem solid #716d6d; }
  .mix-input-place { color: #999999; }
  .mix-input-text { animation: blackBlink 1000ms infinite; }
  .mix-single-return-txt { color: #9b9b9b; }
  .mix-single-return-num { font-weight: 500; }
  .mix-bet-multiple-box { background: linear-gradient(133deg, #3d4046, #35363c); border: .01rem solid #2e2f34; box-shadow: 0 .1rem .2rem 0 rgba(37,37,37,.5); }
  .mix-bet-multiple-body { border-bottom: .01rem solid #2e2f34; }
  .mix-multiple-title-txt { color: #ecebeb; font-weight: 500; }
  .mix-multiple-return-txt { color: #9b9b9b; }
  .mix-multiple-return-num { font-weight: 500; }
  .mix-multiple-input-num { color: #bababa; padding-bottom: .01rem; }
  .mix-multiple-input-txt { color: #9b9b9b; }
  .mix-bet-multiple-body-toggle { border-top: .01rem solid #2e2f34; color: #bababa; }
  .bet-mix-submit-box { background: linear-gradient(to bottom, #3a393f, #333238); box-shadow: 0 -.06rem .1rem 0 rgba(37,37,37,.5); }
  .mix-show-box-txt, .mix-show-box-num { color: #9b9b9b; }
  .mix-show-box-rwd { color: #ff5353; border-bottom: .01rem solid #ff5353; }
  .select-arrow-up, .select-arrow-down { svg path { fill: #666666; } }
  .mix-bet-normal { background: linear-gradient(to bottom, #3a393f, #333238); border-left: .01rem solid #28272d; }
  .mix-bet-normal .mix-bet-btn-text { color: #716d6d; }
  .mix-bet-active .mix-bet-btn-text { color: #fff; }
  .mix-bet-btn-num { background: #fff; }
}
.blue .nb-bet-mix-bet {
  .mix-bet-item-box { background: #1f1f1f; }
  .top-red { box-shadow: 0 -.02rem .08rem 0 rgba(0,0,0,1); background: linear-gradient(92deg, #00ffd8, #00e5fe); }
  .mix-bet-can, .mix-bet-can-close { background: linear-gradient(to bottom, #39373d, #2b2a2f); }
  .mix-bet-head { background: linear-gradient(to bottom, #313136, #252428); box-shadow: 0 .01rem .06rem 0 rgba(0,0,0,.1); }
  .mix-bet-head-title { color: #ecebeb; }
  .mix-bet-head-cnt { background: linear-gradient(to bottom, #39373d, #2b2a2f); color: #909090; }
  .mix-bet-balance { border-right: .01rem solid #28272d; }
  .mix-bet-balance-txt, .mix-bet-balance-num { color: #bababa; }
  .fold-title-txt { color: #909090; }
  .fold-title-alt-txt { color: #909090; }
  .mix-bet-option-single { background: linear-gradient(133deg, #3d4046, #35363c); border: .01rem solid #2e2f34; box-shadow: 0 .1rem .2rem 0 rgba(37,37,37,.5); }
  .mix-single-head .head-team { color: #ecebeb; font-weight: 500; }
  .mix-single-head .head-score { box-shadow: 0 .02rem .06rem 0 rgba(255,104,27,0.1); background: rgba(255,104,27,0.1); }
  .mix-single-idx-txt { color: #bababa; }
  .mix-single-legal { border-right: .01rem solid #ccc; color: #909090; }
  .mix-single-game { color: #909090; }
  .mix-single-team-box { color: #909090; }
  .nb-bet-mix-input { border: .01rem solid #606060; }
  .mix-input-place { color: #606060; }
  .mix-input-text { animation: blueBlink 1000ms infinite; }
  .mix-single-return-txt { color: #909090; }
  .mix-single-return-num { font-weight: 500; }
  .mix-bet-multiple-box { background: linear-gradient(133deg, #3d4046, #35363c); border: .01rem solid #2e2f34; box-shadow: 0 .1rem .2rem 0 rgba(37,37,37,.5); }
  .mix-bet-multiple-body { border-bottom: .01rem solid #2e2f34; }
  .mix-multiple-title-txt { color: #ecebeb; font-weight: 500; }
  .mix-multiple-return-txt { color: #909090; }
  .mix-multiple-return-num { font-weight: 500; }
  .mix-multiple-input-num { color: #909090; padding-bottom: .01rem; }
  .mix-multiple-input-txt { color: #777777; }
  .mix-bet-multiple-body-toggle { border-top: .01rem solid #2e2f34; color: #777777; }
  .bet-mix-submit-box { background: linear-gradient(to top, #28272d, #333238); box-shadow: 0 -.06rem .1rem 0 rgba(0,0,0,.4); }
  .mix-show-box-txt, .mix-show-box-num { color: #909090; }
  .mix-show-box-rwd { color: #53fffd; border-bottom: .01rem solid #53fffd; }
  .select-arrow-up, .select-arrow-down { svg path { fill: #666666; } }
  .mix-bet-normal { background: #4a4a4d; border-left: .01rem solid #28272d; }
  .mix-bet-normal .mix-bet-btn-text { color: #909090; }
  .mix-bet-active .mix-bet-btn-text { color: #fff; }
  .mix-bet-btn-num { background: #ecebeb; }
}
.nb-bet-mix-bet {
  position: fixed;
  width: 3.75rem;
  left: 50%;
  bottom: 0;
  z-index: 999999;
  min-height: .52rem;
  display: flex;
  flex-direction: column;
  transform: translateX(-50%);
  .nb-bet-mix-blank { position: relative; flex-grow: 1; z-index: 1; background: transparent; }
  .mix-bet-item-box { position: relative; width: 100%; z-index: 2; }
  .bet-mix-submit-box { position: relative; width: 100%; z-index: 3; }
  .top-red { width: 100%; height: .06rem; }
  .mix-bet-head { width: 100%; height: .34rem; .mix-bet-head-left, .mix-bet-head-right { height: 100%; } }
  .mix-bet-can { width: .26rem; height: .26rem; margin: 0 .12rem; border-radius: 100%; }
  .mix-bet-can-close { width: .26rem; height: .26rem; margin-left: .12rem; border-radius: 100%; }
  .submit-show-txt-box { flex-grow: 1; height: 100%; }
  .mix-bet-head-title { font-size: .14rem; padding: 0 .03rem; }
  .mix-bet-head-cnt { width: .21rem; height: .21rem; margin-left: .04rem; font-size: .11rem; border-radius: 100%; }
  .mix-bet-balance { height: 100%; font-size: .12rem; padding-right: .2rem; }
  .mix-bet-down-flag { width: .5rem; height: 100%; }
  .mix-bet-body { width: 100%; max-height: 4.15rem; padding: .1rem .1rem 0 .1rem; overflow: auto; -webkit-overflow-scrolling: touch; }
  .mix-bet-option-null { display: none; }
  .mix-bet-option-single { width: 3.55rem; height: .8rem; margin: 0 auto .1rem; border-radius: .06rem; overflow: hidden; }
  .mix-bet-single-body { width: 100%; height: 100%; position: relative; }
  .mix-single-red-line { width: .04rem; height: 100%; background: #ff5353; }
  .mix-single-white-line { width: .04rem; height: 100%; background: transparent; }
  .mix-single-del-idx { width: .26rem; height: 100%; }
  .mix-single-close, .mix-single-idx-box { width: 100%; height: 48%; font-size: .14rem; }
  .mix-single-body-box { flex-grow: 1; height: 100%; }
  .mix-single-head { width: 100%; height: .24rem; margin-top: .07rem; }
  .mix-single-head .head-team { font-size: .16rem; margin-right: .08rem; font-family: PingFangSC; }
  .mix-single-head .head-odds, .mix-single-head .head-odds-alert { height: .21rem; font-size: .16rem; font-weight: 500; padding: 0 .03rem; border-radius: .03rem; }
  .mix-single-head .head-odds, .mix-single-head .head-odds-alert { .head-odds-txt { font-family: PingFangSC; padding-right: .01rem; } }
  .mix-single-head .head-alert { width: .18rem; height: 100%; margin-left: .05rem; }
  .mix-single-head .head-score { border-radius: .02rem; padding: .02rem .04rem; font-size: .13rem; user-select: none; margin-left: .15rem; }
  .mix-single-game-box { width: 100%; height: .17rem; margin-top: .05rem; }
  .mix-single-legal { height: .12rem; padding-right: .08rem; font-size: .12rem; }
  .mix-single-game { height: .12rem; padding-left: .08rem; font-size: .12rem; }
  .mix-single-team-box { width: 100%; height: .17rem; margin-top: .02rem; font-size: .12rem; }
  .mix-single-input-box { width: 2.8rem; height: 100%; position: absolute; z-index: 99999999; right: 0; top: 0; padding-right: .11rem; }
  .mix-single-input { width: 100%; height: .34rem; margin-top: .11rem; padding-right: .01rem; }
  .nb-bet-mix-input { width: 1.1rem; height: .3rem; position: relative; z-index: 20; border-radius: .04rem; padding: 0 .1rem; }
  .mix-input-text, .mix-input-fill { height: 0.21rem; font-size: .16rem; padding-right: .01rem; }
  .mix-input-place { position: absolute; z-index: 10; width: .9rem; height: 90%; font-size: .12rem; }
  .mix-single-return { width: 100%; height: .17rem; margin-top: .09rem; }
  .mix-single-return-txt, .mix-single-return-num { font-size: .12rem; padding-left: .05rem; }
  .mix-bet-fold-title-box { width: 100%; height: .2rem; margin-bottom: .1rem; padding: 0 .1rem; }
  .fold-title-txt { font-size: .12rem; }
  .fold-title-alert { flex-grow: 1; height: 100%; .fold-title-alt-txt { font-size: .13rem; padding: 0 0 .01rem .05rem; } }
  .mix-bet-multiple-box { width: 3.55rem; margin: 0 auto .1rem; padding: .05rem 0; border-radius: .1rem; }
  .mix-bet-option-multiple { width: 100%; padding: 0 .1rem; overflow: hidden; .mix-bet-multiple-body { width: 100%; } }
  .mix-bet-multiple-body-main { width: 100%; height: .55rem; position: relative; z-index: 100; }
  .mix-bet-option-multiple:last-child .mix-bet-multiple-body { border: none; }
  .mix-multiple-title-box { position: absolute; z-index: 110; width: 100%; height: 100%; }
  .mix-multiple-title-txt { width: 100%; height: .3rem; padding-top: .05rem; font-size: .16rem; }
  .mix-multiple-return-box { width: 100%; height: .17rem; margin-top: .02rem; }
  .mix-multiple-return-txt, .mix-multiple-return-num { font-size: .12rem; padding-right: .05rem; }
  .mix-multiple-odds-box { position: absolute; z-index: 120; width: 100%; height: 100%; font-size: .14rem; font-weight: 500; padding: 0 25% .02rem 0; }
  .multiple-odds-txt { font-family: PingFangSC; padding-right: .01rem; }
  .mix-multiple-input-box { position: absolute; z-index: 120; width: 100%; height: 100%; padding-right: .01rem; }
  .mix-multiple-input-txt, .mix-multiple-input-num { font-size: .13rem; padding-right: .1rem; }
  .mix-multiple-input-txt { padding-bottom: .01rem; }
  .mix-multiple-toggle-item { width: 100%; height: .3rem; font-size: .12rem; }
  .submit-show-box { width: 2.3rem; height: 100%; }
  .show-box-top, .show-box-bottom, .show-box-reward { width: 100%; height: 100%; }
  .show-box-top { padding: .06rem 0 0 .12rem; }
  .show-box-bottom { padding: 0 0 0 .12rem; }
  .show-box-reward { padding: 0 0 .06rem .12rem; }
  .mix-show-box-txt { height: 100%; font-size: .12rem; margin-right: .05rem; }
  .mix-show-box-num { height: 100%; font-size: .14rem; }
  .mix-show-box-rwd { font-size: .12rem; }
  .select-arrow-up, .select-arrow-down { height: 100%; }
  .select-arrow-up { transform: rotate(180deg); }
  .submit-btn-box { width: 1.45rem; height: 100%; padding-right: .12rem; }
  .mix-bet-normal, .mix-bet-active { width: 100%; height: .46rem; border-radius: .06rem; }
  .mix-bet-btn-text { font-size: .16rem; .mix-bet-btn-num { width: .21rem; height: .21rem; margin-left: .1rem; font-size: .11rem; border-radius: 100%; } }
}
</style>
