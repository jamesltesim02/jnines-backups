<template>
<loading-bar
  full
  v-if="loading"
/>
<perfect-scrollbar
  v-else
  class="matchs"
>
  <tournament
    v-for="t in matchGroups"
    :key="t.tournamentID"
    :tournament="t"
  />
  <no-more-bar
    full
    v-if="!hasMore"
  />
</perfect-scrollbar>
</template>
<script>
import appConfig from '@/config/business.config';
import { findmatchsList } from '@/api/pull';
import pushoperator from '@/components/Matchs/pushoperator';
import initOptions from '@/components/Matchs/initOptions';
import Tournament from '@/components/Matchs/Tournament';

export default {
  props: ['sno', 'state'],
  data() {
    return {
      delayRefreshTimer: null,
      // 联赛id到名称映射
      toursMapping: {},
      // 按联赛分组后的数据
      matchGroups: [],
      loading: false,
      loaded: false,
    };
  },
  computed: {
    hasMore() {
      return this.loading || this.matchGroups.length > 0;
    },
  },
  components: {
    Tournament,
  },
  watch: {
    state() {
      if (typeof this.state === 'number') {
        this.initQuery();
        if (appConfig.matchsReloadTime) {
          clearInterval(this.delayRefreshTimer);
          this.delayRefreshTimer = setInterval(this.initQuery.bind(this), appConfig.matchsReloadTime);
        }
      }
    },
  },
  create() {
    this.setSnoAndState({
      sno: this.sno,
      newState: this.state,
    });
  },
  mounted() {
    this.initQuery();
    if (appConfig.matchsReloadTime) {
      this.delayRefreshTimer = setInterval(this.initQuery.bind(this), appConfig.matchsReloadTime);
    }
  },
  beforeDestroy() {
    this.$regpush({}, () => {});
    clearInterval(this.delayRefreshTimer);
  },
  methods: {
    initQuery() {
      this.matchGroups = [];
      // 查询比赛信息
      this.queryMatchs();
    },
    async queryMatchs() {
      this.loading = true;
      try {
        const matchs = await findmatchsList({
          sportID: this.sno,
          matchState: this.state,
          // 21 表示为PC (接口将会以联赛和比赛时间卫队来排序)
          versionNum: 21,
          pageSize: 500,
          pageNum: 1,
        });
        if (!matchs || !matchs.length) {
          return;
        }
        let currentTour = null;
        matchs.forEach((m) => {
          if (!currentTour || currentTour.tournamentID !== m.tournamentID) {
            currentTour = this.matchGroups.find(t => m.tournamentID === t.tournamentID);
            if (!currentTour) {
              currentTour = {
                tournamentID: m.tournamentID,
                tournamentName: m.tournamentName,
                tournamentLevel: m.tournamentLevel,
                sportID: m.sportID,
                matchs: [],
              };
              this.matchGroups.push(currentTour);
            }
          }

          initOptions([m]);

          currentTour.matchs.push(m);
        });
      } finally {
        this.$nextTick(() => {
          pushoperator(this);
        });
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="less">
.matchs {
  padding: 0 12px 30px 7px;
}
</style>
