<template>
  <div>
    <div
      v-if="matchs && matchs.length"
      class="x-match-list"
      :class="{ query: state === 0 }"
    >
      <match-item
        v-for="match in matchs"
        :key="match.matchID"
        :match="match"
      />
    </div>
    <div
      v-else-if="!hasMore && !loading"
      class="x-match-list no-more"
    >
      <cimg src="./images/no-more.png" />
      <p>
        比赛正在准备中 <br >
        请耐心等待
      </p>
    </div>
    <loading-bar v-if="loading" />
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { findmatchsListOther } from '@/api/pull';
import appConfig from '@/config/business.config';
import pushoperator from './pushoperator';
import MatchItem from './MatchItem';

export default {
  props: {
    // 查询条件
    state: {
      type: Number,
      default: 1,
    },
    queryDate: {},
  },
  data() {
    return {
      // 是否正在调用接口
      loading: false,
      // 是否有更多数据
      hasMore: true,
      // 每页条数
      pageSize: 10,
      // 当前页码
      pageNum: 1,
      // 比赛列表
      matchs: [],
      // 查询截流timer(防止快速修改日期发起无用查询, 每次查询被延迟处理100毫秒)
      throttlingTimer: null,
      // 已触发查询次数
      queryedCount: 0,
    };
  },
  computed: {
    ...mapState('xsports', ['matchFilter']),
    ...mapState('app', ['matchListUpdateFlag']),
  },
  components: {
    MatchItem,
  },
  watch: {
    state: 'resetAndQuery',
    queryDate: 'resetAndQuery',
    matchFilter: 'resetAndQuery',
    matchListUpdateFlag: 'resetAndQuery',
  },
  created() {
    // 查询比赛列表
    this.queryMatchs();
  },
  methods: {
    ...mapMutations('app', ['refreshMatchListToken']),
    /**
     * 重置条件并重新查询条件变化时调用
     */
    resetAndQuery() {
      this.pageNum = 1;
      this.queryedCount = 0;
      this.hasMore = true;
      this.queryMatchs();
    },
    /**
     * 按当前条件查询下一页比赛
     */
    async nextPage() {
      if (!this.hasMore || this.loading || !this.queryedCount) {
        return;
      }
      await this.queryMatchs({ pageNum: this.pageNum + 1 });
    },
    /**
     * 查询
     */
    async queryMatchs(condition = {}) {
      clearTimeout(this.throttlingTimer);
      this.throttlingTimer = setTimeout(async () => {
        // 查询条件
        const params = {
          matchState: this.state,
          matchDay: this.$options.filters.dateFormat(this.queryDate, 'yyyyMMdd'),
          // sportIds: this.activeSports,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          versionNum: 1,
          ...condition,
        };

        // 添加查询条件
        const { all, sports, tours } = this.matchFilter;
        if (!all) {
          if (sports.length) {
            params.sportIds = sports;
          }
          if (tours.length) {
            params.tids = tours;
          }
        }

        if (params.pageNum === 1) {
          this.matchs = [];
        }
        try {
          this.loading = true;
          this.queryedCount += 1;
          // 查询比赛列表
          const matchs = await findmatchsListOther(params);
          if (!matchs || !matchs.length || matchs.length < this.pageSize) {
            this.hasMore = false;
          }
          if (!matchs || !matchs.length) {
            return;
          }
          matchs.forEach((m) => {
            if (m.games && m.games.length) {
              // 对每场比赛的每个option进行状态初始化处理
              m.games.forEach((g) => {
                g.options.forEach((o) => {
                  o.betBar = g.betBar;
                  o.oddsUpper = false;
                });
              });
            }
          });
          this.matchs.push(...matchs);
          this.pageNum = params.pageNum;
        } finally {
          this.loading = false;
          this.registerPush();
          // 定时刷新页面
          if (appConfig.matchsReloadTime) {
            clearTimeout(this.reloadTimer);
            this.reloadTimer = setTimeout(() => {
              this.refreshMatchListToken();
              this.resetAndQuery();
            }, appConfig.matchsReloadTime);
          }
        }
      }, 100);
    },
    /**
     * 推送消息处理
     */
    registerPush() {
      this.$regpush(
        {
          Matchs: (!this.matchs || !this.matchs.length)
            ? []
            : this.matchs.map(m => ({
              Mids: [m.matchID],
              GameTypes: m.games.map(g => g.gameType),
              GroupType: 0,
            })),
        },
        (msg) => {
          pushoperator(this, msg);
        },
      );
    },
  },
  beforeDestroy() {
    clearTimeout(this.reloadTimer);
    this.$regpush({}, () => {});
  },
};
</script>
<style lang="less">
.x-match-list {
  width: 3.75rem;
  padding: 0 .12rem;
  .x-match-item {
    margin-top: .1rem;
  }
  &.query .x-match-item:first-child {
    margin-top: 0;
  }
  &.no-more {
    margin-top: 20%;
    line-height: .2rem;
    font-size: .12rem;
    img {
      width: 2rem;
    }
    p {
      margin-top: .2rem;
    }
  }
}
</style>
