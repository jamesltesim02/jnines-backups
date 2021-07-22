<template>
  <div class="result-page">
    <h3>{{$t('page.result.title')}}</h3>
    <div class="result-select flex-between">
      <div class="select-before flex-center" @click="toBeforeFun"><icon-select v-if="dateRight < datePage - 1" /></div>
      <div class="select-content">
        <div class="select-box flex-between" :style="cStyle" >
          <div :class="`select-item-${v.active ? 'active' : 'normal'} flex-center-col`" v-for="(v, k) in dateArr" :key="k" @click="selectFun(v)" >
            <span class="select-date">{{v.dDate}}</span>
            <span class="select-day">{{v.wDate}}</span>
          </div>
        </div>
      </div>
      <div class="select-after flex-center" @click="toAfterFun"><icon-select v-if="dateRight > 0" /></div>
    </div>
    <div class="result-total flex-between">
      <span><i></i>{{matchStr}}</span>
      <span>{{$t('page.result.explan')}}</span>
    </div>
    <perfect-scrollbar class="result-page-content" :style="{ height: hmHeight }">
      <loading-bar full v-if="loading && (!data || !data.length)" />
      <no-more-bar full v-if="!loading && (!data || !data.length)" />
      <div class="result-list-item flex-between" v-for="(rw, i) in rowData" :key="i">
        <div class="result-page-item-box" v-for="(v, k) in rw" :key="k" @click="toMatch(v)">
          <div class="result-page-body-box flex-center-col" v-if="v && v.sportID && v.matchID">
            <div class="result-body-icon">
              <icon-football v-if="/^10$/.test(v.sportID)" />
              <icon-basketball v-else-if="/^11$/.test(v.sportID)" />
              <icon-tennis v-else-if="/^12$/.test(v.sportID)" />
              <icon-games v-else />
            </div>
            <ul class="result-body-half flex-none">
              <li class="team flex-center">
                <rolling-text class="result-group" :text="v.tournamentName" :max-length="21" scrollamount="2" />
              </li>
              <li class="score flex-center">{{getHalf(v.periodScore)}}</li>
              <li class="team flex-end">
                <div class="team-end flex-between">
                  <span class="result-time flex-start">{{getMathTime(v.matchDate)}}</span>
                  <live-flag class="result-flag" :active="/^[12]$/.test(v.matchState)" v-if="/^[012]$/.test(v.matchState)" />
                </div>
              </li>
            </ul>
            <ul class="result-body-teams flex-none">
              <li class="team flex-center">
                <rolling-text :text="v.competitor1Name" :max-length="17" scrollamount="3" />
              </li>
              <li class="score flex-center">
                <span class="score-span flex-end" :style="{ color: oddsColor }" >{{getScore(v, 0)}}</span>
                <span class="spliter flex-center"></span>
                <span class="score-span flex-start" :style="{ color: oddsColor }" >{{getScore(v, 1)}}</span>
              </li>
              <li class="team flex-center">
                <rolling-text :text="v.competitor2Name" :max-length="17" scrollamount="3" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { findMatchResult } from '@/api/pull';
import IconSelect from '@/components/Result/IconSelect';
import IconGames from '@/components/Result/IconGames';
import IconTennis from '@/components/Result/IconTennis';
import IconFootball from '@/components/Result/IconFootball';
import IconBasketball from '@/components/Result/IconBasketball';
import RollingText from '@/components/common/RollingText';
import LiveFlag from '@/components/Matchs/MatchItem/icons/LiveFlag';

export default {
  data() {
    return {
      datePage: 6,
      data: [],
      dateArr: [],
      dateRight: 0,
      loading: false,
      finish: false,
      displayDays: 30,
      reqTimer: null,
      selectObj: null,
      reqWaitTime: 120000,
    };
  },
  computed: {
    ...mapState('app', ['contentHeight']),
    hmHeight() {
      if (!this.contentHeight) {
        return 'auto';
      }

      return `${this.contentHeight - 187}px`;
    },
    rowData() {
      const [dtArr, rowNum] = [[], 3];
      for (let i = 0; i < this.data.length; i += 1) {
        if (!(i % rowNum)) {
          dtArr.push([]);
        }
        dtArr[dtArr.length - 1].push(this.data[i]);
      }
      if (dtArr.length && dtArr[dtArr.length - 1].length < rowNum) {
        for (let j = dtArr[dtArr.length - 1].length; j < rowNum; j += 1) {
          dtArr[dtArr.length - 1].push({ });
        }
      }
      return dtArr;
    },
    cStyle() {
      return { width: `${100 * this.datePage}%`, right: `-${100 * this.dateRight}%` };
    },
    matchStr() {
      const dStr = this.selectObj && this.selectObj.qDate ? this.selectObj.qDate : '';
      const wStr = this.selectObj && this.selectObj.whDate ? this.selectObj.whDate : '';
      return `${dStr} ${wStr} ${this.$t('page.result.total')} ${this.data.length || 0} ${this.$t('page.result.games')}`;
    },
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
  },
  components: {
    LiveFlag,
    IconSelect,
    RollingText,
    IconGames,
    IconTennis,
    IconFootball,
    IconBasketball,
  },
  methods: {
    getHalf(score) {
      return /\d/.test(score) ? `${this.$t('pageResult.halfMatch')} ${score.replace(':', '-').trim()}` : '';
    },
    getScore(v, num) {
      const score = /^[12]$/.test(v.matchState) ? v.matchScore : v.resultNB;
      const sArr = `${`${score || ''}`.trim() || '0'}:0`.split(':');
      return /^0$/.test(v.matchState) ? '' : sArr[num || 0];
    },
    getMathTime(time) {
      const dt = time ? new Date(+time) : new Date();
      return `${`0${dt.getHours()}`.slice(-2)}:${`0${dt.getMinutes()}`.slice(-2)}`;
    },
    async loadData(date) {
      clearTimeout(this.reqTimer);
      [this.data, this.loading, this.finish] = [[], true, false];
      try {
        const rtn = await findMatchResult(date);
        this.loading = false;
        if (rtn && rtn.length) {
          this.data = rtn;
        }
      } catch (e) {
        console.log(e);
      } finally {
        [this.loading, this.finish] = [false, true];
        this.reqTimer = setTimeout(() => { this.loadData(date); }, this.reqWaitTime);
      }
    },
    toBeforeFun() {
      this.dateRight += this.dateRight > this.datePage - 2 ? 0 : 1;
    },
    toAfterFun() {
      this.dateRight -= this.dateRight < 1 ? 0 : 1;
    },
    selectFun(v) {
      if (v && v.qDate) {
        this.selectObj = v;
        for (let i = 0; i < this.dateArr.length; i += 1) {
          const dt = this.dateArr[i];
          dt.active = `${dt.qDate}` === `${v.qDate}`;
          this.$set(this.dateArr, i, dt);
        }
        this.loadData(v.qDate.replace(/-/g, ''));
      }
    },
    toMatch(v) {
      if (v && v.sportID && v.matchID && /^[012]$/.test(v.matchState)) {
        const isLive = /^[12]$/.test(v.matchState);
        const sports = window.NBConfig.AVAILABLE_SPORTS;
        let showLive = window.NBConfig.SHOW_LIVE;
        for (let i = 0; i < sports.length; i += 1) {
          const sno = typeof sports[i] === 'object' ? sports[i].SNO || sports[i].SPORT_ID : sports[i];
          if (`${v.sportID}` === `${sno}` && typeof sports[i] === 'object') {
            showLive = typeof sports[i].SHOW_LIVE === 'undefined' ? showLive : sports[i].SHOW_LIVE;
            break;
          }
        }
        if (!isLive || showLive) {
          this.$router.push(`/detail/${v.sportID}/${v.matchID}`);
        }
      }
    },
  },
  mounted() {
    const [nowDate, minDate] = [Date.now(), 4 - this.datePage * 9];
    [this.dateArr, this.dateRight] = [[], 0];
    let sObj = null;
    for (let i = minDate; i < 4; i += 1) {
      const [obj, dt] = [{ }, new Date(nowDate + i * 86400000)];
      obj.qDate = `${dt.getFullYear()}-${`0${dt.getMonth() + 1}`.slice(-2)}-${`0${dt.getDate()}`.slice(-2)}`;
      obj.dDate = `${`0${dt.getMonth() + 1}`.slice(-2)}-${`0${dt.getDate()}`.slice(-2)}`;
      obj.wDate = `${this.$t('page.result.week')}${this.$t('page.result.days')[dt.getDay()]}`;
      obj.whDate = `${this.$t('page.result.hWeek')}${this.$t('page.result.days')[dt.getDay()]}`;
      obj.active = !i;
      sObj = obj.active ? obj : sObj;
      this.dateArr.push(obj);
    }
    this.selectObj = sObj || { };
    if (sObj && sObj.qDate) {
      this.loadData(sObj.qDate.replace(/-/g, ''));
    }
  },
  beforeDestroy() {
    clearTimeout(this.reqTimer);
  },
};
</script>
<style lang="less">
.result-page {
  padding-top: 27px;
  h3 { width: 99%; height: 45px; line-height: 35px; border-left: 7px solid #ff5353; border-bottom: 1px solid #ff5353; padding-left: 17px; font-size: 20px; font-weight: 600; color: #ecebeb; }
  .result-select { width: 99%; height: 80px; }
  .select-before, .select-after { width: 7%; height: 100%; cursor: pointer; svg g { fill: #909090; } }
  .select-before:hover, .select-after:hover { svg g { fill: #ff5353; } }
  .select-before { transform: rotate(180deg); }
  .select-content { position: relative; width: 86%; height: 100%; overflow: hidden; }
  .select-box { position: absolute; width: 400%; height: 100%; top: 0; transition: all 0.15s linear; }
  .select-item-normal { color: #716d6d; }
  .select-item-normal:hover { color: #dddddd; background: #25242b; }
  .select-item-active { color: #f5f5f5; background: #ff5353; }
  .select-item-normal, .select-item-active { width: 100%; height: 60px; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; font-weight: 500; cursor: pointer; }
  .select-date { font-size: 16px; }
  .select-day { font-size: 14px; }
  .result-total { width: 100%; height: 31px; font-size: 14px; font-weight: 500; color: #909090; padding-right: 20px; }
  .result-total>i, .result-total span>i { display: inline-block; width: 6px; height: 6px; background: #ff5353; border-radius: 100%; margin-right: 8px; }
  .result-page-content { width: 100%; padding: 0 18px 50px 0; .result-list-item { width: 100%; } }
  .result-page-item-box { width: 32.5%; height: 110px; margin-top: 10px; border-radius: 6px; overflow: hidden; }
  .result-page-body-box {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 10;
    box-shadow: 0 2px 4px 0 var(--black-50);
    background: linear-gradient(to bottom, #29282e, #2b2a31);
    .result-body-icon { position: absolute; width: 25%; height: 65px; bottom: 0; right: 0; z-index: 20; overflow: hidden; }
    .result-body-half {
      position: absolute;
      width: 100%;
      height: 42px;
      top: 0;
      left: 0;
      z-index: 50;
      padding: 0 11px;
      font-size: 14px;
      color: #909090;
      li.team {
        width: 45%;
        padding: 0 5px;
        .team-end { width: 60%; height: 100%; }
        .result-time { width: 45px; height: 100%; }
        .result-group { width: 100%; }
        .result-flag { margin: 0; }
      }
      .score { width: 100px; }
    }
    .result-body-teams {
      position: absolute;
      width: 100%;
      height: 80px;
      left: 0;
      bottom: 0;
      z-index: 50;
      padding: 0 11px;
      font-size: 16px;
      font-weight: 500;
      color: #ecebeb;
      li.team { width: 45%; padding: 0 5px; }
      .score {
        display: flex;
        font-size: 24px;
        width: 100px;
        span { width: 100%; }
        .score-span { margin: 0 5px; }
        .spliter {
          width: 20px;
          margin-top: 4px;
          &::before {
            content: "";
            width: 12px;
            height: 3px;
            border-radius: 1.5px;
            background: #d8d8d8;
          }
        }
      }
    }
  }
}
</style>
