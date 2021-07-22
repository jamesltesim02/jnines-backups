<template>
  <div class="match-list" ref="matchEl" >
    <loading-bar v-if="loading && loadingPn == 1" />
    <div
      v-for="(g, gi) in matchGroups"
      :key="gi"
      class="day-item"
    >
      <!-- <v-touch
        v-if="showDate"
        class="day-title"
        @tap="g.expanded = !g.expanded"
      > -->
      <v-touch
        v-if="showDate"
        class="day-title"
      >
        <span>
          {{g.matchDay}} - {{countByDay[g.matchDay]}} {{$t('page.matchCount')}}
        </span>
        <!-- <icon-arrow :direction="g.expanded ? 'up' : 'down'" /> -->
      </v-touch>
      <!-- <expand-transition
        :expanded="g.expanded"
        class="group-expander"
        @change="expandChange"
      > -->
        <template v-for="(m, mi) in g.matchs">
          <match-item
            :match="m"
            :key="mi"
          />
          <v-touch
            tag="img"
            :key="`ad-${m.matchID}`"
            class="match-list-ad"
            v-if="m.showAds && !!ad && !horizScreen"
            :src="ad.img"
            @tap="toUrl(ad.url)"
          />
        </template>
      <!-- </expand-transition> -->
    </div>
    <div v-if="!hasMore && !loading" class="no-more">{{$t('message.noMoreRecords')}}</div>
    <loading-bar v-if="loading && loadingPn > 1" />
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import LoadingBar from '@/components/common/LoadingBar';
import appConfig from '@/config/business.config';
import { openInBrowser } from '@/utils/app/AppUtils';
import { findmatchsList, findmatchscount, findNearlyMatchList } from '@/api/pull';
import MatchItem from './MatchItem';
import pushoperator from './pushoperator';

export default {
  props: {
    sno: {},
    filterState: {
      default: {},
    },
    showDate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pageSize: 20,
      pageNum: 1,
      countByDay: {},
      matchGroups: [],
      hasMore: true,
      loading: false,
      loadingPn: 1,
      matchEl: null,
      pageContent: null,
      usingTempData: false,
      reloadTimer: null,
      filterTimer: null,
      ad: null,
      showAdd: false,
    };
  },
  computed: {
    ...mapState('app', ['theme', 'portalInfo', 'matchListStyle', 'horizScreen']),
    ads() {
      if (!this.portalInfo || !this.portalInfo.spreadBanner) {
        return [];
      }
      try {
        let ads = JSON.parse(this.portalInfo.spreadBanner) || [];
        ads = ads.filter(a => a.theme === this.theme);
        return ads;
      } catch (e) {
        return [];
      }
    },
  },
  components: {
    LoadingBar,
    MatchItem,
  },
  watch: {
    // 选中体育类型变更时重新查询
    sno() {
      this.resetAndQuery();
      this.randomAd();
    },
    filterState() {
      this.resetAndQuery();
      this.randomAd();
    },
    portalInfo() {
      this.randomAd();
    },
    showAdd() {
      this.saveAd();
    },
    ad() {
      this.saveAd();
    },
  },
  /**
   * 组件
   */
  mounted() {
    this.matchEl = this.$refs.matchEl;
    this.pageContent = this.matchEl.parentElement;
    this.resetAndQuery();
    this.randomAd();
    clearInterval(this.filterTimer);
    this.filterTimer = setInterval(this.filterMatches, 10000);
  },
  methods: {
    ...mapMutations('app', ['updateAdObject', 'refreshMatchListToken']),
    randomAd() {
      if (!this.ads.length) {
        return;
      }
      this.ad = this.ads[parseInt(Math.random() * this.ads.length, 10)];
    },
    toUrl(url) {
      if (/^https?:\/\//i.test(url)) {
        openInBrowser(url);
      } else {
        this.$router.push(url);
      }
    },
    saveAd() {
      const adObj = this.showAdd && !!this.ad ? this.ad : null;
      this.updateAdObject(adObj);
    },
    /**
     * 重置条件并重新查询,页面加载或体育项改变时调用
     */
    resetAndQuery() {
      this.countByDay = {};
      this.matchGroups = [];
      this.pageNum = 1;
      this.hasMore = true;
      this.showAdd = false;
      this.queryMatchs();
      if (this.showDate) {
        this.queryCountByDate();
      }
    },
    /**
     * 查询每天的比赛场数
     */
    async queryCountByDate() {
      const countByDay = {};
      const countResult = await findmatchscount({ sportID: this.sno });
      countResult.forEach((c) => { countByDay[+c.matchDay] = c.num; });
      this.countByDay = countByDay;
    },
    /**
     * 过滤比赛
     */
    filterMatches() {
      const sports = window.NBConfig.AVAILABLE_SPORTS;
      let showLive = window.NBConfig.SHOW_LIVE;
      for (let i = 0; i < sports.length; i += 1) {
        const sno = typeof sports[i] === 'object' ? sports[i].SNO || sports[i].SPORT_ID : sports[i];
        if (`${this.sno}` === `${sno}` && typeof sports[i] === 'object') {
          showLive = typeof sports[i].SHOW_LIVE === 'undefined' ? showLive : sports[i].SHOW_LIVE;
          break;
        }
      }
      if (!showLive) {
        for (let i = this.matchGroups.length; i > 0; i -= 1) {
          for (let j = this.matchGroups[i - 1].matchs.length; j > 0; j -= 1) {
            if (/^[123]$/.test(this.matchGroups[i - 1].matchs[j - 1].matchState)) {
              this.matchGroups[i - 1].matchs.splice(j - 1, 1);
            }
          }
          if (!this.matchGroups[i - 1].matchs.length) {
            this.matchGroups.splice(i - 1, 1);
          }
        }
      }
    },
    /**
     * 查询比赛列表
     */
    async queryMatchs(condition = {}) {
      if (this.filterState.count === 0) {
        this.hasMore = false;
        return;
      }

      const state = this.filterState.state !== -1 ? this.filterState.state : null;

      const queryParam = {
        sportID: this.sno || null,
        matchState: state,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        versionNum: this.matchListStyle,
        ...condition,
      };
      try {
        this.loading = true;
        this.loadingPn = queryParam.pageNum;
        if (this.sno === 11) {
          queryParam.gameType = [186, 16, 18];
        }
        let data = null;
        if (queryParam.sportID) {
          data = await findmatchsList(queryParam);
        } else {
          data = await findNearlyMatchList(queryParam);
        }
        if (!data || !data.length || data.length < this.pageSize) {
          this.hasMore = false;
        }
        if (!data || !data.length) {
          data = [];
        }
        if (queryParam.pageNum === 1) {
          this.matchGroups = [];
          this.showAdd = false;
          if (data.length) {
            if (data.length >= appConfig.matchAdPosition) {
              data[appConfig.matchAdPosition - 1].showAds = true;
              this.showAdd = true;
            } else {
              data[data.length - 1].showAds = true;
              this.showAdd = true;
            }
          }
        }
        let currentMatchDay = null;
        let matchGroup = null;
        data.forEach((m) => {
          if (currentMatchDay !== m.matchDay) {
            matchGroup = this.matchGroups.find(mg => mg.matchDay === m.matchDay);
            if (!matchGroup) {
              matchGroup = {
                matchs: [],
                matchDay: +m.matchDay,
                expanded: false,
              };
              this.matchGroups.push(matchGroup);
            }
            currentMatchDay = m.matchDay;
          }
          m.games.forEach((g) => {
            g.options.forEach((o) => {
              o.betBar = g.betBar;
              o.oddsUpper = false;
              o.oddsLower = false;
            });
          });
          m.fromList = true;
          matchGroup.matchs.push(m);
        });
        // this.matchGroups[0].expanded = true;
        this.pageNum = queryParam.pageNum;
        this.filterMatches();
      } catch (e) {
        console.log(e);
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
    },
    /**
     * 按当前条件查询下一页比赛
     */
    nextPage() {
      if (!this.hasMore || this.loading) {
        return;
      }
      this.queryMatchs({ pageNum: this.pageNum + 1 });
    },
    /**
     * 当日期分组被收起时判断是否需要查询下一页
     */
    expandChange({ expanded }) {
      if (expanded) {
        return;
      }
      if (this.pageContent.offsetHeight > this.matchEl.offsetHeight) {
        this.nextPage();
      }
    },
    /**
     * 推送消息处理
     */
    registerPush() {
      if (this.usingTempData) {
        return;
      }
      const regData = { Matchs: [] };
      if (this.matchGroups && this.matchGroups.length) {
        this.matchGroups.forEach((mg) => {
          if (!mg.matchs || !mg.matchs.length) {
            return;
          }
          mg.matchs.forEach((m) => {
            regData.Matchs.push({
              Mids: [m.matchID],
              GameTypes: m.games.map(g => g.gameType),
              GroupType: 0,
            });
          });
        });
      }
      this.$regpush(regData, (msg) => { pushoperator(this, msg); });
    },
  },
  beforeDestroy() {
    clearInterval(this.filterTimer);
    clearTimeout(this.reloadTimer);
    this.$regpush({}, () => {});
  },
};
</script>
<style lang="less">
.match-list {
  width: 3.75rem;
  padding: 0 .12rem;
  .day-title {
    display: flex;
    padding: 0 .12rem;
    line-height: .3rem;
    background-image: linear-gradient(to top, #f5f4f5, #fbf8f8);
    color: #858585;
    font-size: .12rem;
    font-weight: normal;
    span { flex-grow: 1; }
    .icon-arrow {
      width: .1rem;
      height: .1rem;
      margin-top: .12rem;
      path { fill: #999; }
    }
  }
  .group-expander {
    padding: 0 .12rem;
    margin-bottom: .1rem;
    padding-bottom: 0;
  }
  .group-expander.expaned {
    padding: 0 .12rem;
    margin-bottom: 0;
  }
}
.match-item-enter-active, .match-item-leave-active { transition: all .25s linear; }
.match-item-enter, .match-item-leave-active { transform: scaleY(0); }
.match-list-ad {
  width: 100%;
  box-shadow: 0 10px 20px 0 rgba(236, 236, 236, 0.5);
}
.black {
  .day-title {
    box-shadow: 0 -2px 5px 0 #28272d;
    background-image: linear-gradient(to bottom, #2e2e30, #29292b);
  }
  .match-list-ad { box-shadow: 0 10px 20px 0 rgba(37, 37, 37, 0.5); }
}
</style>
