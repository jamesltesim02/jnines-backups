<template>
  <list-page
    class="x-finished"
  >
    <div slot="header">
      <detail-nav
        :match-info="mathInfo"
        @back="$router.replace(lastPath || '/xsports/3')"
      />
      <detail-tabs
        v-if="!!detail"
        v-model="tabName"
        :match-state="mathInfo.matchState"
      />
    </div>
    <loading-bar v-if="loading" />
    <tab-content
      v-if="!!detail"
      :match-info="mathInfo"
      :tab-name="tabName"
    />
  </list-page>
</template>
<script>
import { mapState } from 'vuex';
import { findMacthScoreOther } from '@/api/pull';
import gameSorter from '@/views/MatchDetail/gameSorter';
import DetailNav from '@/components/XSports/MatchInfo/DetailNav';
import DetailTabs from '@/components/XSports/MatchInfo/DetailTabs';
import TabContent from '@/components/XSports/MatchInfo/TabContent';

export default {
  props: ['mid'],
  data() {
    return {
      tabName: null,
      detail: null,
      loading: false,
    };
  },
  computed: {
    ...mapState('app', ['lastPath']),
    ...mapState('xsports', ['finishedDetail']),
    mathInfo() {
      const matchInfo = this.detail;
      if (!matchInfo) {
        return null;
      }
      matchInfo.videoId = (matchInfo.betradarKey || '').split(':').pop();
      const { scoreGame } = matchInfo;
      if (scoreGame && scoreGame.length) {
        if (!scoreGame[0].scoreOption || !scoreGame[0].scoreOption[0].matchResult) {
          matchInfo.isSettled = false;
        }
        // 对game排序
        scoreGame.forEach((g) => {
          g.options = g.scoreOption;
          g.sportID = matchInfo.sportID;
          g.matchState = matchInfo.matchState;
        });
        matchInfo.scoreGame = gameSorter(scoreGame);
      } else {
        matchInfo.isSettled = false;
      }
      return matchInfo;
    },
  },
  created() {
    if (this.finishedDetail) {
      this.detail = this.finishedDetail;
    } else {
      this.queryFinishedDetail();
    }
  },
  components: {
    DetailNav,
    DetailTabs,
    TabContent,
  },
  methods: {
    async queryFinishedDetail() {
      try {
        this.loading = true;
        const details = await findMacthScoreOther({ matchID: this.mid });
        if (details && details[0]) {
          this.detail = details[0];
          return;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
      this.$router.replace(this.lastPath || '/xsports/3');
    },
  },
};
</script>
<style lang="less">
.x-finished .x-detail-nav .team-info .score {
  .score1, .score2 {
    color: #909090;
  }
}
</style>
