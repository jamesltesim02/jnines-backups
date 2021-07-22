<template>
  <bet-cover-box class="nb-bet-succ-fail" :index="999999" :show="show" @close="closeFun" >
    <div class="succ-fail-body" :class="bodyClass" v-if="show" >
      <div class="body-blank"></div>
      <div class="body-title flex-center">
        <span class="body-title-text flex-stast" v-if="/fail/i.test(title) && errObj && errObj.title">
          {{errObj.title}}{{errStr}}
        </span>
        <span class="body-title-text flex-stast" v-else-if="/(succ|fail)/i.test(title)">
          {{$t('pageBet.betAct')}}
          <span class="body-title-text-alert flex-center" :style="{ color: alertColor }">
            {{$t(`pageBet.bet${title}`)}}
          </span>{{errStr}}
        </span>
        <span class="body-title-text flex-stast" v-else>{{$t(`pageBet.bet${title}`)}}{{errStr}}</span>
        <span class="body-title-num" v-if="/^-1$/.test(type)" :style="{ color: alertColor }">{{t.count}}</span>
        <span class="body-title-sec" v-if="/^-1$/.test(type)">{{$t('pageBet.second')}}</span>
      </div>
      <div class="body-alert flex-center" v-if="/fail/i.test(title) && errObj && errObj.explan">{{errObj.explan}}</div>
      <div class="body-alert flex-center" v-else>{{$t('pageBet.betAlert')}}</div>
    </div>
    <div class="succ-fail-close flex-center" v-if="show" ><bet-cover-close /></div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetCoverClose from './BetComps/BetCoverClose';
import BetCoverBox from './BetComps/BetCoverBox';

export default {
  inheritAttrs: false,
  name: 'BetSuccFail',
  data() {
    return { bodyClass: 'succ-body', t: { timer: null, count: 0, cntMax: 5 } };
  },
  props: { show: Boolean, type: Number },
  computed: {
    ...mapState({ eCode: state => state.bet.errorCode }),
    ...mapState('app', { user: state => state.userinfo, theme: state => state.theme }),
    title() {
      let rt = /^[2389]$/.test(this.type) ? 'Succ' : 'Fail';
      rt = /^-1$/.test(this.type) ? 'Live' : rt;
      return /^-[2-9]$/.test(this.type) ? 'Proc' : rt;
    },
    errStr() {
      return /^[04567]$/.test(this.type) ? `(${this.eCode})` : '';
    },
    errObj() {
      let rtn = null;
      const errObjFromLan = this.$t('pageBet.betErrObj');
      if (/^[04567]$/.test(this.type) && this.eCode && errObjFromLan[this.eCode]) {
        rtn = errObjFromLan[this.eCode];
      }
      return rtn;
    },
    alertColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BET_ALERT_COLOR ? pSet.BLACK_BET_ALERT_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_BET_ALERT_COLOR ? pSet.BLUE_BET_ALERT_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_BET_ALERT_COLOR ? pSet.WHITE_BET_ALERT_COLOR : '#ff5353';
    },
  },
  watch: {
    show() {
      clearInterval(this.t.timer);
    },
    type() {
      this.changeClass();
    },
  },
  components: { BetCoverClose, BetCoverBox },
  methods: {
    ...mapMutations(['pushPopSlipList']),
    closeFun() {
      clearInterval(this.t.timer);
      if (/^-[1-9]$/.test(this.type)) {
        this.pushPopSlipList();
      }
      this.$emit('close', true);
    },
    changeClass() {
      const rt = /^[2389]$/.test(this.type) ? 'succ-body' : 'fail-body';
      this.bodyClass = /^-[1-9]$/.test(this.type) ? 'proc-body' : rt;
      clearInterval(this.t.timer);
      this.t.count = this.t.cntMax;
      this.t.timer = setInterval(() => {
        this.t.count = this.t.count > 0 ? this.t.count - 1 : this.t.cntMax;
      }, 1000);
    },
  },
  mounted() {
    this.changeClass();
  },
  beforeDestroy() {
    clearInterval(this.t.timer);
  },
};
</script>

<style lang="less">
.nb-bet-succ-fail .nb-bet-public-box-body {
  top: 1.6rem;
  .succ-fail-body {
    border-radius: .1rem;
    width: 3.15rem;
    height: 2.16rem;
    margin: 0 auto;
    .body-blank { width: 100%; height: 1.48rem; }
    .body-title { width: 100%; height: .3rem; }
    .body-title-text, .body-title-num, .body-title-text-alert { font-size: .2rem; height: 100%; }
    .body-title-text-alert { padding: 0 0 .01rem .02rem; }
    .body-title-sec { font-size: .12rem; padding-left: .1rem; }
    .body-alert { width: 100%; height: .24rem; font-size: .14rem; }
  }
  .succ-fail-close { position: absolute; left: 0; right: 0; bottom: -.72rem; height: .72rem; }
  .succ-body {
    background: url(./images/bet-success.png) no-repeat, #fff;
    background-size: 50% auto;
    background-position: center 15%;
  }
  .fail-body {
    background: url(./images/bet-failure.png) no-repeat, #fff;
    background-size: 50% auto;
    background-position: center 15%;
  }
  .proc-body {
    background: url(./images/bet-process.png) no-repeat, #fff;
    background-size: 50% auto;
    background-position: center 15%;
  }
}
.white .nb-bet-succ-fail .nb-bet-public-box-body {
  .body-title-text { color: #2E2F34; }
  .body-title-sec { color: #909090; }
  .body-alert { color: #909090; }
}
.black .nb-bet-succ-fail .nb-bet-public-box-body {
  .body-title-text { color: #2E2F34; }
  .body-title-sec { color: #909090; }
  .body-alert { color: #909090; }
}
.blue .nb-bet-succ-fail .nb-bet-public-box-body {
  .body-title-text { color: #2E2F34; }
  .body-title-sec { color: #909090; }
  .body-alert { color: #909090; }
}
.horizontal .nb-bet-succ-fail .nb-bet-public-box-body { top: .4rem; }
</style>
