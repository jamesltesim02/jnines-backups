<template>
  <sub-panel class="agyy-report-page" :title="$t('agPage.report.title')" >
    <div class="agyy-report-page-box" @click="setBankInputFlag">
      <div class="report-page-title flex-start">{{$t('agPage.report.pointOne')}}</div>
      <div class="report-page-select flex-between">
        <div :class="getSelClass(v)" v-for="(v, k) in typeArr" :key="k" @click="setSelect(v)" >
          <span class="select-item-text flex-center">{{v.text}}</span>
          <span class="select-item-line flex-center"></span>
        </div>
      </div>
      <div class="report-page-date flex-start">
        <span class="select-date-text range flex-start">{{$t('agPage.report.range')}}</span>
        <calendar class="select-date-calendar" :data="selDate" type="from" :min="dateMinFrom"
        :max="dateMaxFrom" format="YYYY-MM-DD 00:00" @change="selDateUpdate" />
        <span class="select-date-text date-to flex-center">{{$t('agPage.report.dateTo')}}</span>
        <calendar class="select-date-calendar" :data="selDate" type="to" :min="dateMinTo"
        :max="dateMaxTo" format="YYYY-MM-DD 23:59" @change="selDateUpdate" />
        <span class="select-date-text type flex-center" v-if="selectPass">{{$t('agPage.report.type')}}</span>
        <div class="select-date-change flex-around" v-if="selectPass">
          <span class="date-change-text flex-center">{{selectObj.text}}</span>
          <div class="date-change-btn-box flex-center-col">
            <div class="date-change-btn flex-center" @click="changeFun(-1)" >
              <svg width="7px" height="7px" style="width:7px;height:7px" viewBox="0 0 100 100">
                <path d="M 0 85.5 L 100 85.5 L50 14.5 Z" fill="#909090"></path>
              </svg>
            </div>
            <div class="date-change-btn flex-center" @click="changeFun(1)" >
              <svg width="7px" height="7px" style="width:7px;height:7px" viewBox="0 0 100 100">
                <path d="M 0 14.5 L 100 14.5 L50 85.5 Z" fill="#909090"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="report-result-head flex-between">
        <span class="result-head-text flex-center" v-for="(v, k) in titleArr" :key="k" :style="{ width: v.width }">{{v.text}}</span>
      </div>
      <div class="report-result-content">
        <loading-bar full v-if="loading" />
        <div class="content-no-record flex-center" v-if="!loading && finish && (!showData || !showData.length)">
          {{$t('agPage.report.noRecord')}}
        </div>
        <div class="content-record-row flex-between" v-for="(row, rid) in showData" :key="rid">
          <div :class="getItemClass(v)" :style="{ width: v.width }" v-for="(v, k) in row.display" :key="k">{{v.text}}</div>
        </div>
      </div>
      <div class="report-result-foot flex-between">
        <div class="foot-page-box flex-between">
          <div class="foot-page-first flex-center" @click="toReportPage('0')"><icon-first /></div>
          <div class="foot-page-prev flex-center" @click="toReportPage('-1')"><icon-prev /></div>
          <div class="foot-page-content flex-center">
            <span class="foot-content-text flex-start">{{$t('agPage.report.ordinal')}}</span>
            <input class="foot-content-input" type="text" v-model="inputPage" v-if="lastPage"
            @keypress="keyFun" @blur="toReportPage(`${inputPage}`)" />
            <input class="foot-content-input-disable" value="0" v-else disabled />
            <span class="foot-content-text flex-center">{{$t('agPage.report.total')}}</span>
            <span class="foot-content-num flex-center">{{lastPage}}</span>
            <span class="foot-content-text flex-center">{{$t('agPage.report.page')}}</span>
          </div>
          <div class="foot-page-next flex-center" @click="toReportPage('+1')"><icon-prev /></div>
          <div class="foot-page-last flex-center" @click="toReportPage('999')"><icon-first /></div>
        </div>
        <div class="foot-calc-box flex-center-col" v-if="lockCalcType < 9">
          <span class="flex-start">{{$t('agPage.report.subTotal')}}{{fmtMoney(totalSub.bet)}}{{$t('agPage.report.cnyStr')}}</span>
          <span class="flex-start">{{$t('agPage.report.allTotal')}}{{fmtMoney(totalAll.bet)}}{{$t('agPage.report.cnyStr')}}</span>
        </div>
        <div class="foot-calc-box flex-center-col" v-else>
          <span class="flex-start">{{$t('agPage.report.subTotal')}}{{fmtMoney(totalSub.win)}} / {{fmtMoney(totalSub.bet)}}</span>
          <span class="flex-start">{{$t('agPage.report.allTotal')}}{{fmtMoney(totalAll.win)}} / {{fmtMoney(totalAll.bet)}}</span>
        </div>
        <div class="foot-display-box flex-end">{{displayStr}}</div>
      </div>
      <customer-service class="report-service" />
    </div>
  </sub-panel>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getBetHistory } from '@/api/bet';
import IconPrev from './IconPrev';
import IconFirst from './IconFirst';
import Calendar from '@/components/Portal/Calendar';
import SubPanel from '@/components/Portal/portals/PortalAgyy/Member/SubPanel';
import CustomerService from '@/components/Portal/portals/PortalAgyy/Member/CustomerService';
import {
  getDepositHis,
  getWithdrawHis,
  getWashCodeHis,
  getPromotionHis,
} from '@/api/portalAgyy';

export default {
  data() {
    return {
      data: [],
      depArr: [],
      lastPage: 0,
      inputPage: 0,
      totalCount: 0,
      typeArr: [],
      titleArr: [],
      showData: [],
      finish: false,
      loading: false,
      titleObj: null,
      selectObj: null,
      lockCalcType: 0,
      dateMinFrom: '',
      dateMaxFrom: '',
      dateMinTo: '',
      dateMaxTo: '',
      totalSub: { bet: 0, win: 0 },
      totalAll: { bet: 0, win: 0 },
      pageCnt: { ag: 15, bt: 100 },
      selDate: { from: '', to: '' },
      tsel: Object.assign({ from: '', to: '', mid: '' }, { page: 0 }),
    };
  },
  computed: {
    ...mapState('app', ['userinfo']),
    ...mapState('agyy', ['reportIndex']),
    selPage() {
      return this.tsel.page || 0;
    },
    selectPass() {
      return this.selectObj && /^[123]$/.test(this.selectObj.id);
    },
    displayStr() {
      const total = this.showData.length;
      const from = this.selPage && total ? (this.selPage - 1) * this.pageCnt.ag + 1 : 0;
      const to = from && total ? from + total - 1 : 0;
      const disStr = `${this.$t('agPage.report.display')}${from}${this.$t('agPage.report.pageTo')}${to}`;
      return `${disStr}${this.$t('agPage.report.listTotal')}${this.totalCount}${this.$t('agPage.report.listStr')}`;
    },
  },
  watch: {
    reportIndex() {
      this.changeParas();
    },
    selPage() {
      if (`${this.inputPage}` !== `${this.selPage}`) {
        this.inputPage = this.selPage;
      }
    },
    lastPage() {
      if (`${this.inputPage}` !== `${this.selPage}`) {
        this.inputPage = this.selPage;
      }
    },
    inputPage() {
      let num = +(`${this.inputPage || ''}`.replace(/[^\d]/g, '') || 0);
      num = num < 1 ? 1 : num;
      num = num > this.lastPage ? this.lastPage : num;
      if (`${num}` !== `${this.inputPage}`) {
        this.inputPage = num;
      }
    },
  },
  components: {
    IconFirst,
    IconPrev,
    Calendar,
    SubPanel,
    CustomerService,
  },
  methods: {
    ...mapMutations('agyy', ['setReportIndex', 'setBankInputFlag']),
    getItemClass(v) {
      return `content-record-item flex-center${v.copy ? ' copy-flag' : ''}`;
    },
    getSelClass(v) {
      return `page-select-item-${v.active ? 'active' : 'normal'} flex-between-col`;
    },
    fmtMoney(num) {
      let pNum = `${Math.floor(+num * 100) / 100}`;
      pNum = /\./.test(pNum) ? `${pNum}00` : `${pNum}.00`;
      return pNum.replace(/^(-?\d+\.\d{2})\d*$/, '$1');
    },
    selDateUpdate(newDateObj) {
      if (JSON.stringify(this.selDate) === JSON.stringify(newDateObj)) return;
      const dtStr = this.getDate(null, true);
      this.selDate = newDateObj;
      this.changeParas();
      [this.dateMaxFrom, this.dateMinTo, this.dateMaxTo] = [this.selDate.to, this.selDate.from, `${dtStr} 23:59:59`];
    },
    toReportPage(num, flag) {
      const rNum = /^[+-]?\d+$/.test(num) ? +num : 0;
      let pNum = this.tsel.page + (/^[+-]\d+$/.test(num) ? rNum : 0);
      pNum = /^\d+$/.test(num) ? rNum : pNum;
      pNum = pNum < 1 ? 1 : pNum;
      pNum = pNum > this.lastPage ? this.lastPage : pNum;
      if (this.selectObj && (`${this.tsel.page}` !== `${pNum}` || flag)) {
        this.lockCalcType = this.selectObj.id;
        [this.tsel.page, this.showData] = [pNum, []];
        [this.loading, this.finish] = [false, false];
        [this.totalSub.bet, this.totalSub.win] = [0, 0];
        if (this.selectObj.id < 9) {
          this.loadData();
        } else {
          this.loading = true;
          this.showData = this.data.slice((pNum - 1) * this.pageCnt.ag, pNum * this.pageCnt.ag);
          this.calTotal();
          this.loading = false;
        }
      }
    },
    calTotal() {
      if (!this.totalAll.bet || !this.totalAll.win) {
        [this.totalAll.bet, this.totalAll.win] = [0, 0];
        for (let i = 0; i < this.data.length; i += 1) {
          this.totalAll.bet += +(`${this.data[i].tamt || this.data[i].amt || 0}`.replace(/[^\d.]/g, ''));
          this.totalAll.win += +(`${this.data[i].win || 0}`.replace(/[^\d.]/g, ''));
        }
      }
      [this.totalSub.bet, this.totalSub.win] = [0, 0];
      for (let i = 0; i < this.showData.length; i += 1) {
        this.totalSub.bet += +(`${this.showData[i].tamt || this.showData[i].amt || 0}`.replace(/[^\d.]/g, ''));
        this.totalSub.win += +(`${this.showData[i].win || 0}`.replace(/[^\d.]/g, ''));
      }
    },
    keyFun() {
      const [evt, input] = [window.event, this.$el.querySelector('.foot-content-input')];
      if (input && evt && evt.keyCode && evt.keyCode === 13) {
        input.blur();
      }
    },
    changeFun(num) {
      if (this.selectObj && this.selectObj.id && /^-?1$/.test(num)) {
        let id = this.selectObj.id + num;
        id = id < 1 ? 3 : id;
        id = id > 3 ? 1 : id;
        this.setReportIndex(id);
        this.setSelect();
      }
    },
    setSelect(v) {
      if (v && /^\d$/.test(v.id)) {
        this.setReportIndex(v.id);
      }
      const id = this.reportIndex || 0;
      this.selectObj = null;
      for (let i = 0; i < this.depArr.length; i += 1) {
        const dt = this.depArr[i];
        dt.active = `${id}` === `${dt.id || 0}`;
        this.$set(this.depArr, i, dt);
        this.selectObj = dt.active ? dt : this.selectObj;
      }
      let obj = null;
      for (let i = 0; i < this.typeArr.length; i += 1) {
        const dt = this.typeArr[i];
        dt.active = `${id}` === `${dt.id || 0}` || (/^1$/.test(dt.id) && this.selectObj);
        this.$set(this.typeArr, i, dt);
        obj = dt.active ? dt : obj;
      }
      this.selectObj = this.selectObj || obj;
      this.titleArr = this.titleObj && this.titleObj[id] ? this.titleObj[id] : [];
    },
    getDate(time, flag) {
      const ndt = time ? new Date(time) : new Date();
      let tstr = `${ndt.getFullYear()}/${`0${ndt.getMonth() + 1}`.slice(-2)}/${`0${ndt.getDate()}`.slice(-2)}`;
      if (!flag) {
        tstr += ` ${`0${ndt.getHours()}`.slice(-2)}:${`0${ndt.getMinutes()}`.slice(-2)}:${`0${ndt.getSeconds()}`.slice(-2)}`;
      }
      return tstr;
    },
    changeParas() {
      if (this.loading) return;
      const [fromDate, toDate] = [new Date(this.selDate.from), new Date(this.selDate.to)];
      if (fromDate > toDate) {
        this.$toast(this.$t('agPage.report.dateWrong'));
      } else if (toDate.getTime() - fromDate.getTime() > 1296000000) {
        this.$toast(this.$t('agPage.report.dateOver'));
      }
      if (fromDate > toDate || toDate - fromDate > 1296000000) return;
      [this.tsel.from, this.tsel.to] = [this.selDate.from.replace(/-/g, '/'), this.selDate.to.replace(/-/g, '/')];
      [this.tsel.mid, this.tsel.page, this.data] = [this.tsel.to, 1, []];
      [this.loading, this.totalSub.bet, this.totalSub.win] = [false, 0, 0];
      [this.finish, this.totalAll.bet, this.totalAll.win] = [false, 0, 0];
      [this.showData, this.lastPage, this.totalCount] = [[], 0, 0];
      this.loadData();
    },
    loadData() {
      const check = !this.loading && !this.finish && this.userinfo && this.userinfo.token;
      if (check && this.selectObj && new Date(this.tsel.from) <= new Date(this.tsel.mid)) {
        const req = { };
        this.lockCalcType = this.selectObj.id;
        if (this.selectObj.id < 9) {
          [req.beginTime, req.page_number] = [this.tsel.from.replace(/\//g, '-'), this.tsel.page];
          [req.endTime, req.page_size] = [this.tsel.to.replace(/\//g, '-'), this.pageCnt.ag];
          if (this.selectObj.id === 1) {
            req.orderType = 'ONLINE_PAYMENT';
          } else if (this.selectObj.id === 2) {
            req.orderType = 'BQ';
          } else if (this.selectObj.id === 3) {
            req.orderType = 'VIRTUAL_ALL';
          }
        } else if (this.selectObj.id === 9) {
          const et = new Date(this.tsel.mid).getTime();
          const st = new Date(this.tsel.from).getTime();
          [req.st, req.et, req.tp] = [st, et, 2];
          [req.wst, req.cnt] = [[-1], this.pageCnt.bt];
        }
        [this.loading, this.finish] = [true, false];
        this.queryDataFromServer(req, (data) => {
          const pgCnt = this.selectObj.id < 9 ? this.pageCnt.ag : this.pageCnt.bt;
          if (data && data.length && data.length >= pgCnt) {
            if (this.selectObj.id === 9) {
              this.tsel.mid = this.getDate(data[data.length - 1].tp - 1);
              this.loadData();
            } else {
              this.finish = true;
            }
          } else {
            if (this.selectObj.id === 9 && this.data.length && this.pageCnt.ag) {
              [this.totalCount, this.lastPage] = [this.data.length, Math.ceil(this.data.length / this.pageCnt.ag)];
              this.toReportPage('1', true);
            }
            [this.tsel.mid, this.finish, this.loading] = [this.tsel.from, true, false];
          }
        });
      }
    },
    async queryDataFromServer(obj, fun) {
      if (!this.selectObj) {
        if (typeof fun === 'function') {
          fun();
        }
      } else {
        try {
          let [rtn, data] = [null, []];
          if (this.selectObj.id === 0) {
            rtn = await getWithdrawHis(obj);
            data = rtn && rtn.data ? rtn.data : rtn;
          } else if (this.selectObj.id <= 3) {
            rtn = await getDepositHis(obj);
            data = rtn && rtn.data ? rtn.data : rtn;
          } else if (this.selectObj.id === 4) {
            rtn = await getWashCodeHis(obj);
            data = rtn && rtn.data ? rtn.data : rtn;
          } else if (this.selectObj.id === 5) {
            rtn = await getPromotionHis(obj);
            data = rtn && rtn.data ? rtn.data : rtn;
          } else if (this.selectObj.id === 9) {
            data = await getBetHistory(obj);
          }
          if (this.selectObj.id < 9 && rtn && rtn.total && this.pageCnt.ag) {
            [this.totalCount, this.lastPage] = [rtn.total, Math.ceil(rtn.total / this.pageCnt.ag)];
            [this.totalSub.bet, this.totalAll.bet] = [+(`${rtn.subtotalAmount || 0}`.replace(/[^\d.]/g, '')), +(`${rtn.totalAmount || 0}`.replace(/[^\d.]/g, ''))];
          }
          this.loading = false;
          if (data && data.length) {
            for (let i = 0; i < data.length; i += 1) {
              const item = this.forDisplayFun(data[i], this.selectObj.id);
              this.data.push(item);
              if (this.selectObj.id < 9) {
                this.showData.push(item);
              }
            }
          }
          if (typeof fun === 'function') {
            fun(data);
          }
        } catch (e) {
          console.log(e);
        } finally {
          this.loading = false;
        }
      }
    },
    forDisplayFun(item, id) {
      const lan = Object.assign(this.$t('common.sports'), this.$t('agPage.report'));
      const dt = JSON.parse(JSON.stringify(item));
      let money = dt.btcAmount || dt.amount || dt.Amount || dt.handleAmount;
      money = +(`${money || 0}`.replace(/[^\d.]/g, ''));
      dt.display = [];
      if (/^0$/.test(id)) {
        dt.display.push({ text: dt.createDate || dt.createdDate });
        dt.display.push({ text: dt.requestId, copy: true });
        dt.display.push({ text: dt.accountType });
        dt.display.push({ text: this.fmtMoney(money) });
        dt.display.push({ text: dt.flagZH });
      } else if (/^[123]$/.test(id)) {
        dt.display.push({ text: dt.createDate || dt.createdDate });
        dt.display.push({ text: dt.orderNo, copy: true });
        dt.display.push({ text: this.fmtMoney(money) });
        const [odStr, cObj] = [dt.orderTypeZH, lan.codeObj];
        const nameStr = /^\d+$/.test(odStr) && !cObj[odStr] ? '110000' : odStr;
        dt.display.push({ text: /^\d+$/.test(nameStr) ? cObj[nameStr] : nameStr });
        dt.display.push({ text: dt.orderFlagZH });
      } else if (/^4$/.test(id)) {
        dt.display.push({ text: dt.createDate || dt.createdDate });
        dt.display.push({ text: dt.lastUpdate });
        dt.display.push({ text: dt.rebateMode });
        dt.display.push({ text: this.fmtMoney(money) });
        dt.display.push({ text: dt.flagZH });
      } else if (/^5$/.test(id)) {
        dt.display.push({ text: dt.createDate || dt.createdDate });
        dt.display.push({ text: dt.lastUpdate });
        dt.display.push({ text: this.fmtMoney(money) });
        // dt.display.push({ text: dt.promotionType });
        dt.display.push({ text: dt.promotionName });
        dt.display.push({ text: dt.flagZH });
      } else if (/^9$/.test(id)) {
        dt.display.push({ text: this.getDate(+dt.tp).replace(/\//g, '-') });
        const arr = [];
        for (let i = 0; i < dt.opts.length; i += 1) {
          if (arr.indexOf(dt.opts[i].sno) < 0) arr.push(dt.opts[i].sno);
        }
        dt.display.push({ text: arr.length > 1 ? lan.together : lan[arr[0]] || '' });
        dt.display.push({ text: dt.mstid, copy: true });
        dt.display.push({ text: this.fmtMoney(dt.tamt || dt.amt) });
        const sts = /^[12]$/.test(dt.wst) ? lan.setNo : lan.cancel;
        dt.display.push({ text: /^[389]$/.test(dt.wst) ? this.fmtMoney(dt.win) : sts });
      }
      for (let i = 0; i < dt.display.length; i += 1) {
        if (this.titleArr[i]) {
          dt.display[i].width = this.titleArr[i].width || '100%';
        }
      }
      return dt;
    },
  },
  mounted() {
    const dtStr = this.getDate(null, true);
    [this.selDate.from, this.selDate.to] = [`${dtStr} 00:00:00`, `${dtStr} 23:59:59`];
    [this.dateMinFrom, this.dateMaxTo] = ['2019-01-01 00:00:00', `${dtStr} 23:59:59`];
    [this.dateMaxFrom, this.dateMinTo] = [this.selDate.to, this.selDate.from];
    this.typeArr = this.$t('agPage.report.select');
    this.depArr = this.$t('agPage.report.payment');
    this.titleObj = this.$t('agPage.report.titleObj');
    this.setSelect();
    this.changeParas();
  },
};
</script>
<style lang="less">
.agyy-report-page {
  .agyy-report-page-box { width: 100%; padding: 40px 46px; }
  .report-page-title { width: 100%; height: 28px; font-size: 20px; font-weight: 500; color: #dddddd; }
  .report-page-select { width: 100%; height: 40px; margin: 20px auto; border-bottom: 1px solid #3c3d44; }
  .page-select-item-normal, .page-select-item-active { height: 38px; cursor: pointer; }
  .select-item-text { height: 25px; font-size: 18px; font-weight: 500; padding: 0 2px; }
  .select-item-line { width: 100%; height: 3px; }
  .page-select-item-normal { .select-item-text { color: #716d6d; } .select-item-line { background: transparent; } }
  .page-select-item-active { .select-item-text { color: #ff5353; } .select-item-line { background: #ff5353; } }
  .report-page-date { width: 100%; height: 30px; margin-bottom: 12px; }
  .select-date-text { font-size: 14px; color: #bababa; }
  .select-date-text.range { margin-right: 5px; }
  .select-date-text.date-to { margin: 0 5px; }
  .select-date-text.type { margin: 0 5px 0 13px; }
  .select-date-calendar { width: 180px; height: 30px; }
  .select-date-change { height: 30px; padding: 0 4px; background-image: linear-gradient(to bottom, #2a292f, #29292e); }
  .date-change-text { min-width: 65px; height: 100%; padding: 0 5px 0 2px; font-size: 12px; color: #ecebeb; }
  .date-change-btn-box { width: 11px; height: 100%; }
  .date-change-btn { width: 100%; height: 35%; cursor: pointer; }
  .report-result-head { width: 100%; height: 36px; background-image: linear-gradient(to bottom, #3a393f, #2b2a2f); font-size: 14px; color: #ecebeb; }
  .result-head-text { width: 100%; height: 100%; }
  .report-result-content { width: 100%; height: 451px; font-size: 12px; color: #ecebeb; }
  .content-no-record { width: 100%; height: 100%; }
  .content-record-row { width: 100%; height: 29px; margin-top: 1px; background-image: linear-gradient(to bottom, #2a292f, #29292e); }
  .content-record-item { width: 100%; height: 100%; border-left: 1px solid #2e2f34; font-size: 12px; color: #ecebeb; }
  .content-record-item:first-child { border: none; }
  .report-result-foot { width: 100%; height: 36px; background-image: linear-gradient(to bottom, #3a393f, #2b2a2f); }
  .foot-page-box { width: 221px; height: 100%; margin: 0 18px; }
  .foot-page-first, .foot-page-prev, .foot-page-next, .foot-page-last { width: 23px; height: 100%; cursor: pointer; }
  .foot-page-next, .foot-page-last { transform: rotate(180deg); }
  .foot-page-content { width: 129px; height: 100%; }
  .foot-content-text { height: 100%; margin-bottom: 2px; font-size: 14px; color: #d3d3d3; }
  .foot-content-input, .foot-content-input-disable { width: 28px; height: 20px; margin: 0 4px; text-align: center; line-height: 20px; background: transparent; border-radius: 2px; border: 1px solid #716d6d; font-size: 14px; color: #d3d3d3; }
  .foot-content-num { height: 100%; font-size: 14px; color: #d3d3d3; margin: 0 4px; }
  .foot-calc-box { min-width: 100px; height: 100%; font-size: 12px; color: #d3d3d3; span { width: 100%; height: 40%; } }
  .foot-display-box { min-width: 180px; height: 100%; padding-right: 24px; font-size: 12px; color: #d3d3d3; }
  .report-service { margin-top: 10px; }
}
</style>
