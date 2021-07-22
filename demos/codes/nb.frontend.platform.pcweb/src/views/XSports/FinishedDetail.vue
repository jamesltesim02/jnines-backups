<template>
  <div class="x-finished-detail">
    <state-bar
      :state="state"
      @update:state="changeState"
      full
    />
    <section v-if="!!match">
      <left-detail
        :match="match"
      />
      <div class="x-right-detail" v-if="match.isSettled === false">
        <div class="x-detail-waitsettle">
          <icon-report />
          <p>该比赛还未结算完成</p>
        </div>
      </div>
      <right-detail
        v-else
        :match="match"
      />
    </section>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { findMacthScoreOther } from '@/api/pull';
import gameSort from '@/views/Detail/gameSort';
import StateBar from '@/components/XSports/StateBar';
import LeftDetail from '@/components/XSports/MatchDetail/LeftDetail';
import RightDetail from '@/components/XSports/MatchDetail/RightDetail';
import IconReport from '@/components/XSports/MatchDetail/LeftDetail/icons/IconReport';

export default {
  props: {
    mid: {
      required: true,
    },
    sno: {
      required: true,
    },
  },
  data() {
    return {
      state: 0,
      detail: null,
    };
  },
  computed: {
    ...mapState('app', ['lastLocation']),
    match() {
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
        matchInfo.games = gameSort(scoreGame);
      } else {
        matchInfo.isSettled = false;
      }
      return matchInfo;
    },
  },
  components: {
    StateBar,
    LeftDetail,
    RightDetail,
    IconReport,
  },
  created() {
    this.queryMatchInfo();
  },
  methods: {
    changeState(state) {
      this.$router.replace(`/xsports/${state}`);
    },
    async queryMatchInfo() {
      try {
        this.loading = true;
        const details = await findMacthScoreOther({ matchID: this.mid });
        if (details && details[0]) {
          this.detail = details[0];
          this.state = this.match.matchState;
          return;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
      this.$router.replace(this.lastLocation || '/xsports/3');
    },
  },
};
</script>
<style lang="less">
.x-finished-detail {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  & > section {
    flex-grow: 1;
    overflow: hidden;
    height: 100%;
    overflow: hidden;
    display: flex;
    .x-left-detail {
      width: 64%;
    }
    .x-right-detail {
      width: 36%;
    }
    & > div {
      height: 100%;
      overflow: hidden;
    }
  }
  .x-detail-waitsettle {
    text-align: center;
    padding: 20px;
    background-image: linear-gradient(to top, #f9f9f9, #ffffff);
    margin: 15px;
    p {
      color: #000;
      margin-top: 10px;
      opacity: .7;
    }
  }
}

.dark .x-finished-detail .x-detail-waitsettle {
  background-image: linear-gradient(to bottom, #36353d, #2f2d34);
  p {
    color: #bababa;
  }
}
</style>
