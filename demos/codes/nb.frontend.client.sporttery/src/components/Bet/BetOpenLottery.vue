<template>
  <bet-cover-box class="nb-bet-open-lottery" :index="999999" :show="show" @close="closeFun" >
    <div class="open-lottery-fixed-body" v-if="nData" >
      <cimg :src="newerUrl" />
      <v-touch class="open-lottery-newer-btn" @tap="newerFun"></v-touch>
    </div>
    <div class="open-lottery-fixed-body" v-else-if="fShow" >
      <cimg :src="fixedUrl" />
      <div class="open-lottery-fixed-title flex-center">{{titleStr}}</div>
      <div class="open-lottery-fixed-detail flex-center-col">
        <div class="flex-center" v-for="(v, k) in detailArr" :key="k">
          <div class="grow flex-center" :style="v.style || { }" v-if="isGrow(v)">5%<bet-lottery-arrow />10%</div>
          <div class="normal flex-center" :style="v.style || { }" v-html="v.text" v-else></div>
        </div>
      </div>
      <v-touch class="open-lottery-fixed-btn" @tap="fixedFun">
        <span class="tp flex-center">{{btnStr}}</span>
        <span class="btm flex-center">{{btnStr}}</span>
      </v-touch>
    </div>
    <div class="open-lottery-random-body" v-else-if="tShow" >
      <cimg :src="randomUrl" />
      <div class="open-lottery-save-str flex-center">{{saveStr}}</div>
      <div class="open-lottery-amt-box flex-center-bottom">
        <span class="open-lottery-amt flex-end-col">{{amtNum}}</span>
        <span class="open-lottery-txt flex-end-col">{{$t('share.rmb')}}</span>
      </div>
      <v-touch class="open-lottery-random-btn" @tap="toPageFun"></v-touch>
    </div>
    <div class="open-lottery-close flex-center" v-if="show" ><bet-cover-close /></div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetCoverClose from './BetComps/BetCoverClose';
import BetCoverBox from './BetComps/BetCoverBox';
import BetLotteryArrow from './BetComps/BetLotteryArrow';

export default {
  inheritAttrs: false,
  name: 'BetOpenLottery',
  computed: {
    ...mapState({
      tData: state => state.bet.taskReward,
      fData: state => state.bet.finishTask,
      nData: state => state.bet.newRegister,
    }),
    fShow() {
      return !!(this.fData && this.fData.title && this.fData.detail && this.fData.detail.length && this.fData.button && this.fData.button.text);
    },
    tShow() {
      return !!(this.tData && this.tData.type && this.tData.amountList && this.tData.amountList.length);
    },
    show() {
      return !!(this.nData || this.tShow || this.fShow);
    },
    newerUrl() {
      return './img/package/new-package.png';
    },
    fixedUrl() {
      return './img/package/fixed-package.png';
    },
    randomUrl() {
      return './img/package/random-package.png';
    },
    saveStr() {
      return `${this.$t(`share.${/^(4|11)$/.test(this.tData.type) ? 'guarantCard' : 'amountCard'}`)}${this.$t('share.cardSaved')}`;
    },
    amtNum() {
      const id = this.tData && this.tData.index ? (this.tData.index - 1) : 0;
      return this.show ? this.tData.amountList[id] : 0;
    },
    titleStr() {
      return this.fData && this.fData.title ? this.fData.title : '';
    },
    detailArr() {
      return this.fData && this.fData.detail && this.fData.detail.length ? this.fData.detail : [];
    },
    btnStr() {
      return this.fData && this.fData.button && this.fData.button.text ? this.fData.button.text : '';
    },
  },
  components: { BetCoverClose, BetCoverBox, BetLotteryArrow },
  methods: {
    ...mapMutations(['setTaskReward', 'setFinishTask', 'setNewRegister']),
    isGrow(v) {
      return !!(v && /^5%\s+10%$/.test(v.text));
    },
    closeFun() {
      if (this.fData && typeof this.fData.close === 'function') {
        this.fData.close();
      }
      if (this.tData && typeof this.tData.close === 'function') {
        this.tData.close();
      }
      this.setTaskReward();
      this.setFinishTask();
      this.setNewRegister();
    },
    newerFun() {
      this.$router.push('/register');
      this.closeFun();
    },
    fixedFun() {
      if (this.fData && this.fData.button && typeof this.fData.button.fun === 'function') {
        this.fData.button.fun();
      }
      this.closeFun();
    },
    toPageFun() {
      if (this.show && /^(4|11)$/.test(this.tData.type)) {
        this.$router.push('/publish/1');
      } else if (this.show) {
        this.$router.push('/xsports/1');
      }
      this.closeFun();
    },
  },
};
</script>

<style lang="less">
.nb-bet-open-lottery .nb-bet-public-box-body {
  top: 1.6rem;
  .open-lottery-fixed-body { position: relative; width: 3.4rem; height: 3.16rem; margin: 0 auto; img { width: 100%; height: 100%; } }
  .open-lottery-random-body { position: relative; width: 3.4rem; height: 3.48rem; margin: 0 auto; img { width: 100%; height: 100%; } }
  .open-lottery-save-str { position: absolute; width: 100%; height: .28rem; left: 0; top: 2.06rem; font-size: .2rem; font-weight: 500; font-family: PingFangSC; letter-spacing: .0075rem; color: #ffffff; }
  .open-lottery-amt-box { position: absolute; width: 100%; height: .8rem; left: 0; top: .7rem; }
  .open-lottery-amt { height: 100%; line-height: .8rem; font-size: 1rem; font-family: PingFangSC; color: #cf8443; }
  .open-lottery-txt { height: 100%; font-size: .26rem; font-weight: 500; font-family: PingFangSC; color: #cf8443; }
  .open-lottery-random-btn { position: absolute; width: 2rem; height: .44rem; left: .7rem; top: 2.48rem; border-radius: .22rem; }
  .open-lottery-fixed-title, .open-lottery-fixed-detail { position: absolute; width: 100%; left: 0; }
  .open-lottery-fixed-title { height: .25rem; top: .38rem; font-size: .18rem; letter-spacing: .007rem; color: #b5661a; }
  .open-lottery-fixed-detail { height: 1.1rem; top: .64rem; font-size: .2rem; font-weight: 500; letter-spacing: .005rem; color: #b5661a; }
  .open-lottery-fixed-detail div { width: 100%; height: .28rem; svg { margin: 0 .04rem; } .normal span { font-family: PingFangSC; padding: 0 .02rem; color: #ff5353; } }
  .open-lottery-newer-btn { position: absolute; width: 2rem; height: .44rem; left: .7rem; top: 2.25rem; border-radius: .22rem; overflow: hidden; }
  .open-lottery-fixed-btn { position: absolute; width: 2rem; height: .44rem; left: .7rem; top: 2.16rem; border-radius: .22rem; overflow: hidden; }
  .open-lottery-fixed-btn .btm { width: 100%; height: 100%; font-size: .18rem; font-weight: 500; letter-spacing: .007rem; color: #fec54f; }
  .open-lottery-fixed-btn .tp { position: absolute; width: 100%; height: 100%; font-size: .18rem; font-weight: 500; letter-spacing: .007rem; color: #b5361a; }
  .open-lottery-close { position: absolute; left: 0; right: 0; bottom: -.4rem; height: .4rem; }
}
.horizontal .nb-bet-open-lottery .nb-bet-public-box-body { top: .4rem; }
</style>
