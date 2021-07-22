<template>
  <list-page class="detail-page" v-if="!horizScreen">
    <div class="detail-head-box" slot="header">
      <nav-bar @back="backFun" @operate="lockFun" custBack>
        <span slot="content" v-if="!this.matchInfo.matchID">{{$t('page.matchDetail')}}</span>
        <ul slot="content" class="team-info" v-else >
          <li class="team">
            <rolling-text :text="matchInfo.competitor1Name" :max-length="14" scrollamount="3" />
          </li>
          <li class="score">
            <span class="score1" :style="{ color: oddsColor }">{{score.team1}}</span>
            <span class="vs">vs</span>
            <span class="score2" :style="{ color: oddsColor }">{{score.team2}}</span>
          </li>
          <li class="team">
            <rolling-text :text="matchInfo.competitor2Name" :max-length="14" scrollamount="3" />
          </li>
        </ul>
      </nav-bar>
      <div v-if="!!matchInfo.matchID && videoLock" >
        <cimg v-if="![10, 11].includes(+sno)" class="detail-video-image" src="./images/detail-bg.jpg" />
        <video-bar-in-iframe
          v-else
          :video-id="videoId"
          :match-video="liveUrl"
        />
      </div>
    </div>
    <loading-bar v-if="loading && !matchInfo.matchID" />
    <div v-if="!!matchInfo.matchID">
      <div v-if="!!matchInfo.matchID && !videoLock">
        <cimg v-if="![10, 11].includes(+sno)" class="detail-video-image" src="./images/detail-bg.jpg" />
        <video-bar-in-iframe
          v-else
          :video-id="videoId"
          :match-video="liveUrl"
        />
      </div>
      <tab-menu
        :selected.sync="tabSelected"
        v-if="[10, 11].includes(+sno)"
        :menus="detailMenus"
      />
      <match-game-list
        v-if="tabSelected === 'betting'"
        :match-info="matchInfo"
      />
      <bet-match-history
        v-else-if="/early/i.test(tabSelected)"
        type="all"
      />
      <sir-widget
        v-else
        :sno="sno"
        :video-id="videoId"
        :widget="tabSelected"
      />
    </div>
    <v-touch class="icon-expand-all flex-center" @tap="toggleExpandAll" v-if="tabSelected === 'betting'" >
      <icon-expand :expanded="expandAll" />
    </v-touch>
  </list-page>
  <div class="detail-horiz" v-else>
    <div class="detail-horiz-left">
      <nav-bar slot="header" @back="backFun" custBack >
        <span slot="content" v-if="!this.matchInfo.matchID">{{$t('page.matchDetail')}}</span>
        <ul class="team-info" slot="content" v-else >
          <li class="team">
            <rolling-text :text="matchInfo.competitor1Name" :max-length="14" scrollamount="3" />
          </li>
          <li class="score">
            <span class="score1" :style="{ color: oddsColor }">{{score.team1}}</span>
            <span class="vs">vs</span>
            <span class="score2" :style="{ color: oddsColor }">{{score.team2}}</span>
          </li>
          <li class="team">
            <rolling-text :text="matchInfo.competitor2Name" :max-length="14" scrollamount="3" />
          </li>
        </ul>
      </nav-bar>
      <loading-bar v-if="loading && !matchInfo.matchID" />
      <div v-if="matchInfo.matchID">
        <cimg v-if="![10, 11].includes(+sno)" class="detail-video-image" src="./images/detail-bg.jpg" />
        <video-bar-in-iframe
          v-else
          :sno="sno"
          :video-id="videoId"
          :match-video="liveUrl"
        />
      </div>
    </div>
    <list-page class="detail-horiz-right">
      <tab-menu :selected.sync="tabSelected" v-if="[10, 11].includes(+sno)" :menus="detailMenus" slot="header" />
      <match-game-list :match-info="matchInfo" v-if="tabSelected === 'betting'" />
      <sir-widget
        :video-id="videoId"
        :widget="tabSelected"
        v-else
      />
      <v-touch class="icon-expand-all flex-center" @tap="toggleExpandAll" v-if="tabSelected === 'betting'" >
        <icon-expand :expanded="expandAll" />
      </v-touch>
    </list-page>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { StorageKey } from '@/config/constants';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import { findmatch } from '@/api/pull';
import appConfig from '@/config/business.config';
import VideoBarInIframe from '@/components/MatchDetail/VideoBarInIframe';
import SirWidget from '@/components/MatchDetail/SirWidget';
import TabMenu from '@/components/MatchDetail/TabMenu';
import MatchGameList from '@/components/MatchDetail/MatchGameList';
import IconExpand from '@/components/MatchDetail/icons/IconExpand';
import LoadingBar from '@/components/common/LoadingBar';
import RollingText from '@/components/common/RollingText';
import BetMatchHistory from '@/components/Bet/BetMatchHistory';
import gameSorter from './gameSorter';
import pushoperator from './pushoperator';

export default {
  props: ['mid', 'sno'],
  data() {
    return {
      matchInfo: {},
      loading: false,
      reloadTimer: null,
      filterTimer: null,
      // tabSelected: 'betting',
      tabSelected: '',
      lockTime: 0,
    };
  },
  computed: {
    ...mapState('app', [
      'userinfo',
      'matchListStyle',
      'horizScreen',
      'theme',
      'multType',
      'videoLock',
    ]),
    videoId() {
      return (this.matchInfo.betradarKey || '').split(':').pop();
    },
    liveUrl() {
      return this.matchInfo.matchState === 1
        ? this.matchInfo.matchVideo
        : null;
    },
    games() {
      return this.matchInfo.games;
    },
    score() {
      const scoreStr = !/^[12]$/.test(this.matchInfo.matchState) ? ':' : `${this.matchInfo.matchScore || '0'}:0`;
      const [hs, as] = scoreStr.split(':');
      return { team1: hs, team2: as };
    },
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_OPTION_COLOR ? pSet.BLUE_OPTION_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    detailMenus() {
      if (!this.matchInfo.matchID) {
        return [];
      }
      if (this.matchInfo.matchState === 1) {
        return [
          'betting',
          'match.statistics',
          'match.generalStatistics',
          'match.ballPosession',
          'match.lineups',
          'match.earlyCash',
        ];
      }
      return [
        'betting',
        'team.comparison',
        'match.headToHead',
        'match.scoringProbabilityPerPeriod',
        'match.earlyCash',
      ];
    },
    expandAll() {
      if (!this.matchInfo || !this.matchInfo.games) {
        return false;
      }
      return this.matchInfo.games.filter(v => v.expanded).length > 0;
    },
  },
  components: {
    VideoBarInIframe,
    BetMatchHistory,
    TabMenu,
    MatchGameList,
    IconExpand,
    LoadingBar,
    RollingText,
    SirWidget,
  },
  methods: {
    ...mapMutations('app', ['setVideoLock']),
    ...mapActions('app', ['transferToNB']),
    toggleExpandAll() {
      const allExpand = !this.expandAll;
      if (this.matchInfo && this.matchInfo.games) {
        this.matchInfo.games.forEach((g) => {
          g.expanded = allExpand;
          this.$set(this.matchInfo.games, g);
        });
      }
    },
    expandTop(match, topNum) {
      if (!match || !topNum) {
        return;
      }
      match.games.slice(0, topNum).forEach((g) => {
        g.expanded = true;
      });
    },
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
      if (!showLive && this.matchInfo && /^[123]$/.test(this.matchInfo.matchState)) {
        this.matchInfo.games = [];
        this.$toast(this.$t('message.matchClosed'));
        setTimeout(() => {
          this.$router.replace('/');
        }, 20);
      }
    },
    async getMacthData() {
      const cacheKey = `${StorageKey.MATCH_DETAIL_KEY}-${this.sno}-${this.mid}`;
      this.matchInfo = loadFromStorage(cacheKey, {});
      try {
        this.loading = true;
        const matchInfo = await findmatch({
          matchID: this.mid,
          sportID: this.sno,
          versionNum: this.matchListStyle,
        });
        if (matchInfo && matchInfo.games) {
          matchInfo.games = gameSorter(matchInfo.games);
          this.expandTop(matchInfo, matchInfo.games.length);
          this.matchInfo = matchInfo;
          /**
           * FONT_ID对照
           * 亚游: 102001011JIaThBA
           * 凯时: 1000610117Qe1Gj0 (A06)
           * 酷游: 102061011cYgTGB2 (B06 凯发电游)
           * 和记: 1010410116Ea5Hq7 (E03)
           * 永乐: 101031011k3Lx9Tf (E04)
           *
           * B06 要默认显示投注
           */
          const { FRONT_ID } = window.NBConfig;
          if (matchInfo.sportID === 10 && FRONT_ID !== '102061011cYgTGB2') {
            this.tabSelected = this.detailMenus[1]; // eslint-disable-line prefer-destructuring
          } else {
            this.tabSelected = 'betting';
          }
          this.fromList = false;
          saveToStorage(cacheKey, matchInfo);
          this.reRegPush();
          return;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
      this.$toast(this.$t('message.noMatchinfo'));
      this.$router.push('/');
    },
    reRegPush() {
      const pushData = { Matchs: [{ Mids: [this.mid], GameTypes: [-1] }] };
      this.$regpush(pushData, (msg) => { pushoperator(this, msg); });
      this.filterMatches();
    },
    backFun() {
      /**
       * FONT_ID对照
       * 亚游: 102001011JIaThBA
       * 凯时: 1000610117Qe1Gj0 (A06)
       * 酷游: 102061011cYgTGB2 (B06 凯发电游)
       * 和记: 1010410116Ea5Hq7 (E03)
       * 永乐: 101031011k3Lx9Tf (E04)
       */
      const { FRONT_ID } = window.NBConfig;
      if (FRONT_ID === '102061011cYgTGB2') {
        this.$router.replace('/home');
      } else {
        this.$router.replace(`/matchs/${this.multType}/${this.sno}`);
      }
    },
    lockFun() {
      const timePass = Date.now() - this.lockTime < 500;
      this.lockTime = Date.now();
      if (timePass) {
        this.lockTime = 0;
        this.setVideoLock();
      }
    },
  },
  async mounted() {
    await this.getMacthData();
    if (appConfig.matchsReloadTime) {
      setInterval(this.reloadTimer);
      this.reloadTimer = setInterval(this.reRegPush, appConfig.matchsReloadTime);
    }
    clearInterval(this.filterTimer);
    this.filterTimer = setInterval(this.filterMatches, 10000);
    if (this.userinfo && this.userinfo.token) {
      this.transferToNB();
    }
  },
  beforeDestroy() {
    clearInterval(this.filterTimer);
    clearInterval(this.reloadTimer);
    this.$regpush({}, () => {});
  },
};
</script>
<style lang="less">
.icon-expand-all {
  position: fixed;
  right: .3rem;
  bottom: .6rem;
  width: .4rem;
  height: .4rem;
  box-shadow: 0 4px 18px 0 rgba(58, 58, 58, 0.15);
  background-color: #ffffff;
  border-radius: 50%;
  z-index: 2;
  transform: translateY(-env(safe-area-inset-bottom))
}
.black .icon-expand-all {
  box-shadow: 0 4px 18px 0 #161616;
  background-color: #28272d;
}
.detail-page, .detail-horiz-left {
  .nav-bar .nav-content { font-size: .14rem; }
  .page-content {
    padding-bottom: env(safe-area-inset-bottom) !important;
  }
  .team-info{
    display: flex;
    padding: 0 .45rem;
    li { height: .44rem; }
    .team { width: 1.3rem; }
    .score {
      width: .9rem;
      .score1, .score2 { padding: .03rem; }
      .vs { padding: .05rem; }
    }
  }
}
.detail-video-image { width: 100%; }
.detail-horiz-left {
  width: 3.75rem;
  float: left;
}
.detail-horiz-right { float: right; }
.horizontal .detail-horiz { width: 100%; height: 100%; }
</style>
