<template>
  <div class="nb-bet-statistical-head">
    <div class="statistical-head-list flex-between">
      <div class="statistical-head-item flex-center" v-for="(v, k) in data" :key="k">{{v}}</div>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetStatisticalHead',
  props: {
    data: Array,
  },
};
</script>

<style lang="less">
.white .nb-bet-statistical-head {
  background: #FFF;
  .statistical-head-list {
    border-top: .01rem solid #EBE9E9;
    background: linear-gradient(to bottom, #F9F9F9, #FFFFFF);
    .statistical-head-item { color: #6b6b6b; }
  }
}
.horizontal .white .report-page-left .nb-bet-statistical-head {
  border-right: .01rem solid #EBE9E9;
}
.black .nb-bet-statistical-head {
  background: #28272d;
  .statistical-head-list {
    background: linear-gradient(to bottom, #2a292f, #29292e);
    .statistical-head-item { color: #6b6b6b; }
  }
}
.horizontal .black .report-page-left .nb-bet-statistical-head {
  border-right: .01rem solid #2e2f34;
}
.blue .nb-bet-statistical-head {
  background: #28272d;
  .statistical-head-list {
    background: linear-gradient(to bottom, #2a292f, #29292e);
    .statistical-head-item { color: #6b6b6b; }
  }
}
.horizontal .blue .report-page-left .nb-bet-statistical-head {
  border-right: .01rem solid #2e2f34;
}
.nb-bet-statistical-head {
  width: 3.75rem;
  .statistical-head-list {
    width: 100%;
    height: .26rem;
    .statistical-head-item {
      width: 100%;
      height: 100%;
      font-size: .14rem;
    }
  }
}
</style>
