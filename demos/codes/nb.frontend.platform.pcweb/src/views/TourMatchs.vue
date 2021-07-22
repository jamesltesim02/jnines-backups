<template>
<perfect-scrollbar class="tour">
  <loading-bar
    full
    v-if="loading"
  />
  <tournament :tournament="matchGroups[0]" />
  <no-more-bar
    full
    v-if="!hasMore"
  />
</perfect-scrollbar>
</template>
<script>
import appConfig from '@/config/business.config';
import { findmatchsList, findbyid } from '@/api/pull';
import pushoperator from '@/components/Matchs/pushoperator';
import initOptions from '@/components/Matchs/initOptions';
import Tournament from '@/components/Matchs/Tournament';

export default {
  props: ['sno', 'tourid'],
  data() {
    return {
      loading: false,
      delayRefreshTimer: null,
      matchGroups: [
        {
          tournamentName: '',
          matchs: [],
        },
      ],
    };
  },
  computed: {
    hasMore() {
      return this.loading || this.matchGroups[0].matchs.length > 0;
    },
  },
  components: {
    Tournament,
  },
  watch: {
    tourid() {
      this.queryMatch();
      if (appConfig.matchsReloadTime) {
        clearInterval(this.delayRefreshTimer);
        this.delayRefreshTimer = setInterval(this.queryMatch.bind(this), appConfig.matchsReloadTime);
      }
    },
  },
  mounted() {
    this.queryMatch();
    if (appConfig.matchsReloadTime) {
      this.delayRefreshTimer = setInterval(this.queryMatch.bind(this), appConfig.matchsReloadTime);
    }
  },
  beforeDestroy() {
    this.$regpush({}, () => {});
    clearInterval(this.delayRefreshTimer);
  },
  methods: {
    async queryMatch() {
      this.matchGroups = [{
        tournamentName: '',
        matchs: [],
      }];

      try {
        this.loading = true;
        const [tourname, matchs] = await Promise.all([
          findbyid(this.tourid),
          findmatchsList({
            sportID: this.sno,
            versionNum: 21,
            pageSize: 500,
            pageNum: 1,
            tournamentID: this.tourid,
          }),
        ]);

        initOptions(matchs);

        this.matchGroups = [{
          tournamentName: tourname,
          matchs,
        }];
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
.tour {
  padding: 0 12px 30px 7px;
}
</style>
