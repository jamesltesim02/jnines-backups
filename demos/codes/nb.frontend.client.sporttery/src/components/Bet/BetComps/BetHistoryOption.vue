<template>
  <v-touch class="nb-history-option" @tap="toResultPage(data)" >
    <div :class="boxClass" v-if="!/^3$/.test(betMode)" >
      <div class="detail-real-head flex-start">
        <span class="head-index" v-if="showId || !isSingle" :style="{ color: oddsColor }">{{data.idx}}</span>
        <rolling-text class="head-team" :text="getOptName(data)" :maxLength="11" scrollamount="1" />
        <span class="head-odds">{{getOddv(data) | NumFmt(true, 3)}}</span>
        <span class="head-blank"></span>
        <span class="head-score" v-if="data.live || /^[12]$/.test(data.matchState)" :style="{ color: liveColor }">
          {{data.msc || data.matchScore}}
        </span>
        <span class="head-blank"></span>
        <div class="head-win-box" v-if="!isSingle">
          <span class="head-box-win" v-if="/^\d{2,3}$/.test(data.res)" :style="winStyle">{{data.winStu}}</span>
          <span class="head-box-lose" v-else-if="/^-\d{2,3}$/.test(data.res)" :style="loseStyle">{{data.winStu}}</span>
          <span class="head-box-other" v-else>{{data.winStu || ''}}</span>
        </div>
      </div>
      <div class="history-body-item flex-start">
        <span class="body-item-team">{{$t(`common.wf.wf_${getJoinStr(data)}`)}}</span>
      </div>
      <div class="history-body-item flex-start">
        <rolling-text class="body-item-legal" :text="data.tn || data.tournamentName || ''" :maxLength="17" scrollamount="1" />
        <div class="body-item-line flex-center"></div>
        <rolling-text class="body-item-team" :text="getCompName(data)" :maxLength="37" scrollamount="2" />
      </div>
    </div>
    <div class="history-body-mix" v-else-if="!isFollow" >
      <div class="detail-real-head flex-start">
        <span class="head-index" v-if="showId || !isSingle" :style="{ color: oddsColor }">{{data.idx}}</span>
        <span class="head-team-mix">{{getOptName(data)}}</span>
        <div :class="`head-odds-mix${data.alert ? '-alert' : ''} flex-center`">
          <span class="head-odds-txt">@</span>
          <span class="head-odds-num">{{getOddv(data) | NumFmt(true, 3)}}</span>
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
      <div class="history-body-item flex-start">
        <span class="mix-body-legal flex-center">{{data.tn || data.tournamentName || ''}}</span>
        <span class="mix-body-game flex-center">{{$t(`common.wf.wf_${getJoinStr(data)}`)}}</span>
      </div>
      <div class="history-body-item flex-start">
        <span class="mix-comp-name flex-center">{{getCompName(data)}}</span>
      </div>
    </div>
    <div class="history-body-flw" v-else >
      <div class="detail-head-flw flex-start">
        <div class="detail-head-flw-lft flex-start">
          <div class="head-flw-sport flex-center">{{getSptName(data)}}</div>
          <div class="head-flw-date flex-center">{{getMatchDate(data)}}</div>
          <div class="head-flw-tour flex-center">{{data.tn || data.tournamentName || ''}}</div>
          <div class="head-flw-line flex-center"></div>
        </div>
        <div class="head-flw-team flex-start">{{getCompName(data)}}</div>
      </div>
      <div class="detail-foot-flw flex-start" v-if="isResult">
        <div class="foot-flw-name flex-center">{{getOptName(data)}}</div>
        <div class="foot-flw-odds-box flex-center">
          <span class="flw-odds-txt">@</span>
          <span class="flw-odds-num">{{getOddv(data) | NumFmt(true, 3)}}</span>
        </div>
        <div class="head-flw-line flex-center"></div>
        <div class="head-flw-game flex-start">{{$t(`common.wf.wf_${getJoinStr(data)}`)}}</div>
      </div>
    </div>
  </v-touch>
</template>

<script>
import { mapState } from 'vuex';
import toOptionName from '@/components/common/GameOption/toOptionName';
import BetOddsUp from '@/components/Bet/BetComps/BetOddsUp';
import RollingText from '@/components/common/RollingText';
import oddsFormat from '@/filters/oddsFormat';

export default {
  inheritAttrs: false,
  name: 'BetHistoryOption',
  props: {
    data: Object,
    isSingle: Boolean,
    showId: Boolean,
    isFollow: Boolean,
    isResult: Boolean,
  },
  computed: {
    ...mapState('app', { theme: state => state.theme, betMode: state => state.bettingMode }),
    needShow() {
      return /\/history\//i.test(this.$route.path);
    },
    boxClass() {
      return `history-body-${this.isSingle ? 'single' : 'multiple'}`;
    },
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_OPTION_COLOR ? pSet.BLUE_OPTION_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    winColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BET_HIS_WIN_COLOR ? pSet.BLACK_BET_HIS_WIN_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_BET_HIS_WIN_COLOR ? pSet.BLUE_BET_HIS_WIN_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_BET_HIS_WIN_COLOR ? pSet.WHITE_BET_HIS_WIN_COLOR : '#ff5353';
    },
    winStyle() {
      return { border: `.01rem solid ${this.winColor}`, color: this.winColor };
    },
    loseColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BET_HIS_LOSE_COLOR ? pSet.BLACK_BET_HIS_LOSE_COLOR : '#428723';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_BET_HIS_LOSE_COLOR ? pSet.BLUE_BET_HIS_LOSE_COLOR : '#909090';
      }
      return pSet && pSet.WHITE_BET_HIS_LOSE_COLOR ? pSet.WHITE_BET_HIS_LOSE_COLOR : '#428723';
    },
    loseStyle() {
      return { border: `.01rem solid ${this.loseColor}`, color: this.loseColor };
    },
    loseMixStyle() {
      let colorStr = /black/i.test(this.theme) ? '#909090' : '#bababa';
      colorStr = /blue/i.test(this.theme) ? '#909090' : colorStr;
      return { border: `.01rem solid ${colorStr}`, color: colorStr };
    },
    liveColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_LIVE_FLAG_COLOR ? pSet.BLACK_LIVE_FLAG_COLOR : '#fe6246';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_LIVE_FLAG_COLOR ? pSet.BLUE_LIVE_FLAG_COLOR : '#fe6246';
      }
      return pSet && pSet.WHITE_LIVE_FLAG_COLOR ? pSet.WHITE_LIVE_FLAG_COLOR : '#fe6246';
    },
  },
  components: { BetOddsUp, RollingText },
  methods: {
    getOddv(v) {
      if (v.odv) {
        return v.odv;
      }
      const oddOld = v.ods || v.odds;
      const oddNew = oddsFormat(oddOld, v.gmt || v.gameType);
      return oddNew - oddOld > 0.5 ? oddOld + 1 : oddOld;
    },
    getSptName(v) {
      const sptArr = this.$t('common.sports');
      return sptArr && sptArr[v.sno] ? sptArr[v.sno] : '';
    },
    getMatchDate(v) {
      const dt = new Date(+(v.matchStartTime || new Date().getTime()));
      return `${`0${dt.getMonth() + 1}`.slice(-2)}/${`0${dt.getDate()}`.slice(-2)}`;
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
    toResultPage(v) {
      if (v && v.fmsc && v.mid && this.needShow) {
        this.$router.push(`/finished/${v.mid}`);
      }
    },
    setWidthFun() {
      const bsEle = this.$el.querySelector('.detail-head-flw');
      const leftEle = this.$el.querySelector('.detail-head-flw-lft');
      const rightEle = this.$el.querySelector('.head-flw-team');
      if (bsEle && leftEle && rightEle) {
        const baseWidth = parseFloat(window.getComputedStyle(bsEle).width);
        const basePadding = parseFloat(window.getComputedStyle(bsEle).paddingLeft);
        const leftWidth = parseFloat(window.getComputedStyle(leftEle).width);
        const rightWidth = baseWidth - 2 * basePadding - leftWidth;
        rightEle.style.width = `${rightWidth}px`;
      }
    },
  },
  mounted() {
    setTimeout(() => { this.setWidthFun(); }, 20);
  },
};
</script>

<style lang="less">
.white .nb-history-option {
  .history-body-single, .history-body-multiple {
    .head-win-box .head-box-other { border: .01rem solid transparent; color: #909090; }
    .body-item-line { border-right: .01rem solid #CCC; }
  }
  .history-body-single .history-body-item span, .history-body-single .history-body-item marquee { color: #3A3A3A; }
  .history-body-multiple .history-body-item span, .history-body-multiple .history-body-item marquee { color: #666; }
  .history-body-mix .history-body-item span, .history-body-mix .history-body-item marquee { color: #909090; }
  .detail-real-head .head-team, .detail-real-head .head-odds { color: #333; }
  .detail-real-head  .head-team-mix { color: #333; font-weight: 600; }
  .detail-real-head .head-odds-mix { color: #ff5353; }
  .detail-real-head .head-odds-mix-alert { background: #ff5353; color: #fff; }
  .detail-real-head .head-score, .detail-real-head .head-score-mix { background: rgba(255,104,27,0.1); }
  .mix-body-legal { border-right: .01rem solid #ccc; }
  .mix-comp-rst { background: #bababa; color: #fff !important; }
  .head-flw-sport { border: .005rem solid #ff5353; color: #ff5353; }
  .head-flw-date { color: #aaaaaa; }
  .head-flw-tour { color: #aaaaaa; }
  .head-flw-line { background: #e2e2e2; }
  .head-flw-team { color: #aaaaaa; }
  .foot-flw-name { color: #aaaaaa; }
  .foot-flw-odds-box { color: #ff5353; }
  .head-flw-game { color: #aaaaaa; }
}
.black .nb-history-option {
  .history-body-single, .history-body-multiple {
    .head-win-box .head-box-other {  border: .01rem solid transparent; color: #bababa; }
    .body-item-line { border-right: .01rem solid #CCC; }
  }
  .history-body-single .history-body-item span, .history-body-single .history-body-item marquee { color: #bababa; }
  .history-body-multiple .history-body-item span, .history-body-multiple .history-body-item marquee { color: #bababa; }
  .history-body-mix .history-body-item span, .history-body-mix .history-body-item marquee { color: #bababa; }
  .detail-real-head .head-team, .detail-real-head .head-odds { color: #ecebeb; }
  .detail-real-head  .head-team-mix { color: #ecebeb; font-weight: 500; }
  .detail-real-head .head-odds-mix { color: #ff5353; }
  .detail-real-head .head-odds-mix-alert { background: #ff5353; color: #fff; }
  .detail-real-head .head-score, .detail-real-head .head-score-mix { box-shadow: 0 .02rem .06rem 0 rgba(255,104,27,0.1); background: rgba(255,104,27,0.1); }
  .mix-body-legal { border-right: .01rem solid #ccc; }
  .mix-comp-rst { background: #28272d; color: #716d6d !important; }
  .head-flw-sport { border: .005rem solid #ff5353; color: #ff5353; }
  .head-flw-date { color: #777777; }
  .head-flw-tour { color: #777777; }
  .head-flw-line { background: #555555; }
  .head-flw-team { color: #777777; }
  .foot-flw-name { color: #777777; }
  .foot-flw-odds-box { color: #ff5353; }
  .head-flw-game { color: #777777; }
}
.blue .nb-history-option {
  .history-body-single, .history-body-multiple {
    .head-win-box .head-box-other {  border: .01rem solid transparent; color: #909090; }
    .body-item-line { border-right: .01rem solid #777; }
  }
  .history-body-single .history-body-item span, .history-body-single .history-body-item marquee { color: #909090; }
  .history-body-multiple .history-body-item span, .history-body-multiple .history-body-item marquee { color: #909090; }
  .history-body-mix .history-body-item span, .history-body-mix .history-body-item marquee { color: #909090; }
  .detail-real-head .head-team, .detail-real-head .head-odds { color: #ecebeb; }
  .detail-real-head  .head-team-mix { color: #ecebeb; font-weight: 500; }
  .detail-real-head .head-odds-mix { color: #53fffd; }
  .detail-real-head .head-odds-mix-alert { background: #ff5353; color: #fff; }
  .detail-real-head .head-score, .detail-real-head .head-score-mix { box-shadow: 0 .02rem .06rem 0 rgba(255,104,27,0.1); background: rgba(255,104,27,0.1); }
  .mix-body-legal { border-right: .01rem solid #777; }
  .mix-comp-rst { background: #434249; color: #b0b0b0 !important; }
  .head-flw-sport { border: .005rem solid #53fffd; color: #53fffd; }
  .head-flw-date { color: #666666; }
  .head-flw-tour { color: #666666; }
  .head-flw-line { background: #444444; }
  .head-flw-team { color: #666666; }
  .foot-flw-name { color: #666666; }
  .foot-flw-odds-box { color: #53fffd; }
  .head-flw-game { color: #666666; }
}
.nb-history-option {
  width: 100%;
  .history-body-single, .history-body-multiple, .history-body-mix {
    .history-body-item {
      width: 100%;
      height: .21rem;
      padding: 0 .12rem;
      span, marquee { white-space: nowrap; font-size: .12rem; user-select: none; line-height: 100%; }
      .body-item-legal { max-width: 1rem; }
      .body-item-team { max-width: 2rem; }
      .body-item-line { width: .07rem; height: .12rem; margin-right: .06rem }
    }
  }
  .history-body-single .detail-real-head .head-team { font-size: .16rem; }
  .history-body-multiple .detail-real-head .head-team { font-size: .14rem; }
  .history-body-mix .detail-real-head .head-team-mix { font-size: .16rem; margin-right: .08rem; font-family: PingFangSC; }
  .history-body-single .detail-real-head .head-odds { font-size: .16rem; }
  .history-body-multiple .detail-real-head .head-odds { font-size: .14rem; }
  .detail-real-head {
    width: 100%;
    height: .34rem;
    padding: 0 .12rem;
    .head-index { font-size: .13rem; padding-top: .01rem; padding-right: .06rem; }
    .head-team { max-width: 1rem; white-space: nowrap; user-select: none; }
    .head-odds { padding-left: .05rem; user-select: none; }
    .head-blank { padding-left: .15rem; }
    .head-score, .head-score-mix { border-radius: .02rem; padding: .02rem .04rem; font-size: .13rem; user-select: none; }
    .head-score-mix { margin-left: .15rem; }
    .head-win-box span { padding: .01rem .04rem; border-radius: .02rem; font-size: .12rem; user-select: none; }
    .head-odds-mix, .head-odds-mix-alert { height: .21rem; font-size: .16rem; font-weight: 500; padding: 0 .03rem; border-radius: .03rem; }
    .head-odds-mix, .head-odds-mix-alert { .head-odds-txt { font-family: PingFangSC; padding-right: .01rem; } }
    .head-alert { width: .18rem; height: 100%; margin-left: .05rem; }
  }
  .mix-body-legal { height: .12rem; padding-right: .08rem; font-size: .12rem; }
  .mix-body-game { height: .12rem; padding-left: .08rem; font-size: .12rem; }
  .mix-comp-name { padding-right: .15rem; max-width: 2.9rem; }
  .mix-comp-rst { width: .32rem; height: .15rem; border-radius: .07rem; font-size: .11rem; }
  .detail-head-flw { width: 100%; height: .28rem; padding: .03rem .13rem 0 .13rem; .detail-head-flw-lft { width: auto; height: 100%; } }
  .detail-foot-flw { width: 100%; height: .23rem; padding: 0 .13rem .04rem .13rem; }
  .head-flw-sport { min-height: .14rem; border-radius: .02rem; padding: 0 .04rem; font-size: .1rem; line-height: .14rem; }
  .head-flw-date { margin-left: .06rem; font-size: .12rem; }
  .head-flw-tour { height: 100%; margin: 0 .08rem 0 .06rem; font-size: .12rem; }
  .head-flw-line { width: .01rem; height: .1rem; margin-right: .08rem; }
  .head-flw-team { width: 1rem; text-overflow: ellipsis; white-space: nowrap; font-size: .12rem; overflow: hidden; }
  .foot-flw-name { margin-right: .02rem; font-size: .12rem; }
  .foot-flw-odds-box { height: 100%; margin-right: .06rem; font-size: .13rem; font-weight: 500; .flw-odds-txt { font-family: PingFangSC; padding-right: .01rem; } }
  .head-flw-game { font-size: .12rem; }
}
</style>
