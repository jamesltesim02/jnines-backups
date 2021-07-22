<template>
  <transition name="history">
    <div :class="`nb-history-body${betCheck ? '-mix' : ''}`" v-if="data.show" >
      <div class="nb-history-body-box">
        <div class="history-body-status flex-start" v-if="!betCheck" >
          <div class="body-status-alert flex-center" v-if="ctOne" :style="cashStyle">
            <div class="status-cash-text flex-center" v-if="errStr">{{errStr}}</div>
            <div class="status-cash-text flex-center" v-else>{{$t('pageBet.earlyProc')}}</div>
          </div>
          <div class="body-status-cash flex-center" v-else-if="ctTwo" :style="cashStyle" @click="setpFun(1)">
            <div class="status-cash-text flex-center">{{$t('pageBet.earlyCash')}}</div>
            <div class="status-cash-num flex-center">{{changeCash(data.cash)}}</div>
          </div>
          <div class="body-cash-confirm-box flex-between" v-else-if="ctThree">
            <div class="body-cash-cancel flex-center" :style="cancelStyle" @click="setpFun(0)">{{$t('pageBet.cancel')}}</div>
            <div class="body-cash-confirm flex-center" :style="cashStyle" @click="cashFun">{{$t('pageBet.confirm')}}</div>
          </div>
          <div class="body-status-win-lose flex-center" v-else-if="/^[389]$/.test(data.wst)">
            <div class="body-status-pre-win flex-center" v-if="/9/.test(data.wst) && data.x.rtn > data.x.amt" :style="winStyle">
              {{$t('pageBet.earlyCash')}}
            </div>
            <div class="body-status-pre-lose flex-center" v-else-if="/9/.test(data.wst) && data.x.rtn < data.x.amt" :style="loseStyle">
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
        <div :class="moneyClass" class="flex-end" v-if="!betCheck" >
          <div class="body-money-bet">{{$t('pageBet.moneyBet')}} {{changeType(data.x.amt)}}</div>
          <div class="body-money-rtn-win" v-if="data.x.rtn >= data.x.amt" :style="{ color: winColor }">
            {{$t(`pageBet.${getRtnStr()}`)}} {{changeType(data.x.rtn)}}
          </div>
          <div class="body-money-rtn-lose" v-else :style="{ color: loseColor }">
            {{$t(`pageBet.${getRtnStr()}`)}} {{changeType(data.x.rtn)}}
          </div>
        </div>
        <div class="nb-history-option-show-box" :style="optStyle" >
          <div :class="`nb-history-opt-item${betCheck ? '-mix' : ''}`" v-for="(v, k) in data.opts" :key="k">
            <bet-history-option :data="v" :isSingle="isSingle" />
            <div class="history-body-short" v-if="!isSingle && k < data.opts.length - 1"></div>
            <div class="history-body-long" v-if="!isSingle && k >= data.opts.length - 1"></div>
          </div>
          <div class="history-body-status-mix flex-start" v-if="betCheck" >
            <div class="body-status-alert flex-center" v-if="ctOne" :style="cashMixStyle">
              <div class="status-cash-text flex-center" v-if="errStr">{{errStr}}</div>
              <div class="status-cash-text flex-center" v-else>{{$t('pageBet.earlyProc')}}</div>
            </div>
            <div class="body-status-cash flex-center" v-else-if="ctTwo" :style="cashMixStyle" @click="setpFun(1)">
              <div class="status-cash-text flex-center">{{$t('pageBet.earlyCash')}}</div>
              <div class="status-cash-num flex-center">{{changeCash(data.cash)}}</div>
            </div>
            <div class="body-cash-confirm-box flex-between" v-else-if="ctThree">
              <div class="body-cash-cancel flex-center" :style="cancelMixStyle" @click="setpFun(0)">{{$t('pageBet.cancel')}}</div>
              <div class="body-cash-confirm flex-center" :style="cashMixStyle" @click="cashFun">{{$t('pageBet.confirm')}}</div>
            </div>
            <div class="body-status-win-lose flex-center" v-else-if="/^[389]$/.test(data.wst)">
              <div class="body-status-pre-win-mix flex-center" v-if="/9/.test(data.wst) && data.x.rtn > data.x.amt" :style="winStyle">
                {{$t('pageBet.earlyCash')}}
              </div>
              <div class="body-status-pre-lose-mix flex-center" v-else-if="/9/.test(data.wst) && data.x.rtn < data.x.amt" :style="loseMixStyle">
                {{$t('pageBet.earlyCash')}}
              </div>
              <div class="body-status-win-mix flex-center" v-else-if="data.x.rtn > data.x.amt"><bet-mix-win-lose /></div>
              <div class="body-status-lose-mix flex-center" v-else-if="data.x.rtn < data.x.amt"><bet-mix-win-lose lose /></div>
              <div class="body-status-none flex-center" v-else>{{$t('pageBet.widNorObj.win0')}}</div>
            </div>
            <div class="body-status-cancel flex-center" v-else-if="/^[04567]$/.test(data.wst)">
              {{$t('pageBet.betFail')}}
            </div>
          </div>
        </div>
      </div>
      <div class="history-body-mult-box" v-if="!isSingle">
        <div class="history-body-mult" v-for="(v, k) in data.bets" :key="k" @click="changeFun(v)">
          <div :class="`body-mult-item${betCheck ? '-mix' : ''} flex-between`">
            <div class="body-mult-item-box flex-start" v-if="!betCheck" >
              <span class="mult-item-title">{{getMultName(v.num, v.fld)}}</span>
              <span class="mult-item-count" :style="{ color: oddsColor }">{{v.cnt}} {{$t('pageBet.bets')}}</span>
            </div>
            <div class="body-mult-item-box flex-start" v-else >
              <span class="mult-item-title-mix">{{getMultName(v.num, v.fld)}}</span>
              <span class="mult-item-count-mix flex-center">{{v.cnt}}</span>
            </div>
            <div class="body-mult-odds-box flex-start" v-if="v.detail && !betCheck" >
              <span class="body-mult-odds-at">@</span>
              <span class="body-mult-odds-txt">{{changeType(v.odv, true, 3)}}</span>
            </div>
            <bet-history-body-ani :flag="v.detail" :txt="$t('pageBet.eachBet')" :num="changeType(v.tamt / (v.cnt || 1), true)" />
          </div>
          <bet-history-list :data="data" :item="v" />
          <div class="history-body-money-item flex-between" v-if="v.detail && data.bets.length > 1" >
            <div class="body-money-bet flex-start" >
              <span class="body-money-mix-txt flex-center">{{$t('pageBet.betMoney')}}</span>
              <span class="body-money-mix-num flex-center" :style="{ color: oddsColor }">{{changeType(v.tamt, true)}}</span>
            </div>
            <div class="body-money-rtn-win flex-end" >
              <span class="body-money-mix-txt flex-center">{{$t(`pageBet.${getRtnStr()}`)}}</span>
              <span class="body-money-mix-num flex-center" :style="{ color: v.win >= 0 || betCheck ? winColor : loseColor }">
                {{changeType(/^[389]$/.test(data.wst) ? v.win + v.tamt : v.mxp, true)}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div :class="`history-body-slip-box${isSingle ? '-s' : ''}`" v-if="betCheck" >
        <div class="history-body-slip-mix-box" v-if="open" >
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
            <span class="body-money-mix-txt flex-center">{{$t('pageBet.betMoney')}}</span>
            <span class="body-money-mix-num flex-center" :style="{ color: oddsColor }">{{changeType(data.x.amt, true)}}</span>
          </div>
          <div class="body-money-rtn-win flex-start" >
            <span class="body-money-mix-txt flex-center">{{$t(`pageBet.${getRtnStr()}`)}}</span>
            <span class="body-money-mix-num flex-center" :style="{ color: winColor }">{{changeType(data.x.rtn, true)}}</span>
          </div>
        </div>
        <div class="body-toggle-box flex-center" @click="toggleWid">
          <span class="body-toggle-box-txt">{{$t(`pageBet.wid${open ? 'Close' : 'Open'}`)}}</span>
          <bet-arrow-box class="body-toggle-box-arrow" :type="open ? 'up' : 'down'" size="0.07" />
        </div>
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
import { postPreCash } from '@/api/bet';
import { changeNumType } from '@/utils/betUtils';
import BetArrowBox from '@/components/Bet/BetComps/BetArrowBox';
import BetMixWinLose from '@/components/Bet/BetComps/BetMixWinLose';
import BetHistoryList from '@/components/Bet/BetComps/BetHistoryList';
import BetHistoryOption from '@/components/Bet/BetComps/BetHistoryOption';
import BetHistoryBodyAni from '@/components/Bet/BetComps/BetHistoryBodyAni';

export default {
  inheritAttrs: false,
  name: 'BetHistoryBody',
  data() {
    return Object.assign({ loading: false, cashTimer: null, errStr: '' }, { open: false });
  },
  props: { data: Object },
  computed: {
    ...mapState('app', ['theme', 'bettingMode', 'bettingStyle']),
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
    isSingle() {
      return `${this.data.title}` === `${this.$t('pageBet.sinBet')}`;
    },
    optStyle() {
      return this.betCheck ? { paddingTop: '4px' } : { };
    },
    moneyClass() {
      return `history-body-money-${this.isSingle ? 'single' : 'multiple'}`;
    },
    ctOne() {
      return this.data.cashObj && this.data.cashout && this.data.cash && (this.errStr || this.loading);
    },
    ctTwo() {
      return this.data.cashObj && this.data.cashout && this.data.cash && !this.data.cashStep;
    },
    ctThree() {
      return this.data.cashObj && this.data.cashout && this.data.cash && this.data.cashStep;
    },
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    btnColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BOTTON_BACKGROUND ? pSet.BLACK_BOTTON_BACKGROUND : '#ff5353';
      }
      return pSet && pSet.WHITE_BOTTON_BACKGROUND ? pSet.WHITE_BOTTON_BACKGROUND : '#ff5353';
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
    loseMixStyle() {
      const colorStr = /black/i.test(this.theme) ? '#909090' : '#bababa';
      return { border: `1px solid ${colorStr}`, color: colorStr };
    },
    cashStyle() {
      return { background: this.btnColor, boxShadow: `0 2px 6px 0 ${this.btnColor}7d` };
    },
    cancelStyle() {
      return { color: this.oddsColor, border: `1px solid ${this.btnColor}`, boxShadow: `0 2px 6px 0 ${this.btnColor}7d` };
    },
    cashMixStyle() {
      return { background: this.btnColor };
    },
    cancelMixStyle() {
      return { color: this.oddsColor, border: `1px solid ${this.btnColor}` };
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
    ...mapMutations(['changeEarlySuccess']),
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
    changeCash(cash) {
      const str = `${this.changeType(cash, cash < 100)}`;
      return cash < 100 ? str : str.replace(',', '');
    },
    getRtnStr() {
      return /^[03456789]$/.test(this.data.wst) ? 'moneyRtn' : 'willRtn';
    },
    getMultName(num, fld) {
      const [lan, nFld] = [this.$t('pageBet.betMoney'), fld || 1];
      const nunStr = !/[a-z]+/i.test(lan) ? '一二三四五六七八九十' : '';
      if (nunStr) {
        const beStr = num < 11 ? '一二三四五六七八九十'.substr(num - 1, 1) : num;
        const afStr = nFld < 11 ? '一二三四五六七八九十'.substr(nFld - 1, 1) : nFld;
        return this.betCheck ? `${num}串${nFld}` : `${beStr}串${afStr}`;
      }
      return `${num} Folds${fld && fld > 1 ? ` ${fld}` : ''}`;
    },
    setpFun(flag) {
      const dt = this.data;
      dt.cashStep = flag ? 1 : 0;
      setTimeout(() => { this.$emit('step', dt); }, 50);
    },
    async cashFun() {
      this.loading = true;
      clearTimeout(this.cashTimer);
      if (this.data && this.data.mstid) {
        try {
          await postPreCash({ wid: this.data.mstid, btp: 1 });
          this.changeEarlySuccess(true);
          this.setError(this.$t('pageBet.earlySucc'), () => { this.$emit('cash', this.data); });
        } catch (ev) {
          this.setError(`${this.$t('pageBet.earlyFail')}${ev && ev.code ? `【${ev.code}】` : ''}`);
        } finally {
          this.loading = false;
        }
      } else {
        this.loading = false;
        this.setError(this.$t('pageBet.earlyFail'));
      }
    },
    setError(str, fun) {
      clearTimeout(this.cashTimer);
      this.errStr = str;
      this.setpFun(0);
      this.cashTimer = setTimeout(() => {
        this.errStr = '';
        if (typeof fun === 'function') {
          fun();
        }
      }, 1500);
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
    toggleWid() {
      this.open = !this.open;
    },
  },
};
</script>

<style lang="less">
.history-enter-active, .history-leave-active { transition: all 0.15s linear; }
.history-enter, .history-leave-active { transform: scaleY(0); }
.nb-history-body, .nb-history-body-mix {
  width: 100%;
  .nb-history-body-box {
    width: 100%;
    position: relative;
    .history-body-status { height: 35px; top: 2px; }
    .history-body-status-mix { height: 38px; top: 50%; transform: translateY(-50%); }
    .history-body-status, .history-body-status-mix {
      position: absolute;
      min-width: 40px;
      right: 20px;
      .body-status-cash, .body-status-alert, .body-cash-cancel, .body-cash-confirm {
        height: 32px;
        padding: 0 8px;
        border-radius: 6px;
        cursor: pointer;
        .status-cash-text { min-width: 70px; font-size: 12px; cursor: pointer; }
        .status-cash-num { padding-left: 5px; min-width: 60px; font-size: 16px; cursor: pointer; }
      }
      .body-status-alert { min-width: 140px; }
      .body-cash-cancel, .body-cash-confirm { min-width: 70px; margin-left: 10px; }
      .body-status-cancel { width: 60px; height: 24px; font-size: 12px; }
      .body-status-win-lose {
        min-width: 40px;
        height: 100%;
        .body-status-pre-win, .body-status-pre-lose, .body-status-pre-win-mix, .body-status-pre-lose-mix, .body-status-none { min-width: 24px; height: 24px; }
        .body-status-pre-win, .body-status-pre-lose, .body-status-pre-win-mix, .body-status-pre-lose-mix { padding: 0 8px; border-radius: 12px; font-size: 14px; }
        .body-status-win, .body-status-lose { min-width: 30px; height: 30px; border-radius: 15px; font-size: 16px; }
        .body-status-none { padding: 0 6px; border-radius: 2px; font-size: 12px; }
      }
    }
    .history-body-money-single, .history-body-money-multiple {
      position: absolute;
      min-width: 220px;
      height: 34px;
      right: 20px;
      .body-money-bet { margin-right: 20px; }
      .body-money-bet, .body-money-rtn-win, .body-money-rtn-lose { height: 50%; font-size: 12px; }
    }
    .history-body-money-single { bottom: -24px; }
    .history-body-money-multiple { bottom: 8px; }
  }
  .nb-history-option-show-box { position: relative; width: 100%; }
  .nb-history-opt-item-mix { padding-top: 8px; }
  .history-body-short { width: 55%; height: 8px; }
  .history-body-long { width: 100%; height: 10px; }
  .history-body-mult {
    width: 100%;
    .body-mult-item, .body-mult-item-mix {
      position: relative;
      width: 100%;
      height: 36px;
      padding: 0 20px;
      .mult-item-title { font-size: 14px; user-select: none; }
      .mult-item-title-mix { font-size: 16px; font-weight: 500; user-select: none; }
      .mult-item-count { padding-left: 20px; font-size: 12px; user-select: none; }
      .mult-item-count-mix { width: 23px; height: 23px; border-radius: 100%; margin-left: 12px; font-size: 11px; font-weight: 500; user-select: none; }
    }
  }
  .body-mult-odds-box { position: absolute; width: 80%; height: 100%; left: 0; top: 0; padding-left: 30.5%; }
  .body-mult-odds-at { font-size: 14px; padding-right: 1px; font-family: PingFangTC; }
  .body-mult-odds-txt { font-size: 14px; }
  .history-body-money-item { width: 100%; height: 30px; padding: 0 20px; font-size: 14px; .body-money-mix-txt { margin-right: 6px; font-size: 12px; } }
  .history-body-slip { width: 100%; padding: 0 20px; font-size: 11px; }
  .history-body-slip-alert { display: none; }
  .history-body-slip-button { width: 40px; height: 15px; line-height: 13px; margin-left: 16px; font-size: 11px; border-radius: 7px; }
  .history-body-slip-time { flex-grow: 1; }
  .history-body-money-mix { width: 100%; height: 30px; padding: 0 20px; font-size: 14px; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; }
  .history-body-money-mix { .body-money-bet { width: 100%; height: 95%; padding-left: 16px; } .body-money-rtn-win { width: 100%; height: 95%; padding-left: 45px; } }
  .body-money-mix-txt { margin-right: 6px; font-size: 12px; }
  .body-money-mix-num { font-size: 14px; }
  .body-toggle-box { width: 100%; height: 26px; font-size: 12px; }
  .history-body-slip-mix-box { width: 100%; padding: 5px 20px; }
  .history-body-slip-mix { width: 100%; height: 22px; font-size: 11px; }
  .history-body-slip-text { padding-right: 6px; }
}
.nb-history-body { .history-body-slip { height: 32px; } }
.nb-history-body-mix { .history-body-slip { height: 18px; margin: 6px 0; } }
.white .nb-history-body { border-top: 1px solid #ECEBEB; }
.white .nb-history-body, .white .nb-history-body-mix {
  .body-status-cash, .body-status-alert { .status-cash-text { color: #FFF; } .status-cash-num { color: #FFF; } }
  .body-cash-confirm { color: #fff; }
  .body-status-cancel { border: 1px solid #979797; color: #909090; }
  .body-status-win, .body-status-pre-win { box-shadow: 0 2px 10px 0 #fe9a9a; }
  .body-status-lose, .body-status-pre-lose { box-shadow: 0 2px 10px 0 #8cc871; }
  .body-status-none { color: #bababa; border: 1px solid #ecebeb; }
  .body-money-bet { color: #909090; }
  .history-body-short { border-bottom: 1px solid #F1F1F1; }
  .history-body-long { border-bottom: 1px solid #ECEBEB; }
  .body-mult-item, .body-mult-item-mix { .mult-item-title { color: #909090; } }
  .body-mult-item { border-bottom: 1px solid #ECEBEB; }
  .mult-item-title-mix { color: #2e2f34; }
  .mult-item-count-mix { background: #ecebeb; color: #767477; }
  .body-mult-item-mix { background: #fff; border-bottom: 1px solid #ECEBEB; }
  .history-body-money-mix { border-bottom: 1px solid #ebe9e9; color: #909090; background: #fff; }
  .history-body-money-mix .body-money-bet { border-right: 1px solid #f5f5f5; }
  .history-body-money-item { border-bottom: 1px solid #ebe9e9; color: #909090; }
  .body-money-mix-txt { color: #909090; }
  .body-mult-odds-at, .body-mult-odds-txt { color: #666; }
  .history-body-slip { color: #BBB; }
  .history-body-slip-button { background: #bababa; color: #fff; }
  .history-body-slip-box-s { border-top: 1px solid #ecebeb; margin-top: 6px; }
  .body-toggle-box { color: #bababa; }
  .history-body-slip-mix-box { border-bottom: 1px solid #ebe9e9; }
  .history-body-slip-mix { color: #bababa; }
}

.dark {
  .history-body-slip-mix {
    color: #777;
  }
  .history-body-slip-button,
  .mix-comp-rst {
    color: #ccc;
    background: #4f5155;
    font-size: 12px;
  }
  .history-body-money-mix {
    background: #3b3a40;
  }
  .nb-bet-body-show-num,
  .body-money-mix-num {
    color: #53fffd !important;
  }
  .body-status-cash {
    background: #00b5b3 !important;
    color: #fff;
  }
}
</style>
