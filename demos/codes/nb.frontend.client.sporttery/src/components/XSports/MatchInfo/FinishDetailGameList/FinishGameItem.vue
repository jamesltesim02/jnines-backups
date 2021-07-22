<template>
  <div class="x-finish-game-item">
    <v-touch
      class="game-item-title"
      @tap="$emit('update:expanded', !expanded)"
    >
      <game-name
        :sport-id="match.sportID"
        :group-type="game.groupType"
        :bet-stage="game.betStage"
        :game-type="game.gameType"
      />
      <icon-arrow
        class="expand-arrow"
        width=".08rem"
        height=".14rem"
        :direction="expanded ? 'up' : 'down'"
      />
    </v-touch>
    <expand-transition :expanded="expanded">
      <finish-option-list
        :match="match"
        :game="game"
      />
    </expand-transition>
  </div>
</template>
<script>
import GameName from '@/components/common/GameName';
import FinishOptionList from './FinishOptionList';

export default {
  props: {
    expanded: {
      default: true,
    },
    game: {},
    match: {},
  },
  components: {
    GameName,
    FinishOptionList,
  },
};
</script>
<style lang="less">
.x-finish-game-item {
  box-shadow: 0 10px 20px 0 rgba(236, 236, 236, 0.5);
  background: linear-gradient(to top, #f9f9f9, #ffffff);
  color: #909090;
  border-radius: 10px;
  margin-bottom: .1rem;
  overflow: hidden;
  &:last-child {
    margin-bottom: 0;
  }
  .game-item-title {
    position: relative;
    line-height: .38rem;
    font-size: .14rem;
    padding-left: .1rem;
    .expand-arrow {
      position: absolute;
      right: .2rem;
      top: .13rem;
      width: .08rem;
      height: .14rem;
      path {
        fill: #C8C8CA;
      }
    }
  }
}
.blue .x-finish-game-item {
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
  background: linear-gradient(to bottom, #3a393f, #333238);
  border: solid 1px #2e2f34;
  color: #909090;
  .game-item-title .expand-arrow path { fill: #666666; }
}
</style>
