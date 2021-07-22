<template>
  <div
    :class="{
      'x-match-list': true,
      'x-date-filter': dayPickerAvailable,
    }"
  >
    <date-picker
      :available="dayPickerAvailable"
      v-model="queryDate"
      :range-to="dayRange"
      :start-date="startDate"
      all-day
    />
    <section class="list-panel">
      <loading-bar
        full
        v-if="loading && pageNum === 0"
      />
      <no-more-bar
        full
        v-if="!hasMore && matchs.length === 0"
      />
      <perfect-scrollbar
        class="matchs"
        :wheelPropagation="true"
        @ps-y-reach-end="wheelHandle"
      >
        <match-list-item
          v-for="match in matchs"
          :key="match.matchID"
          :match="match"
        />
        <loading-bar v-if="loading && pageNum !== 0" />
      </perfect-scrollbar>
    </section>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { findmatchsListOther } from '@/api/pull';
import appConfig from '@/config/business.config';
import pushoperator from './pushoperator';
import DatePicker from './DatePicker';
import MatchListItem from './MatchListItem';

export default {
  props: {
    state: {},
    tno: {
      default: null,
    },
    sports: {},
    lastAvailableDay: {
      default: null,
    },
  },
  data() {
    return {
      // 是否正在调用接口
      loading: false,
      // 是否有更多数据
      hasMore: true,
      // 每页条数
      pageSize: 20,
      // 当前页码
      pageNum: 0,
      // 比赛列表
      matchs: [],
      // 查询截流timer(防止快速修改日期发起无用查询, 每次查询被延迟处理100毫秒)
      throttlingTimer: null,
      // 查询时间
      queryDate: null,
      // 默认查询开始时间
      startDate: new Date(Date.now() + 86400000),
    };
  },
  computed: {
    ...mapState('xsports', ['matchListUpdateFlag']),
    dayPickerAvailable() {
      return this.state === 0;
    },
    dayRange() {
      const d = +this.lastAvailableDay;
      if (!d) {
        return 30;
      }

      const availabelDate = new Date(
        parseInt(d / 10000, 10),
        parseInt((d % 10000) / 100, 10) - 1,
        parseInt(d % 100, 10),
        23,
        59,
        59,
      );

      return parseInt((availabelDate.getTime() - Date.now()) / 86400000, 10);
    },
  },
  watch: {
    state: 'resetAndQuery',
    matchListUpdateFlag: 'resetAndQuery',
    activeSports: 'resetAndQuery',
    sports: 'resetAndQuery',
    tno: 'resetAndQuery',
    queryDate() {
      this.resetAndQuery(false);
    },
  },
  components: {
    MatchListItem,
    DatePicker,
  },
  created() {
    // 查询比赛列表
    this.queryMatchs();
  },
  methods: {
    ...mapMutations('xsports', ['refreshMatchListToken']),
    /**
     * 重置条件并重新查询条件变化时调用
     */
    resetAndQuery(resetDate = true) {
      this.pageNum = 0;
      this.queryedCount = 0;
      this.hasMore = true;
      if (resetDate) {
        this.queryDate = null;
      }
      this.$nextTick(() => {
        this.queryMatchs();
      });
    },
    /**
     * 按当前条件查询下一页比赛
     */
    async nextPage() {
      if (!this.hasMore || this.loading) {
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
        const param = {
          matchState: this.state,
          sportIds: this.sports,
          tournamentID: this.tno,
          pageSize: this.pageSize,
          pageNum: this.pageNum || 1,
          versionNum: 21,
          ...condition,
        };
        if (this.state === 0) {
          param.matchDay = this.$options.filters.dateFormat(this.queryDate, 'yyyyMMdd');
        }
        if (param.pageNum === 1) {
          this.matchs = [];
        }
        try {
          this.loading = true;
          // 查询比赛列表
          const matchs = await findmatchsListOther(param);
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
          this.pageNum = param.pageNum;
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
    wheelHandle() {
      if (this.hasMore) {
        this.nextPage();
      }
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
  min-width: 920px;
  .list-panel {
    height: 100%;
    .ps {
      padding: 15px 15px 0 12px;
      transition: all .25s ease-out;
    }
  }
  &.x-date-filter .list-panel {
    height: calc(100% - 80px);
    .ps {
      padding-top: 0;
    }
  }
}
</style>
