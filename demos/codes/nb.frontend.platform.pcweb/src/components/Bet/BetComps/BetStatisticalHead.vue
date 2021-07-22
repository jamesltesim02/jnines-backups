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
  props: { data: Array },
};
</script>

<style lang="less">
.nb-bet-statistical-head {
  width: 100%;
  .statistical-head-list { width: 100%; height: 32px; .statistical-head-item { width: 100%; height: 100%; font-size: 16px; } }
}
.black .nb-bet-statistical-head {
  background: #28272d;
  .statistical-head-list { background: linear-gradient(to bottom, #2a292f, #29292e); .statistical-head-item { color: #6b6b6b; } }
}
.white .nb-bet-statistical-head {
  background: #FFF;
  .statistical-head-list { border-bottom: 1px solid #EBE9E9; background: linear-gradient(to bottom, #F9F9F9, #FFFFFF); .statistical-head-item { color: #6b6b6b; } }
}
</style>
