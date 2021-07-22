<template>
  <div class="nb-bet-early-cash-button flex-center" >
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
    <div class="body-status-cancel flex-center" v-else-if="/^[04567]$/.test(data.wst)">{{$t('pageBet.betFail')}}</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { postPreCash } from '@/api/bet';
import { changeNumType } from '@/utils/betUtils';
import BetMixWinLose from '@/components/Bet/BetComps/BetMixWinLose';

export default {
  inheritAttrs: false,
  name: 'BetEarlyCashButton',
  props: { data: Object },
  data() {
    return { loading: false, cashTimer: null, errStr: '' };
  },
  computed: {
    ctOne() {
      return this.data.cashObj && this.data.cashout && this.data.cash && (this.errStr || this.loading);
    },
    ctTwo() {
      return this.data.cashObj && this.data.cashout && this.data.cash && !this.data.cashStep;
    },
    ctThree() {
      return this.data.cashObj && this.data.cashout && this.data.cash && this.data.cashStep;
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
    cashMixStyle() {
      return { background: this.btnColor };
    },
    cancelMixStyle() {
      return { color: this.oddsColor, border: `1px solid ${this.btnColor}` };
    },
  },
  components: { BetMixWinLose },
  methods: {
    ...mapMutations(['changeEarlySuccess']),
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
    changeCash(cash) {
      const str = `${this.changeType(cash, cash < 100)}`;
      return cash < 100 ? str : str.replace(',', '');
    },
    setpFun(flag) {
      const dt = this.data;
      dt.cashStep = flag ? 1 : 0;
      this.$emit('step', dt);
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
  },
};
</script>

<style lang="less">
.nb-bet-early-cash-button {
  width: 100%;
  height: 100%;
  .body-status-cash, .body-status-alert, .body-cash-cancel, .body-cash-confirm {
    height: 32px;
    padding: 0 8px;
    border-radius: 6px;
    cursor: pointer;
    .status-cash-text { min-width: 70px; font-size: 12px; cursor: pointer; }
    .status-cash-num { padding-left: 5px; min-width: 60px; font-size: 16px; cursor: pointer; }
  }
  .body-status-alert { min-width: 140px; }
  .body-cash-cancel, .body-cash-confirm { min-width: 70px; }
  .body-cash-confirm { margin-left: 10px; }
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
.black .nb-bet-early-cash-button {
  .body-status-cash, .body-status-alert { .status-cash-text { color: #FFF; } .status-cash-num { color: #FFF; } }
  .body-cash-confirm { color: #fff; }
  .body-status-cancel { border: 1px solid #979797; color: #bababa; }
  .body-status-win, .body-status-pre-win { box-shadow: 0 2px 10px 0 #fe9a9a; }
  .body-status-lose, .body-status-pre-lose { box-shadow: 0 2px 10px 0 #8cc871; }
  .body-status-none { color: #bababa; border: 1px solid #979797; }
}
.white .nb-bet-early-cash-button {
  .body-status-cash, .body-status-alert { .status-cash-text { color: #FFF; } .status-cash-num { color: #FFF; } }
  .body-cash-confirm { color: #fff; }
  .body-status-cancel { border: 1px solid #979797; color: #909090; }
  .body-status-win, .body-status-pre-win { box-shadow: 0 2px 10px 0 #fe9a9a; }
  .body-status-lose, .body-status-pre-lose { box-shadow: 0 2px 10px 0 #8cc871; }
  .body-status-none { color: #bababa; border: 1px solid #ecebeb; }
}
</style>
