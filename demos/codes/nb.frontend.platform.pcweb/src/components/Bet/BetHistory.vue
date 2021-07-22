<template>
<bet-cover-box :class="`nb-bet-history${betCheck ? '-mix' : ''}`" :index="99999" :show="hisShow" @close="closeFun" >
  <list-page class="bet-his-box" :loading="loading" :first="!data.length" :toggle="toggle" @scrollBottom="loadData" >
    <div class="bet-history-head" slot="header">
      <div class="bet-history-close flex-center"><icon-close size="20" /></div>
      <div class="bet-history-title flex-start">{{$t('pageBet.betSlips')}}</div>
      <bet-history-head />
    </div>
    <div class="history-page-body-box" v-for="(v, k) in data" :key="k">
      <bet-history-title :data="v" @change="changeFun(v)" v-if="!betCheck" />
      <bet-history-body :data="v" @change="changeFun(v)" @step="stepFun" @cash="earlyFun" />
    </div>
    <div class="history-box-none flex-center-col" v-if="finish && !loading && !data.length">
      <icon-none :inColor="inCol" :outColor="ouCol" />
      <p class="history-box-none-text flex-center">{{$t('pageBet.noItem')}}</p>
    </div>
    <div v-if="finish && !loading && data.length" class="history-no-more flex-center">{{$t('pageBet.noMore')}}</div>
  </list-page>
  <div :class="`show-calculate-${calShow ? 'in' : 'out'} flex-center`" @click="toggleCalFun">
    <icon-select color="#909090" size="12" />
  </div>
  <div class="nb-history-calculate" v-if="calShow" @click="toggleCalFun" >
    <bet-statistical-head :data="$t(`pageBet.statisticalTitle${!hisType ? 'One' : 'Two'}`)" />
    <bet-statistical-body :data="stData" />
  </div>
</bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { checkCashList } from '@/api/cash';
import { getBetHistory } from '@/api/bet';
import { betDisplay } from '@/utils/betUtils';
import ListPage from '@/components/common/ListPage';
import IconSelect from '@/components/Result/IconSelect';
import IconNone from '@/components/common/icons/IconNone';
import IconClose from '@/components/common/icons/IconClose';
import BetCoverBox from '@/components/Bet/BetComps/BetCoverBox';
import BetHistoryHead from '@/components/Bet/BetComps/BetHistoryHead';
import BetHistoryBody from '@/components/Bet/BetComps/BetHistoryBody';
import BetHistoryTitle from '@/components/Bet/BetComps/BetHistoryTitle';
import BetStatisticalHead from '@/components/Bet/BetComps/BetStatisticalHead';
import BetStatisticalBody from '@/components/Bet/BetComps/BetStatisticalBody';

export default {
  inheritAttrs: false,
  name: 'BetHistory',
  data() {
    return {
      tsel: { from: '', to: '', mid: '' },
      data: [],
      stData: [],
      pageCnt: 20,
      loading: false,
      finish: false,
      pageLan: null,
      calShow: false,
      loadTime: 0,
      toggle: false,
    };
  },
  computed: {
    ...mapState('app', ['userinfo', 'theme', 'bettingMode', 'bettingStyle']),
    ...mapState({
      hisType: state => state.bet.hisType,
      earObj: state => state.bet.earlyObject,
      earSts: state => state.bet.earlyStatus,
      bFlag: state => state.bet.betHistoryFlag,
    }),
    hisShow() {
      return !!(this.bFlag && this.userinfo && this.userinfo.token);
    },
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
    inCol() {
      return !/^white$/i.test(this.theme) ? '#434448' : '#909090';
    },
    ouCol() {
      return !/^white$/i.test(this.theme) ? '#55565A' : '#AAAAAA';
    },
  },
  components: {
    ListPage,
    IconNone,
    IconClose,
    IconSelect,
    BetCoverBox,
    BetHistoryHead,
    BetHistoryBody,
    BetHistoryTitle,
    BetStatisticalHead,
    BetStatisticalBody,
  },
  watch: {
    hisShow() {
      this.calShow = false;
      if (this.hisShow) {
        this.changeHisType();
        this.resetQuery();
      } else {
        this.clearEarlyTimer();
      }
    },
    hisType() {
      this.resetQuery();
    },
  },
  methods: {
    ...mapMutations(['showBetHistory', 'changeHisType', 'createEarlyTimer', 'clearEarlyTimer']),
    closeFun() {
      this.showBetHistory();
    },
    toggleCalFun() {
      this.calShow = !this.calShow;
    },
    changeFun(v) {
      for (let i = 0; i < this.data.length; i += 1) {
        if (v && v.mstid && `${this.data[i].mstid}` === `${v.mstid}`) {
          this.$set(this.data, i, v);
          break;
        }
      }
      this.toggle = !this.toggle;
    },
    stepFun(v) {
      for (let i = 0; i < this.data.length; i += 1) {
        const item = this.data[i];
        item.cashStep = v && v.mstid && `${item.mstid}` === `${v.mstid}` ? v.cashStep : 0;
        this.$set(this.data, i, item);
      }
    },
    earlyFun(v) {
      for (let i = 0; i < this.data.length; i += 1) {
        if (v && v.mstid && `${this.data[i].mstid}` === `${v.mstid}`) {
          if (!v.fail) this.data.splice(i, 1);
          break;
        }
      }
      this.updateEarly();
      this.toggle = !this.toggle;
    },
    getDate(time, d) {
      const [dt, sd] = [time ? new Date(time) : new Date(), (d || 0) * 86400000];
      const ndt = new Date(dt.getTime() + sd);
      let tstr = `${ndt.getFullYear()}/${`0${ndt.getMonth() + 1}`.slice(-2)}/${`0${ndt.getDate()}`.slice(-2)}`;
      tstr += ` ${`0${ndt.getHours()}`.slice(-2)}:${`0${ndt.getMinutes()}`.slice(-2)}:${`0${ndt.getSeconds()}`.slice(-2)}`;
      return tstr;
    },
    async getCashListFromServer(obj) {
      let data = [];
      if (obj && obj.options && obj.options.length) {
        try {
          data = await checkCashList(obj);
        } catch (e) {
          console.log(e);
        }
      }
      return data && data.length ? data : [];
    },
    getCashParam() {
      const arr = [];
      for (let i = 0; i < this.data.length; i += 1) {
        if (this.data[i].cashObj) {
          arr.push(this.data[i].cashObj);
        }
      }
      return { options: arr };
    },
    async updateEarly() {
      const data = await this.getCashListFromServer(this.getCashParam());
      for (let i = 0; i < this.data.length; i += 1) {
        if (this.data[i].cashObj) {
          const item = JSON.parse(JSON.stringify(this.data[i]));
          [item.cash, item.cashStep] = [0, 0];
          for (let j = 0; j < data.length; j += 1) {
            if (`${data[j].orderId}` === `${item.cashObj.orderId}`) {
              [item.cash, item.cashout] = [data[j].amount, data[j].cashout];
              break;
            }
          }
          this.$set(this.data, i, item);
        }
      }
      this.deleteSame();
    },
    startLoop() {
      if (!this.hisType) {
        this.createEarlyTimer(this.updateEarly);
      }
    },
    resetQuery() {
      this.tsel.from = `${this.getDate(null, -3652).split(' ')[0]} 00:00:00`;
      this.tsel.to = `${this.getDate(null, 1).split(' ')[0]} 23:59:59`;
      [this.loading, this.finish] = [false, false];
      [this.tsel.mid, this.data] = [this.tsel.to, []];
      this.updateStatistical();
      this.loadData();
      this.startLoop();
    },
    loadData() {
      if (Date.now() - this.loadTime < 500) return;
      this.loadTime = Date.now();
      const para = this.hisType ? [0, 3, 4, 5, 6, 7, 8, 9] : [1, 2];
      const check = !this.loading && !this.finish && this.userinfo;
      if (check && this.userinfo.token && new Date(this.tsel.from) <= new Date(this.tsel.mid)) {
        const et = new Date(this.tsel.mid).getTime();
        const st = new Date(this.tsel.from).getTime();
        const req = { st, et, tp: 2 };
        [req.wst, req.cnt] = [para, this.pageCnt];
        [this.loading, this.finish] = [true, false];
        this.queryBetListData(req, (data) => {
          this.loadTime = Date.now();
          if (data && data.length && data.length >= this.pageCnt) {
            const dt = data[data.length - 1].tp - 1;
            this.tsel.mid = this.getDate(dt);
          } else {
            this.tsel.mid = this.tsel.from;
            this.finish = true;
          }
        });
      }
    },
    async queryBetListData(obj, fun) {
      try {
        const data = await getBetHistory(obj);
        this.loading = false;
        if (data && data.length) {
          for (let i = 0; i < data.length; i += 1) {
            this.data.push(betDisplay(data[i], this.pageLan));
          }
          this.deleteSame();
          if (!this.hisType) this.updateEarly();
        }
        if (fun && typeof fun === 'function') {
          fun(data);
        }
      } catch (e) {
        console.log(e);
        this.finish = true;
      } finally {
        this.loading = false;
      }
    },
    deleteSame() {
      for (let i = this.data.length - 1; i > 0; i -= 1) {
        for (let j = 0; j < i; j += 1) {
          if (`${this.data[j].mstid}` === `${this.data[i].mstid}`) {
            this.data.splice(i, 1);
            break;
          }
        }
      }
      this.updateStatistical();
    },
    updateStatistical() {
      const sArr = this.pageLan && this.pageLan.statisticalData ? this.pageLan.statisticalData : null;
      const dt = typeof sArr === 'object' && sArr.constructor === Array ? JSON.parse(JSON.stringify(sArr)) : null;
      if (!dt || dt.length < 7) return;
      for (let i = 0; i < this.data.length; i += 1) {
        const item = this.data[i];
        [dt[0][1], dt[0][2], dt[0][3]] = [dt[0][1] + 1, dt[0][2] + item.x.amt, dt[0][3] + item.x.win];
        if (item.x.single) {
          [dt[1][1], dt[1][2], dt[1][3]] = [dt[1][1] + 1, dt[1][2] + item.x.amt, dt[1][3] + item.x.win];
          if (/^1\d(\d{2})?$/.test(item.ctp)) {
            [dt[2][1], dt[2][2], dt[2][3]] = [dt[2][1] + 1, dt[2][2] + item.x.amt, dt[2][3] + item.x.win];
          }
        } else {
          [dt[3][1], dt[3][2], dt[3][3]] = [dt[3][1] + 1, dt[3][2] + item.x.amt, dt[3][3] + item.x.win];
        }
        if (item.cashObj && item.cashout && item.cash) {
          [dt[4][1], dt[4][2], dt[4][3]] = [dt[4][1] + 1, dt[4][2] + item.x.amt, dt[4][3] + item.cash];
        }
        if (/^9$/.test(item.wst) && item.x.rtn > 0) {
          [dt[4][1], dt[4][2], dt[4][3]] = [dt[4][1] + 1, dt[4][2] + item.x.amt, dt[4][3] + item.x.win];
        }
        if (/^(3|8|9)$/.test(item.wst)) {
          if (item.x.rtn > item.x.amt) {
            [dt[5][1], dt[5][2], dt[5][3]] = [dt[5][1] + 1, dt[5][2] + item.x.amt, dt[5][3] + item.x.win];
            if (item.x.single) {
              [dt[8][1], dt[8][2], dt[8][3]] = [dt[8][1] + 1, dt[8][2] + item.x.amt, dt[8][3] + item.x.win];
              if (/^1\d(\d{2})?$/.test(item.ctp)) {
                [dt[11][1], dt[11][2], dt[11][3]] = [dt[11][1] + 1, dt[11][2] + item.x.amt, dt[11][3] + item.x.win];
              }
            } else {
              [dt[14][1], dt[14][2], dt[14][3]] = [dt[14][1] + 1, dt[14][2] + item.x.amt, dt[14][3] + item.x.win];
            }
          } else if (item.x.rtn < item.x.amt) {
            [dt[6][1], dt[6][2], dt[6][3]] = [dt[6][1] + 1, dt[6][2] + item.x.amt, dt[6][3] + item.x.win];
            if (item.x.single) {
              [dt[9][1], dt[9][2], dt[9][3]] = [dt[9][1] + 1, dt[9][2] + item.x.amt, dt[9][3] + item.x.win];
              if (/^1\d(\d{2})?$/.test(item.ctp)) {
                [dt[12][1], dt[12][2], dt[12][3]] = [dt[12][1] + 1, dt[12][2] + item.x.amt, dt[12][3] + item.x.win];
              }
            } else {
              [dt[15][1], dt[15][2], dt[15][3]] = [dt[15][1] + 1, dt[15][2] + item.x.amt, dt[15][3] + item.x.win];
            }
          } else {
            [dt[7][1], dt[7][2], dt[7][3]] = [dt[7][1] + 1, dt[7][2] + item.x.amt, dt[7][3] + item.x.win];
            if (item.x.single) {
              [dt[10][1], dt[10][2], dt[10][3]] = [dt[10][1] + 1, dt[10][2] + item.x.amt, dt[10][3] + item.x.win];
              if (/^1\d(\d{2})?$/.test(item.ctp)) {
                [dt[13][1], dt[13][2], dt[13][3]] = [dt[13][1] + 1, dt[13][2] + item.x.amt, dt[13][3] + item.x.win];
              }
            } else {
              [dt[16][1], dt[16][2], dt[16][3]] = [dt[16][1] + 1, dt[16][2] + item.x.amt, dt[16][3] + item.x.win];
            }
          }
        }
      }
      this.stData = dt;
    },
  },
  mounted() {
    [this.pageLan, this.stData] = [this.$t('pageBet'), []];
    this.showBetHistory();
  },
};
</script>

<style lang="less">
.nb-bet-history .nb-bet-public-box-body,
.nb-bet-history-mix .nb-bet-public-box-body {
  height: 100%;
  right: 0;
  .nb-bet-public-box-body-posit {
    height: 100%;
    .bet-his-box {
      .bet-history-close { position: absolute; width: 60px; height: 60px; top: 10px; right: 10px; cursor: pointer; }
      .bet-history-title {
        width: 100%;
        height: 80px;
        font-size: 24px;
        font-weight: 500;
        padding-left: 46px;
        color: #eeeeee;
        background: url('../XSports/images/subview-white.jpg');
      }
      .history-page-body-box { border-radius: 6px; }
      .history-box-none { width: 100%; height: 400px; .history-box-none-text { width: 100%; height: 53px; font-size: 15px; opacity: 0.7; user-select: none; } }
      .history-no-more { margin-top: 20px; width: 100%; height: 40px; font-size: 13px; user-select: none; }
    }
    .show-calculate-out, .show-calculate-in { position: absolute; width: 30px; height: 30px; top: 5px; border-radius: 4px; cursor: pointer; }
    .show-calculate-out { transform: rotate(180deg); }
    .nb-history-calculate { position: absolute; width: 400px; top: 5px; border-radius: 6px; overflow: hidden; }
  }
}
.nb-bet-history .nb-bet-public-box-body {
  width: 740px;
  .history-page-body-box { width: 671px; margin: 20px auto 0; }
  .show-calculate-out, .show-calculate-in { right: 745px; }
  .nb-history-calculate { right: 780px; }
}
.nb-bet-history-mix .nb-bet-public-box-body {
  width: 500px;
  .history-page-body-box { width: 476px; margin: 15px auto 0; }
  .show-calculate-out, .show-calculate-in { right: 505px; }
  .nb-history-calculate { right: 540px; }
}

.white .nb-bet-history .nb-bet-public-box-body-posit {
  background: #f5f4f5;
  .history-page-body-box { box-shadow: 0 2px 4px 0 rgba(223,222,223,.5); background: linear-gradient(to top, #f9f9f9, #ffffff); border: 1px solid #EBE9E9; }
  .history-box-none .history-box-none-text { color: #2E2F34; }
  .history-no-more { color: #BBB; }
  .show-calculate-out, .show-calculate-in { background: linear-gradient(to bottom, #f9f9f921, #ffffff21); svg g { fill: #bababa; } }
  .nb-history-calculate { background: linear-gradient(to bottom, #f9f9f9, #ffffff); }
}

.white .nb-bet-history-mix .nb-bet-public-box-body-posit {
  background: #f5f4f5;
  .history-page-body-box { box-shadow: 0 2px 4px 0 rgba(223,222,223,.5); background: linear-gradient(to top, #f9f9f9, #ffffff); border: 1px solid #EBE9E9; }
  .history-box-none .history-box-none-text { color: #2E2F34; }
  .history-no-more { color: #BBB; }
  .show-calculate-out, .show-calculate-in { background: linear-gradient(to bottom, #f9f9f921, #ffffff21); svg g { fill: #bababa; } }
  .nb-history-calculate { background: linear-gradient(to bottom, #f9f9f9, #ffffff); }
}

.dark .nb-bet-history-mix .nb-bet-public-box-body {
  .nb-bet-public-box-body-posit {
    .bet-his-box {
      .bet-history-title {
        background: url('../XSports/images/subview-dark.jpg');
      }
      .history-page-body-box {
        box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
        background-image: linear-gradient(to bottom, #3a393f, #333238);
      }
    }
  }
  .show-calculate-in,
  .show-calculate-out,
  .nb-history-calculate {
    display: none;
  }
}
</style>
