<template>
  <list-page class="master-page" v-if="!horizScreen" @cFun="clickFun">
    <bet-master-head slot="header" />
    <div class="master-page-box">
      <div class="bet-box-none flex-center-col" v-if="noData">
        <bet-box-none :inColor="inCol" :outColor="ouCol" />
        <p class="bet-box-none-text flex-center">{{$t('pageBet.noItems')}}</p>
      </div>
      <div class="bet-box-detail" v-else>
        <div class="page-box-title flex-between">
          <span class="page-box-title-text">{{$t('pageBet.betItem')}}</span>
          <v-touch tag="span" class="page-box-title-clear flex-center" @tap="clearFun">
            {{$t('pageBet.clearAll')}}
          </v-touch>
        </div>
        <bet-keyboard-multiple class="page-box-mult" v-if="multType" />
        <div class="page-box-title flex-between" v-if="multType">
          <span class="page-box-title-text">{{$t('pageBet.betSlips')}}</span>
          <span class="page-box-title-alert flex-between" v-if="!allowSame && betList.find(v => v.same)">
            <bet-box-alert />
            <span class="page-box-title-alert-text flex-none">{{$t('pageBet.sameAlert')}}</span>
          </span>
        </div>
        <div class="bet-page-item" v-for="(v, k) in betList" :key="k">
          <bet-option-box :data="v" :showId="!!multType" />
        </div>
        <bet-option-btn v-if="!multType && showBtn" />
      </div>
    </div>
  </list-page>
  <v-touch class="master-page" v-else @tap="clickFun">
    <div class="master-page-left flex-none-col">
      <bet-master-head class="master-left-header" />
      <div class="master-left-content">
        <div class="master-page-box">
          <div class="bet-box-none flex-center-col" v-if="noData">
            <bet-box-none :inColor="inCol" :outColor="ouCol" />
            <p class="bet-box-none-text flex-center">{{$t('pageBet.noItems')}}</p>
          </div>
          <div class="bet-box-detail" v-else>
            <div class="page-box-title flex-between">
              <span class="page-box-title-text">{{$t('pageBet.betItem')}}</span>
              <v-touch tag="span" class="page-box-title-clear flex-center" @tap="clearFun">
                {{$t('pageBet.clearAll')}}
              </v-touch>
            </div>
            <bet-keyboard-multiple class="page-box-mult" v-if="multType" />
            <bet-option-btn v-if="!multType && showBtn" />
            <transition name="bOption">
              <div class="bet-page-item" v-if="betShows.length && !showBtn">
                <bet-option-box :data="betShows[0]" :showId="!!multType" />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <div class="master-page-right">
      <list-page class="master-page">
        <div class="master-page-box" slot="header">
          <div class="bet-box-detail">
            <div class="page-box-title flex-between">
              <span class="page-box-title-text">{{$t('pageBet.betSlips')}}</span>
              <span class="page-box-title-alert flex-between" v-if="multType && !allowSame && betList.find(v => v.same)">
                <bet-box-alert />
                <span class="page-box-title-alert-text flex-none">{{$t('pageBet.sameAlert')}}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="master-page-box" v-if="!showBtn">
          <div class="bet-box-none flex-center-col" v-if="!betItems || !betItems.length">
            <bet-box-none :inColor="inCol" :outColor="ouCol" />
            <p class="bet-box-none-text flex-center">
              {{$t(`pageBet.${betList && betList.length ? 'noMoreItems' : 'noItems'}`)}}
            </p>
          </div>
          <div class="bet-box-detail" v-else>
            <div class="bet-page-item" v-for="(v, k) in betItems" :key="k">
              <bet-option-box :data="v" :showId="!!multType" />
            </div>
          </div>
        </div>
        <div class="master-page-box" v-else>
          <div class="bet-box-none flex-center-col" v-if="!betList || !betList.length">
            <bet-box-none :inColor="inCol" :outColor="ouCol" />
            <p class="bet-box-none-text flex-center">
              {{$t(`pageBet.${betList && betList.length ? 'noMoreItems' : 'noItems'}`)}}
            </p>
          </div>
          <div class="bet-box-detail" v-else>
            <div class="bet-page-item" v-for="(v, k) in betList" :key="k">
              <bet-option-box :data="v" :showId="!!multType" />
            </div>
          </div>
        </div>
      </list-page>
    </div>
  </v-touch>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { AppModes } from '@/config/constants';
import ListPage from '@/components/common/ListPage';
import BetBoxNone from '@/components/Bet/BetComps/BetBoxNone';
import BetBoxAlert from '@/components/Bet/BetComps//BetBoxAlert';
import BetOptionBox from '@/components/Bet/BetComps/BetOptionBox';
import BetOptionBtn from '@/components/Bet/BetComps/BetOptionBtn';
import BetMasterHead from '@/components/Bet/BetComps/BetMasterHead';
import BetKeyboardMultiple from '@/components/Bet/BetKeyboardMultiple';

export default {
  data() {
    return {
      multSel: 0,
      balance: '0.00',
      range: Object.assign({ min: 0, max: 0, rtn: 0 }, { odds: 0, mOdds: 0, gtp: 0 }),
      right: { m: 0, o: '1.00', lock: false },
      st: { o: {}, i: {} },
      betShows: [],
    };
  },
  computed: {
    ...mapState({
      betList: state => state.bet.betList,
      betCnt: state => state.bet.betCount,
    }),
    ...mapState('app', {
      theme: state => state.theme,
      user: state => state.userinfo,
      multType: state => state.multType,
      horizScreen: state => state.horizScreen,
    }),
    allowSame() {
      return !!window.NBConfig.ALLOW_SAME_MATCH;
    },
    showBtn() {
      const con = window.NBConfig;
      return /^2$/.test(con.BETTING_MODE) && con.ALLOW_SAME_MATCH && con.ALLOW_MULT_OPTION;
    },
    betItems() {
      const dt = this.betList.filter(v => !v.show);
      return !this.multType ? dt : this.betList;
    },
    betItemShows() {
      const dt = this.betList.filter(v => v.show);
      return !this.multType ? dt : [];
    },
    noData() {
      if (!this.multType) {
        return this.betList.length < 1;
      }
      if (this.betList.length < 2) {
        return true;
      }
      const mArr = [];
      for (let i = 0; i < this.betList.length; i += 1) {
        if (mArr.indexOf(`${this.betList[i].matchID}`) < 0) {
          mArr.push(`${this.betList[i].matchID}`);
        }
      }
      return mArr.length < 2;
    },
    inCol() {
      const defColor = /black/i.test(this.theme) ? '#37383C' : '#909090';
      return /blue/i.test(this.theme) ? '#37383C' : defColor;
    },
    ouCol() {
      const defColor = /black/i.test(this.theme) ? '#55565A' : '#AAAAAA';
      return /blue/i.test(this.theme) ? '#55565A' : defColor;
    },
  },
  components: {
    ListPage,
    BetBoxNone,
    BetBoxAlert,
    BetOptionBox,
    BetOptionBtn,
    BetMasterHead,
    BetKeyboardMultiple,
  },
  watch: {
    betItemShows(v) {
      this.getBetShows(v);
    },
    multType() {
      this.clearOptAmount();
      this.updateBal();
    },
    betCnt() {
      this.quoteBetCart();
    },
  },
  methods: {
    ...mapMutations(['clearBetItem', 'changeSubStatus', 'changeShowIndex', 'changeBetAmount', 'changeUsedBalance', 'clearOptAmount']),
    ...mapMutations('app', ['setTabHeight', 'updateMultType']),
    ...mapActions('app', ['reloadBalance', 'transferToNB']),
    ...mapActions(['getNBUser', 'quoteBetCart']),
    clearFun() {
      this.clearBetItem();
    },
    backFun() {
      this.$router.go(-1);
      this.changeSubStatus(false);
    },
    eFun(v) {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/close/i.test(cName)) {
        this.clearBetItem(v);
      } else if (v.matchID) {
        this.$router.push(`/detail/${v.sportID}/${v.matchID}`);
      }
    },
    getBetShows(v) {
      const lenPass = !!(v && v.length === 1 && this.betShows.length === v.length);
      if (lenPass && `${v[0].optionID}` === `${this.betShows[0].optionID}`) return;
      this.betShows = [];
      if (v && v.length) {
        setTimeout(() => { this.betShows = v; }, 150);
      }
    },
    async updateBal() {
      this.changeUsedBalance();
      this.changeBetAmount({ amt: '' });
      if (this.user && this.user.token) {
        await this.transferToNB();
        const con = window.NBConfig;
        const pSet = con.PORTAL_SETTING;
        const url = pSet && pSet.USER_CENTER_URL;
        if (url || AppModes.SEAMLESS === con.APP_MODE) {
          this.getNBUser(true);
        } else {
          this.reloadBalance();
        }
      }
    },
    findClass(el, str) {
      const kPass = /(content-inputs|bet-show-get|show-get-(txt|num|input|null))/i.test(el.className || '');
      let cPass = new RegExp(`${str}`, 'i').test(el.className || '');
      cPass = cPass || (/nb-history-option-box/i.test(str) && kPass && !el.parentElement);
      if (cPass) {
        return true;
      }
      return el.parentElement ? this.findClass(el.parentElement, str) : false;
    },
    clickFun(ev) {
      const e = ev || window.event;
      if (!this.multType && this.showBtn && !this.findClass(e.target, 'nb-history-option-box')) {
        this.changeShowIndex();
      }
    },
  },
  mounted() {
    this.updateMultType(this.betList.length > 1 && !this.noData ? 1 : 0);
    this.changeShowIndex();
    this.getBetShows(this.betItemShows);
    setTimeout(() => { this.setTabHeight('0'); }, 100);
    this.updateBal();
    if (this.user && this.user.token) {
      this.quoteBetCart();
    }
  },
};
</script>

<style lang="less">
.bOption-enter-active, .bOption-leave-active { transition: all 0.25s ease-out; }
.bOption-enter, .bOption-leave-active { transform: scaleY(0); }
.white .master-page-box {
  .bet-box-none .bet-box-none-text { color: #2E2F34; }
  .page-box-title {
    .page-box-title-text { color: rgba(46,47,52,0.7); }
    .page-box-title-clear {  border: .01rem solid #bababa; color: rgba(46,47,52,0.5); }
    .page-box-title-alert-text { color: rgba(46,47,52,0.3); }
  }
  .bet-page-item {
    background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
    box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,0.5);
    border: .01rem solid #EBE9E9;
  }
}
.black .master-page-box {
  .bet-box-none .bet-box-none-text { color: #FFF; }
  .page-box-title {
    .page-box-title-text { color: rgba(255,255,255,0.7); }
    .page-box-title-clear { border: .01rem solid #666; color: rgba(255,255,255,0.5); }
    .page-box-title-alert-text { color: rgba(255,255,255,0.3); }
  }
  .bet-page-item {
    background: linear-gradient(to bottom, #3a393f, #333238);
    box-shadow: 0 .1rem .2rem 0 rgba(37, 37, 37, 0.5);
    border: .01rem solid #2e2f34;
  }
}
.blue .master-page-box {
  .bet-box-none .bet-box-none-text { color: #FFF; }
  .page-box-title {
    .page-box-title-text { color: rgba(255,255,255,0.7); }
    .page-box-title-clear { border: .01rem solid #666; color: rgba(255,255,255,0.5); }
    .page-box-title-alert-text { color: rgba(255,255,255,0.3); }
  }
  .bet-page-item {
    background: linear-gradient(to bottom, #3a393f, #333238);
    box-shadow: 0 .1rem .2rem 0 rgba(37, 37, 37, 0.5);
    border: .01rem solid #2e2f34;
  }
}
.master-page-box {
  width: 3.55rem;
  margin: .1rem auto 0;
  .bet-box-none {
    width: 100%;
    height: 4.5rem;
    .bet-box-none-text {
      width: 100%;
      height: .53rem;
      font-size: .15rem;
      opacity: 0.7;
    }
  }
  .page-box-title {
    width: 100%;
    height: .23rem;
    .page-box-title-text { font-size: .13rem; }
    .page-box-title-clear {
      height: .22rem;
      padding: 0 .1rem;
      border-radius: .11rem;
      font-size: .12rem;
    }
    .page-box-title-alert-text { font-size: .12rem; padding: 0 .03rem .01rem .06rem; }
  }
  .page-box-mult { margin: .1rem auto; }
  .bet-page-item {
    width: 100%;
    margin-top: .1rem;
    border-radius: .1rem;
    overflow: hidden;
  }
}
.master-page-left {
  float: left;
  width: 3.75rem;
  height: 100%;
  .master-left-header { position: relative; z-index: 12; }
  .master-left-content {
    position: relative;
    flex-grow: 1;
    z-index: 10;
    width: 3.75rem;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
  }
  .bet-box-none { height: 1.6rem; }
}
.master-page-right {
  float: right;
  width: 3.75rem;
  height: 100%;
  .bet-box-none { height: 2.6rem; }
}
.horizontal .master-page { width: 100%; height: 100%; }
</style>
