<template>
  <div class="nb-reward-body" >
    <reward-task-box v-if="isTypeValid([1, 2])" >
      <div slot="title">{{$t('share.betTask')}}{{$t('share.maxGet')}}<span>888</span>{{$t('share.rmbCard')}}</div>
      <reward-task-detail type="1" :baseData="data" v-if="isTypeValid([1])" />
      <reward-task-detail type="2" :baseData="data" v-if="isTypeValid([2])" />
    </reward-task-box>
    <reward-task-box v-if="isTypeValid([3])" >
      <div slot="title">{{$t('share.publishTask')}}{{$t('share.willGet')}}<span>8</span>{{$t('share.rmbCard')}}</div>
      <reward-task-detail type="3" :baseData="data" v-if="isTypeValid([3])" />
    </reward-task-box>
    <reward-task-box v-if="isTypeValid([4, 11])" >
      <div slot="title">{{$t('share.followTask')}}{{$t('share.maxGet')}}<span>888</span>{{$t('share.rmbCard')}}</div>
      <reward-task-detail type="4" :baseData="data" v-if="isTypeValid([4])" />
      <reward-task-detail type="11" :baseData="data" v-if="isTypeValid([11])" />
    </reward-task-box>
    <reward-task-box v-if="isTypeValid([5])" >
      <div slot="title">{{$t('share.shineTask')}}{{$t('share.willGet')}}<span>8</span>{{$t('share.rmbCard')}}</div>
      <reward-task-detail type="5" :baseData="data" v-if="isTypeValid([5])" />
    </reward-task-box>
    <reward-task-box v-if="isTypeValid([12])" >
      <div slot="title">{{$t('share.weekTask')}}{{$t('share.willGet')}}<span>188</span>{{$t('share.rmbCard')}}</div>
      <reward-task-detail type="12" :baseData="data" v-if="isTypeValid([12])" />
    </reward-task-box>
  </div>
</template>

<script>
import RewardTaskBox from '@/components/Reward/RewardTaskBox';
import RewardTaskDetail from '@/components/Reward/RewardTaskDetail';

export default {
  inheritAttrs: false,
  name: 'RewardBody',
  props: { data: Array },
  components: { RewardTaskBox, RewardTaskDetail },
  methods: {
    isTypeValid(arr) {
      const dt = this.data && this.data.length ? this.data : [];
      for (let i = 0; i < arr.length; i += 1) {
        const fdt = dt.filter(v => v.activityType && `${v.activityType}` === `${arr[i]}`);
        const obj = fdt && fdt.length ? fdt[0] : { };
        if (/^\d+$/.test(obj.total) && /^\d+$/.test(obj.finish) && obj.total) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style lang="less">
.nb-reward-body { width: 100%; }
</style>
