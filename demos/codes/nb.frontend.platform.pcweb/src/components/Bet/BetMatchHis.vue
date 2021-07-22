<template>
  <i class="nb-bet-match-his"></i>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { checkCashList } from '@/api/cash';
import { getBetHistory } from '@/api/bet';
import { betDisplay } from '@/utils/betUtils';

export default {
  inheritAttrs: false,
  name: 'BetMatchHis',
  data() {
    return {
      data: [],
      pageLan: null,
      hisTimer: null,
      tsel: { from: '', to: '', mid: '' },
    };
  },
  computed: {
    ...mapState({ pushFlag: state => state.bet.pushMstFlag, earFlag: state => state.bet.earlySucFlag }),
    ...mapState('app', { user: state => state.userinfo, betMode: state => state.bettingMode }),
    count() {
      return this.data.filter(v => !!(v.cash && v.cashout)).length;
    },
    rout() {
      return this.$route.path;
    },
    mid() {
      const rArr = this.rout.match(/^\/?(detail|finished|matchinfo)(\/\d{1,5})?\/(\d+)$/i);
      return rArr && rArr[3] ? rArr[3] : '';
    },
  },
  watch: {
    mid() {
      this.getMatchHisData();
    },
    pushFlag() {
      setTimeout(() => { this.getMatchHisData(); }, 100);
    },
    earFlag() {
      setTimeout(() => { this.getMatchHisData(); }, 100);
    },
    data() {
      this.updateMatchHisList(this.data);
    },
    count() {
      this.updateMatchHisCount(this.count);
    },
  },
  methods: {
    ...mapMutations(['updateMatchHisList', 'updateMatchHisCount', 'createEarlyTimer']),
    getDate(time, d) {
      const [dt, sd] = [time ? new Date(time) : new Date(), (d || 0) * 86400000];
      const ndt = new Date(dt.getTime() + sd);
      let tstr = `${ndt.getFullYear()}/${`0${ndt.getMonth() + 1}`.slice(-2)}/${`0${ndt.getDate()}`.slice(-2)}`;
      tstr += ` ${`0${ndt.getHours()}`.slice(-2)}:${`0${ndt.getMinutes()}`.slice(-2)}:${`0${ndt.getSeconds()}`.slice(-2)}`;
      return tstr;
    },
    getMatchHisData() {
      this.tsel.from = `${this.getDate(null, -3652).split(' ')[0]} 00:00:00`;
      this.tsel.to = `${this.getDate(null, 1).split(' ')[0]} 23:59:59`;
      [this.tsel.mid, this.data] = [this.tsel.to, []];
      this.loadData();
    },
    loadData() {
      if (this.user && this.user.token && this.mid && new Date(this.tsel.from) <= new Date(this.tsel.mid)) {
        const et = new Date(this.tsel.mid).getTime();
        const st = new Date(this.tsel.from).getTime();
        const req = Object.assign({ st, et, tp: 2 }, { mid: this.mid, wst: [-1], cnt: 100 });
        clearInterval(this.hisTimer);
        this.queryBetListData(req, (data) => {
          if (data && data.length && data.length >= 100) {
            const dt = data[data.length - 1].tp - 1;
            this.tsel.mid = this.getDate(dt);
            this.loadData();
          } else {
            this.tsel.mid = this.tsel.from;
            this.deleteSame();
            this.updateEarly();
            this.hisTimer = setInterval(() => { this.getMatchHisData(); }, 600000);
          }
        });
      }
    },
    async queryBetListData(obj, fun) {
      let dt = [];
      try {
        dt = await getBetHistory(obj);
        if (dt && dt.length) {
          for (let i = 0; i < dt.length; i += 1) {
            this.data.push(betDisplay(dt[i], this.pageLan, this.betMode));
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        if (typeof fun === 'function') fun(dt);
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
    async updateEarly() {
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
      this.startLoop();
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
    startLoop() {
      const cArr = this.data.filter(v => !!v.cashObj);
      if (cArr && cArr.length) {
        this.createEarlyTimer(() => { this.updateEarly(); });
      }
    },
  },
  mounted() {
    this.pageLan = this.$t('pageBet');
    this.getMatchHisData();
  },
};
</script>

<style lang="less">
.nb-bet-match-his { width: 0; height: 0; display: none; }
</style>
