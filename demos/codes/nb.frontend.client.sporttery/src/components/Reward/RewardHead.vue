<template>
  <div class="reward-head flex-start">
    <div class="reward-head-img flex-center" >
      <icon-head :src="head" />
    </div>
    <div class="reward-head-box flex-between-col">
      <div class="reward-head-tp flex-start">{{taskTitle}}</div>
      <div class="reward-head-btm flex-start">{{taskDetail}}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import IconHead from '@/components/XSports/Xmember/icons/IconHead';

export default {
  inheritAttrs: false,
  name: 'RewardHead',
  props: { data: Array },
  computed: {
    ...mapState('app', ['userinfo']),
    head() {
      return this.userinfo && this.userinfo.header ? this.userinfo.header : '1';
    },
    baseData() {
      return this.data && this.data.length ? this.data : [];
    },
    totalTask() {
      let tNum = 0;
      for (let i = 0; i < this.baseData.length; i += 1) {
        const v = this.baseData[i] ? this.baseData[i] : { };
        const vPass = /^([12345]|11)$/.test(v.activityType) && /^\d+$/.test(v.total) && v.total;
        tNum += vPass ? 1 : 0;
      }
      return tNum;
    },
    totalFinish() {
      let tNum = 0;
      for (let i = 0; i < this.baseData.length; i += 1) {
        const v = this.baseData[i] ? this.baseData[i] : { };
        const vPass = /^([12345]|11)$/.test(v.activityType) && /^\d+$/.test(v.total) && v.total;
        tNum += vPass && v.finish >= v.total ? 1 : 0;
      }
      return tNum;
    },
    taskTitle() {
      return `${this.$t('share.tFinish')}${this.totalFinish}/${this.totalTask}${this.$t('share.task')}`;
    },
    taskDetail() {
      const dt = this.baseData.filter(v => v && /^12$/.test(v.activityType));
      const obj = dt && dt.length ? dt[0] : { };
      return obj.total ? `${this.$t('share.finishWeek')}${obj.total}${this.$t('share.wTaskStr')}` : '';
    },
  },
  components: { IconHead },
};
</script>

<style lang="less">
.reward-head {
  width: 100%;
  height: .8rem;
  padding: .1rem .15rem;
  background: #fff;
  .reward-head-img { width: .6rem; height: .6rem; border-radius: 100%; margin-right: .1rem; img { width: 100%; height: 100%; } }
  .reward-head-box { width: 2.7rem; height: .6rem; padding: .05rem 0; }
  .reward-head-tp { width: 100%; height: .32rem; font-size: .16rem; font-weight: 500; color: #2e2f34; }
  .reward-head-btm { width: 100%; height: .18rem; font-size: .12rem; color: #666; }
}
.blue .reward-head {
  box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
  background: linear-gradient(to bottom, #3a393f, #333238);
  .reward-head-tp { color: #ecebeb; }
  .reward-head-btm { color: #909090; }
}
</style>
