<template>
  <list-page class="history-page" @scrollBottom="loadData" v-if="!horizScreen">
    <bet-history-head slot="header" />
    <div class="history-page-body-box" v-for="(v, k) in data" :key="k">
      <bet-history-item :data="v" @change="changeFun" />
    </div>
    <div class="history-box-none flex-center-col" v-if="finish && !loading && !data.length">
      <bet-box-none :inColor="inCol" :outColor="ouCol" />
      <p class="history-box-none-text flex-center">{{$t('pageBet.noItem')}}</p>
    </div>
    <div v-if="finish && !loading && data.length" class="history-no-more flex-center">{{$t('pageBet.noMore')}}</div>
    <div v-if="loading && !data.length" class="history-box-none flex-center-col"><icon-loading /></div>
    <div v-if="loading && data.length" class="history-loading-bar flex-center"><icon-loading /></div>
  </list-page>
  <div class="history-page" v-else>
    <div class="history-page-left flex-none-col">
      <div class="history-left-header">
        <bet-history-head />
        <bet-statistical-head :data="$t(`pageBet.statisticalTitle${!hisType ? 'One' : 'Two'}`)" />
      </div>
      <div class="history-left-content">
        <bet-statistical-body :data="stData" />
      </div>
      <div class="history-left-footer" :style="{ paddingBottom: leftTabBottom }"></div>
    </div>
    <div class="history-page-right">
      <list-page class="history-page" @scrollBottom="loadData">
        <div class="history-page-body-box" v-for="(v, k) in data" :key="k">
          <bet-history-item :data="v" @change="changeFun" />
        </div>
        <div class="history-box-none flex-center-col" v-if="finish && !loading && !data.length">
          <bet-box-none :inColor="inCol" :outColor="ouCol" />
          <p class="history-box-none-text flex-center">{{$t('pageBet.noItem')}}</p>
        </div>
        <div v-if="finish && !loading && data.length" class="history-no-more flex-center">{{$t('pageBet.noMore')}}</div>
        <div v-if="loading && !data.length" class="history-box-none flex-center-col"><icon-loading /></div>
        <div v-if="loading && data.length" class="history-loading-bar flex-center"><icon-loading /></div>
      </list-page>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { checkCashList } from '@/api/cash';
import { getBetHistory } from '@/api/bet';
import { betDisplay } from '@/utils/betUtils';
import ListPage from '@/components/common/ListPage';
import BetHistoryHead from '@/components/Bet/BetComps/BetHistoryHead';
import BetHistoryItem from '@/components/Bet/BetComps/BetHistoryItem';
import BetStatisticalHead from '@/components/Bet/BetComps/BetStatisticalHead';
import BetStatisticalBody from '@/components/Bet/BetComps/BetStatisticalBody';
import BetBoxNone from '@/components/Bet/BetComps/BetBoxNone';
import IconLoading from '@/components/common/icons/IconLoading';

export default {
  data() {
    return {
      tsel: { from: '', to: '', mid: '' },
      data: [],
      pageCnt: 10,
      loading: false,
      finish: false,
      stData: [],
      pageLan: null,
    };
  },
  props: { type: { type: Number, default: 0 } },
  computed: {
    ...mapState({
      earObj: state => state.bet.earlyObject,
      earSts: state => state.bet.earlyStatus,
      isIphoneX: state => state.bet.isIphoneX,
    }),
    ...mapState('app', {
      user: state => state.userinfo,
      theme: state => state.theme,
      betMode: state => state.bettingMode,
      horizScreen: state => state.horizScreen,
    }),
    hisType() {
      return this.type ? 1 : 0;
    },
    rout() {
      return this.$route.path;
    },
    inCol() {
      const defColor = /black/i.test(this.theme) ? '#37383C' : '#909090';
      return /blue/i.test(this.theme) ? '#37383C' : defColor;
    },
    ouCol() {
      const defColor = /black/i.test(this.theme) ? '#55565A' : '#AAAAAA';
      return /blue/i.test(this.theme) ? '#55565A' : defColor;
    },
    leftTabBottom() {
      return this.isIphoneX ? '0.66rem' : '0.51rem';
    },
  },
  watch: {
    rout() {
      if (/\/history\/[01]/i.test(this.rout)) {
        this.changeHisType(this.type ? 1 : 0);
        this.resetQuery();
      }
    },
    earObj() {
      if (this.earObj) this.earlyFun(this.earObj);
    },
    earSts(n, o) {
      if (n && !o) this.startLoop();
    },
  },
  components: {
    ListPage,
    BetHistoryHead,
    BetHistoryItem,
    BetStatisticalHead,
    BetStatisticalBody,
    BetBoxNone,
    IconLoading,
  },
  methods: {
    ...mapMutations(['changeHisType', 'createEarlyTimer', 'changeSuccStatus', 'changeEarlyStatus']),
    changeFun(v) {
      for (let i = 0; i < this.data.length; i += 1) {
        if (v && v.mstid && `${this.data[i].mstid}` === `${v.mstid}`) {
          this.$set(this.data, i, v);
          break;
        }
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
    },
    getDate(time, d) {
      const [dt, sd] = [time ? new Date(time) : new Date(), (d || 0) * 86400000];
      return this.dateFmt(dt.getTime() + sd);
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
      this.changeSuccStatus();
      const data = await this.getCashListFromServer(this.getCashParam());
      for (let i = 0; i < this.data.length; i += 1) {
        if (this.data[i].cashObj) {
          const item = JSON.parse(JSON.stringify(this.data[i]));
          item.cash = 0;
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
        this.createEarlyTimer(() => {
          this.changeEarlyStatus();
          this.updateEarly();
        });
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
      this.changeSuccStatus();
      const para = this.hisType ? [0, 3, 4, 5, 6, 7, 8, 9] : [1, 2];
      const check = !this.loading && !this.finish && this.user;
      if (check && new Date(this.tsel.from) <= new Date(this.tsel.mid)) {
        const et = new Date(this.tsel.mid).getTime();
        const st = new Date(this.tsel.from).getTime();
        const req = { st, et, tp: 2 };
        [req.wst, req.cnt] = [para, this.pageCnt];
        [this.loading, this.finish] = [true, false];
        this.queryBetListData(req, (data) => {
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
            this.data.push(betDisplay(data[i], this.pageLan, this.betMode));
          }
          this.deleteSame();
          if (!this.hisType) this.updateEarly();
        }
        if (fun && typeof fun === 'function') {
          fun(data);
        }
      } catch (e) {
        console.log(e);
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
    this.changeHisType(this.type ? 1 : 0);
    this.resetQuery();
  },
};
</script>

<style lang="less">
.white .history-page {
  .history-page-body-box {
    box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,0.5);
    background: linear-gradient(to top, #f9f9f9, #ffffff);
    border: .01rem solid #EBE9E9;
  }
  .history-box-none .history-box-none-text { color: #2E2F34; }
  .history-no-more, .history-loading-bar { color: #BBB; }
}
.black .history-page {
  .history-page-body-box {
    box-shadow: 0 .1rem .2rem 0 rgba(37, 37, 37, 0.5);
    background: linear-gradient(133deg, #3d4046, #35363c);
    border: .01rem solid #2e2f34;
  }
  .history-box-none .history-box-none-text { color: #FFF; }
  .history-no-more, .history-loading-bar { color: #716d6d; }
}
.blue .history-page {
  .history-page-body-box {
    box-shadow: 0 .1rem .2rem 0 rgba(0, 0, 0, 0.3);
    background: linear-gradient(to bottom, #3a393f, #333238);
    border: .01rem solid #2e2f34;
  }
  .history-box-none .history-box-none-text { color: #b0b0b0; }
  .history-no-more, .history-loading-bar { color: #666666; }
}
.history-page {
  .history-page-body-box { width: 3.55rem; border-radius: .06rem; margin: .1rem auto 0; }
  .history-box-none {
    width: 100%;
    height: 4.5rem;
    .history-box-none-text {
      width: 100%;
      height: .53rem;
      font-size: .15rem;
      opacity: 0.7;
      user-select: none;
    }
  }
  .history-no-more, .history-loading-bar {
    margin-top: .12rem;
    width: 100%;
    height: .26rem;
    font-size: .13rem;
    user-select: none;
  }
}
.history-page-left {
  float: left;
  width: 3.75rem;
  height: 100%;
  .history-left-header { position: relative; z-index: 13; }
  .history-left-content {
    position: relative;
    flex-grow: 1;
    z-index: 10;
    width: 3.75rem;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
  }
  .history-left-footer { position: relative; z-index: 12; }
}
.history-page-right {
  float: right;
  width: 3.75rem;
  height: 100%;
  .history-box-none { height: 2.6rem; }
}
.horizontal .history-page { width: 100%; height: 100%; }
</style>
