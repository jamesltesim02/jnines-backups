<template>
  <div class="nb-cart-option">
    <div :class="boxClass" v-if="!betCheck" >
      <div class="detail-real-head flex-start">
        <span class="head-index" v-if="showId || !isSingle" :style="{ color: oddsColor }">{{data.idx}}</span>
        <rolling-text class="head-team" :text="getOptName(data)" :maxLength="11" scrollamount="1" />
        <span class="head-odds">{{getOddv(data)}}</span>
        <span class="head-blank"></span>
        <span class="head-score" v-if="data.live || /^1$/.test(data.matchState)" :style="{ color: liveColor }">
          {{data.msc || data.matchScore}}
        </span>
        <span class="head-blank"></span>
        <div class="head-win-box" v-if="!isSingle">
          <span class="head-box-win" v-if="/^\d{2,3}$/.test(data.res)" :style="winStyle">{{data.winStu}}</span>
          <span class="head-box-lose" v-else-if="/^-\d{2,3}$/.test(data.res)" :style="loseStyle">{{data.winStu}}</span>
          <span class="head-box-other" v-else>{{data.winStu || ''}}</span>
        </div>
      </div>
      <div class="cart-body-item flex-start">
        <span class="body-item-team">{{$t(`common.wf.wf_${getJoinStr(data)}`)}}</span>
      </div>
      <div class="cart-body-item flex-start">
        <rolling-text class="body-item-legal" :text="data.tn || data.tournamentName || ''" :maxLength="7" scrollamount="1" />
        <div class="body-item-line flex-center"></div>
        <rolling-text class="body-item-team" :text="getCompName(data)" :maxLength="23" scrollamount="2" />
      </div>
    </div>
    <div class="cart-body-mix" v-else >
      <div class="detail-real-head flex-start">
        <span class="head-index" v-if="showId || !isSingle" :style="{ color: oddsColor }">{{data.idx}}</span>
        <span class="head-team-mix">{{getOptName(data)}}</span>
        <div :class="`head-odds-mix${data.alert ? '-alert' : ''} flex-center`">
          <span class="head-odds-txt flex-center">@</span>
          <span class="head-odds-num flex-center">{{getOddv(data)}}</span>
        </div>
        <span class="head-alert flex-center" v-if="data.alert"><bet-odds-up :down="data.alert < 0" /></span>
        <span class="head-score-mix" v-if="data.live || /^[12]$/.test(data.matchState)" :style="{ color: liveColor }">
          {{data.msc || data.matchScore}}
        </span>
        <span class="head-blank"></span>
        <div class="head-win-box" v-if="!isSingle">
          <span class="head-box-win" v-if="/^\d{2,3}$/.test(data.res)" :style="winStyle">{{data.winStu}}</span>
          <span class="head-box-lose" v-else-if="/^-\d{2,3}$/.test(data.res)" :style="loseMixStyle">{{data.winStu}}</span>
          <span class="head-box-other" v-else>{{data.winStu || ''}}</span>
        </div>
      </div>
      <div class="cart-body-item  flex-start">
        <span class="mix-body-legal flex-center">{{data.tn || data.tournamentName || ''}}</span>
        <span class="mix-body-game flex-center">{{$t(`common.wf.wf_${getJoinStr(data)}`)}}</span>
      </div>
      <div class="cart-body-item  flex-start">
        <span class="mix-comp-name flex-center">{{getCompName(data)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { changeNumType } from '@/utils/betUtils';
import toOptionName from '@/components/Matchs/GameOption/toOptionName';
import oddsFormat from '@/filters/oddsFormat';
import RollingText from '@/components/common/RollingText';
import BetOddsUp from '@/components/Bet/BetComps/BetOddsUp';

export default {
  inheritAttrs: false,
  name: 'BetCartOption',
  props: { data: Object, isSingle: Boolean, showId: Boolean },
  computed: {
    ...mapState('app', ['theme', 'bettingMode', 'bettingStyle']),
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
    boxClass() {
      return `cart-body-${this.isSingle ? 'single' : 'multiple'}`;
    },
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    winColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BET_HIS_WIN_COLOR ? pSet.BLACK_BET_HIS_WIN_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_BET_HIS_WIN_COLOR ? pSet.WHITE_BET_HIS_WIN_COLOR : '#ff5353';
    },
    winStyle() {
      return { border: `1px solid ${this.winColor}`, color: this.winColor };
    },
    loseColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BET_HIS_LOSE_COLOR ? pSet.BLACK_BET_HIS_LOSE_COLOR : '#428723';
      }
      return pSet && pSet.WHITE_BET_HIS_LOSE_COLOR ? pSet.WHITE_BET_HIS_LOSE_COLOR : '#428723';
    },
    loseStyle() {
      return { border: `1px solid ${this.loseColor}`, color: this.loseColor };
    },
    liveColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_LIVE_FLAG_COLOR ? pSet.BLACK_LIVE_FLAG_COLOR : '#fe6246';
      }
      return pSet && pSet.WHITE_LIVE_FLAG_COLOR ? pSet.WHITE_LIVE_FLAG_COLOR : '#fe6246';
    },
  },
  components: { RollingText, BetOddsUp },
  methods: {
    getOddv(v) {
      if (v.odv) {
        return changeNumType(v.odv, true, 3);
      }
      const oddOld = v.ods || v.odds;
      const oddNew = oddsFormat(oddOld, v.gmt || v.gameType);
      return changeNumType(oddNew - oddOld > 0.5 ? oddOld + 1 : oddOld, true, 3);
    },
    getJoinStr(v) {
      return `${v.sno || v.sportID}_${v.gpt || v.groupType || 0}_${v.stg || v.betStage || 0}_${v.gmt || v.gameType || 0}`;
    },
    getOptName(v) {
      const obj = toOptionName(v.gmt || v.gameType, v.bar || v.betBar, v.bop || v.betOption);
      let optName = obj.key_s ? this.$t(`common.optionNames.${obj.key_s}`) : '';
      optName += obj.prefix ? `${/-/.test(obj.prefix) ? '' : '+'}${obj.prefix} ` : '';
      optName += obj.key_e ? this.$t(`common.optionNames.${obj.key_e}`) : '';
      optName += !obj.key_s && obj.key ? this.$t(`common.optionNames.${obj.key}`) : '';
      return `${optName}${obj.value || ''}${obj.suffix || ''}`;
    },
    getCompName(v) {
      const cStr = v.mn || v.compName || '';
      return cStr && v.fmsc ? cStr.replace(/\s+vs\s+/i, ` ${v.fmsc.replace(':', ' vs ')} `) : cStr;
    },
  },
};
</script>

<style lang="less">
.nb-cart-option {
  width: 100%;
  .cart-body-item { width: 100%; height: 21px; padding: 0 12px; }
  .cart-body-item { span, marquee { white-space: nowrap; font-size: 12px; user-select: none; line-height: 100%; } }
  .body-item-legal { max-width: 40px; }
  .body-item-team { max-width: 150px; }
  .body-item-line { width: 7px; height: 12px; margin-right: 6px; }
  .cart-body-single .detail-real-head .head-team { font-size: 16px; }
  .cart-body-multiple .detail-real-head .head-team { font-size: 14px; }
  .cart-body-single .detail-real-head .head-odds { font-size: 16px; }
  .cart-body-multiple .detail-real-head .head-odds { font-size: 14px; }
  .detail-real-head { width: 100%; height: 34px; padding: 0 12px; }
  .head-index { font-size: 13px; padding-top: 1px; padding-right: 5px; }
  .head-team { max-width: 100px; white-space: nowrap; user-select: none; }
  .head-odds { padding-left: 5px; user-select: none; }
  .head-team-mix { font-size: 16px; margin-right: 8px; font-family: PingFangSC; }
  .head-odds-mix, .head-odds-mix-alert { height: 21px; font-weight: 500; padding: 0 3px; border-radius: 3px; span { font-size: 16px; height: 100%; } }
  .head-odds-mix, .head-odds-mix-alert { .head-odds-txt { font-family: PingFangSC; padding-right: 1px; } }
  .head-blank { padding-left: 15px; }
  .head-score, .head-score-mix { border-radius: 2px; padding: 2px 4px; font-size: 13px; user-select: none; }
  .head-score-mix { margin-left: 15px; }
  .head-win-box span { padding: 4px; border-radius: 2px; font-size: 12px; user-select: none; }
  .head-alert { width: 18px; height: 100%; margin-left: 5px; }
  .mix-body-legal { height: 12px; padding-right: 8px; font-size: 12px; }
  .mix-body-game { height: 12px; padding-left: 8px; font-size: 12px; }
  .mix-comp-name { padding-right: 15px; font-size: 12px; }
  .mix-comp-rst { width: 32px; height: 15px; line-height: 15px; border-radius: 7px; font-size: 11px; }
}
.white .nb-cart-option {
  .head-win-box .head-box-other { border: 1px solid transparent; color: #909090; }
  .body-item-line { border-right: 1px solid #CCC; }
  .cart-body-single .cart-body-item span, .cart-body-single .cart-body-item marquee { color: #3A3A3A; }
  .cart-body-multiple .cart-body-item span, .cart-body-multiple .cart-body-item marquee { color: #666; }
  .cart-body-mix .cart-body-item span, .cart-body-mix .cart-body-item marquee { color: #909090; }
  .head-team, .head-odds { color: #333; }
  .head-team-mix { color: #333; font-weight: 600; }
  .head-odds-mix { color: #ff5353; }
  .head-odds-mix-alert { background: #ff5353; color: #fff; }
  .head-score, .head-score-mix { background: rgba(255,104,27,0.1); }
  .mix-body-legal { border-right: 1px solid #ccc; }
  .mix-comp-rst { background: #bababa; color: #fff !important; }
}
</style>
