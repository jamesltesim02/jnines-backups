<template>
  <list-page class="x-rake-history">
    <nav-bar
      title="佣金记录"
      slot="header"
    />
    <no-records v-if="!hasMore && !pageIndex" />
    <ul v-else>
      <li class="header">
        <span>时间</span>
        <span>类型</span>
        <span>方案</span>
        <span>跟单人数</span>
        <span>方案佣金</span>
      </li>
      <li
        v-for="(r, i) in rakes"
        :key="i"
      >
        <span class="date">
          {{ r.planCreateDate | dateFormat('MM-dd') }}<br>
          {{ r.planCreateDate | dateFormat('HH:ss') }}
        </span>
        <span class="type">{{ ['', '单式', '串关'][+r.betType] }}</span>
        <rake-teams
          class="teams"
          :items="r.items"
        />
        <span>{{ r.followCount }}</span>
        <span>{{ r.recCommission }}</span>
      </li>
    </ul>
    <loading-bar v-if="loading" />
  </list-page>
</template>
<script>
import { mapState } from 'vuex';
import { getCommissionByUser } from '@/api/activity';
import RakeTeams from '@/views/XSports/Xmember/TakeHistory/RakeTeams';

export default {
  data() {
    return {
      loading: false,
      hasMore: true,
      rakes: [],
      pageIndex: 0,
    };
  },
  computed: {
    ...mapState('app', ['userinfo']),
  },
  created() {
    this.queryRakes();
  },
  components: {
    RakeTeams,
  },
  methods: {
    async queryRakes(pageIndex = 1) {
      try {
        this.loading = true;
        const result = await getCommissionByUser({
          userId: this.userinfo.nbUser,
          pageIndex,
        });
        if (!result || !result.length) {
          this.hasMore = false;
          return;
        }
        this.rakes.push(...result);
        this.pageIndex = pageIndex;
      } finally {
        this.loading = false;
      }
    },
    toNext() {
      if (this.hasMore && !this.loading) {
        return;
      }

      this.queryRakes(this.pageIndex + 1);
    },
  },
};
</script>
<style lang="less">
.x-rake-history {
  text-align: center;
  ul li {
    display: grid;
    grid-template-columns: .7rem .4rem 1.25rem .65rem  .7rem;
    min-height: .65rem;
    background: linear-gradient(to bottom, #ffffff, #fcfcfc);
    color: #2e2f34;
    font-size: .12rem;
    margin-bottom: .06rem;
    &.header {
      height: .42rem;
      min-height: .42rem;
      background: none;
      color: #6a6c74;
      font-size: .14rem;
      span {
        border: 0;
      }
    }
    span {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #ecebeb;
      &:last-child {
        border: 0;
      }
      &.date {
        color: #909090;
      }
      &.type {
        color: #777777;
      }
      &.teams {
        color: #6a6c74;
        padding: .05rem 0;
      }
    }
  }
}
</style>
