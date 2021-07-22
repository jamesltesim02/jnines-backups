<template>
  <div class="nb-bet-history-title flex-between" >
    <div class="history-title-left flex-start">
      <div class="title-left-text flex-between">
        <span>{{data.title}}</span>
        <bet-fast-flag class="title-left-fast" v-if="/^1\d(\d{2})?$/.test(data.ctp)" />
      </div>
      <live-flag class="title-left-live" :active="true" v-if="data.live" />
    </div>
    <div class="history-title-time flex-end">{{data.time}}</div>
  </div>
</template>

<script>
import BetFastFlag from '@/components/Bet/BetComps/BetFastFlag';
import LiveFlag from '@/components/Matchs/MatchItem/icons/LiveFlag';

export default {
  inheritAttrs: false,
  name: 'BetHistoryTitle',
  props: { data: Object },
  components: { BetFastFlag, LiveFlag },
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
.nb-bet-history-title {
  width: 100%;
  height: 38px;
  padding: 0 20px;
  .history-title-left {
    width: 470px;
    height: 100%;
    .title-left-fast { margin: 4px 0 0 4px; }
    .title-left-live { margin-top: 2px; }
    .title-left-text { font-size: 14px; user-select: none; }
  }
  .history-title-time { min-width: 145px; font-size: 12px; user-select: none; }
}
.black .nb-bet-history-title {
  .title-left-text { color: #ecebeb; }
  .history-title-time { color: #999; }
}
.white .nb-bet-history-title {
  .title-left-text { color: #909090; }
  .history-title-time { color: #999; }
}
</style>
