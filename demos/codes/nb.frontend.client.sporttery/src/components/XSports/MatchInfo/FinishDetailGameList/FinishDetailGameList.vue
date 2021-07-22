<template>
  <no-records v-if="matchInfo.isSettled === false">该比赛还未结算完成</no-records>
  <div
    v-else
    class="x-detail-game-list"
  >
    <finish-game-item
      v-for="game in matchInfo.scoreGame"
      :key="game.gameID"
      :game="game"
      :match="matchInfo"
      :expanded.sync="game.expanded"
    />
  </div>
</template>
<script>
import FinishGameItem from './FinishGameItem';

export default {
  props: {
    matchInfo: {},
  },
  components: {
    FinishGameItem,
  },
};
</script>
<style lang="less">
.x-detail-game-list {
  padding: .1rem .1rem 0;
}
</style>
