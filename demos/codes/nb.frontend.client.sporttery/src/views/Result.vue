<template>
  <list-page class="result-page" v-if="!horizScreen" >
    <result-head :dayNum="displayDays" :matchNum="data.length" @change="loadData" slot="header" />
    <v-touch class="result-page-body-box flex-center-col" v-for="(v, k) in data" :key="k" @tap="toMatch(v)">
      <ul class="result-body-half flex-none">
        <li class="team flex-center">
          <span class="result-time flex-start">{{getMathTime(v.matchDate)}}</span>
          <rolling-text class="result-group" :text="v.tournamentName" :max-length="12" scrollamount="2" />
        </li>
        <li class="score flex-center">{{getHalf(v.periodScore)}}</li>
        <li class="team flex-end">
          <live-flag :active="/^[12]$/.test(v.matchState)" v-if="/^[012]$/.test(v.matchState)" />
        </li>
      </ul>
      <ul class="result-body-teams flex-none">
        <li class="team flex-center">
          <rolling-text :text="v.competitor1Name" :max-length="14" scrollamount="3" />
        </li>
        <li class="score flex-center">
          <span class="flex-center" :style="{ color: oddsColor }" >{{getScore(v, 0)}}</span>
          <span class="spliter flex-center"></span>
          <span class="flex-center" :style="{ color: oddsColor }" >{{getScore(v, 1)}}</span>
        </li>
        <li class="team flex-center">
          <rolling-text :text="v.competitor2Name" :max-length="14" scrollamount="3" />
        </li>
      </ul>
    </v-touch>
    <div class="history-box-none flex-center-col" v-if="finish && !loading && !data.length">
      <bet-box-none :inColor="inCol" :outColor="ouCol" />
      <p class="history-box-none-text flex-center">{{$t('pageResult.noGames')}}</p>
    </div>
    <div v-if="finish && !loading && data.length" class="history-no-more flex-center">{{$t('pageQuery.noMore')}}</div>
    <div v-if="loading && !data.length" class="history-box-none flex-center-col"><icon-loading /></div>
    <div v-if="loading && data.length" class="history-loading-bar flex-center"><icon-loading /></div>
  </list-page>
  <div class="result-page" v-else>
    <div class="result-page-left flex-none-col">
      <div class="result-left-header">
        <result-head :dayNum="displayDays" :matchNum="data.length" @change="loadData" />
        <bet-statistical-head :data="$t('pageResult.queryArrTitle')" />
      </div>
      <div class="result-left-content">
        <bet-statistical-body :data="statsData" />
      </div>
    </div>
    <div class="result-page-right">
      <list-page >
        <v-touch class="result-page-body-box flex-center-col" v-for="(v, k) in data" :key="k" @tap="toMatch(v)">
          <ul class="result-body-half flex-none">
            <li class="team flex-center">
              <span class="result-time flex-start">{{getMathTime(v.matchDate)}}</span>
              <rolling-text class="result-group" :text="v.tournamentName" :max-length="12" scrollamount="2" />
            </li>
            <li class="score flex-center">{{getHalf(v.periodScore)}}</li>
            <li class="team flex-end">
              <live-flag :active="/^[12]$/.test(v.matchState)" v-if="/^[012]$/.test(v.matchState)" />
            </li>
          </ul>
          <ul class="result-body-teams flex-none">
            <li class="team flex-center">
              <rolling-text :text="v.competitor1Name" :max-length="14" scrollamount="3" />
            </li>
            <li class="score flex-center">
              <span class="flex-center" :style="{ color: oddsColor }" >{{getScore(v, 0)}}</span>
              <span class="spliter flex-center"></span>
              <span class="flex-center" :style="{ color: oddsColor }" >{{getScore(v, 1)}}</span>
            </li>
            <li class="team flex-center">
              <rolling-text :text="v.competitor2Name" :max-length="14" scrollamount="3" />
            </li>
          </ul>
        </v-touch>
        <div class="history-box-none flex-center-col" v-if="finish && !loading && !data.length">
          <bet-box-none :inColor="inCol" :outColor="ouCol" />
          <p class="history-box-none-text flex-center">{{$t('pageResult.noGames')}}</p>
        </div>
        <div v-if="finish && !loading && data.length" class="history-no-more flex-center">{{$t('pageQuery.noMore')}}</div>
        <div v-if="loading && !data.length" class="history-box-none flex-center-col"><icon-loading /></div>
        <div v-if="loading && data.length" class="history-loading-bar flex-center"><icon-loading /></div>
      </list-page>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { findMatchResult } from '@/api/pull';
import ListPage from '@/components/common/ListPage';
import LiveFlag from '@/components/common/LiveFlag';
import ResultHead from '@/components/Result/ResultHead';
import RollingText from '@/components/common/RollingText';
import BetBoxNone from '@/components/Bet/BetComps/BetBoxNone';
import IconLoading from '@/components/common/icons/IconLoading';
import BetStatisticalHead from '@/components/Bet/BetComps/BetStatisticalHead';
import BetStatisticalBody from '@/components/Bet/BetComps/BetStatisticalBody';

export default {
  data() {
    return {
      data: [],
      loading: false,
      finish: false,
      displayDays: 30,
      statsData: [],
      reqTimer: null,
      reqWaitTime: 120000,
    };
  },
  computed: {
    ...mapState('app', {
      theme: state => state.theme,
      horizScreen: state => state.horizScreen,
    }),
    inCol() {
      const defColor = /black/i.test(this.theme) ? '#37383C' : '#909090';
      return /blue/i.test(this.theme) ? '#37383C' : defColor;
    },
    ouCol() {
      const defColor = /black/i.test(this.theme) ? '#55565A' : '#AAAAAA';
      return /blue/i.test(this.theme) ? '#55565A' : defColor;
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
  },
  components: {
    ListPage,
    LiveFlag,
    ResultHead,
    RollingText,
    BetBoxNone,
    IconLoading,
    BetStatisticalHead,
    BetStatisticalBody,
  },
  methods: {
    getHalf(score) {
      return /\d/.test(score) ? `${this.$t('pageResult.halfMatch')} ${score.replace(':', '-').trim()}` : '';
    },
    getScore(v, num) {
      const score = /^[12]$/.test(v.matchState) ? v.matchScore : v.resultNB;
      const sArr = `${`${score || ''}`.trim() || '0'}:0`.split(':');
      return /^0$/.test(v.matchState) ? '' : sArr[num || 0];
    },
    getMathTime(time) {
      const dt = time ? new Date(+time) : new Date();
      return `${`0${dt.getHours()}`.slice(-2)}:${`0${dt.getMinutes()}`.slice(-2)}`;
    },
    calStatsData() {
      const dt = JSON.parse(JSON.stringify(this.$t('pageResult.queryArrData')));
      if (this.data && this.data.length) {
        for (let i = 0; i < this.data.length; i += 1) {
          const sno = this.data[i].sportID || 0;
          for (let j = 0; j < dt.length; j += 1) {
            if (`${dt[j][0]}` === `${sno}`) {
              dt[j][1] += /^0$/.test(this.data[i].matchState) ? 1 : 0;
              dt[j][2] += /^[12]$/.test(this.data[i].matchState) ? 1 : 0;
              dt[j][3] += /^[012]$/.test(this.data[i].matchState) ? 0 : 1;
              dt[j][4] += 1;
              break;
            }
          }
        }
      }
      for (let i = 0; i < dt.length; i += 1) {
        dt[i][0] = this.$t(`common.sports.${dt[i][0]}`);
      }
      this.statsData = dt;
    },
    async loadData(date) {
      clearTimeout(this.reqTimer);
      [this.data, this.loading, this.finish] = [[], true, false];
      try {
        const rtn = await findMatchResult(date);
        this.loading = false;
        if (rtn && rtn.length) {
          this.data = rtn;
        }
        this.calStatsData();
      } catch (e) {
        console.log(e);
      } finally {
        [this.loading, this.finish] = [false, true];
        this.reqTimer = setTimeout(() => { this.loadData(date); }, this.reqWaitTime);
      }
    },
    toMatch(v) {
      if (v && v.sportID && v.matchID && /^[012]$/.test(v.matchState)) {
        const isLive = /^[12]$/.test(v.matchState);
        const sports = window.NBConfig.AVAILABLE_SPORTS;
        let showLive = window.NBConfig.SHOW_LIVE;
        for (let i = 0; i < sports.length; i += 1) {
          const sno = typeof sports[i] === 'object' ? sports[i].SNO || sports[i].SPORT_ID : sports[i];
          if (`${v.sportID}` === `${sno}` && typeof sports[i] === 'object') {
            showLive = typeof sports[i].SHOW_LIVE === 'undefined' ? showLive : sports[i].SHOW_LIVE;
            break;
          }
        }
        if (!isLive || showLive) {
          this.$router.push(`/detail/${v.sportID}/${v.matchID}`);
        }
      }
    },
  },
  beforeDestroy() {
    clearTimeout(this.reqTimer);
  },
};
</script>

<style lang="less">
.white .result-page {
  .result-page-body-box {
    box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,0.50);
    background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
    border: .01rem solid #EBE9E9;
    .result-body-half {
      color: #c6c4c4;
      .result-time { border-right: .01rem solid #ccc; }
    }
    .result-body-teams { color: #2e2f34; }
  }
  .history-box-none .history-box-none-text { color: #2E2F34; }
  .history-no-more, .history-loading-bar { color: #BBB; }
}
.black .result-page {
  .result-page-body-box {
    box-shadow: 0 .1rem .2rem 0 rgba(37, 37, 37, 0.5);
    background: linear-gradient(133deg, #3d4046, #35363c);
    border: .01rem solid #2e2f34;
    .result-body-half {
      color: #888888;
      .result-time { border-right: .01rem solid #34363b; }
    }
    .result-body-half { color: #888888; }
    .result-body-teams { color: #ecebeb; }
  }
  .history-box-none .history-box-none-text { color: #FFF; }
  .history-no-more, .history-loading-bar { color: #716d6d; }
}
.result-page {
  .result-page-body-box {
    width: 3.51rem;
    height: .56rem;
    margin: .06rem auto 0;
    border-radius: .06rem;
    padding: .03rem 0;
    .result-body-half {
      width: 100%;
      height: .23rem;
      font-size: .12rem;
      li.team {
        width: 1.58rem;
        padding: 0 .05rem;
        .result-time { width: .38rem; height: .15rem; margin-right: .08rem; }
        .result-group { width: .8rem; }
      }
      .score { width: .62rem; }
    }
    .result-body-teams {
      width: 100%;
      height: .27rem;
      font-size: .15rem;
      li.team { width: 1.52rem; padding: 0 .05rem; }
      .score {
        display: flex;
        font-size: .18rem;
        width: .74rem;
        span { width: 100%; }
        .spliter {
          width: .2rem;
          &::before {
            content: "";
            width: .12rem;
            height: .03rem;
            border-radius: 1.5px;
            background: #d8d8d8;
          }
        }
      }
    }
  }
  .history-box-none {
    width: 100%;
    height: 4.5rem;
    .history-box-none-text {
      width: 100%;
      height: .53rem;
      font-size: .15rem;
      opacity: 0.7;
    }
  }
  .history-no-more, .history-loading-bar {
    margin-top: .12rem;
    width: 100%;
    height: .26rem;
    font-size: .13rem;
  }
}
.result-page-left {
  float: left;
  width: 3.75rem;
  height: 100%;
  .result-left-header { position: relative; z-index: 13; }
  .result-left-content {
    position: relative;
    flex-grow: 1;
    z-index: 10;
    width: 3.75rem;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
  }
}
.result-page-right {
  float: right;
  width: 3.75rem;
  height: 100%;
  .history-box-none { height: 2.6rem; }
}
.horizontal .result-page { width: 100%; height: 100%; }
</style>
