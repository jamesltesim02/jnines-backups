<template>
  <div
    class="match-list"
    ref="matchEl"
  >
    <loading-bar v-if="loading && loadingPn == 1" />
    <div
      v-for="(g, gi) in matchGroups"
      :key="gi"
      class="day-item"
    >
      <v-touch
        tag="div"
        class="day-title"
        @tap="g.expanded = !g.expanded"
      >
        <span>
          {{g.matchDay}} - {{countByDay[g.matchDay]}} {{$t('page.matchCount')}}
        </span>
        <icon-arrow :direction="g.expanded ? 'up' : 'down'" />
      </v-touch>
      <expand-transition
        :expanded="g.expanded"
        class="group-expander"
        @change="expandChange"
      >
        <template v-for="m in g.matchs">
          <match-item
            :match="m"
            :key="m.matchID"
          />
          <transition
            name="match-item"
            :key="`ad-${m.matchID}`"
          >
            <v-touch
              tag="img"
              class="match-list-ad"
              v-if="m.showAds && !!ad"
              :src="ad.img"
              @tap="toUrl(ad.url)"
            />
          </transition>
        </template>
      </expand-transition>
    </div>
    <div v-if="!hasMore && !loading" class="no-more">{{$t('message.noMoreRecords')}}</div>
    <loading-bar v-if="loading && loadingPn > 1" />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import IconArrow from '@/components/common/icons/IconArrow';
import ExpandTransition from '@/components/common/ExpandTransition';
import LoadingBar from '@/components/common/LoadingBar';
import appConfig from '@/config/business.config';
// import { StorageKey } from '@/config/constants';
// import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import { openInBrowser } from '@/utils/app/AppUtils';
import { findmatchsList, findmatchscount } from '@/api/pull';
import { regpush } from '@/utils/PushUtil';
import MatchItem from './MatchItem';
import pushoperator from './pushoperator';

export default {
  props: ['sno'],
  data() {
    return {
      pageSize: 200,
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
      ad: null,
    };
  },
  computed: {
    ...mapState('app', ['theme', 'portalInfo', 'matchListStyle']),
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
    IconArrow,
    ExpandTransition,
    MatchItem,
  },
  watch: {
    // 选中体育类型变更时重新查询
    sno() {
      this.resetAndQuery();
      this.randomAd();
    },
    portalInfo() {
      this.randomAd();
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
  },
  methods: {
    randomAd() {
      if (!this.ads.length) {
        return;
      }
      this.ad = this.ads[parseInt(Math.random() * this.ads.length, 10)];
    },
    toUrl(url) {
      if (/^https?:\/\//i.test(url)) {
        // window.location = url;
        openInBrowser(url);
      } else {
        this.$router.push(url);
      }
    },
    /**
     * 重置条件并重新查询,页面加载或体育项改变时调用
     */
    resetAndQuery() {
      this.countByDay = {};
      this.matchGroups = [];
      this.pageNum = 1;
      this.hasMore = true;

      this.queryCountByDate();
      this.queryMatchs();
    },
    /**
     * 查询每天的比赛场数
     */
    async queryCountByDate() {
      const countByDay = {};
      const countResult = await findmatchscount({
        sportID: this.sno,
      });
      countResult.forEach((c) => {
        countByDay[+c.matchDay] = c.num;
      });
      this.countByDay = countByDay;
    },
    /**
     * 查询比赛列表
     */
    async queryMatchs(condition = {}) {
      const queryParam = {
        sportID: this.sno,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        versionNum: this.matchListStyle,
        ...condition,
      };

      // const cacheKey = `${StorageKey.MATCH_LIST_KEY}-${this.sno}-${queryParam.pageNum}`;
      // if (queryParam.pageNum === 1) {
      //   // 加载缓存数据
      //   this.usingTempData = true;
      //   this.matchGroups = loadFromStorage(cacheKey, []);
      // }

      try {
        this.loading = true;
        this.loadingPn = queryParam.pageNum;
        let data = await findmatchsList(queryParam);
        if (!data || !data.length) {
          this.hasMore = false;
          data = [];
        }

        if (queryParam.pageNum === 1) {
          this.matchGroups = [];

          if (data.length) {
            if (data.length >= appConfig.matchAdPosition) {
              data[appConfig.matchAdPosition - 1].showAds = true;
            } else {
              data[data.length - 1].showAds = true;
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
                expanded: true,
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

        // if (queryParam.pageNum === 1) {
        //   saveToStorage(cacheKey, this.matchGroups);
        // }
        // this.usingTempData = false;
        this.pageNum = queryParam.pageNum;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
        this.registerPush();

        // 定时刷新页面
        if (appConfig.matchsReloadTime) {
          clearTimeout(this.reloadTimer);
          this.reloadTimer = setTimeout(
            this.resetAndQuery.bind(this),
            appConfig.matchsReloadTime,
          );
        }
      }
    },
    /**
     * 按当前条件查询下一页比赛
     */
    toNext() {
      if (!this.hasMore || this.loading) {
        return;
      }
      this.queryMatchs({
        pageNum: this.pageNum + 1,
      });
    },
    /**
     * 当日期分组被收起时判断是否需要查询下一页
     */
    expandChange({ expanded }) {
      if (expanded) {
        return;
      }
      if (this.pageContent.offsetHeight > this.matchEl.offsetHeight) {
        this.toNext();
      }
    },
    /**
     * 推送消息处理
     */
    receivePush(msg) {
      pushoperator(this, msg);
    },
    registerPush() {
      if (this.usingTempData) {
        return;
      }

      const regData = {
        Matchs: [],
      };

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

      regpush(regData, this.receivePush.bind(this));
    },
  },
  beforeDestroy() {
    // 组件被销毁时撤销本页面的推送注册
    regpush({}, () => {});
  },
};
</script>
<style lang="less">
.match-list {
  width: 3.75rem;
  .day-title {
    display: flex;
    padding: 0 .12rem;
    line-height: .3rem;
    background-image: linear-gradient(to top, #f5f4f5, #fbf8f8);
    color: #858585;
    font-size: .12rem;
    font-weight: normal;
    span {
      flex-grow: 1;
    }
    .icon-arrow {
      width: .1rem;
      height: .1rem;
      margin-top: .12rem;
      path {
        fill: #999;
      }
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
.match-item-enter-active, .match-item-leave-active {
  transition: all .15s linear;
}
.match-item-enter, .match-item-leave-active {
  transform: scaleY(0);
}
.match-list-ad {
  width: 100%;
  box-shadow: 0 10px 20px 0 rgba(236, 236, 236, 0.5);
}
.black {
  .day-title {
    box-shadow: 0 -2px 5px 0 #28272d;
    background-image: linear-gradient(to bottom, #2e2e30, #29292b);
  }
  .match-list-ad {
    box-shadow: 0 10px 20px 0 rgba(37, 37, 37, 0.5);
  }
}
</style>
