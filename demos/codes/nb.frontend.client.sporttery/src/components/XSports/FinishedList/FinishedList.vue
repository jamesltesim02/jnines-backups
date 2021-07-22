<template>
  <div class="x-finished-list">
    <match-header
      v-for="match in matchs"
      :key="match.matchID"
      :match="match"
      @tap="toDetail(match)"
    />
    <div
      v-if="!this.matchs.length && !loading"
      class="no-more"
    >
      {{$t('message.noMoreRecords')}}
    </div>
    <loading-bar v-if="loading" />
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { findMacthScoreOther } from '@/api/pull';
import MatchHeader from '../MatchList/MatchHeader';

export default {
  props: ['queryDate'],
  data() {
    return {
      loading: false,
      matchs: [],
      queryTimer: null,
    };
  },
  computed: {
    ...mapState('xsports', ['activeSports']),
  },
  components: {
    MatchHeader,
  },
  watch: {
    queryDate() {
      this.queryFinishedMatchs();
    },
    activeSports() {
      this.queryFinishedMatchs();
    },
  },
  mounted() {
    if (this.queryDate) {
      this.queryFinishedMatchs();
    }
  },
  methods: {
    ...mapMutations('xsports', ['setFinishedDetail']),
    queryFinishedMatchs() {
      clearTimeout(this.queryTimer);
      this.queryTimer = setTimeout(async () => {
        this.matchs = [];
        this.loading = true;
        try {
          this.matchs = await findMacthScoreOther({
            matchDay: this.$options.filters.dateFormat(this.queryDate, 'yyyyMMdd'),
            sportIds: this.activeSports,
          });
        } finally {
          this.loading = false;
        }
      }, 100);
    },
    toDetail(detail) {
      this.setFinishedDetail(detail);
      this.$router.push(`/finished/${detail.matchID}`);
    },
  },
};
</script>
<style lang="less">
.x-finished-list {
  padding: 0 .1rem;
  .x-match-header {
    background-image: linear-gradient(to top, #f9f9f9, #ffffff);
    box-shadow: 0 10px 20px 0 rgba(223, 222, 223, 0.5);
    border-radius: 6px;
    border: 1px solid #ecebeb;
    padding-bottom: .1rem;
    margin-bottom: .06rem;
    .score-lose { opacity: 0.7; }
  }
}
.blue .x-finished-list .x-match-header {
  background-image: linear-gradient(to bottom, #3a393f, #333238);
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
  border: 1px solid #2e2f34;
  .score-lose { opacity: 0.5; }
}
</style>
