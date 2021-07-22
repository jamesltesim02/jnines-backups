<template>
  <div
    v-if="optionLength > 0"
    class="x-detail-item"
  >
    <div
      :class="{
        'item-title': true,
        expanded: expanded,
      }"
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
          size="13"
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
import GameName from '@/components/Matchs/GameName';
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
.x-detail-item {
  margin-top: 10px;
  background-image: linear-gradient(to top, #f9f9f9, #ffffff);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 10px 20px 0 rgba(236, 236, 236, 0.5);
  border: 1px solid #ebe9e9;
  .item-title {
    position: relative;
    padding-left: 37px;
    line-height: 37px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0);
    transition: all .25s ease-out;
    button {
      position: absolute;
      right: 15px;
      padding: 10px 15px;
      svg g path{
        fill: #C8C8CA;
      }
    }
    &.expanded {
      border-bottom: 1px solid #ecebeb;
    }
  }
  .detail-options {
    padding: 0;
    & > li {
      margin: 0;
      border-right: 1px solid #ecebeb;
      &:last-child {
        border: 0;
      }
      li {
        margin-top: 0;
        border-bottom: 1px solid #ecebeb;
        &:last-child {
          border: 0;
        }
      }
    }
    .option-item {
      border-radius: 0;
      &:hover {
        .game-option {
          background: transparent;
        }
        .game-option.active {
          background: transparent;
        }
      }
    }
    .option-item.unempty {
      position: relative;
      * {
        position: relative;
        z-index: 1;
      }
      &::before {
        display: none;
      }
      &:hover {
        .game-option {
          background: #f7f7f7;
        }
        .game-option.active {
          background: #ff5353;
        }
      }
    }
    .option-bar {
      color: #bababa;
      margin-right: 4px;
    }
  }
}

.dark .x-detail-item {
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
  border-color: #2e2f34;
  background-image: linear-gradient(to bottom, #3a393f, #333238);
  .item-title {
    border-bottom: solid 1px #2e2f34;
    button svg g path {
      fill: #666;
    }
  }
  .detail-options {
    li {
      border-color: #2e2f34;
      .option-item.unempty {
        .odds {
          color: #53fffd;
        }
        &:hover {
          .game-option {
            background: #3B3A41;
          }
          .game-option.active {
            background: #00b5b3;
          }
        }
        .game-option.active {
          background: #00b5b3;
          .odds {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
