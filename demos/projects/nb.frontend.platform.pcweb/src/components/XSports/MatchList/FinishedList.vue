<template>
  <div class="x-finished-list">
    <date-picker
      :available="true"
      v-model="queryDate"
      :range-to="-30"
    />
    <section class="list-panel">
      <loading-bar
        full
        v-if="loading"
      />
      <no-more-bar
        full
        v-if="!loading && (!matchs || !matchs.length)"
      />
      <perfect-scrollbar v-else>
        <match-list-item
          v-for="match in matchs"
          :key="match.matchID"
          :match="match"
        />
      </perfect-scrollbar>
    </section>
  </div>
</template>
<script>
import { findMacthScoreOther } from '@/api/pull';
import DatePicker from './DatePicker';
import MatchListItem from './MatchListItem';

export default {
  props: {
    sports: {},
  },
  data() {
    return {
      // 是否正在调用接口
      loading: false,
      // 比赛列表
      // 查询时间
      queryDate: new Date(),
      // 比赛列表
      matchs: [],
    };
  },
  watch: {
    queryDate() {
      this.queryFinishedMatchs();
    },
  },
  components: {
    DatePicker,
    MatchListItem,
  },
  mounted() {
    if (this.queryDate) {
      this.queryFinishedMatchs();
    }
  },
  methods: {
    queryFinishedMatchs() {
      clearTimeout(this.queryTimer);
      this.queryTimer = setTimeout(async () => {
        this.matchs = [];
        try {
          this.loading = true;
          this.matchs = await findMacthScoreOther({
            matchDay: this.$options.filters.dateFormat(this.queryDate, 'yyyyMMdd'),
            sportIds: this.sports,
          });
        } finally {
          this.loading = false;
        }
      }, 100);
    },
  },
};
</script>
<style lang="less">
.x-finished-list .list-panel {
  height: calc(100% - 80px);
  .ps {
    padding: 0 15px 0 12px;
    transition: all .25s ease-out;
  }
}
.dark .x-finished-list .x-item-games section li:hover {
  background-color: #3B3A41;
  border-color: #36353b;
  box-shadow: none;
}
</style>
