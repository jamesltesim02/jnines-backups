<template>
  <div
    v-if="match"
    class="quick-item-b06"
  >
    <h5>{{match.tournamentName}}</h5>
    <ul class="team-and-time">
      <li class="team1">{{match.competitor1Name}}</li>
      <li class="time">{{match.matchDate | dateFormat('M/d HH:mm')}}</li>
      <li class="team2">{{match.competitor2Name}}</li>
    </ul>
    <ul class="bet-options">
      <li
        v-for="(o, i) in options"
        :key="i"
      >
        <game-option
          :option="o"
          :game="game"
          :match="match"
          :games="[game]"
        />
      </li>
    </ul>
  </div>
</template>
<script>
import GameOption from '@/components/common/GameOption';

export default {
  props: ['slide'],
  components: {
    GameOption,
  },
  computed: {
    match() {
      return this.slide.slideMatch;
    },
    options() {
      let options = [undefined, undefined, undefined];
      if (this.match && this.match.options) {
        options = this.match.options; // eslint-disable-line prefer-destructuring
        if (Array.isArray(options[0])) {
          options = options[0]; // eslint-disable-line prefer-destructuring
        }
      }
      return options;
    },
    game() {
      if (typeof this.options[0] === 'undefined') {
        return {};
      }
      const option = this.options[0];
      return {
        betBar: '',
        gameType: option.gameType,
        betStage: option.betStage,
        betStatus: option.betStatus,
        groupType: option.groupType,
        sportID: option.sportID,
      };
    },
  },
};
</script>
<style lang="less">
.quick-item-b06 {
  padding: .1rem 0;
  color: #fff;
  h5 {
    font-size: 14px;
    font-weight: normal;
    text-align: center;
  }
  .team-and-time {
    display: flex;
    text-align: center;
    margin-top: .08rem;
    li {
      line-height: .16rem;
    }
    .team1, .team2 {
      width: 40%;
      font-size: .16rem;
    }
    .time {
      width: 20%;
      font-size: .13rem;
      color: rgba(255, 255, 255, .7);
      font-family: PingFangSC;
    }
  }
  .bet-options {
    display: flex;
    justify-content: space-around;
    margin-top: .12rem;
    li {
      width: 1.03rem;
      .game-option {
        line-height: .3rem;
        .name {
          display: none;
        }
        .odds {
          text-align: center;
          padding: 0;
          border: 1px solid #3F3F3F;
          border-radius: 10rem;
        }
        &.active {
          .odds {
            border-color: #ff5353;
            background: #ff5353;
            color: #fff !important;
          }
        }
      }
    }
  }
}
</style>
