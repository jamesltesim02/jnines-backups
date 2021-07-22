<template>
<div class="x-match-detail-games">
  <template v-for="group in matchInfo.groupGames">
    <div
      :key="group.key"
      class="group-holder"
      :id="group.key"
    ></div>
    <detail-game-item
      v-for="g in group.games"
      :class="group.key"
      :key="g.gameID"
      :expanded.sync="g.expanded"
      :game="g"
      :match="matchInfo"
    />
  </template>
</div>
</template>
<script>
import DetailGameItem from '@/components/MatchDetail/DetailGameItem';

export default {
  props: {
    matchInfo: {
      default: {},
    },
  },
  components: { DetailGameItem },
};
</script>
<style>
.x-match-detail-games { position: relative; padding: .15rem .13rem .05rem .13rem; }
</style>
