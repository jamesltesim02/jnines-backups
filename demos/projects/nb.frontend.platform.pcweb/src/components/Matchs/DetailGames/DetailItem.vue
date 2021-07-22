<template>
  <div
    v-if="optionLength > 0"
    class="detail-item"
  >
    <div
      class="item-title"
      @click="expanded = !expanded"
    >
      <game-name
        :sport-id="game.sportID"
        :group-type="game.groupType"
        :bet-stage="game.betStage"
        :game-type="game.gameType"
      />
      <button>
        <icon-arrow
          :direction="expanded ? 'up' : 'down'"
        />
      </button>
    </div>
    <expand-box
      class="item-content"
      :expanded="expanded"
    >
      <detail-options
        :game="game"
        :match="match"
      />
    </expand-box>
  </div>
</template>
<script>
import GameName from '../GameName';
import DetailOptions from './DetailOptions';

export default {
  props: ['game', 'match'],
  data() {
    return {
      expanded: true,
    };
  },
  components: {
    GameName,
    DetailOptions,
  },
  computed: {
    optionLength() {
      const { game: { options } } = this;
      if (!options || !options.length) {
        return 0;
      }
      if (!Array.isArray(options[0])) {
        return options.length;
      }

      return options.reduce((acc, curr) => acc || curr.length, 0);
    },
  },
};
</script>
<style lang="less">
.detail-item {
  margin-top: 10px;
  background: linear-gradient(to bottom, #29282e, #2b2a31);
  border-radius: 6px;
  overflow: hidden;
  .item-title {
    position: relative;
    border-bottom: 1px solid #1e1d23;
    padding-left: 37px;
    line-height: 37px;
    cursor: pointer;
    button {
      position: absolute;
      right: 15px;
      padding: 10px 15px;
      svg {
        height: 12px;
        width: 8px;
        g path{
          fill: #909090;
        }
      }
    }
  }
  .item-content .detail-options{
    padding: 12px 8px;
  }
}
</style>
