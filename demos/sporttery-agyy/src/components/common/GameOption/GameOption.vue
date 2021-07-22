<template>
  <v-touch
    class="game-option"
    :class="{
      active: checked,
      'odds-upper': option.oddsUpper,
      'odds-lower': option.oddsLower,
      disabled: option.betStatus <= 6,
    }"
    v-if="option"
    @tap="toogleBet"
  >
    <div class="name">
      <span v-if="optionName.prefix" class="option-bar" >{{optionName.prefix}}</span>
      <span v-if="optionName.key">{{$t(`common.optionNames.${optionName.key}`)}}</span>
      <span v-if="optionName.value">{{optionName.value}}</span>
      <span v-if="optionName.suffix">{{optionName.suffix}}</span>
    </div>
    <div class="odds">{{option.odds | oddsFormat(game.gameType)}}</div>
    <bet-item
      ref="betControl"
      v-model="checked"
      :oid="option.optionID"
      class="bet-item-placeholder"
    />
  </v-touch>
  <div v-else class="game-option">&nbsp;</div>
</template>
<script>
import BetItem from '@/components/Bet/BetItem';
import toOptionName from './toOptionName';

export default {
  props: ['match', 'game', 'option', 'games'],
  data() {
    return {
      checked: false,
    };
  },
  computed: {
    optionName() {
      return toOptionName(
        this.game.gameType,
        this.option.betBar,
        this.option.betOption,
      );
    },
  },
  components: {
    BetItem,
  },
  methods: {
    toogleBet() {
      // status 小于7的不能投注
      if (!this.checked && this.option.betStatus < 7) {
        return;
      }
      this.$refs.betControl.bet({
        sportID: this.match.sportID,
        matchID: this.match.matchID,
        optionID: this.option.optionID,
        tournamentName: this.match.abbrName || this.match.tournamentName,
        competitor1Name: this.match.competitor1Name,
        competitor2Name: this.match.competitor2Name,
        matchScore: this.match.matchScore,
        matchState: this.match.matchState,
        fromList: !!this.match.fromList,
        games: JSON.parse(JSON.stringify(this.games)),
        fastFlag: !!this.match.isQuickBet,
      });
    },
  },
};
</script>
<style lang="less">
.game-option {
  display: flex;
  line-height: .38rem;
  transition: all .15s;
  position: relative;
  div {
    display: block;
    // min-width: .58rem;
    width: 100%;
  }
  .name {
    padding-right: .05rem;
    text-align: right;
    font-size: .12rem;
    color: #666;
  }
  .option-bar {
    color: #bababa;
    margin-right: .08rem;
  }
  .odds {
    padding-left: .05rem;
    font-size: .16rem;
    color: #ff5353;
  }
  &.active {
    background: #FF5353;
    .name,.option-bar,.odds {
      color: #fff;
    }
  }
  &.disabled .odds{
    color: #666;
  }
  &.odds-upper::before,
  &.odds-upper::after,
  &.odds-lower::before,
  &.odds-lower::after {
    position: absolute;
    content: "";
    display: block;
    width: .08rem;
    height: .08rem;
    right: 0;
    animation: blink 1s linear infinite;
  }
  &.odds-upper::before {
    top: 0;
    background: linear-gradient(-135deg, #FF4A4A 50%, transparent 55%);
  }
  &.odds-lower::after {
    bottom: 0;
    background: linear-gradient(-45deg, #7CCD5D 50%, transparent 55%);
  }
  .bet-item-placeholder {
    display: none;
  }
}

@keyframes blink {
  from,
  50%,
  to {
    opacity: 1;
  }

  25%,
  75% {
    opacity: 0;
  }
}

</style>
