<template>
  <div class="xsports">
    <left-bar
      :sno="filterSno"
      :mid="filterMid"
      @update:sno="updateFilterSno"
      @update:mid="updateFilterMid"
    />
    <div class="main-content">
      <state-bar
        :state="state"
        @update:state="state => $router.replace(`/xsports/${state}`)"
        :counts="stateCounts"
      />
      <match-list
        v-if="state !== 3"
        :state="state"
        :sno="filterSno"
        :tno="filterMid"
        :sports="sports"
        :last-available-day="stateCounts.lastMatchDay"
      />
      <FinishedList
        v-else
        :sno="filterSno"
        :tno="filterMid"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { findCountOther } from '@/api/pull';
import appConfig from '@/config/business.config';
import LeftBar from '@/components/XSports/LeftBar';
import StateBar from '@/components/XSports/StateBar';
import MatchList from '@/components/XSports/MatchList';
import FinishedList from '@/components/XSports/MatchList/FinishedList';

export default {
  props: {
    state: {
      type: Number,
    },
  },
  data() {
    return {
      // 状态对应的比赛数量
      stateCounts: {},
      // 定时刷新的timer对象
      reloadTimer: null,
    };
  },
  computed: {
    ...mapState('xsports', ['activeSports', 'filterSno', 'filterMid']),
    sports() {
      return this.filterSno ? [this.filterSno] : this.activeSports;
    },
  },
  components: {
    LeftBar,
    StateBar,
    MatchList,
    FinishedList,
  },
  watch: {
    activeSports: 'loadStateCounts',
    filterSno: 'loadStateCounts',
    filterMid: 'loadStateCounts',
  },
  created() {
    this.loadStateCounts();
  },
  methods: {
    ...mapMutations('xsports', ['updateFilterSno', 'updateFilterMid']),
    /**
     * 查询每个状态的比赛数量
     */
    async loadStateCounts() {
      clearTimeout(this.reloadTimer);
      if (this.state === 3) {
        this.$router.replace('/xsports/1');
      }
      this.stateCounts = await findCountOther({
        sportIds: this.sports,
        tournamentID: this.filterMid,
      });
      if (appConfig.matchsReloadTime) {
        this.reloadTimer = setTimeout(
          this.loadStateCounts.bind(this),
          appConfig.matchsReloadTime,
        );
      }
    },
  },
};
</script>
<style lang="less">
.xsports {
  height: 100%;
  display: flex;
  .main-content {
    width: calc(100% - 250px);
    height: 100%;
    .x-match-list,
    .x-finished-list {
      height: calc(100% - 75px);
    }
  }
}
</style>
