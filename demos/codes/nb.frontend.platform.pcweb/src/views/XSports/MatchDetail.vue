<template>
  <div class="x-match-detail">
    <state-bar
      :state="state"
      @update:state="changeState"
      full
    />
    <section v-if="!!match">
      <left-detail
        :match="match"
      />
      <right-detail
        :match="match"
      />
    </section>
  </div>
</template>
<script>
import { findmatch } from '@/api/pull';
import gameSorter from '@/components/XSports/MatchDetail/gameSort';
import pushoperator from '@/components/XSports/MatchDetail/pushoperator';
import StateBar from '@/components/XSports/StateBar';
import LeftDetail from '@/components/XSports/MatchDetail/LeftDetail';
import RightDetail from '@/components/XSports/MatchDetail/RightDetail';

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
      match: null,
    };
  },
  components: {
    StateBar,
    LeftDetail,
    RightDetail,
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
        // 查询比赛信息
        const match = await findmatch({
          matchID: this.mid,
          sportID: this.sno,
          versionNum: 21,
        });

        // 如果没有查询到比赛
        if (!match) {
          this.$toast(this.$t('message.noMatchinfo'));
          this.$router.replace('/xsports/1');
          return;
        }

        this.state = match.matchState;

        if (match.games && match.games.length) {
          // 对game排序
          match.games = gameSorter(match.games);
          match.games.forEach((g) => {
            g.expanded = true;
          });
        }

        match.videoId = (match.betradarKey || '').split(':').pop();

        this.match = match;
        this.$regpush(
          {
            Matchs: [
              {
                Mids: [this.mid],
                GameTypes: [-1],
              },
            ],
          },
          (msg) => {
            pushoperator(this, msg);
          },
        );
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="less">
.x-match-detail {
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
}
</style>
