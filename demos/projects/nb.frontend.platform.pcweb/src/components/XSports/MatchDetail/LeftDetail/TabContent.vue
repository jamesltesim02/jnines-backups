<template>
<div class="x-tab-content">
  <bet-match-history
    type="early"
    v-if="tabName === 'settlement'"
  />
  <sir-widget
    v-else
    :sno="match.sportID"
    :video-id="match.videoId"
    :widget="tabName"
  />
</div>
</template>
<script>
import SirWidget from './SirWidget';
import BetMatchHistory from '@/components/Bet/BetMatchHistory';

export default {
  props: ['match', 'tabName'],
  components: {
    SirWidget,
    BetMatchHistory,
  },
};
</script>
