<template>
  <div class="nb-bet-match-history" >
    <div class="nb-bet-match-history-content flex-center-col" >
      <div class="history-box-title flex-between" >
        <div class="history-odds-box flex-center" >{{$t('pageBet.slipOddsTxt')}}</div>
        <div class="history-game-box flex-center" >{{$t('pageBet.slipGameTxt')}}</div>
        <div class="history-amount-box flex-center" >{{$t('pageBet.betMoney')}}</div>
        <div class="history-return-box flex-center" >{{$t('pageBet.maxRtnP')}}</div>
        <div class="history-button-box flex-center" ></div>
      </div>
      <perfect-scrollbar class="nb-bet-match-history-scroll" >
        <div :class="getItemClass(v)" v-for="(v, k) in showData" :key="k">
          <div class="history-box-body flex-between" v-if="getNeedShow(v)" >
            <div class="history-odds-box flex-center" >
              <span class="head-team-mix">{{getOptName(v)}}</span>
              <div class="head-odds-mix flex-center">
                <span class="head-odds-txt flex-center">@</span>
                <span class="head-odds-num flex-center">{{getOddv(v)}}</span>
              </div>
            </div>
            <div class="history-game-box flex-center" >
              <span class="mix-body-game flex-center">{{$t(`common.wf.wf_${getJoinStr(v)}`)}}</span>
            </div>
            <div class="history-amount-box flex-center" >
              <span class="body-money-mix-num flex-center" :style="{ color: oddsColor }">{{changeType(v.x.amt, true)}}</span>
            </div>
            <div class="history-return-box flex-center" >
              <span class="body-money-mix-num flex-center" :style="{ color: oddsColor }">{{changeType(v.x.rtn, true)}}</span>
            </div>
            <div class="history-button-box flex-center" >
              <bet-early-cash-button :data="v" @step="stepFun" />
            </div>
          </div>
        </div>
        <div class="history-box-none flex-center-col" v-if="!showData.length">
          <p class="history-box-none-text flex-center">{{$t('pageBet.noItem')}}</p>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import oddsFormat from '@/filters/oddsFormat';
import { changeNumType } from '@/utils/betUtils';
import toOptionName from '@/components/Matchs/GameOption/toOptionName';
import BetEarlyCashButton from '@/components/Bet/BetComps/BetEarlyCashButton';

export default {
  data() {
    return { showData: [] };
  },
  props: { type: String },
  computed: {
    ...mapState('app', ['theme']),
    ...mapState({ data: state => state.bet.matchHisList }),
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
  },
  watch: {
    data() {
      this.getShowData();
    },
  },
  components: { BetEarlyCashButton },
  methods: {
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
    getShowData() {
      const dt = [];
      for (let i = 0; i < this.data.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.data[i]));
        if (this.getNeedShow(obj)) {
          obj.cashStep = 0;
          dt.push(obj);
        }
      }
      this.showData = dt;
    },
    getNeedShow(v) {
      let rst = true;
      if (this.type && /ear/i.test(this.type)) {
        rst = !!(v.cash && v.cashout);
      } else if (this.type && /un/i.test(this.type)) {
        rst = /^[12]$/.test(v.wst);
      } else if (this.type && /fi/i.test(this.type)) {
        rst = /^[12]$/.test(v.wst);
      }
      return rst;
    },
    getItemClass(v) {
      return `history-page-body-box${this.getNeedShow(v) ? '' : '-none'}`;
    },
    getBetOpt(w) {
      return w && w.opts && w.opts.length ? w.opts[0] : { };
    },
    getOddv(w) {
      const v = this.getBetOpt(w);
      if (v.odv) {
        return changeNumType(v.odv, true, 3);
      }
      const oddOld = v.ods || v.odds;
      const oddNew = oddsFormat(oddOld, v.gmt || v.gameType);
      return changeNumType(oddNew - oddOld > 0.5 ? oddOld + 1 : oddOld, true, 3);
    },
    getJoinStr(w) {
      const v = this.getBetOpt(w);
      return `${v.sno || v.sportID}_${v.gpt || v.groupType || 0}_${v.stg || v.betStage || 0}_${v.gmt || v.gameType || 0}`;
    },
    getOptName(w) {
      const v = this.getBetOpt(w);
      const obj = toOptionName(v.gmt || v.gameType, v.bar || v.betBar, v.bop || v.betOption);
      let optName = obj.key_s ? this.$t(`common.optionNames.${obj.key_s}`) : '';
      optName += obj.prefix ? `${/-/.test(obj.prefix) ? '' : '+'}${obj.prefix} ` : '';
      optName += obj.key_e ? this.$t(`common.optionNames.${obj.key_e}`) : '';
      optName += !obj.key_s && obj.key ? this.$t(`common.optionNames.${obj.key}`) : '';
      return `${optName}${obj.value || ''}${obj.suffix || ''}`;
    },
    stepFun(v) {
      for (let i = 0; i < this.showData.length; i += 1) {
        const item = this.showData[i];
        item.cashStep = v && v.mstid && `${item.mstid}` === `${v.mstid}` ? v.cashStep : 0;
        this.$set(this.showData, i, item);
      }
    },
  },
  mounted() {
    this.getShowData();
  },
};
</script>

<style lang="less">
.white .nb-bet-match-history {
  .nb-bet-match-history-content { border: 1px solid #f2f1f1; box-shadow: 0 10px 20px 0 rgba(223,222,223,.5); background: linear-gradient(to top, #f9f9f9, #ffffff); }
  .history-box-title { border-bottom: 1px solid #eeeef0; background: #fbfbfc; color: #a8a8a8; }
  .history-page-body-box { border-bottom: 1px solid #f9f9f9; }
  .head-team-mix { color: #333; font-weight: 600; }
  .head-odds-mix { color: #ff5353; }
  .mix-body-game { color: #909090; }
  .history-box-none-text { color: #2E2F34; }
}

.nb-bet-match-history {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  .ps__rail-y, .ps__rail-y:hover { background: transparent; .ps__thumb-y { width: 4px; background: transparent; } }
  .nb-bet-match-history-content { width: 100%; height: 100%; border-radius: 6px; }
  .history-box-title { position: relative; width: 100%; height: 38px; font-size: 12px; z-index: 30; }
  .nb-bet-match-history-scroll { position: relative; width: 100%; flex-grow: 1; z-index: 10; }
  .history-page-body-box-none { display: none; }
  .history-page-body-box { width: 100%; height: 52px; }
  .history-box-body { width: 100%; height: 100%; }
  .history-odds-box { width: 19%; height: 100%; }
  .history-game-box { width: 19%; height: 100%; }
  .history-amount-box { width: 19%; height: 100%; }
  .history-return-box { width: 19%; height: 100%; }
  .history-button-box { width: 24%; height: 100%; }
  .head-team-mix { font-size: 16px; margin-right: 8px; font-family: PingFangSC; }
  .head-odds-mix { height: 21px; font-weight: 500; padding: 0 3px; border-radius: 3px; span { font-size: 16px; height: 100%; } }
  .head-odds-mix { .head-odds-txt { font-family: PingFangSC; padding-right: 1px; } }
  .mix-body-game { width: 90%; height: 80%; font-size: 12px; }
  .body-money-mix-num { width: 90%; height: 80%; font-size: 14px; }
  .history-box-none { width: 100%; height: 150px; }
  .history-box-none-text { width: 100%; height: 53px; font-size: 15px; opacity: 0.7; user-select: none; }
}

.dark .nb-bet-match-history {
  .head-team-mix {
    color: #fff;
  }
  .head-odds-mix{
    color: #53fffd;
  }
}
</style>
