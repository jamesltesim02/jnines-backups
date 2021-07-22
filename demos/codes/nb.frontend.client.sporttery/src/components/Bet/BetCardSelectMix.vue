<template>
<transition name="cardMixAni">
  <div class="nb-bet-reward-mix" :style="oStyle" v-if="show" >
    <div class="top-red"></div>
    <div class="bet-mix-submit-box flex-between" >
      <div class="submit-show-box flex-start" >
        <div class="submit-show-txt-box flex-start-col" >
          <div class="show-box-top flex-start">
            <span class="mix-show-box-txt flex-start">{{$t('pageBet.tMixBet')}}</span>
            <span class="mix-show-box-num flex-start">{{tAmt | NumFmt(true)}}</span>
          </div>
          <div class="show-box-bottom flex-start">
            <span class="mix-show-box-txt flex-start">{{$t('pageBet.tMixRtn')}}</span>
            <span class="mix-show-box-num flex-start" :style="{ color: oddsColor }">{{tRtn | NumFmt(true)}}</span>
          </div>
          <v-touch class="show-box-reward flex-start" v-if="!(list && list.length)" @tap="toRewardFun" >
            <span class="mix-show-box-rwd flex-start">{{$t('share.toReward')}}</span>
          </v-touch>
          <v-touch class="show-box-reward flex-start" v-else @tap="hideSelFun" >
            <span class="mix-show-box-txt flex-start" :style="{ color: oddsColor }" v-if="cardName">{{$t('share.using')}}{{cardName}}</span>
            <span class="mix-show-box-txt flex-start" v-else>{{$t('share.uHas')}}{{list.length}}{{$t('share.cardCanUse')}}</span>
            <div :class="`select-arrow-${show ? 'down' : 'up'} flex-center`">
              <svg width=".12rem" height=".12rem" style="width:.12rem;height:.12rem" viewBox="0 0 100 100" version="1.1" >
                <path d="M 0 14.5 L 100 14.5 L50 85.5 Z"></path>
              </svg>
            </div>
          </v-touch>
        </div>
      </div>
      <div class="submit-btn-box flex-start" >
        <v-touch class="mix-bet-active flex-center" @tap="hideSelFun">{{$t('pageBet.finish')}}</v-touch>
      </div>
    </div>
    <div class="reward-card-show-box" :style="iStyle" >
      <div class="nb-card-item flex-center" v-for="(v, k) in list" :key="k">
        <bet-comp-card :data="v" :valid="isCardValid(v)" :select="isUsedCard(v)" @tap="selectCardFun" />
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetCompCard from './BetCompCard';

export default {
  inheritAttrs: false,
  name: 'BetCardSelectMix',
  data() {
    return { oStyle: { }, iStyle: { } };
  },
  computed: {
    ...mapState({
      iphX: state => state.bet.isIphoneX,
      slCd: state => state.bet.selectCard,
      rObj: state => state.bet.rewardObject,
    }),
    ...mapState('app', { theme: state => state.theme }),
    show() {
      return !!(this.rObj && this.rObj.data && this.rObj.data.length);
    },
    tAmt() {
      return +(this.rObj && this.rObj.amt ? this.rObj.amt : 0);
    },
    tRtn() {
      return +(this.rObj && this.rObj.rtn ? this.rObj.rtn : 0);
    },
    tLen() {
      return +(this.rObj && this.rObj.len ? this.rObj.len : 0);
    },
    aOdds() {
      return +(this.rObj && this.rObj.odds ? this.rObj.odds : 1);
    },
    list() {
      return this.rObj && this.rObj.data && this.rObj.data.length ? this.rObj.data : [];
    },
    cardName() {
      return this.slCd && this.slCd.couponName ? this.slCd.couponName : '';
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
  },
  watch: {
    iphX() {
      if (this.show) this.setCardStyle();
    },
    show() {
      this.setCardStyle();
    },
  },
  components: { BetCompCard },
  methods: {
    ...mapMutations(['setSelectCard', 'setRewardObject']),
    getCompDate(v) {
      return `${v && v.endDate ? v.endDate : ''}`.replace(/\.\d+$/, '');
    },
    getDateValid(v) {
      const dtStr = this.getCompDate(v).replace(/-/g, '/');
      return !!(dtStr && new Date(dtStr).getTime() - new Date().getTime() > 0);
    },
    getCardValid(v) {
      const isNum = v && /^\d+(\.\d+)?$/.test(v.minBet) && /^\d+(\.\d+)?$/.test(v.minOdds);
      return !!(isNum && +this.tAmt > +v.minBet && +this.aOdds > +v.minOdds && this.tLen < 2);
    },
    isCardValid(v) {
      return !!(this.getCardValid(v) && this.getDateValid(v));
    },
    isUsedCard(v) {
      return !!(this.slCd && `${this.slCd.licenseCode}` === `${v.licenseCode}`);
    },
    toRewardFun() {
      this.$router.push('/reward');
    },
    hideSelFun() {
      this.setRewardObject();
    },
    selectCardFun(v) {
      if (this.slCd && `${this.slCd.licenseCode}` === `${v.licenseCode}`) {
        this.setSelectCard();
      } else if (!this.getDateValid(v)) {
        this.$toast(this.$t('share.cardUnAva'));
      } else if (!this.getCardValid(v)) {
        this.$toast(this.$t('share.noReach'));
      } else {
        this.setSelectCard(v);
      }
    },
    setCardStyle() {
      [this.oStyle, this.iStyle] = [{ }, { }];
      this.oStyle.height = this.iphX ? '5.41rem' : '5.26rem';
      this.iStyle.height = this.iphX ? '4.65rem' : '4.5rem';
      this.iStyle.paddingBottom = this.iphX ? '.25rem' : '.1rem';
    },
  },
  mounted() {
    this.setCardStyle();
  },
};
</script>

<style lang="less">
.cardMixAni-enter-active, .cardMixAni-leave-active { transition: all 0.15s linear; }
.cardMixAni-enter, .cardMixAni-leave-active { transform: translateY(3rem); }
.white .nb-bet-reward-mix {
  background: #f5f4f5;
  box-shadow: 0 .07rem .2rem 0 #909090;
  .top-red { box-shadow: 0 -.02rem .08rem 0 rgba(40,39,45,.5); background: #ff5353; }
  .bet-mix-submit-box { background: #FFF; box-shadow: 0 -.02rem .1rem 0 rgba(144,131,131,.25); }
  .mix-show-box-txt, .mix-show-box-num { color: #666; }
  .mix-show-box-rwd { color: #ff5353; border-bottom: .01rem solid #ff5353; }
  .select-arrow-up, .select-arrow-down { svg path { fill: #d8d8d8; } }
  .mix-bet-active { background: #ff5353; color: #fff; }
}
.black .nb-bet-reward-mix {
  background: linear-gradient(to bottom, #3a393f, #333238);
  box-shadow: 0 .07rem .2rem 0 rgba(0,0,0,.5);
  .top-red { box-shadow: 0 -.02rem .08rem 0 rgba(0,0,0,.5); background: #ff5353; }
  .bet-mix-submit-box { background: linear-gradient(to bottom, #3a393f, #333238); box-shadow: 0 -.06rem .1rem 0 rgba(37,37,37,.5); }
  .mix-show-box-txt, .mix-show-box-num { color: #9b9b9b; }
  .mix-show-box-rwd { color: #ff5353; border-bottom: .01rem solid #ff5353; }
  .select-arrow-up, .select-arrow-down { svg path { fill: #666666; } }
  .mix-bet-active { background: #ff5353; color: #fff; }
}
.blue .nb-bet-reward-mix {
  background: #1f1f1f;
  box-shadow: 0 .07rem .2rem 0 rgba(0,0,0,.35);
  .top-red { box-shadow: 0 -.02rem .08rem 0 rgba(0,0,0,1); background: linear-gradient(92deg, #00ffd8, #00e5fe); }
  .bet-mix-submit-box { background: linear-gradient(to top, #28272d, #333238); box-shadow: 0 -.01rem .2rem 0 rgba(0,0,0,.3); }
  .mix-show-box-txt, .mix-show-box-num { color: #909090; }
  .mix-show-box-rwd { color: #53fffd; border-bottom: .01rem solid #53fffd; }
  .select-arrow-up, .select-arrow-down { svg path { fill: #666666; } }
  .mix-bet-active { background: #00b5b3; color: #fff; }
}
.nb-bet-reward-mix {
  position: absolute;
  z-index: 99999992;
  left: 0;
  bottom: 0;
  width: 3.75rem;
  margin: 0 auto;
  .top-red { width: 100%; height: .06rem; }
  .bet-mix-submit-box { width: 100%; height: .7rem; }
  .submit-show-box { width: 2.19rem; height: 100%; }
  .submit-btn-box { width: 1.56rem; height: 100%; padding-right: .12rem; }
  .submit-show-txt-box { width: 100%; height: 100%; }
  .show-box-top, .show-box-bottom, .show-box-reward { width: 100%; height: 100%; }
  .show-box-top { padding: .06rem 0 0 .12rem; }
  .show-box-bottom { padding: 0 0 0 .12rem; }
  .show-box-reward { padding: 0 0 .06rem .12rem; }
  .mix-show-box-txt { height: 100%; font-size: .12rem; margin-right: .05rem; }
  .mix-show-box-num { height: 100%; font-size: .14rem; }
  .mix-show-box-rwd { font-size: .12rem; }
  .select-arrow-up, .select-arrow-down { height: 100%; }
  .select-arrow-up { transform: rotate(180deg); }
  .mix-bet-active { width: 100%; height: .46rem; border-radius: .06rem; font-size: .16rem; }
  .reward-card-show-box { width: 100%; overflow: auto; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
  .nb-card-item { margin-top: .1rem; }
}
</style>
