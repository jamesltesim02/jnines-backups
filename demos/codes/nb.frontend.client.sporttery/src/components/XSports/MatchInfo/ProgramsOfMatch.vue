<template>
  <no-records v-if="!hasMore && !pageIndex" />
  <div
    v-else
    class="x-programs-of-match"
  >
    <publish-item v-for="(v, k) in programs" :key="k" :data="v" />
    <loading-bar v-if="loading" />
  </div>
</template>
<script>
import { getPlansByMatchId } from '@/api/activity';
import PublishItem from '@/components/Publish/PublishItem';

export default {
  props: {
    matchInfo: {
      default: {},
    },
  },
  data() {
    return {
      loading: false,
      hasMore: true,
      programs: [],
      pageIndex: 0,
    };
  },
  components: { PublishItem },
  created() {
    this.queryPrograms();
  },
  methods: {
    async queryPrograms(pageIndex = 1) {
      try {
        this.loading = true;
        const result = await getPlansByMatchId({
          matchId: this.matchInfo.matchID,
          pageIndex,
        });
        if (!result || !result.length) {
          this.hasMore = false;
          return;
        }
        this.pageIndex = pageIndex;
        this.programs.push(...result);
      } finally {
        this.loading = false;
      }
    },
    scrollBottom() {
      if (!this.hasMore || this.loading) {
        return;
      }

      this.queryPrograms(this.pageIndex + 1);
    },
  },
};
</script>
<style lang="less">
.x-programs-of-match {
  padding: .15rem .1rem 0;
  .nb-publish-item { margin-bottom: .15rem; }
  .nb-publish-item:last-child { margin: 0; }
}
</style>
