<template>
  <list-page
    class="x-my-programs"
    @scrollBottom="toNext"
  >
    <nav-bar
      title="我的方案"
      slot="header"
    />
    <programs
      :title="`最新方案${activePrograms.length ? `(${activePrograms.length})` : ''}`"
      :programs="activePrograms"
      :loading="loading"
    />
    <programs
      title="历史方案"
      :programs="historyPrograms"
      showable
      :loading="loading"
    />
    <loading-bar v-if="loading" />
  </list-page>
</template>
<script>
import { mapState } from 'vuex';
import { getMemberByUser, getHistoryPlansByUser } from '@/api/activity';
import Programs from '@/components/XSports/Xmember/Specialist/Programs';

export default {
  data() {
    return {
      loading: false,
      activePrograms: [],
      historyPrograms: [],
      pageIndex: 1,
      hasMore: true,
    };
  },
  computed: {
    ...mapState('app', ['userinfo']),
  },
  components: {
    Programs,
  },
  created() {
    this.loadSpecialist();
    this.queryHistoryProgram();
  },
  methods: {
    async loadSpecialist() {
      const result = await getMemberByUser({
        userId: this.userinfo.nbUser,
      });
      this.activePrograms = result.activePlans || [];
    },
    async queryHistoryProgram(pageIndex = 1) {
      try {
        this.loading = true;
        const programs = await getHistoryPlansByUser({
          userId: this.userinfo.nbUser,
          pageIndex,
        });
        if (!programs || !programs.length) {
          this.hasMore = false;
          return;
        }
        this.pageIndex = pageIndex;
        this.historyPrograms.push(...programs);
      } finally {
        this.loading = false;
      }
    },
    toNext() {
      if (this.hasMore && !this.loading) {
        this.queryHistoryProgram(this.pageIndex + 1);
      }
    },
  },
};
</script>
