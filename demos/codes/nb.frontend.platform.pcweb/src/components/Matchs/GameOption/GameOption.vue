<template>
  <div
    v-if="option"
    :class="classes"
    @click="toggleBet"
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
      :type="type"
      class="bet-item-placeholder"
    />
  </div>
  <div v-else class="game-option">&nbsp;</div>
</template>
<script>
import { mapState } from 'vuex';
import { toPortalUrlByKey } from '@/utils/PortalUtils';
import BetItem from '@/components/Bet/BetItem';
import toOptionName from './toOptionName';

export default {
  props: ['match', 'game', 'option'],
  data() {
    return {
      checked: false,
    };
  },
  computed: {
    ...mapState('app', ['isLoged']),
    ...mapState('match', ['detailOptionRefreshToken']),
    optionName() {
      return toOptionName(
        this.game.gameType,
        this.game.betBar || this.option.betBar,
        this.option.betOption,
      );
    },
    classes() {
      return {
        'game-option': true,
        unempty: true,
        // 已选中
        active: this.checked,
        // 不可投
        disabled: this.option.betStatus <= 6,
        // 赔率上升
        'odds-lower': this.option.oddsStatus < 0,
        // 赔率下降
        'odds-upper': this.option.oddsStatus > 0,
      };
    },
    type() {
      return this.match.isQuickBet ? 'fast' : '';
    },
  },
  components: { BetItem },
  watch: {
    detailOptionRefreshToken() {
      this.$forceUpdate();
    },
  },
  methods: {
    toggleBet() {
      // status 小于7的不能投注
      if (!this.checked && this.option.betStatus < 7) {
        return;
      }

      if (!this.isLoged) {
        toPortalUrlByKey('LOGIN_PAGE_URL');
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
        games: [{
          ...this.game,
        }],
        type: this.type,
      });
    },
  },
};
</script>
<style lang="less">
.game-option {
  display: flex;
  &.unempty {
    cursor: pointer;
  }
  &.disabled {
    cursor: default;
    filter: grayscale(100%);
  }
  &.active,
  &.active:hover {
    background: #ff5353;
    .name,
    .odds {
      color: #fff;
    }
  }
  &:hover {
    background: rgba(64, 63, 68, .4);
    transition: background-color .25s ease-out;
  }
  .name {
    width: 45%;
    text-align: right;
    color: #666;
    font-size: 12px;
    transition: color .35s ease-out;
  }
  .option-bar {
    margin-right: 10px;[]
  }
  .odds {
    width: 55%;
    text-align: left;
    padding-left: 10px;
    color: #ff5353;
    transition: color .35s ease-out;
  }
  &.odds-lower::before,
  &.odds-upper::before {
    position: absolute;
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    right: 0;
    animation: blink 1s linear infinite;
  }
  &.odds-lower::before {
    bottom: 0;
    background: linear-gradient(-45deg, #7CCD5D 50%, transparent 55%);
  }
  &.odds-upper::before {
    top: 0;
    background: linear-gradient(-135deg, #FF4A4A 50%, transparent 55%);
  }
}
</style>
