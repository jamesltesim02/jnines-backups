<template>
  <item-style2
    :match="match"
    :games="itemGames"
    :flag-color="flagColor"
    :match-time="matchTime"
    :match-score="matchScore"
  />
</template>
<script>
import ItemStyle2 from './ItemStyle2';

export default {
  props: [
    'match',
    'flagColor',
    'matchTime',
    'games',
    'matchScore',
  ],
  computed: {
    itemGames() {
      return [this.games[0]];
    },
  },
  components: {
    ItemStyle2,
  },
};
</script>
