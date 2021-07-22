<template>
  <v-touch tag="div" class="nb-bet-history-title flex-between" @tap="eFun">
    <div class="history-title-left flex-between">
      <span class="title-left-text">{{data.title}}</span>
      <live-flag class="title-left-live" :active="true" v-if="data.live" />
    </div>
    <div class="history-title-time">{{data.time}}</div>
    <bet-arrow-box v-if="data.show" type="up" />
    <bet-arrow-box v-else type="down" />
  </v-touch>
</template>

<script>
import BetArrowBox from './BetArrowBox';
import LiveFlag from '@/components/common/LiveFlag';

export default {
  inheritAttrs: false,
  name: 'BetHistoryTitle',
  props: {
    data: Object,
  },
  components: {
    BetArrowBox,
    LiveFlag,
  },
  methods: {
    eFun() {
      const dt = this.data;
      dt.show = !dt.show;
      dt.detail = false;
      this.$emit('change', dt);
    },
  },
};
</script>

<style lang="less">
.white .nb-bet-history-title {
  .title-left-text {
    color: #909090;
  }
  .history-title-time {
    color: #999;
  }
}
.black .nb-bet-history-title {
  .title-left-text {
    color: #bababa;
  }
  .history-title-time {
    color: #999;
  }
}
.nb-bet-history-title {
  width: 3.51rem;
  height: .37rem;
  padding: 0 .12rem;
  .history-title-left {
    width: .86rem;
    height: 100%;
    .title-left-text {
      font-size: .14rem;
      user-select: none;
    }
  }
  .history-title-time {
    padding-right: .5rem;
    font-size: .11rem;
    user-select: none;
  }
}
</style>
