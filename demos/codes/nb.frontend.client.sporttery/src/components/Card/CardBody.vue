<template>
  <div class="nb-card-body" >
    <div class="nb-card-item flex-center" v-for="(v, k) in data" :key="k">
      <bet-comp-card :data="v" :valid="isCardValid(v)" @tap="selectCardFun" >
        <div class="use-now flex-start" v-if="!state" >
          <span>{{$t('share.useNow')}}</span>
          <span>&gt;&gt;</span>
        </div>
        <div class="used-card flex-start" v-else >
          <span class="flex-center" v-if="/^2$/.test(v.state)">{{$t('share.isUsed')}}</span>
          <span class="flex-center" v-else>{{$t('share.totNow')}}</span>
        </div>
      </bet-comp-card>
    </div>
    <div class="nb-no-card-item flex-center" v-if="!data || !data.length">
      <span class="flex-center" v-if="!state">{{$t('share.noValidCards')}}</span>
      <span class="flex-center" v-else>{{$t('share.noUsedCards')}}</span>
    </div>
  </div>
</template>

<script>
import BetCompCard from '@/components/Bet/BetCompCard';

export default {
  inheritAttrs: false,
  name: 'CardBody',
  props: { data: Array, state: Number },
  components: { BetCompCard },
  methods: {
    getCompDate(v) {
      return `${v && v.endDate ? v.endDate : ''}`.replace(/\.\d+$/, '');
    },
    getDateValid(v) {
      const dtStr = this.getCompDate(v).replace(/-/g, '/');
      return !!(dtStr && new Date(dtStr).getTime() - new Date().getTime() > 0);
    },
    isCardValid(v) {
      return !!(/^1$/.test(v.state) && this.getDateValid(v));
    },
    selectCardFun(v) {
      if (/^1$/.test(v.state)) {
        this.$router.push(/^1$/.test(v.couponType) ? 'publish/1' : '/xsports/1');
      }
    },
  },
};
</script>

<style lang="less">
.nb-card-body {
  width: 100%;
  .nb-card-item { width: 100%; margin-top: .1rem; }
  .use-now { width: 100%; height: .17rem; font-size: .12rem; font-family: PingFangSC; color: #fff; span { padding-left: .05rem; } }
  .used-card { width: 100%; height: .2rem; padding-left: .1rem; span { height: 100%; padding: 0 .12rem; font-size: .12rem; border-radius: .1rem; background: #ffffff; color: #666; } }
  .nb-no-card-item { width: 100%; height: .6rem; font-size: .14rem; color: #999999; }
}
.blue .nb-card-body {
  .nb-no-card-item { color: #909090; }
  .use-now { color: #fff; }
}
</style>
