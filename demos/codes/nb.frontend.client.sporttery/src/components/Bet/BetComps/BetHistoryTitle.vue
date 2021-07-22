<template>
  <div class="nb-bet-history-title flex-between" v-if="!/^3$/.test(bettingMode)" >
    <div class="history-title-left flex-between">
      <div class="title-left-text flex-between">
        <span>{{data.title}}</span>
        <bet-fast-flag class="title-left-fast" v-if="/^1\d(\d{2})?$/.test(data.ctp)" />
      </div>
      <live-flag class="title-left-live" :active="true" v-if="data.live" />
    </div>
    <div class="history-title-time">{{data.time}}</div>
  </div>
  <div class="nb-bet-history-title flex-between" v-else >
    <div class="history-title-left flex-start">
      <span>{{data.nTitle}}</span>
      <bet-fast-flag class="title-left-fast" v-if="/^1\d(\d{2})?$/.test(data.ctp)" />
    </div>
    <div class="history-title-middle flex-between">
      <div class="history-title-time flex-start">{{data.time.replace(/:\d{2}$/, '')}}</div>
      <span class="history-title-slip flex-end">{{slipNumStr}}</span>
      <span class="history-title-hidden copy-target">{{data.mstid}}</span>
      <span class="history-title-hidden copy-alert">{{$t('pageBet.slipAlt')}}</span>
    </div>
    <button class="history-title-btn copy-flag">{{$t('pageBet.slipBtn')}}</button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LiveFlag from '@/components/common/LiveFlag';
import BetFastFlag from '@/components/Bet/BetComps/BetFastFlag';

export default {
  inheritAttrs: false,
  name: 'BetHistoryTitle',
  props: { data: Object },
  computed: {
    ...mapState('app', ['bettingMode']),
    slipNumStr() {
      return `${this.$t('pageBet.slipStr')}${this.data.mstid}`.slice(0, 20);
    },
  },
  components: { LiveFlag, BetFastFlag },
  methods: {
    eFun() {
      const dt = this.data;
      dt.show = !dt.show;
      for (let i = 0; i < dt.bets.length; i += 1) {
        dt.bets[i].detail = false;
      }
      this.$emit('change', dt);
    },
  },
};
</script>

<style lang="less">
.white .nb-bet-history-title {
  .history-title-left { color: #909090; }
  .title-left-text { color: #909090; }
  .history-title-time { color: #999; }
  .history-title-middle .history-title-time { color: #bbbbbb; }
  .history-title-slip { color: #bbbbbb; }
  .history-title-btn { color: #999999; }
}
.black .nb-bet-history-title {
  .history-title-left { color: #bababa; }
  .title-left-text { color: #bababa; }
  .history-title-time { color: #999; }
  .history-title-middle .history-title-time { color: #bbbbbb; }
  .history-title-slip { color: #bbbbbb; }
  .history-title-btn { color: #999999; }
}
.blue .nb-bet-history-title {
  .history-title-left { color: #bababa; }
  .title-left-text { color: #bababa; }
  .history-title-time { color: #999; }
  .history-title-middle .history-title-time { color: #bbbbbb; }
  .history-title-slip { color: #bbbbbb; }
  .history-title-btn { color: #999999; }
}
.nb-bet-history-title {
  position: relative;
  width: 100%;
  height: .37rem;
  padding: 0 .12rem;
  z-index: 1;
  .history-title-left { width: .92rem; height: 100%; font-size: .16rem; font-weight: bold; }
  .title-left-fast { margin: .03rem 0 0 .04rem; }
  .title-left-text { font-size: .14rem; user-select: none; }
  .history-title-time { padding-right: .02rem; font-size: .11rem; user-select: none; }
  .history-title-middle { position: absolute; width: 100%; height: 100%; top: 0; left: 0; padding: 0 .54rem; z-index: 2; }
  .history-title-btn { position: absolute; width: .54rem; height: 100%; top: 0; right: 0; z-index: 3; font-size: .11rem; font-weight: 500; }
  .history-title-slip { width: 1.48rem; height: 100%; font-size: .12rem; }
  .history-title-hidden { display: none; }
}
</style>
