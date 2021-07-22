<template>
  <bet-cover-box class="nb-bet-jump-page white" :index="999999" :show="show" @close="closeFun" >
    <div class="nb-bet-jump-page-body" v-if="show" >
      <div class="top-red"></div>
      <div class="jump-title flex-center" v-if="data.title">{{data.title}}</div>
      <div class="jump-detail" v-if="data.detail" v-html="data.detail"></div>
      <div class="jump-button flex-center" v-if="data.btn">
        <v-touch class="body-btn-cancel flex-center" @tap="closeFun">{{$t('pageBet.think')}}</v-touch>
        <v-touch class="body-btn-submit flex-center" :style="{ background: btnColor }" @tap="jumpFun">{{data.btn || ''}}</v-touch>
      </div>
    </div>
    <div class="nb-bet-jump-page-close flex-center" v-if="show" ><bet-cover-close /></div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetCoverClose from '@/components/Bet/BetComps/BetCoverClose';
import BetCoverBox from '@/components/Bet/BetComps/BetCoverBox';

export default {
  inheritAttrs: false,
  name: 'NBJumpPage',
  data() {
    return { };
  },
  computed: {
    ...mapState('app', { jObj: state => state.jumpObjNew, theme: state => state.theme }),
    show() {
      return !!this.jObj;
    },
    data() {
      return this.jObj || { };
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
      if (this.show) {
        this.setJumpStatus(false);
      }
    },
  },
  components: { BetCoverClose, BetCoverBox },
  methods: {
    ...mapMutations('app', ['setJumpNewObject', 'setJumpStatus']),
    closeFun() {
      this.setJumpNewObject();
    },
    jumpFun() {
      if (this.data && this.data.url && this.data.replace) {
        this.$router.replace(this.data.url);
      } else if (this.data && this.data.url) {
        this.$router.push(this.data.url);
      }
      this.setJumpStatus(true);
      setTimeout(() => { this.closeFun(); }, 50);
    },
  },
};
</script>

<style lang="less">
.nb-bet-jump-page .nb-bet-public-box-body {
  top: 1.5rem;
  .nb-bet-jump-page-body { width: 3.3rem; min-height: 2.3rem; border-radius: .1rem; margin: 0 auto; overflow: hidden; background: #fff; }
  .top-red { width: 100%; height: .05rem; background: #ff5353; }
  .jump-title { width: 100%; height: .46rem; font-size: .18rem; font-weight: bold; border-bottom: .01rem solid #ecebeb; color: #303030; }
  .jump-detail { width: 100%; line-height: 1.7; letter-spacing: -.005rem; padding: .16rem .2rem; font-size: .14rem; color: #303030; }
  .jump-button { width: 100%; height: .5rem; font-size: .16rem; }
  .body-btn-cancel { width: 1.15rem; height: .5rem; background: #909090; color: #fff; }
  .body-btn-submit { width: 2rem; height: .5rem; color: #fff; }
  .nb-bet-jump-page-close { position: absolute; left: 0; right: 0; bottom: -.72rem; height: .72rem; }
}
.blue .nb-bet-jump-page .nb-bet-public-box-body {
  .nb-bet-jump-page-body { box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1); background: linear-gradient(to bottom, #3a393f, #333238); }
  .top-red { background: #53fffd; }
  .jump-title { border-bottom: .01rem solid #2e2f34; color: #ecebeb; }
  .jump-detail { color: #ecebeb; }
  .body-btn-cancel { background: #2e2f34; color: #909090; }
  .body-btn-submit { color: #fff; }
}
.horizontal .nb-bet-jump-page .nb-bet-public-box-body { top: .4rem; }
</style>
