<template>
  <list-page class="report-page" @scrollBottom="loadData">
    <report-head slot="header" />
    <div class="report-page-body-box flex-around" v-for="(v, k) in data" :key="k">
      <div class="head-time flex-center-col">
        <span class="head-top flex-center">{{v.date}}</span>
        <span class="head-bottom flex-center">{{v.time}}</span>
      </div>
      <div class="head-order flex-center-col" v-if="v.id">
        <span class="head-top flex-center">{{v.name}}</span>
        <span class="head-bottom flex-center copy-flag">{{v.id}}</span>
      </div>
      <div class="head-order flex-center-col" v-else>{{v.name}}</div>
      <div class="head-money flex-center-col">{{v.money}}</div>
      <div class="head-result flex-center-col">{{v.status}}</div>
    </div>
    <div class="history-box-none flex-center-col" v-if="finish && !loading && !data.length">
      <bet-box-none :inColor="inCol" :outColor="ouCol" />
      <p class="history-box-none-text flex-center">{{$t('pageQuery.notYet')}}{{pageTitle}}</p>
    </div>
    <div v-if="finish && !loading && data.length" class="history-no-more flex-center">{{$t('pageQuery.noMore')}}</div>
    <div v-if="loading && !data.length" class="history-box-none flex-center-col"><icon-loading /></div>
    <div v-if="loading && data.length" class="history-loading-bar flex-center"><icon-loading /></div>
  </list-page>
</template>

<script>
import { mapState } from 'vuex';
import { getBetHistory } from '@/api/bet';
import ListPage from '@/components/common/ListPage';
import ReportHead from '@/components/QueryAndBank/ReportHead';
import BetBoxNone from '@/components/Bet/BetComps/BetBoxNone';
import IconLoading from '@/components/common/icons/IconLoading';
import { queryDefault, displayMoney, displayBetting } from '@/utils/queryUtils';
import { getDepositHis, getWithdrawHis, getWashCodeHis } from '@/api/portalAgyy';

export default {
  props: ['type'],
  data() {
    return {
      pageTitle: '',
      tsel: Object.assign({ from: '', to: '', mid: '' }, { page: 0 }),
      data: [],
      loading: false,
      finish: false,
      pageCnt: 10,
    };
  },
  computed: {
    ...mapState('app', {
      user: state => state.userinfo,
      theme: state => state.theme,
    }),
    ...mapState('query', {
      queryData: state => state.queryData,
    }),
    inCol() {
      return /black/i.test(this.theme) ? '#37383C' : '#909090';
    },
    ouCol() {
      return /black/i.test(this.theme) ? '#55565A' : '#AAAAAA';
    },
  },
  components: {
    ListPage,
    ReportHead,
    BetBoxNone,
    IconLoading,
  },
  methods: {
    getDate(time, d) {
      const [dt, sd] = [time ? new Date(time) : new Date(), (d || 0) * 86400000];
      const ndt = new Date(dt.getTime() + sd);
      let tstr = `${ndt.getFullYear()}/${`0${ndt.getMonth() + 1}`.slice(-2)}/${`0${ndt.getDate()}`.slice(-2)}`;
      tstr += ` ${`0${ndt.getHours()}`.slice(-2)}:${`0${ndt.getMinutes()}`.slice(-2)}:${`0${ndt.getSeconds()}`.slice(-2)}`;
      return tstr;
    },
    changeDateType(tStr) {
      const tArr = tStr.split(/[-/\s]/);
      return `${tArr[0]}/${+tArr[1]}/${+tArr[2]} ${tArr[3]}`;
    },
    changeQueryPara(dt) {
      [this.tsel.from, this.tsel.to] = [`${dt.from} 00:00:00`, `${dt.to} ${this.queryData.type < 6 ? '00:00:00' : '23:59:59'}`];
      [this.tsel.mid, this.tsel.page, this.data] = [this.tsel.to, 1, []];
      [this.loading, this.finish] = [false, false];
      this.loadData();
    },
    loadData() {
      const check = !this.loading && !this.finish && this.user && this.user.token;
      if (check && new Date(this.tsel.from) <= new Date(this.tsel.mid)) {
        const req = { };
        if (this.queryData.type < 6) {
          [req.beginTime, req.page_number] = [this.changeDateType(this.tsel.from), this.tsel.page];
          [req.endTime, req.page_size] = [this.changeDateType(this.tsel.to), this.pageCnt];
          if (this.queryData.type === 1) {
            req.orderType = 'ONLINE_PAYMENT';
          } else if (this.queryData.type === 2) {
            req.orderType = 'BQ';
          } else if (this.queryData.type === 3) {
            req.orderType = 'VIRTUAL_ALL';
          }
        } else if (this.queryData.type === 6) {
          const et = new Date(this.tsel.mid).getTime();
          const st = new Date(this.tsel.from).getTime();
          [req.st, req.et, req.tp] = [st, et, 2];
          [req.wst, req.cnt] = [[-1], this.pageCnt];
        }
        [this.loading, this.finish] = [true, false];
        this.queryDataFromServer(req, (data) => {
          if (data && data.length && data.length >= this.pageCnt) {
            if (this.queryData.type === 6) {
              this.tsel.mid = this.getDate(data[data.length - 1].tp - 1);
            }
            this.tsel.page += 1;
          } else {
            this.tsel.mid = this.tsel.from;
            this.finish = true;
          }
        });
      }
    },
    async queryDataFromServer(obj, fun) {
      try {
        let [rtn, data] = [null, []];
        if (this.queryData.type <= 3) {
          rtn = await getDepositHis(obj);
          data = rtn && rtn.data ? rtn.data : rtn;
        } else if (this.queryData.type === 4) {
          rtn = await getWithdrawHis(obj);
          data = rtn && rtn.data ? rtn.data : rtn;
        } else if (this.queryData.type === 5) {
          rtn = await getWashCodeHis(obj);
          data = rtn && rtn.data ? rtn.data : rtn;
        } else if (this.queryData.type === 6) {
          data = await getBetHistory(obj);
        }
        this.loading = false;
        if (data && data.length) {
          const lan = Object.assign(this.$t('common.sports'), this.$t('pageQuery'));
          for (let i = 0; i < data.length; i += 1) {
            if (this.queryData.type < 6) {
              this.data.push(displayMoney(data[i], this.queryData.type));
            } else if (this.queryData.type === 6) {
              this.data.push(displayBetting(data[i], lan));
            }
          }
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
    getPageTitle(type) {
      const list = {
        1: this.$t('pageQuery.deposit'),
        2: this.$t('pageQuery.deposit'),
        3: this.$t('pageQuery.deposit'),
        4: this.$t('pageQuery.withdraw'),
        5: this.$t('pageQuery.washCode'),
        6: this.$t('pageQuery.betting'),
      };
      this.pageTitle = list[type];
    },
  },
  mounted() {
    const dt = queryDefault(+this.type);
    this.getPageTitle(dt.type);
    this.changeQueryPara(dt);
  },
};
</script>

<style lang="less">
.white .report-page {
  .report-page-body-box {
    background: linear-gradient(to bottom, #F9F9F9, #FFFFFF);
    .head-time, .head-order, .head-money {
      border-right: .01rem solid #EBE9E9;
    }
    .head-time span {
      color: #6b6b6b;
    }
    .head-order {
      color: #2E2F34;
      .head-top {
        color: #2E2F34;
      }
      .head-bottom {
        color: #6b6b6b;
      }
    }
    .head-money {
      color: #2E2F34;
    }
    .head-result {
      color: #2E2F34;
    }
  }
  .history-box-none .history-box-none-text {
    color: #2E2F34;
  }
  .history-no-more, .history-loading-bar {
    color: #BBB;
  }
}
.black .report-page {
  .report-page-body-box {
    background: linear-gradient(to bottom, #2a292f, #29292e);
    .head-time, .head-order, .head-money {
      border-right: .01rem solid #2e2f34;
    }
    .head-time span {
      color: #909090;
    }
    .head-order {
      color: #f1f1f1;
      .head-top {
        color: #f1f1f1;
      }
      .head-bottom {
        color: #bababa;
      }
    }
    .head-money {
      color: #f1f1f1;
    }
    .head-result {
      color: #f1f1f1;
    }
  }
  .history-box-none .history-box-none-text {
    color: #FFF;
  }
  .history-no-more, .history-loading-bar {
    color: #716d6d;
  }
}
.report-page {
  .report-page-body-box {
    width: 3.75rem;
    height: .64rem;
    margin-top: .04rem;
    .head-time, .head-order, .head-money, .head-result {
      height: 100%;
      font-size: .12rem;
      span {
        width: 100%;
        padding: 0 .02rem;
        min-height: 30%;
      }
    }
    .head-time {
      width: .69rem;
    }
    .head-order {
      width: 1.41rem;
    }
    .head-money {
      width: .83rem;
    }
    .head-result {
      width: .82rem;
    }
  }
  .history-box-none {
    width: 100%;
    height: 4.5rem;
    .history-box-none-text {
      width: 100%;
      height: .53rem;
      font-size: .15rem;
      opacity: 0.7;
    }
  }
  .history-no-more, .history-loading-bar {
    margin-top: .12rem;
    width: 100%;
    height: .26rem;
    font-size: .13rem;
  }
}
</style>
