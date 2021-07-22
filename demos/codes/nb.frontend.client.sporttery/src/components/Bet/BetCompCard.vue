<template>
  <v-touch class="nb-bet-comp-card-box flex-center" @tap="tapCardFun">
    <div :class="shadowClass"></div>
    <cimg :src="compCardUrl" />
    <div class="comp-card-cover" >
      <div class="comp-card-round flex-center" v-if="select" >
        <bet-card-select />
      </div>
      <div class="comp-card-title flex-start">
        <bet-card-icon-one v-if="/^1$/.test(data.couponType)" />
        <bet-card-icon-two v-else />
        <span>{{/^1$/.test(data.couponType) ? $t('share.guarantCard') : $t('share.reduceCard')}}</span>
      </div>
      <div class="comp-card-detail flex-between-col">
        <div class="comp-card-detail-tp flex-start">
          <span class="card-detail-pt"></span>
          <span class="card-detail-txt">{{$t('share.useFor')}}</span>
          <span class="card-detail-num">{{data.minBet || 0}}</span>
          <span class="card-detail-txt">{{$t('share.useAbove')}}</span>
        </div>
        <div class="comp-card-detail-btm flex-start">
          <span class="card-detail-pt"></span>
          <span class="card-detail-txt">{{$t('share.lastDate')}}</span>
          <span class="card-detail-num">{{getCompDate}}</span>
        </div>
      </div>
      <div class="comp-card-amt-box flex-center-col" >
        <div class="comp-card-amt-box-tp flex-start" >
          <div class="comp-card-flag flex-start-col" >
            <span class="flex-start"></span>
            <span class="flex-start">￥</span>
          </div>
          <div class="comp-card-amt">{{data.money || 0}}</div>
        </div>
        <slot />
      </div>
    </div>
  </v-touch>
</template>

<script>
import BetCardSelect from './BetComps/BetCardSelect';
import BetCardIconOne from './BetComps/BetCardIconOne';
import BetCardIconTwo from './BetComps/BetCardIconTwo';

const CompCards = [
  require('./images/comp_card_1.png'),
  require('./images/comp_card_2.png'),
  require('./images/comp_card_3.png'),
];

export default {
  inheritAttrs: false,
  name: 'BetCompCard',
  props: { data: Object, valid: Boolean, select: Boolean },
  computed: {
    compCardUrl() {
      const id = /^2$/.test(this.data.couponType) ? 1 : 0;
      return CompCards[this.valid ? id : 2];
    },
    shadowClass() {
      const str = /^2$/.test(this.data.couponType) ? 'two' : 'one';
      return `comp-card-shadow ${this.valid ? str : 'three'}`;
    },
    getCompDate() {
      return `${this.data && this.data.endDate ? this.data.endDate : ''}`.replace(/\.\d+$/, '');
    },
  },
  components: { BetCardSelect, BetCardIconOne, BetCardIconTwo },
  methods: {
    tapCardFun() {
      this.$emit('tap', this.data);
    },
  },
};
</script>

<style lang="less">
.nb-bet-comp-card-box {
  position: relative;
  width: 3.48rem;
  height: .9rem;
  z-index: 1;
  .comp-card-shadow { position: absolute; width: 80%; height: 98%; z-index: 2; top: 1%; left: 10%; }
  .comp-card-shadow.one { box-shadow: .01rem .03rem .1rem 0 rgba(111,136,245,.6); }
  .comp-card-shadow.two { box-shadow: .01rem .03rem .1rem 0 rgba(255,27,0,.3); }
  .comp-card-shadow.three { box-shadow: .01rem .03rem .1rem 0 rgba(0,0,0,.15); }
  img { position: absolute; width: 100%; height: 100%; z-index: 3; top: 0; left: 0; }
  .comp-card-cover { position: absolute; width: 3.49rem; height: .9rem; z-index: 4; top: 0; left: 0; border-radius: .1rem; overflow: hidden; }
  .comp-card-title { position: absolute; width: 100%; height: 100%; z-index: 5; padding: .12rem 0 .56rem .36rem; }
  .comp-card-title span { padding-left: .06rem; font-size: .16rem; font-family: PingFangSC; font-weight: 500; color: #ffffff; }
  .comp-card-detail { position: absolute; width: 100%; height: 100%; z-index: 6; padding: .39rem 0 .17rem .34rem; }
  .comp-card-detail-tp, .comp-card-detail-btm { width: 100%; height: .17rem; font-size: .12rem; color: #ffffff; }
  .card-detail-pt { width: .02rem; height: .02rem; margin-right: .04rem; background: #ffffff; }
  .card-detail-num { font-size: .13rem; font-family: DIN; padding: 0 .02rem; }
  .comp-card-amt-box { position: absolute; width: 100%; height: 100%; z-index: 7; padding-left: 2.42rem; }
  .comp-card-amt-box-tp { width: 100%; height: .52rem; }
  .comp-card-flag { width: .12rem; height: 100%; span { width: 100%; height: 48%; font-size: .17rem; font-weight: 500; font-family: PingFangSC; color: #ffffff; } }
  .comp-card-amt { padding-left: .04rem; font-size: .44rem; font-weight: 500; letter-spacing: -.005rem; color: #ffffff; }
  .comp-card-round { position: absolute; width: .44rem; height: .44rem; z-index: 9; padding: .12rem .05rem 0 0; border-radius: 100%; right: -.08rem; top: -.14rem; background: linear-gradient(54deg, rgba(238,238,238,.3), rgba(255,255,255,.1)); }
}
</style>
