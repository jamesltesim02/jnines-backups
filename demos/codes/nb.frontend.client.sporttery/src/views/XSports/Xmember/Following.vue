<template>
  <list-page class="x-following" @scrollBottom="queryNext" >
    <nav-bar
      title="我的关注"
      slot="header"
    />
    <no-records
      v-if="!hasMore && !pageIndex"
      minify
    />
    <template v-else>
      <publish-item
        v-for="(p, i) in programs"
        :key="i"
        :data="p"
      />
    </template>
    <loading-bar v-if="loading" />
  </list-page>
</template>
<script>
import { mapState } from 'vuex';
import { getFocusPlans } from '@/api/activity';
import PublishItem from '@/components/Publish/PublishItem';

export default {
  data() {
    return {
      loading: false,
      hasMore: true,
      programs: [],
      pageIndex: 0,
    };
  },
  computed: {
    ...mapState('app', ['userinfo']),
  },
  components: { PublishItem },
  created() {
    this.queryPrograms();
  },
  methods: {
    async queryPrograms(pageIndex = 1) {
      try {
        this.loading = true;
        const result = await getFocusPlans({
          userId: this.userinfo.nbUser,
          pageIndex,
        });
        if (!result || !result.length) {
          this.hasMore = false;
          return;
        }
        this.programs.push(...result);
        this.pageIndex = pageIndex;
      } finally {
        this.loading = false;
      }
    },
    async queryNext() {
      if (!this.hasMore || this.loading) {
        return;
      }
      this.queryPrograms(this.pageIndex + 1);
    },
  },
};
</script>
<style lang="less">
.x-following .page-content { padding: 0 .1rem; .nb-publish-item { margin-top: .1rem; } }
</style>
