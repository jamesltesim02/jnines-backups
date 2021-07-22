<template>
  <section
    class="detail"
  >
    <nav-bar :routes="routes" />
    <loading-bar
      full
      v-if="loading"
    />
    <div
      v-if="match"
      class="detail-content"
      :style="{height: mcHeight}"
    >
      <!-- <div class="lmt-and-betting"> -->
      <perfect-scrollbar class="lmt-and-betting">
        <video-bar
          :video-id="videoId"
          :match-video="liveUrl"
          :sno="sno"
        />
        <div class="betting-content">
          <!-- <perfect-scrollbar :style="{height: bcHeight}"> -->
            <h3 class="detail-header">
              <span class="tourname">{{match.tournamentName}}</span>
              {{match.competitor1Name}}
              <span class="score1">{{score.team1}}</span>
              &nbsp;&nbsp;vs&nbsp;&nbsp;
              <span class="score2">{{score.team2}}</span>
              {{match.competitor2Name}}
            </h3>
            <detail-games :match="match" />
          <!-- </perfect-scrollbar> -->
        </div>
      <!-- </div> -->
      </perfect-scrollbar>
      <widgets
        :video-id="videoId"
        :state="match.matchState"
      />
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex';
import { findmatch } from '@/api/pull';
import NavBar from '@/components/common/NavBar';
import VideoBar from '@/components/Matchs/VideoBar';
import DetailGames from '@/components/Matchs/DetailGames';
import Widgets from '@/components/Matchs/DetailGames/Widgets';
import gameSort from './gameSort';
import pushoperator from './pushoperator';

export default {
  props: ['sno', 'mid'],
  data() {
    return {
      loading: false,
      match: null,
      routes: [
        {
          route: '/',
          text: '首页',
        },
        {
          route: `/tomatchs/${this.sno}`,
          text: this.$t(`common.sports.${this.sno}`),
        },
      ],
    };
  },
  computed: {
    ...mapState('app', ['contentHeight']),
    videoId() {
      return (this.match.betradarKey || '').split(':').pop();
    },
    liveUrl() {
      return this.match.matchState === 1
        ? this.match.matchVideo
        : null;
    },
    score() {
      const scoreStr = ![1, 2].includes(this.match.matchState) ? ':' : `${this.match.matchScore || '0'}:0`;
      const [hs, as] = scoreStr.split(':');
      return { team1: hs, team2: as };
    },
    mcHeight() {
      if (!this.contentHeight) {
        return 'auto';
      }

      return `${this.contentHeight - 56}px`;
    },
    bcHeight() {
      if (!this.contentHeight) {
        return 'auto';
      }

      return `${this.contentHeight - 400}px`;
    },
  },
  watch: {
    match(n) {
      if (!n) {
        return;
      }

      this.routes.push({
        route: `/tour/${this.sno}/${n.tournamentID}`,
        text: n.tournamentName,
      });
    },
  },
  components: {
    NavBar,
    VideoBar,
    DetailGames,
    Widgets,
  },
  mounted() {
    this.queryMatchinfo();
  },
  beforeDestroy() {
    this.$regpush({}, () => {});
  },
  methods: {
    async queryMatchinfo() {
      try {
        this.loading = true;
        const match = await findmatch({
          matchID: this.mid,
          sportID: this.sno,
          versionNum: 21,
        });

        if (!match) {
          this.$toast(this.$t('message.noMatchinfo'));
          this.$router.go(-1);
          return;
        }

        this.match = {
          ...match,
          games: gameSort(match.games),
        };

        this.$nextTick(() => {
          this.reRegPush();
        });
      } finally {
        this.loading = false;
      }
    },
    reRegPush() {
      const pushData = { Matchs: [{ Mids: [this.mid], GameTypes: [-1] }] };
      this.$regpush(pushData, (msg) => { pushoperator(this, msg); });
    },
  },
};
</script>
<style lang="less">
.detail {
  height: 100%;
}
.detail-content {
  display: flex;
  .lmt-and-betting {
    width: 68%;
    overflow: hidden;
    min-width: 400px;
    padding-right: 10px;
  }
  .detail-header {
    margin-top: 10px;
    font-size: 18px;
    color: #909090;
    line-height: 18px;
    padding: 10px 0 10px 15px;
    border-left: 5px solid #ff5353;
    .tourname {
      display: inline-block;
      padding-right: 10px;
      margin-right: 8px;
      border-right: 1px solid #333;
    }
    .score1, .score2 {
      color: #ff5353;
    }
  }
  .betting-content {
    width: 100%;
    height: 100%;
    .ps {
      margin-right: -10px;
      padding-right: 10px;
    }
  }
}
</style>
