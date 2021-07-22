<template>
  <v-touch
    v-if="getOption()"
    :class="{
      active: checked,
      'game-option': true,
      'odds-upper': getOption().oddsUpper,
      'odds-lower': getOption().oddsLower,
    }"
    :style="btnStyle"
    @tap="toggleBet"
  >
    <i class="odds-change-flag" :style="flagStyle"></i>
    <div class="name">
      <span v-if="optionName.prefix" class="option-bar" >{{optionName.prefix}}</span>
      <span v-if="optionName.key">{{$t(`common.optionNames.${optionName.key}`)}}</span>
      <span v-if="optionName.value">{{optionName.value}}</span>
      <span v-if="optionName.suffix">{{optionName.suffix}}</span>
    </div>
    <div
      class="odds"
      :style="{ color: oddsColor }"
    >
      {{getOption().odds | oddsFormat(game.gameType)}}
    </div>
    <bet-item
      ref="betControl"
      v-model="checked"
      :oid="getOption().optionID"
      class="bet-item-placeholder"
    />
  </v-touch>
  <div v-else class="game-option">&nbsp;</div>
</template>
<script>
import { mapState } from 'vuex';
import { toPoralUrlByKey } from '@/utils/PortalUtils';
import BetItem from '@/components/Bet/BetItem';
import toOptionName from './toOptionName';

export default {
  props: ['match', 'game', 'option', 'options', 'optionIndex', 'games'],
  data() {
    return { checked: false };
  },
  computed: {
    ...mapState('app', ['theme', 'isLoged']),
    ...mapState('match', ['detailOptionRefreshToken']),
    optionValue() {
      return typeof this.optionIndex === 'undefined' ? this.option : this.options[this.optionIndex];
    },
    optionName() {
      return toOptionName(this.game.gameType, this.getOption().betBar, this.getOption().betOption);
    },
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (this.getOption().betStatus <= 6) {
        return '#666';
      }
      if (this.checked) {
        return '#ffffff';
      }
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_OPTION_COLOR ? pSet.BLUE_OPTION_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    btnStyle() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      let str = 'transparent';
      if (this.checked) {
        if (/^black$/i.test(this.theme)) {
          str = pSet && pSet.BLACK_BOTTON_BACKGROUND ? pSet.BLACK_BOTTON_BACKGROUND : '#ff5353';
        } else if (/^blue$/i.test(this.theme)) {
          str = pSet && pSet.BLUE_BOTTON_BACKGROUND ? pSet.BLUE_BOTTON_BACKGROUND : '#00b5b3';
        } else {
          str = pSet && pSet.WHITE_BOTTON_BACKGROUND ? pSet.WHITE_BOTTON_BACKGROUND : '#ff5353';
        }
      }
      return { background: str };
    },
    flagColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (this.getOption().oddsUpper) {
        if (/^black$/i.test(this.theme)) {
          return pSet && pSet.BLACK_ODDS_UPPER_COLOR ? pSet.BLACK_ODDS_UPPER_COLOR : '#FF4A4A';
        }
        if (/^blue$/i.test(this.theme)) {
          return pSet && pSet.BLUE_ODDS_UPPER_COLOR ? pSet.BLUE_ODDS_UPPER_COLOR : '#FF4A4A';
        }
        return pSet && pSet.WHITE_ODDS_UPPER_COLOR ? pSet.WHITE_ODDS_UPPER_COLOR : '#FF4A4A';
      }
      if (this.getOption().oddsLower) {
        if (/^black$/i.test(this.theme)) {
          return pSet && pSet.BLACK_ODDS_LOWER_COLOR ? pSet.BLACK_ODDS_LOWER_COLOR : '#7CCD5D';
        }
        if (/^blue$/i.test(this.theme)) {
          return pSet && pSet.BLUE_ODDS_LOWER_COLOR ? pSet.BLUE_ODDS_LOWER_COLOR : '#7CCD5D';
        }
        return pSet && pSet.WHITE_ODDS_LOWER_COLOR ? pSet.WHITE_ODDS_LOWER_COLOR : '#7CCD5D';
      }
      return 'transparent';
    },
    flagStyle() {
      const [up, co] = [this.getOption().oddsUpper ? 13 : 4, this.flagColor];
      return { background: `linear-gradient(-${up}5deg, ${co} 50%, transparent 55%)` };
    },
    optionID() {
      console.log(this.getOption());
      return this.getOption().optionID;
    },
  },
  components: { BetItem },
  watch: {
    detailOptionRefreshToken() {
      this.$forceUpdate();
    },
  },
  methods: {
    getOption() {
      return typeof this.optionIndex === 'undefined' ? this.option : this.options[this.optionIndex];
    },
    toggleBet() {
      // status 小于7的不能投注
      if (!this.checked && this.getOption().betStatus < 7) {
        return;
      }

      if (!this.isLoged) {
        toPoralUrlByKey('LOGIN_PAGE_URL');
        return;
      }

      const params = {
        sportID: this.match.sportID,
        matchID: this.match.matchID,
        optionID: this.getOption().optionID,
        tournamentName: this.match.abbrName || this.match.tournamentName,
        competitor1Name: this.match.competitor1Name,
        competitor2Name: this.match.competitor2Name,
        matchScore: this.match.matchScore,
        matchState: this.match.matchState,
        fromList: !!this.match.fromList,
        games: JSON.parse(JSON.stringify(this.games)),
        fastFlag: !!this.match.isQuickBet,
      };

      this.$refs.betControl.bet(params);
    },
  },
};
</script>
<style lang="less">
.game-option {
  display: flex;
  line-height: .38rem;
  transition: all  .25s ease-out;
  position: relative;
  div { display: block; width: 100%; }
  .name {
    padding-right: .05rem;
    text-align: right;
    font-size: .12rem;
    color: #666;
  }
  .option-bar { color: #bababa; margin-right: .08rem; }
  .odds { padding-left: .05rem; font-size: .16rem; }
  &.active { .name,.option-bar,.odds { color: #fff; } }
  &.odds-upper .odds-change-flag, &.odds-lower .odds-change-flag {
    position: absolute;
    content: "";
    display: block;
    width: .08rem;
    height: .08rem;
    right: 0;
    animation: blink 1s linear infinite;
  }
  &.odds-upper .odds-change-flag { top: 0; }
  &.odds-lower .odds-change-flag { bottom: 0; }
  .bet-item-placeholder { display: none; }
}
@keyframes blink { from, 50%, to { opacity: 1; } 25%, 75% { opacity: 0; } }
</style>
