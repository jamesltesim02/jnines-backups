<template>
<perfect-scrollbar class="home-page">
  <div class="sliders">
    <focus-match
      :matchs="matchGroups[0].matchs"
      :loading="loading"
    />
    <banner />
  </div>
  <recent-match
    :matchs="matchGroups[1].matchs"
    :loading="loading"
  />
</perfect-scrollbar>
</template>
<script>
import appConfig from '@/config/business.config';
import { findmatchsList, findNearlyMatchList } from '@/api/pull';
import initOptions from '@/components/Matchs/initOptions';
import pushoperator from '@/components/Matchs/pushoperator';
import FocusMatch from '@/components/Home/FocusMatch';
import Banner from '@/components/Home/Banner';
import RecentMatch from '@/components/Home/RecentMatch';

export default {
  data() {
    return {
      delayRefreshTimer: null,
      matchGroups: [
        // 焦点赛事
        {
          matchs: [],
        },
        // 近期赛程
        {
          matchs: [],
        },
      ],
      loading: false,
    };
  },
  components: {
    FocusMatch,
    Banner,
    RecentMatch,
  },
  mounted() {
    this.queryMatchs();
    if (appConfig.matchsReloadTime) {
      this.delayRefreshTimer = setInterval(this.queryMatchs.bind(this), appConfig.matchsReloadTime);
    }
  },
  beforeDestroy() {
    this.$regpush({}, () => {});
    clearInterval(this.delayRefreshTimer);
  },
  methods: {
    async queryMatchs() {
      try {
        this.loading = true;
        const [fms, rms] = await Promise.all([
          findmatchsList({
            // TODO 合适的时候去掉体育类型限制
            sportID: 10,
            isFocus: 1,
            pageSize: 5,
            pageNum: 1,
          }),
          findNearlyMatchList({
            pageNum: 1,
            pageSize: 20,
          }),
        ]);

        this.matchGroups[0].matchs = initOptions(fms.filter(m => m.games.length > 0).map((m) => {
          const games = m.games.map(g => ({
            ...g,
            options: g.options.map(o => ({
              ...o,
              betBar: g.betBar,
              oddsStatus: 0,
            })),
          }));
          if (games.length === 1) {
            games[1] = {
              options: [undefined, undefined, undefined],
            };
          }
          return ({
            ...m,
            isQuickBet: true,
            games,
          });
        }));
        this.matchGroups[1].matchs = initOptions(rms);
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
.home-page {
  padding: 10px 12px 40px 10px;
  .sliders {
    display: flex;
    padding-bottom: 20px;
    margin: 0 -12px 0 -10px;
    .focus-match {
      width: 37.5%;
    }
    .banner {
      width: 62.5%;
    }
  }
}
</style>
