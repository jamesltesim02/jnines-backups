<template>
  <list-page class="history-page" @scrollBottom="loadData">
    <bet-history-head slot="header" />
    <div class="history-page-body-box" v-for="(v, k) in data" :key="k">
      <bet-history-title :data="v" @change="changeFun" />
      <bet-history-body :data="v" @change="changeFun" />
    </div>
    <div class="history-box-none flex-center-col" v-if="finish && !loading && !data.length">
      <bet-box-none :inColor="inCol" :outColor="ouCol" />
      <p class="history-box-none-text flex-center">{{$t('pageBet.noItem')}}</p>
    </div>
    <div v-if="finish && !loading && data.length" class="history-no-more flex-center">{{$t('pageBet.noMore')}}</div>
    <div v-if="loading && !data.length" class="history-box-none flex-center-col"><icon-loading /></div>
    <div v-if="loading && data.length" class="history-loading-bar flex-center"><icon-loading /></div>
  </list-page>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { checkCashList } from '@/api/cash';
import { getBetHistory } from '@/api/bet';
import { betDisplay } from '@/utils/betUtils';
import ListPage from '@/components/common/ListPage';
import BetHistoryHead from '@/components/Bet/BetComps/BetHistoryHead';
import BetHistoryBody from '@/components/Bet/BetComps/BetHistoryBody';
import BetHistoryTitle from '@/components/Bet/BetComps/BetHistoryTitle';
import BetBoxNone from '@/components/Bet/BetComps/BetBoxNone';
import IconLoading from '@/components/common/icons/IconLoading';

export default {
  data() {
    return {
      tsel: { from: '', to: '', mid: '' },
      data: [],
      loading: false,
      finish: false,
      pageCnt: 30,
    };
  },
  computed: {
    ...mapState({
      hisType: state => state.bet.hisType,
      earObj: state => state.bet.earlyObject,
    }),
    ...mapState('app', {
      user: state => state.userinfo,
      theme: state => state.theme,
    }),
    inCol() {
      return /black/i.test(this.theme) ? '#37383C' : '#909090';
    },
    ouCol() {
      return /black/i.test(this.theme) ? '#55565A' : '#AAAAAA';
    },
  },
  watch: {
    hisType() {
      this.resetQuery();
    },
    earObj() {
      if (this.earObj) this.earlyFun(this.earObj);
    },
  },
  components: {
    ListPage,
    BetHistoryHead,
    BetHistoryBody,
    BetHistoryTitle,
    BetBoxNone,
    IconLoading,
  },
  methods: {
    ...mapMutations([
      'changeHisType',
      'createEarlyTimer',
      'changeSuccStatus',
    ]),
    ...mapActions('app', ['reloadBalance']),
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
          this.data.splice(i, 1);
          break;
        }
      }
      this.reloadBalance();
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
      this.changeSuccStatus();
      const data = await this.getCashListFromServer(this.getCashParam());
      for (let i = 0; i < this.data.length; i += 1) {
        if (this.data[i].cashObj) {
          const item = this.data[i];
          for (let j = 0; j < data.length; j += 1) {
            if (`${data[j].orderId}` === `${item.cashObj.orderId}`) {
              [item.cash, item.cashout] = [data[j].amount, data[j].cashout];
              this.$set(this.data, i, item);
              break;
            }
          }
        }
      }
      this.deleteSame();
    },
    resetQuery() {
      this.tsel.from = `${this.getDate(null, -3652).split(' ')[0]} 00:00:00`;
      this.tsel.to = `${this.getDate(null, 1).split(' ')[0]} 23:59:59`;
      [this.loading, this.finish] = [false, false];
      [this.tsel.mid, this.data] = [this.tsel.to, []];
      this.loadData();
      if (!this.hisType) {
        this.createEarlyTimer(this.updateEarly);
      }
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
            this.data.push(betDisplay(data[i], this.$t('pageBet')));
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
    },
  },
  mounted() {
    this.changeHisType();
    this.resetQuery();
  },
};
</script>

<style lang="less">
.white .history-page {
  .history-page-body-box {
    box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,0.50);
    background-image: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
    border: .01rem solid #EBE9E9;
  }
  .history-box-none .history-box-none-text {
    color: #2E2F34;
  }
  .history-no-more, .history-loading-bar {
    color: #BBB;
  }
}
.black .history-page {
  .history-page-body-box {
    box-shadow: 0 .1rem .2rem 0 rgba(37, 37, 37, 0.5);
    background-image: linear-gradient(133deg, #3d4046, #35363c);
    border: .01rem solid #2e2f34;
  }
  .history-box-none .history-box-none-text {
    color: #FFF;
  }
  .history-no-more, .history-loading-bar {
    color: #716d6d;
  }
}
.history-page {
  .history-page-body-box {
    width: 3.51rem;
    border-radius: .06rem;
    margin: .1rem auto 0;
  }
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
</style>
