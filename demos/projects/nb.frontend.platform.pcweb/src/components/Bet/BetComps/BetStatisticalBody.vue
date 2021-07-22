<template>
  <div class="nb-bet-statistical-body">
    <div class="statistical-body-row flex-between" v-for="(item, id) in nData" :key="id">
      <div class="statistical-body-item flex-center" v-for="(v, k) in item" :key="k">{{changeType(v)}}</div>
    </div>
  </div>
</template>

<script>
import { changeNumType } from '@/utils/betUtils';

export default {
  inheritAttrs: false,
  name: 'BetStatisticalBody',
  props: { data: Array },
  computed: {
    nData() {
      return this.data.filter(v => !!v[0]);
    },
  },
  methods: {
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
  },
};
</script>

<style lang="less">
.nb-bet-statistical-body {
  width: 100%;
  .statistical-body-row {
    width: 100%;
    height: 26px;
    margin-top: 1px;
    .statistical-body-item { width: 100%; height: 100%; font-size: 14px; }
    .statistical-body-item:last-child { border-right: none; }
  }
}
.black .nb-bet-statistical-body .statistical-body-row {
  background: linear-gradient(to bottom, #2a292f, #29292e);
  .statistical-body-item { color: #bababa; border-right: 1px solid #2e2f34; }
  .statistical-body-item:first-child { color: #909090; }
}
.white .nb-bet-statistical-body .statistical-body-row {
  background: linear-gradient(to bottom, #F9F9F9, #FFFFFF);
  .statistical-body-item { color: #3A3A3A; border-right: 1px solid #f5f5f5; }
  .statistical-body-item:first-child { color: #6b6b6b; }
}
</style>
