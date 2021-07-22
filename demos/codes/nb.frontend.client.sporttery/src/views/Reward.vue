<template>
  <list-page class="reward" v-if="!horizScreen" >
    <nav-bar :title="$t('share.rewardDay')" slot="header" />
    <reward-head :data="data" />
    <reward-body :data="data" />
  </list-page>
  <div class="reward-horiz" v-else >
    <list-page class="reward-horiz-left" >
      <nav-bar :title="$t('share.rewardDay')" slot="header" />
      <reward-head :data="data" />
    </list-page>
    <list-page class="reward-horiz-right" >
      <reward-body :data="data" />
    </list-page>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { findDayTaskInfo } from '@/api/activity';
import NavBar from '@/components/common/NavBar';
import RewardHead from '@/components/Reward/RewardHead';
import RewardBody from '@/components/Reward/RewardBody';

export default {
  data() {
    return { data: [], qt: 0 };
  },
  computed: {
    ...mapState({ tData: state => state.bet.taskReward }),
    ...mapState('app', ['userinfo', 'horizScreen']),
    isLogin() {
      return !!(this.userinfo && this.userinfo.token && this.userinfo.nbUser);
    },
    taskList() {
      const dt = window.NBConfig.TASK_ID_LIST;
      return dt && dt.length ? dt.join(',') : '';
    },
  },
  watch: {
    tData(n, o) {
      if (!n && o) {
        this.getDayTask();
      }
    },
  },
  components: { NavBar, RewardHead, RewardBody },
  methods: {
    async getDayTask() {
      if (this.isLogin && this.taskList && Date.now() - this.qt > 500) {
        this.qt = Date.now();
        try {
          const dt = await findDayTaskInfo({ userId: this.userinfo.nbUser, taskId: this.taskList });
          this.data = dt && dt.length ? dt : [];
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
  mounted() {
    [this.data, this.qt] = [[], 0];
    this.getDayTask();
  },
};
</script>
<style lang="less">
.horizontal .reward-horiz { width: 100%; height: 100%; }
.reward-horiz-left { width: 3.75rem; float: left; }
.reward-horiz-right { padding-top: .05rem; float: right; }
.reward, .reward-horiz-left {
  .nav-bar {
    border-bottom: solid 1px #ecebeb;
    z-index: 2;
    .nav-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
  }
}
.blue .reward, .blue .reward-horiz-left {
  .nav-bar { border-bottom: solid 1px #2e2f34; }
}
</style>
