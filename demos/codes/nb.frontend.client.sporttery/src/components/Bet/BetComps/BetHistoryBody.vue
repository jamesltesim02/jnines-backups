<template>
  <transition name="history">
    <div :class="`nb-history-body${/^3$/.test(bettingMode) ? '-mix' : ''}`" v-if="data.show">
      <div class="nb-history-body-box">
        <div class="history-body-status flex-start" v-if="!/^3$/.test(bettingMode)" >
          <v-touch class="body-status-cash flex-center" v-if="canCashOut" :style="cashBfStyle" @tap="eFun">
            <div class="status-cash-text flex-start">{{$t('pageBet.earlyCash')}}</div>
            <div class="status-cash-num flex-center" v-if="data.cash < 100">{{data.cash | NumFmt(true)}}</div>
            <div class="status-cash-num flex-center" v-else>{{data.cash | NumFmt(false, 2, true)}}</div>
          </v-touch>
          <div class="body-status-win-lose flex-start" v-else-if="/^[389]$/.test(data.wst)">
            <div class="body-status-win flex-center" v-if="/9/.test(data.wst) && data.x.rtn > data.x.amt" :style="winStyle">
              {{$t('pageBet.earlyCash')}}
            </div>
            <div class="body-status-lose flex-center" v-else-if="/9/.test(data.wst) && data.x.rtn < data.x.amt" :style="loseStyle">
              {{$t('pageBet.earlyCash')}}
            </div>
            <div class="body-status-win flex-center" v-else-if="data.x.rtn > data.x.amt" :style="winStyle">{{$t('pageBet.widNorObj.win100')}}</div>
            <div class="body-status-lose flex-center" v-else-if="data.x.rtn < data.x.amt" :style="loseStyle">{{$t('pageBet.widNorObj.lose100')}}</div>
            <div class="body-status-none flex-center" v-else>{{$t('pageBet.widNorObj.win0')}}</div>
          </div>
          <div class="body-status-cancel flex-center" v-else-if="/^[04567]$/.test(data.wst)">
            {{$t('pageBet.betFail')}}
          </div>
        </div>
        <div :class="moneyClass" class="flex-center-col" v-if="!/^3$/.test(bettingMode)" >
          <div class="body-money-bet flex-end">{{$t('pageBet.moneyBet')}}{{(data.x.amt) | NumFmt}}</div>
          <div class="body-money-rtn-win flex-end" v-if="data.x.rtn >= data.x.amt" :style="{ color: winColor }">
            {{$t(`pageBet.${getRtnStr()}`)}}{{(data.x.rtn) | NumFmt}}
          </div>
          <div class="body-money-rtn-lose flex-end" v-else :style="{ color: loseColor }">
            {{$t(`pageBet.${getRtnStr()}`)}}{{(data.x.rtn) | NumFmt}}
          </div>
        </div>
        <div class="nb-history-option-show-box" :style="optStyle" >
          <v-touch class="nb-history-option-flw-box" @tap="toFlwDetailFun" v-if="data.flwId" >
            <div class="option-flw-title-box flex-start">
              <span class="option-flw-title">{{flwTitle}}</span>
            </div>
            <div class="option-flw-rst-box flex-end">
              <span :class="flwClass" v-if="flwOdds">{{flwOdds}}</span>
              <span :class="flwRstClass" v-if="flwRst">{{flwRst}}</span>
            </div>
          </v-touch>
          <div :class="hisOptClass" v-for="(v, k) in data.opts" :key="k">
            <bet-history-option :data="v" :isSingle="isSingle" :isFollow="!!data.flwId" :isResult="!/^[12]$/.test(data.wst)" />
            <div class="history-body-short" v-if="!isSingle && k < data.opts.length - 1"></div>
            <div class="history-body-long" v-if="k >= data.opts.length - 1"></div>
          </div>
          <div class="history-body-status-mix flex-center-col" v-if="/^3$/.test(bettingMode) && !data.flwId" >
            <v-touch class="body-status-cash flex-center" v-if="canCashOut" :style="cashStyle" @tap="eFun">
              <div class="status-cash-text flex-start">{{$t('pageBet.earlyCash')}}</div>
              <div class="status-cash-num flex-center" v-if="data.cash < 100">{{data.cash | NumFmt(true)}}</div>
              <div class="status-cash-num flex-center" v-else>{{data.cash | NumFmt(false, 2, true)}}</div>
            </v-touch>
            <div class="body-status-win-lose flex-start" v-else-if="/^[389]$/.test(data.wst)">
              <div class="body-status-win-early-mix flex-center" v-if="/9/.test(data.wst) && data.x.rtn > data.x.amt" :style="winStyle">
                {{$t('pageBet.earlyCash')}}
              </div>
              <div class="body-status-lose-early-mix flex-center" v-else-if="/9/.test(data.wst) && data.x.rtn < data.x.amt" :style="loseMixStyle">
                {{$t('pageBet.earlyCash')}}
              </div>
              <div class="body-status-win-mix flex-center" v-else-if="data.x.rtn > data.x.amt"><bet-mix-win-lose /></div>
              <div class="body-status-lose-mix flex-center" v-else-if="data.x.rtn < data.x.amt"><bet-mix-win-lose lose /></div>
              <div class="body-status-none flex-center" v-else>{{$t('pageBet.widMixObj.win0')}}</div>
            </div>
            <div class="body-status-cancel flex-center" v-else-if="/^[04567]$/.test(data.wst)">
              {{$t('pageBet.betFail')}}
            </div>
            <div class="body-status-rst-box flex-end" v-if="flwOdds" >
              <span :class="flwClass">{{flwOdds}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="history-body-mult-box" v-if="!isSingle && !data.flwId">
        <v-touch class="history-body-mult" v-for="(v, k) in data.bets" :key="k" @tap="changeFun(v)">
          <div :class="`body-mult-item${/^3$/.test(bettingMode) ? '-mix' : ''} flex-between`">
            <div class="body-mult-item-box flex-start" v-if="!/^3$/.test(bettingMode)" >
              <span class="mult-item-title">{{getMultName(v.num, v.fld)}}</span>
              <span class="mult-item-count" :style="{ color: oddsColor }">{{v.cnt}} {{$t('pageBet.bets')}}</span>
            </div>
            <div class="body-mult-item-box flex-start" v-else >
              <span class="mult-item-title-mix">{{getMultName(v.num, v.fld)}}</span>
              <span class="mult-item-count-mix flex-center">{{v.cnt}}</span>
            </div>
            <div class="body-mult-odds-box flex-start" v-if="v.detail && !/^3$/.test(bettingMode)" >
              <span class="body-mult-odds-at">@</span>
              <span class="body-mult-odds-txt">{{v.odv | NumFmt(true, 3)}}</span>
            </div>
            <bet-history-body-ani :flag="v.detail" :txt="$t('pageBet.eachBet')"
            :num="v.tamt / (v.cnt || 1) | NumFmt(true)" />
          </div>
          <bet-history-list :data="data" :item="v" />
          <div class="history-body-money-item flex-between" v-if="v.detail && data.bets.length > 1" >
            <div class="body-money-bet flex-start" >
              <span class="body-money-mix-txt flex-center">{{$t('pageBet.betMoney')}}</span>
              <span class="body-money-mix-num flex-center" :style="{ color: oddsColor }">{{v.tamt | NumFmt(true)}}</span>
            </div>
            <div class="body-money-rtn-win flex-end" >
              <span class="body-money-mix-txt flex-center">{{$t(`pageBet.${getRtnStr()}`)}}</span>
              <span class="body-money-mix-num flex-center" :style="{ color: v.win >= 0 || /^3$/.test(bettingMode) ? winColor : loseColor }">
                {{(/^[389]$/.test(data.wst) ? v.win + v.tamt : v.mxp) | NumFmt}}
              </span>
            </div>
          </div>
        </v-touch>
      </div>
      <div :class="`history-body-slip-box${isSingle ? '-s' : ''}`" v-if="/^3$/.test(bettingMode)" >
        <div class="history-body-slip-mix-box" v-if="open && 1 < 0" >
          <div class="history-body-slip-mix flex-start">
            <span class="history-body-slip-target flex-start copy-target">{{$t('pageBet.slipNum')}}{{data.mstid}}</span>
            <span class="history-body-slip-alert copy-alert">{{$t('pageBet.slipAlt')}}</span>
            <button class="history-body-slip-button flex-center copy-flag">{{$t('pageBet.slipBtn')}}</button>
          </div>
          <div class="history-body-slip-mix flex-start">
            <span class="history-body-slip-text">{{$t('pageBet.betTime')}}</span>
            <span class="history-body-slip-time">{{data.time}}</span>
          </div>
        </div>
        <div class="history-body-money-mix flex-between" >
          <div class="body-money-bet flex-start" >
            <span class="body-money-mix-txt flex-center">{{$t('pageBet.guessMon')}}</span>
            <span class="body-money-mix-num flex-center" :style="{ color: oddsColor }">{{data.x.amt | NumFmt}}</span>
          </div>
          <div class="body-money-rtn-win flex-start" >
            <span class="body-money-mix-txt flex-center">{{$t(`pageBet.${getRtnStr()}`)}}</span>
            <span class="body-money-mix-num flex-center" :style="{ color: winColor }">{{getRtnNum | NumFmt}}</span>
          </div>
          <div class="body-money-pub-box flex-end">
            <v-touch class="body-money-publish flex-center" v-if="data.publish && /^[12]$/.test(data.wst)"
            :style="{ background: btnColor }" @tap="pubFun">{{$t('share.publishBtn')}}</v-touch>
            <v-touch class="body-money-publish flex-center" v-else-if="data.shine && !/^[12]$/.test(data.wst)"
            :style="{ background: btnColor }" @tap="shineFun">{{$t('share.shineBtn')}}</v-touch>
            <v-touch class="body-money-published flex-center" v-else-if="/^1$/.test(data.followId)"
            @tap="toPubDetailFun">{{$t('share.published')}}</v-touch>
            <div class="body-money-follow flex-end" v-else-if="/\d\d+/.test(data.flwId)">
              <span class="body-money-mix-txt flex-center">{{$t('share.waterRate')}}</span>
              <span class="body-money-mix-num flex-center" :style="{ color: winColor }" v-if="/^[12]$/.test(data.wst)">{{rakeStr | NumFmt}}%</span>
              <span class="body-money-mix-num flex-center" :style="{ color: winColor }" v-else>{{rakeStr | NumFmt}}</span>
            </div>
            <v-touch class="body-money-publish flex-center" v-else-if="(!data.followId || /^0$/.test(data.followId)) && /^[38]$/.test(data.wst)"
            :style="{ background: btnColor }" @tap="toShareOutFun">{{$t('share.shareOut')}}</v-touch>
          </div>
        </div>
        <v-touch class="body-toggle-box flex-center" @tap="toggleWid" v-if="1 < 0">
          <span class="body-toggle-box-txt">{{$t(`pageBet.wid${open ? 'Close' : 'Open'}`)}}</span>
          <bet-arrow-box class="body-toggle-box-arrow" :type="open ? 'up' : 'down'" size="0.07" />
        </v-touch>
      </div>
      <div class="history-body-slip flex-start" v-else >
        <span class="history-body-slip-target flex-start copy-target">{{$t('pageBet.slipNum')}}{{data.mstid}}</span>
        <span class="history-body-slip-alert copy-alert">{{$t('pageBet.slipAlt')}}</span>
        <button class="history-body-slip-button flex-center copy-flag">{{$t('pageBet.slipBtn')}}</button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetArrowBox from '@/components/Bet/BetComps/BetArrowBox';
import BetMixWinLose from '@/components/Bet/BetComps/BetMixWinLose';
import BetHistoryList from '@/components/Bet/BetComps/BetHistoryList';
import BetHistoryOption from '@/components/Bet/BetComps/BetHistoryOption';
import BetHistoryBodyAni from '@/components/Bet/BetComps/BetHistoryBodyAni';

export default {
  inheritAttrs: false,
  name: 'BetHistoryBody',
  data() {
    return { open: false };
  },
  props: { data: Object },
  computed: {
    ...mapState('app', ['theme', 'bettingMode']),
    isSingle() {
      return `${this.data.title}` === `${this.$t('pageBet.sinBet')}`;
    },
    canCashOut() {
      return !!(this.data.cashObj && this.data.cashout && this.data.cash && !/^1$/.test(this.data.followId));
    },
    pubOdds() {
      let odds = 1;
      for (let i = 0; i < this.data.opts.length; i += 1) {
        odds *= 1 + (this.data.opts[i].ods || 0);
      }
      return `${parseInt((odds - 1) * 1000, 10) / 1000}`.replace('.', 'x');
    },
    flwObj() {
      return this.data && this.data.followInf ? this.data.followInf : { };
    },
    couObj() {
      return this.data && this.data.couponInf ? this.data.couponInf : { };
    },
    flwTitle() {
      return this.flwObj.title || '';
    },
    flwOdds() {
      const lanStr = this.$t(`share.${/^1$/.test(this.couObj.type) ? 'guarant' : 'reduce'}`);
      return this.couObj.amt ? `${lanStr} ${this.couObj.amt}` : '';
    },
    flwClass() {
      return `option-flw-${/^1$/.test(this.couObj.type) ? 'tag' : 'odds'} flex-center`;
    },
    flwRst() {
      let str = this.data && this.data.win ? this.$t('share.lose') : '';
      str = this.data && this.data.win && this.data.win > 0 ? this.$t('share.win') : str;
      return this.data && !/^[12]$/.test(this.data.wst) && this.data.flwId ? str : '';
    },
    rakeStr() {
      return `${/^[12]$/.test(this.data.wst) ? `${100 * (this.flwObj.rake || 0)}` : `${this.flwObj.commission || 0}`}`.replace('-', '');
    },
    flwRstClass() {
      return `option-flw-rst-${this.data && this.data.win && this.data.win > 0 ? 'win' : 'lose'} flex-center`;
    },
    hisOptClass() {
      return `history-body-opt-box${this.data && this.data.flwId ? '-flw' : ''}`;
    },
    optStyle() {
      return /^3$/.test(this.bettingMode) && 1 < 0 ? { paddingTop: '.04rem' } : { };
    },
    moneyClass() {
      return `history-body-money-${this.isSingle ? 'single' : 'multiple'}`;
    },
    getRtnNum() {
      const nOdds = (this.flwObj.guaranteeOdds || 0) * (1 - Math.abs(this.flwObj.rake || 0));
      const unFlwNum = (this.flwObj.amt || 0) * (1 + nOdds);
      const flwedNum = this.data.x.rtn + this.data.cRtn - Math.abs(this.flwObj.commission || 0);
      const flwNum = /^[389]$/.test(this.data.wst) ? flwedNum : parseInt(unFlwNum / 500, 10) * 500;
      return this.data.flwId ? +flwNum : this.data.x.rtn;
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
    btnColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BOTTON_BACKGROUND ? pSet.BLACK_BOTTON_BACKGROUND : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_BOTTON_BACKGROUND ? pSet.BLUE_BOTTON_BACKGROUND : '#00b5b3';
      }
      return pSet && pSet.WHITE_BOTTON_BACKGROUND ? pSet.WHITE_BOTTON_BACKGROUND : '#ff5353';
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
    cashBfStyle() {
      return { background: this.btnColor, boxShadow: `0 .02rem .06rem 0 ${this.btnColor}69` };
    },
    cashStyle() {
      return { border: `.01rem solid ${this.btnColor}`, color: this.oddsColor };
    },
  },
  components: {
    BetArrowBox,
    BetMixWinLose,
    BetHistoryList,
    BetHistoryOption,
    BetHistoryBodyAni,
  },
  methods: {
    ...mapMutations(['changeEarlyStatus', 'updateTicket', 'updateShineNewObj']),
    ...mapMutations('app', ['setShareTarget']),
    pubFun() {
      this.updateTicket(this.data);
      this.$router.push(`/publishnew/${this.data.mstid}/${this.pubOdds}/0`);
    },
    shineFun() {
      this.updateShineNewObj(this.data.followInf);
      this.$router.push(`/shinenew/${this.data.mstid}`);
    },
    toPubDetailFun() {
      this.$router.push(`/publishdetail/${this.data.mstid}`);
    },
    toShareOutFun() {
      setTimeout(() => { this.setShareTarget('history'); }, 100);
    },
    toFlwDetailFun() {
      this.$router.push(`/publishdetail/${this.data.flwId}`);
    },
    changeFun(v) {
      const dt = this.data;
      for (let i = 0; i < dt.bets.length; i += 1) {
        const btIdPass = `${dt.bets[i].btId || ''}` === `${v.btId || ''}`;
        const nPass = `${dt.bets[i].num}_${dt.bets[i].fld || 1}` === `${v.num}_${v.fld || 1}`;
        const cPass = dt.bets[i].btId ? btIdPass : nPass;
        if (cPass) {
          dt.bets[i].detail = !dt.bets[i].detail;
        }
      }
      this.$emit('change', dt);
    },
    getRtnStr() {
      const str = this.data.flwId ? 'willMax' : 'willRtn';
      return /^[03456789]$/.test(this.data.wst) ? 'moneyRtn' : str;
    },
    toggleWid() {
      this.open = !this.open;
    },
    eFun() {
      this.changeEarlyStatus({ mstid: this.data.mstid, money: this.data.cash });
    },
    getMultName(num, fld) {
      const [lan, nFld] = [this.$t('pageBet.betMoney'), fld || 1];
      const nunStr = !/[a-z]+/i.test(lan) ? '一二三四五六七八九十' : '';
      if (nunStr) {
        const beStr = num < 11 ? '一二三四五六七八九十'.substr(num - 1, 1) : num;
        const afStr = nFld < 11 ? '一二三四五六七八九十'.substr(nFld - 1, 1) : nFld;
        return /^3$/.test(this.bettingMode) ? `${num}串${nFld}` : `${beStr}串${afStr}`;
      }
      return `${num} Folds${fld && fld > 1 ? ` ${fld}` : ''}`;
    },
  },
};
</script>

<style lang="less">
.history-enter-active, .history-leave-active { transition: all 0.15s linear; }
.history-enter, .history-leave-active { transform: scaleY(0); }
.white .nb-history-body, .white .nb-history-body-mix {
  border-top: .01rem solid #ECEBEB;
  .body-status-cash { color: #FFF; }
  .body-status-cancel { border: .01rem solid #979797; color: #909090; }
  .body-status-win { box-shadow: 0 .02rem .1rem 0 #fe9a9a; }
  .body-status-lose { box-shadow: 0 .02rem .1rem 0 #8cc871; }
  .body-status-none { color: #bababa; border: .01rem solid #ecebeb; }
  .body-money-bet { color: #909090; }
  .history-body-short { border-bottom: .01rem solid #F5F5F5; }
  .history-body-mult-box { border-top: .01rem solid #ecebeb; }
  .body-mult-item, .body-mult-item-mix { border-bottom: .01rem solid #ecebeb; .mult-item-title { color: #909090; } }
  .mult-item-title-mix { color: #2e2f34; }
  .mult-item-count-mix { background: #ecebeb; color: #767477; }
  .body-mult-item-mix { background: #fff; }
  .history-body-money-mix { border-bottom: .01rem solid #ecebeb; color: #909090; background: #fff; }
  .history-body-money-item { border-bottom: .01rem solid #ecebeb; color: #909090; }
  .body-money-mix-txt { color: #909090; }
  .body-mult-odds-at, .body-mult-odds-txt { color: #666; }
  .history-body-slip { color: #BBB; }
  .history-body-slip-button { background: #bababa; color: #fff; }
  .history-body-slip-box-s { border-top: .01rem solid #ecebeb; }
  .body-toggle-box { color: #bababa; }
  .history-body-slip-mix-box { border-bottom: .01rem solid #ecebeb; }
  .history-body-slip-mix { color: #bababa; }
  .body-money-publish { color: #ffffff; }
  .body-money-published { color: #cacaca; }
  .option-flw-title { color: #2e2f34; }
  .option-flw-odds { color: #ff5353; border: .01rem solid #ff5353; background: rgba(255,83,83,.1); }
  .option-flw-tag { color: #6eb4ff; border: .01rem solid #6eb4ff; background: rgba(110,180,255,.1); }
  .option-flw-rst-win { background: #ff5353; color: #ffffff; }
  .option-flw-rst-lose { background: #2e2f34; color: #ffffff; }
  .history-body-opt-box-flw { background: #f6f6f6; }
}
.black .nb-history-body, .black .nb-history-body-mix {
  border-top: .01rem solid #2e2f34;
  .body-status-cash { color: #FFF; }
  .body-status-cancel { border: .01rem solid #979797; color: #bababa; }
  .body-status-none { color: #bababa; border: .01rem solid #979797; }
  .body-money-bet { color: #bababa; }
  .history-body-short { border-bottom: .01rem solid #2e2f34; }
  .history-body-mult-box { border-top: .01rem solid #2e2f34; }
  .body-mult-item, .body-mult-item-mix { border-bottom: .01rem solid #2e2f34; .mult-item-title { color: #bababa; } }
  .mult-item-title-mix { color: #ecebeb; }
  .mult-item-count-mix { background: #28272d; color: #909090; }
  .body-mult-item-mix { background: #35363c; }
  .history-body-money-mix { border-bottom: .01rem solid #2e2f34; color: #bababa; background: #35363c; }
  .history-body-money-item { border-bottom: .01rem solid #2e2f34; color: #bababa; }
  .body-money-mix-txt { color: #909090; }
  .body-mult-odds-at, .body-mult-odds-txt { color: #bababa; }
  .history-body-slip { color: #909090; }
  .history-body-slip-button { background: #28272d; color: #716d6d; }
  .history-body-slip-box-s { border-top: .01rem solid #2e2f34; }
  .body-toggle-box { color: #909090; }
  .history-body-slip-mix-box { border-bottom: .01rem solid #2e2f34; }
  .history-body-slip-mix { color: #909090; }
  .body-money-publish { color: #ffffff; }
  .body-money-published { color: #777777; }
  .option-flw-title { color: #ecebeb; }
  .option-flw-odds { color: #ff5353; border: .01rem solid #ff5353; background: rgba(255,83,83,.1); }
  .option-flw-tag { color: #6eb4ff; border: .01rem solid #6eb4ff; background: rgba(110,180,255,.1); }
  .option-flw-rst-win { background: #ff5353; color: #ffffff; }
  .option-flw-rst-lose { background: #4d4d4d; color: #ffffff; }
  .history-body-opt-box-flw { background: #28272d; }
}
.blue .nb-history-body, .blue .nb-history-body-mix {
  border-top: .01rem solid #2e2f34;
  .body-status-cash { color: #FFF; }
  .body-status-cancel { border: .01rem solid #979797; color: #bababa; }
  .body-status-none { color: #bababa; border: .01rem solid #979797; }
  .body-money-bet { color: #bababa; }
  .history-body-short { border-bottom: .01rem solid #2b2c31; }
  .history-body-mult-box { border-top: .01rem solid #2b2c31; }
  .body-mult-item, .body-mult-item-mix { border-bottom: .01rem solid #2e2f34; .mult-item-title { color: #bababa; } }
  .mult-item-title-mix { color: #ecebeb; }
  .mult-item-count-mix { background: #39383e; color: #bababa; }
  .body-mult-item, .body-mult-item-mix { background: #3f3e45; }
  .history-body-money-mix { border-bottom: .01rem solid #2e2f34; color: #bababa; background: linear-gradient(to bottom, #3a393f, #333238); }
  .history-body-money-item { border-bottom: .01rem solid #2e2f34; color: #bababa; }
  .body-money-mix-txt { color: #909090; }
  .body-mult-odds-at, .body-mult-odds-txt { color: #666666; }
  .history-body-slip { color: #777; }
  .history-body-slip-button { background: #434249; color: #b0b0b0; }
  .history-body-slip-box-s { border-top: .01rem solid #2e2f34; }
  .body-toggle-box { color: #666666; }
  .history-body-slip-mix-box { border-bottom: .01rem solid #2e2f34; }
  .history-body-slip-mix { color: #777777; }
  .body-money-publish { color: #ffffff; }
  .body-money-published { color: #777777; }
  .option-flw-title { color: #ecebeb; }
  .option-flw-odds { color: #ff5353; border: .01rem solid #ff5353; background: rgba(255,83,83,.1); }
  .option-flw-tag { color: #53fffd; border: .01rem solid #53fffd; background: rgba(83,255,253,.1); }
  .option-flw-rst-win { background: #ff5353; color: #ffffff; }
  .option-flw-rst-lose { background: #4d4d4d; color: #ffffff; }
  .history-body-opt-box-flw { background: linear-gradient(to top, #303030, #343438); }
}
.nb-history-body, .nb-history-body-mix {
  width: 100%;
  .nb-history-body-box {
    width: 100%;
    position: relative;
    .history-body-status { height: .35rem; top: .1rem; .body-status-win-lose { height: .35rem; } }
    .history-body-status-mix { height: .6rem; top: 50%; transform: translateY(-50%); .body-status-win-lose { height: .38rem; } }
    .history-body-status, .history-body-status-mix {
      position: absolute;
      min-width: .4rem;
      right: .12rem;
      z-index: 99999;
      .body-status-cash {
        height: .26rem;
        padding: 0 .08rem;
        border-radius: .06rem;
        .status-cash-text { width: .5rem; font-size: .12rem; }
        .status-cash-num { padding-left: .05rem; min-width: .6rem; font-size: .14rem; }
      }
      .body-status-cancel { width: .6rem; height: .24rem; font-size: .12rem; }
      .body-status-win-lose {
        min-width: .4rem;
        .body-status-win, .body-status-lose, .body-status-win-mix, .body-status-lose-mix, .body-status-win-early-mix, .body-status-lose-early-mix, .body-status-none { min-width: .24rem; height: .24rem; }
        .body-status-win, .body-status-lose, .body-status-win-mix, .body-status-lose-mix { padding: 0 .04rem; border-radius: .12rem; font-size: .14rem; }
        .body-status-win-early-mix, .body-status-lose-early-mix { padding: 0 .04rem; border-radius: .06rem; font-size: .14rem; }
        .body-status-none { padding: 0 .06rem; border-radius: .02rem; font-size: .12rem; }
      }
    }
    .history-body-money-single, .history-body-money-multiple {
      position: absolute;
      min-width: 1.1rem;
      height: .4rem;
      right: .12rem;
      .body-money-bet, .body-money-rtn-win, .body-money-rtn-lose { width: 100%; height: 50%; font-size: .12rem; }
    }
    .history-body-money-single { bottom: -0.24rem; }
    .history-body-money-multiple { bottom: .08rem; }
  }
  .nb-history-option-show-box { position: relative; width: 100%; }
  .history-body-short { width: 60%; height: .06rem; }
  .history-body-long { width: 100%; height: .06rem; }
  .history-body-mult {
    width: 100%;
    .body-mult-item, .body-mult-item-mix {
      position: relative;
      width: 100%;
      height: .36rem;
      padding: 0 .12rem;
      .mult-item-title { font-size: .14rem; user-select: none; }
      .mult-item-title-mix { font-size: .16rem; font-weight: 500; user-select: none; }
      .mult-item-count { padding-left: .2rem; font-size: .12rem; user-select: none; }
      .mult-item-count-mix { width: .23rem; height: .23rem; border-radius: 100%; margin-left: .12rem; font-size: .11rem; font-weight: 500; user-select: none; }
    }
  }
  .body-mult-odds-box { position: absolute; width: 80%; height: 100%; left: 0; top: 0; padding-left: 30.5%; }
  .body-mult-odds-at { font-size: .14rem; padding-right: .01rem; font-family: PingFangTC; }
  .body-mult-odds-txt { font-size: .14rem; }
  .history-body-money-item { width: 100%; height: .3rem; padding: 0 .12rem; font-size: .14rem; .body-money-mix-txt { margin-right: .06rem; font-size: .12rem; } }
  .history-body-slip { width: 100%; height: .18rem; margin: .06rem 0; padding: 0 .12rem; font-size: .11rem; }
  .history-body-slip-alert { display: none; }
  .history-body-slip-button { width: .34rem; height: .17rem; margin-left: .1rem; font-size: .11rem; border-radius: .08rem; }
  .history-body-slip-time { flex-grow: 1; }
  .history-body-money-mix { position: relative; width: 100%; height: .3rem; padding: 0 .1rem; font-size: .14rem; border-bottom-left-radius: .06rem; border-bottom-right-radius: .06rem; }
  .history-body-money-mix { .body-money-bet { width: 34%; height: 95%; } .body-money-rtn-win { width: 66%; height: 95%; } }
  .history-body-money-mix .body-money-pub-box { position: absolute; width: 40%; height: 100%; top: 0; right: 0; padding: 0 .1rem; }
  .body-money-mix-txt { margin-right: .06rem; font-size: .12rem; }
  .body-money-mix-num { font-size: .14rem; }
  .body-money-publish { width: .73rem; height: .24rem; border-radius: .12rem; font-size: .14rem; }
  .body-money-published { width: .73rem; height: 100%; font-size: .12rem; }
  .body-toggle-box { width: 100%; height: .26rem; font-size: .12rem; }
  .history-body-slip-mix-box { width: 100%; padding: .05rem .12rem; }
  .history-body-slip-mix { width: 100%; height: .22rem; font-size: .11rem; }
  .history-body-slip-text { padding-right: .06rem; }
  .nb-history-option-flw-box { position: relative; width: 100%; height: .37rem; padding: 0 .1rem; }
  .option-flw-title-box { width: 100%; height: 100%; }
  .option-flw-title { max-width: 2.5rem; font-size: .14rem; white-space: nowrap; overflow: hidden; }
  .option-flw-odds, .option-flw-tag { height: .16rem; margin-left: .06rem; padding: 0 .08rem; font-size: .1rem; border-radius: .08rem; }
  .option-flw-rst-box { position: absolute; width: 1.5rem; height: 100%; top: 0; right: 0; padding-right: .1rem; }
  .body-status-rst-box { width: 100%; height: .16rem; margin-top: .1rem; }
  .option-flw-rst-win, .option-flw-rst-lose { width: .26rem; height: .26rem; margin-left: .06rem; border-radius: 100%; font-size: .12rem; }
  .body-money-follow { width: 80%; height: 100%; }
  .history-body-opt-box-flw { .history-body-short, .history-body-long { height: .01rem; } }
}
.horizontal .nb-history-body {
  .status-cash-text { width: .55rem !important; }
  .body-item-legal { max-width: 1.2rem !important; }
}
</style>
