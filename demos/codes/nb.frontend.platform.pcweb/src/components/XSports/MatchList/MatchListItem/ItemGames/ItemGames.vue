<template>
  <div class="x-item-games">
    <header class="row">
      <game-name
        v-for="(m, i) in mapping"
        :key="i"
        :sport-id="match.sportID"
        group-type="1"
        :bet-stage="m.betStage"
        :game-type="m.gameType"
      />
    </header>
    <div
      v-if="waitingSettle"
      class="settle-msg"
    >
      该比赛还未结算完成
    </div>
    <section
      v-else
      class="row"
    >
      <template v-for="(g, gi) in games">
        <ul :key="gi">
          <template v-if="g && (g.options || g.scoreOption)">
            <li
              v-for="(o, oi) in (g.options || g.scoreOption)"
              :key="oi"
              :class="{
                finised: finished,
              }"
            >
              <finished-option
                v-if="finished"
                :match="match"
                :game="g"
                :option="o"
              />
              <game-option
                v-else
                :match="match"
                :game="g"
                :option="o"
              />
            </li>
          </template>
        </ul>
      </template>
    </section>
  </div>
</template>
<script>
import matchListGamesMapping from './matchListGamesMapping';
import GameName from '@/components/Matchs/GameName';
import GameOption from '@/components/Matchs/GameOption';
import FinishedOption from './FinishedOption';

export default {
  props: {
    match: {
      required: true,
    },
  },
  computed: {
    mapping() {
      return matchListGamesMapping[this.match.sportID];
    },
    games() {
      const gs = this.match.games || this.match.scoreGame;

      return this.mapping.map(
        ({
          betStage: st,
          gameType: gt,
        }) => gs.find(
          g => g && st === g.betStage && gt === g.gameType,
        ),
      );
    },
    finished() {
      return this.match.matchState === 3;
    },
    waitingSettle() {
      if (!this.finished) {
        return false;
      }

      const { scoreGame } = this.match;
      if (!scoreGame || !scoreGame.length) {
        return true;
      }

      if (!scoreGame[0].scoreOption || (
        !scoreGame[0].scoreOption[0].matchResult
        && !scoreGame[0].scoreOption[0].settleResult
      )) {
        return true;
      }

      return false;
    },
  },
  components: {
    GameName,
    GameOption,
    FinishedOption,
  },
};
</script>

<style lang="less">
.x-item-games {
  text-align: center;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  .row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-column-gap: 24px;
    padding: 0 14px;
  }
  header {
    height: 38px;
    line-height: 38px;
    border-bottom: 1px solid #e8e8e8;
    color: #a8a8a8;
  }
  section {
    ul {
      padding: 4px 0 12px 0;
    }
    li {
      margin-top: 8px;
      background: #fff;
      border: solid 1px rgba(242, 241, 241, .5);
      box-shadow: 0 2px 5px 0 rgba(223, 222, 223, 0);
      border-radius: 6px;
      line-height: 30px;
      overflow: hidden;
      transition: all .25s ease-out;
      &:hover {
        box-shadow: 0 2px 5px 0 rgba(223, 222, 223, 0.2);
        border: solid 1px #ededed;
        .game-option {
          background: rgba(255, 255, 255,  1);
        }
      }
      .game-option {
        transition: all .25s ease-out;
        background: rgba(255, 255, 255, .5);
        .option-bar {
          color: #bababa;
          margin-right: 4px;
        }
        .odds {
          font-size: 16px;
        }
      }
      .game-option.active {
        .option-bar {
          color: #fff;
        }
        background: #ff5353;
      }
    }
    li.finised {
      border-color: transparent;
    }
  }
  .settle-msg {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.dark .x-item-games {
  header {
    border-bottom: 1px solid #303136;
    color: #888;
  }
  section {
    li {
      background-color: #3B3A41;
      border-color: #36353b;
      &:hover {
        border: solid 1px #3d3c43;
        background-color: #46454d;
        box-shadow: none;
      }
      .game-option {
        background: transparent;
        .odds {
          color: #53fffd;
        }
      }
      .game-option.active {
        background: #00b5b3;
        .option-bar,
        .odds {
          color: #fff;
        }
      }
    }
  }
}
</style>
