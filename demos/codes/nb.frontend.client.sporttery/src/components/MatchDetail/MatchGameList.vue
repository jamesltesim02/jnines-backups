<template>
  <div class="icon-expand-box">
    <div class="match-detail-games">
      <detail-game-item
        v-for="g in matchInfo.games"
        :key="g.gameID"
        :expanded.sync="g.expanded"
        :game="g"
        :match="matchInfo"
      />
    </div>
  </div>
</template>
<script>
import DetailGameItem from './DetailGameItem';

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
.match-detail-games {
  padding: .15rem .13rem;
}
.icon-expand-box {
  transform: none;
}
</style>
