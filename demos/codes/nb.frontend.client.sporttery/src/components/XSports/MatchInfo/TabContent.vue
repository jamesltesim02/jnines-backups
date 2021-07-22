<template>
<div
  class="x-tab-content"
  @touchstart="touchFun"
>
  <Detail-Game-List
    v-if="tabName === 'betting'"
    :match-info="matchInfo"
  />
  <bet-match-history
    v-else-if="tabName === 'settlement'"
    type="all"
  />
  <programs-of-match
    ref="program"
    v-else-if="tabName === 'program'"
    :match-info="matchInfo"
  />
  <finish-detail-game-list
    v-else-if="tabName === 'result'"
    :match-info="matchInfo"
  />
  <sir-widget
    v-else
    :sno="matchInfo.sportID"
    :video-id="matchInfo.videoId"
    :widget="tabName"
  />
</div>
</template>
<script>
import BetMatchHistory from '@/components/Bet/BetMatchHistory';
import DetailGameList from '@/components/XSports/MatchInfo/DetailGameList';
import FinishDetailGameList from '@/components/XSports/MatchInfo/FinishDetailGameList';
import ProgramsOfMatch from '@/components/XSports/MatchInfo/ProgramsOfMatch';
import SirWidget from '@/components/MatchDetail/SirWidget';

export default {
  props: ['matchInfo', 'tabName'],
  components: {
    DetailGameList,
    BetMatchHistory,
    FinishDetailGameList,
    ProgramsOfMatch,
    SirWidget,
  },
  methods: {
    touchFun() {
      this.$emit('tStart');
    },
    scrollBottom() {
      if (this.tabName !== 'program') {
        return;
      }
      this.$refs.program.scrollBottom();
    },
  },
};
</script>
