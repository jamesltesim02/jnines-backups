<template>
  <list-page class="detail-page">
    <nav-bar slot="header">
      <span slot="content" v-if="!this.matchInfo.matchID">
        {{$t('page.matchDetail')}}
      </span>
      <ul
        v-else
        class="team-info"
        slot="content"
      >
        <li class="team">
          <rolling-text
            :text="matchInfo.competitor1Name"
            :max-length="14"
          />
        </li>
        <li class="score">
          <span class="score1">{{score.team1}}</span>
          <span class="vs">vs</span>
          <span class="score2">{{score.team2}}</span>
        </li>
        <li class="team">
          <rolling-text
            :text="matchInfo.competitor2Name"
            :max-length="14"
          />
        </li>
      </ul>
    </nav-bar>
    <loading-bar v-if="loading && !matchInfo.matchID" />
    <div v-if="matchInfo.matchID">
      <cimg
        v-if="![10, 11].includes(+sno)"
        class="detail-video-image"
        src="./images/detail-bg.jpg"
      />
      <video-bar-in-iframe
        v-else
        :video-id="videoId"
      />
      <match-game-list
        :match-info="matchInfo"
        @toggle-expand-all="toggleExpandAll"
      />
    </div>
  </list-page>
</template>
<script>
import { mapState } from 'vuex';
import { StorageKey } from '@/config/constants';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import { findmatch } from '@/api/pull';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import VideoBarInIframe from '@/components/MatchDetail/VideoBarInIframe';
import MatchGameList from '@/components/MatchDetail/MatchGameList';
import LoadingBar from '@/components/common/LoadingBar';
import RollingText from '@/components/common/RollingText';

import gameSorter from './gameSorter';
import pushoperator from './pushoperator';

export default {
  props: ['mid', 'sno'],
  data() {
    return {
      matchInfo: {},
      loading: false,
      // score: {
      //   team1: 0,
      //   team2: 0,
      // },
    };
  },
  computed: {
    ...mapState('app', ['matchListStyle']),
    videoId() {
      return (this.matchInfo.betradarKey || '').split(':').pop();
    },
    score() {
      // if (this.matchInfo.matchState !== 1) {
      //   return {};
      // }

      const [hs, as] = this.matchInfo.matchScore.split(':');

      return {
        team1: hs,
        team2: as,
      };
    },
  },
  components: {
    ListPage,
    NavBar,
    VideoBarInIframe,
    MatchGameList,
    LoadingBar,
    RollingText,
  },
  watch: {
    // 'matchInfo.matchScore'(n) {
    //   [this.score.team1, this.score.team2] = n.split(':');
    // },
  },
  async created() {
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
        this.expandTop(matchInfo, 3);
        this.matchInfo = matchInfo;
        this.fromList = false;
        saveToStorage(cacheKey, matchInfo);
        pushoperator(this);
        return;
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.loading = false;
    }

    this.$toast.center(this.$t('message.noMatchinfo'));
    this.$router.push('/matchs/0/10');
  },
  methods: {
    toggleExpandAll(state) {
      this.matchInfo.games.forEach((g) => {
        g.expanded = state;
        this.$set(this.matchInfo.games, g);
      });
    },
    expandTop(match, topNum) {
      if (!match) {
        return;
      }

      if (!topNum) {
        return;
      }

      match.games.slice(0, topNum).forEach((g) => {
        g.expanded = true;
      });
    },
  },
};
</script>
<style lang="less">
.detail-page {
  .nav-bar .nav-content {
    font-size: .14rem;
  }
  .page-content {
    padding-bottom: env(safe-area-inset-bottom);
  }
  .team-info{
    display: flex;
    padding: 0 .45rem;
    li {
      height: .44rem;
    }
    .team {
      width: 1.3rem;
    }
    .score {
      width: .9rem;
      .score1, .score2 {
        padding: .03rem;
        color: #ff5353;
      }
      .vs {
        padding: .05rem;
      }
    }
  }
}
.detail-video-image {
  width: 100%;
}
</style>
