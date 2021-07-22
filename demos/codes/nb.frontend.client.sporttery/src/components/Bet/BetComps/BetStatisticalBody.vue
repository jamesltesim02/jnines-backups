<template>
  <div class="nb-bet-statistical-body">
    <div class="statistical-body-row flex-between" v-for="(item, id) in nData" :key="id">
      <div class="statistical-body-item flex-center" v-for="(v, k) in item" :key="k">
        {{v | NumFmt}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetStatisticalBody',
  props: {
    data: Array,
  },
  computed: {
    nData() {
      return this.data.filter(v => !!v[0]);
    },
  },
};
</script>

<style lang="less">
.white .nb-bet-statistical-body .statistical-body-row {
  background: linear-gradient(to bottom, #F9F9F9, #FFFFFF);
  .statistical-body-item {
    color: #3A3A3A;
    border-right: .01rem solid #EBE9E9;
  }
  .statistical-body-item:first-child {
    color: #6b6b6b;
  }
  .statistical-body-item:last-child {
    border-right: none;
  }
}
.horizontal .white .report-page-left .nb-bet-statistical-body {
  border-right: .01rem solid #EBE9E9;
}
.black .nb-bet-statistical-body .statistical-body-row {
  background: linear-gradient(to bottom, #2a292f, #29292e);
  .statistical-body-item {
    color: #bababa;
    border-right: .01rem solid #2e2f34;
  }
  .statistical-body-item:first-child {
    color: #909090;
  }
  .statistical-body-item:last-child {
    border-right: none;
  }
}
.horizontal .black .report-page-left .nb-bet-statistical-body {
  border-right: .01rem solid #2e2f34;
}
.blue .nb-bet-statistical-body .statistical-body-row {
  background: linear-gradient(to bottom, #2a292f, #29292e);
  .statistical-body-item {
    color: #bababa;
    border-right: .01rem solid #2e2f34;
  }
  .statistical-body-item:first-child {
    color: #909090;
  }
  .statistical-body-item:last-child {
    border-right: none;
  }
}
.horizontal .blue .report-page-left .nb-bet-statistical-body {
  border-right: .01rem solid #2e2f34;
}
.nb-bet-statistical-body {
  width: 3.75rem;
  .statistical-body-row {
    width: 100%;
    height: .22rem;
    margin-top: .02rem;
    .statistical-body-item {
      width: 100%;
      height: 100%;
      font-size: .12rem;
    }
  }
}
</style>
