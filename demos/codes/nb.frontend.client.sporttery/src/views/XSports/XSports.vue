<template>
  <list-page
    class="xsports"
    v-if="!horizScreen"
    @scrollBottom="scrollToNextPage"
  >
    <div slot="header">
      <nav-tabbar />
      <filter-bar
        :value="state"
        @change="changeState"
      />
      <announcement v-if="[1, 2].includes(state)" />
      <date-picker
        v-if="[0, 3].includes(state)"
        v-model="queryDate"
        :expand="dayCountText"
        :rangeTo="state === 0 ? daysCount : -30"
      />
    </div>
    <match-list
      v-if="state !== 3"
      ref="listComp"
      :state="state"
      :query-date="state === 0 ? queryDate : ''"
    />
    <finished-list
      v-else
      :query-date="queryDate"
    />
  </list-page>
  <div class="xsports-horiz" v-else >
    <list-page class="xsports-horiz-left" >
      <div slot="header">
        <nav-tabbar />
        <filter-bar
          :value="state"
          @change="changeState"
        />
        <announcement v-if="[1, 2].includes(state)" />
        <date-picker
          v-if="[0, 3].includes(state)"
          v-model="queryDate"
          :expand="dayCountText"
          :rangeTo="state === 0 ? daysCount : -30"
        />
        <div class="xsports-horiz-list flex-start" >
          赛事种类
        </div>
      </div>
      <sports-filter-list />
    </list-page>
    <list-page class="xsports-horiz-right" @scrollBottom="scrollToNextPage" >
      <match-list
        v-if="state !== 3"
        ref="listComp"
        :state="state"
        :query-date="state === 0 ? queryDate : ''"
      />
      <finished-list
        v-else
        :query-date="queryDate"
      />
    </list-page>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { findmatchscount } from '@/api/pull';
import NavTabbar from '@/components/XSports/NavTabbar';
import FilterBar from '@/components/XSports/FilterBar';
import MatchList from '@/components/XSports/MatchList';
import FinishedList from '@/components/XSports/FinishedList';
import DatePicker from '@/components/XSports/FinishedList/DatePicker';
import SportsFilterList from '@/components/XSports/SportsFilterList';
import Announcement from '../../components/XSports/Announcement/Announcement';

export default {
  props: { state: { type: Number, default: 1 } },
  data() {
    return {
      queryDate: new Date(),
      countObj: null,
      countByDay: null,
    };
  },
  computed: {
    ...mapState('app', ['horizScreen', 'teachSets', 'userinfo']),
    ...mapState('xsports', ['activeSports']),
    daysCount() {
      if (this.countObj && this.countObj.lastMatchDay) {
        let str = `${this.countObj.lastMatchDay}`;
        str = `${str.slice(0, 4)}/${str.slice(4, 6)}/${str.slice(-2)} 23:59:59`;
        const deltaMiniSec = new Date(str).getTime() - new Date().getTime();
        return parseInt(Math.abs(deltaMiniSec) / 86400000, 10);
      }
      return 30;
    },
    dayCountText() {
      if (this.state !== 0 || !this.queryDate || !this.countByDay) {
        return '';
      }
      const dayKey = this.$options.filters.dateFormat(this.queryDate, 'yyyyMMdd');
      if (!this.countByDay[dayKey]) {
        return '';
      }
      return `&nbsp; 共${this.countByDay[dayKey]}场`;
    },
  },
  watch: {
    state() {
      this.queryDate = new Date();
    },
  },
  components: {
    Announcement,
    NavTabbar,
    FilterBar,
    MatchList,
    FinishedList,
    DatePicker,
    SportsFilterList,
  },
  methods: {
    ...mapMutations('app', ['setTeachList']),
    scrollToNextPage() {
      if (this.state !== 3 && this.$refs.listComp) {
        this.$refs.listComp.nextPage();
      }
    },
    changeState(v) {
      if (typeof v === 'number') {
        this.$router.replace(`/xsports/${v}`);
        return;
      }
      if (typeof v === 'object') {
        this.countObj = v.counts || null;
        this.$router.replace(`/xsports/${v.state || 0}`);
      }
    },
    /**
     * 查询每天的比赛场数
     */
    async queryCountByDate() {
      const countByDay = {};
      const countResult = await findmatchscount({
        sportIds: this.activeSports,
      });
      countResult.forEach((c) => { countByDay[+c.matchDay] = c.num; });
      this.countByDay = countByDay;
    },
    showTeachNew() {
      if (this.userinfo && this.userinfo.token && this.teachSets && !this.teachSets[0]) {
        this.setTeachList({
          id: 0,
          data: [
            { bottom: 'bt_11.jpg', cover: 'cv_11.png', height: '' },
            { bottom: 'bt_12.jpg', cover: 'cv_12.png', height: '2.13rem' },
            { bottom: 'bt_13.jpg', cover: 'cv_13.png', height: '' },
            { bottom: 'bt_14.jpg', cover: 'cv_14.png', height: '' },
            { bottom: 'bt_15.jpg', cover: 'cv_15.png', height: '' },
            { bottom: 'bt_16.jpg', cover: 'cv_16.png', height: '' },
          ],
        });
      }
    },
  },
  created() {
    this.queryCountByDate();
    this.showTeachNew();
  },
};
</script>
<style lang="less">
.horizontal .xsports-horiz { width: 100%; height: 100%; }
.xsports-horiz-left { width: 3.75rem; float: left; }
.xsports-horiz-right { padding-top: .05rem; float: right; }
.xsports, .xsports-horiz-left {
  .nav-bar {
    border-bottom: solid 1px #ecebeb;
    z-index: 2;
    .nav-content { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
  }
  .xsports-horiz-list { width: 100%; height: .4rem; padding: 0 .1rem; font-size: .12rem; color: #2e2f34; }
  .x-sports { margin-top: 0; }
}
.blue .xsports, .blue .xsports-horiz-left {
  .nav-bar { border-bottom: solid 1px #2e2f34; }
  .xsports-horiz-list { color: #bababa; }
}
</style>
