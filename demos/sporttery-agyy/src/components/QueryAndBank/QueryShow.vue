<template>
  <div class="query-show flex-between">
    <div class="show-title flex-start">
      <span class="sel-text" v-if="data">{{data}}</span>
      <span class="sel-def" v-else>- - -</span>
    </div>
    <div class="show-end flex-center">{{$t('withBank.cMoney')}}</div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'QueryShow',
  props: {
    data: Number,
  },
};
</script>

<style lang="less">
.white .query-show {
  border: .01rem solid #EBE9E9;
  background: #fff;
  .show-title {
    .sel-text {
      color: #ff5353;
    }
    .sel-def {
      color: #909090;
    }
  }
  .show-end {
    border-left: .01rem solid #EBE9E9;
    color: #909090;
  }
}
.black .query-show {
  border: .01rem solid #3a3a3a;
  background: #232227;
  .show-title {
    .sel-text {
      color: #ff5353;
    }
    .sel-def {
      color: #909090;
    }
  }
  .show-end {
    border-left: .01rem solid #2e2f34;
    color: #909090;
  }
}
.query-show {
  width: 3.5rem;
  height: .44rem;
  border-radius: .04rem;
  .show-title {
    width: 2.42rem;
    height: 100%;
    padding: 0 .15rem;
    .sel-text, .sel-def {
      font-size: .14rem;
      font-family: PingFangSC;
    }
  }
  .show-end {
    width: 1.08rem;
    height: 100%;
    font-size: .14rem;
    font-weight: 500;
    font-family: PingFangSC;
  }
}
</style>
