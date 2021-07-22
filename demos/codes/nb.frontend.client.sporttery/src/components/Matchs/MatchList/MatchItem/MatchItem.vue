<template>
  <component
    :is="comp"
    :match="matchinfo"
    :games="matchinfo.games"
    :flag-color="flagColor"
    :match-time="matchTime"
    :match-score="matchScore"
    :period="period"
  />
</template>
<script>
// import { SportsColors } from '@/config/constants';
import { mapState } from 'vuex';
import ItemStyle1 from './item-styles/ItemStyle1';
import ItemStyle2 from './item-styles/ItemStyle2';
import ItemStyle3 from './item-styles/ItemStyle3';

/**
 * 各体育联赛标志颜色
 */
const SportsColors = {
  // 足球
  10: {
    // 英格兰超级联赛 4467826303959040 #5fd78d
    4467826303959040: '#5fd78d',
    // 英格兰冠军联赛 4467861251948545 #4fbe7a
    4467861251948545: '#4fbe7a',
    // 德国甲级联赛 4467872553238528 #e35c5c
    4467872553238528: '#e35c5c',
    // 德国乙级联赛 4585083807727616 #d6798b
    4585083807727616: '#d6798b',
    // 意大利甲级 4467869017178112   #d7ca5f
    4467869017178112: '#d7ca5f',
    // 意大利乙级 5079357034594304   #c2b54c
    5079357034594304: '#c2b54c',
    // 法国甲级 4467866428768256    #bfd2e2
    4467866428768256: '#bfd2e2',
    // 法国乙级 4467824537370624    #a7baca
    4467824537370624: '#a7baca',
    // * 西班牙甲级 4467863181066241    #e49769
    4467863181066241: '#e49769',
    // * 西班牙乙级 5079530553737216    #c47f56
    5079530553737216: '#c47f56',
    // * 巴西甲级 4467863181066242334    #6fa6c6
    4467863181066242334: '#6fa6c6',
    // * 挪威甲级 6621201762615296    #e14b5f
    6621201762615296: '#e14b5f',
    // 中超(中国足协杯) 4663711520522240        #e4cb69
    4663711520522240: '#e4cb69',
    // 日J1 4671820866781186        #c9c9c9
    4671820866781186: '#c9c9c9',
    // 日乙 4671821327368192        #c9c9c9
    4671821327368192: '#c9c9c9',
    // 韩国职业(韩国K1联赛) 4671824945741824    #6f8ac6
    4671824945741824: '#6f8ac6',
    // 欧足联(欧足联国家联赛) 4494571063214080       #e9b83e
    4494571063214080: '#e9b83e',
    // - 欧冠  5079642820837378        #c8cdd8
    5079642820837378: '#c8cdd8',
    // - 亚冠  6458191986032640        #5fc1d7
    6458191986032640: '#5fc1d7',
    // 其他         #e6cbdc
    others: '#e6cbdc',
  },
  // 篮球
  11: {
    // NBA 4470496797130752         #e35c5c
    4470496797130752: '#e35c5c',
    // 欧洲篮球联赛 4555640951537664  #e4cb69
    4555640951537664: '#e4cb69',
    // - 其他          #bfd2e2
    others: '#bfd2e2',
    // - CBA          #e9b83e
    // - 德国甲级联赛  #6f8ac6
    // - 义大利蓝甲    #d7ca5f
    // - 东南亚篮球联赛 #ffe373
    // - 法蓝甲级      #5fc1d7
    // - 西蓝甲        #6fa6c6
    // - 其他          #bfd2e2
  },
  // 其他
  others: {
    // 其他         #e6cbdc
    others: '#e6cbdc',
  },
};


const itemStyles = [
  null,
  ItemStyle1,
  ItemStyle2,
  ItemStyle3,
  ItemStyle1,
];

export default {
  props: {
    match: { default: { matchTime: '{}' } },
  },
  data() {
    return { pushMatchTime: null };
  },
  computed: {
    ...mapState({
      betList: state => state.bet.betList,
      matchListStyle: state => state.app.matchListStyle,
    }),
    comp() {
      return itemStyles[this.matchListStyle || 1];
    },
    matchinfo() {
      const betedMatch = this.betList.find(m => m.matchID === this.match.matchID);
      if (betedMatch) {
        return { ...this.match, fromList: betedMatch.fromList };
      }
      return this.match;
    },
    matchScore() {
      const score = `${/^[12]$/.test(this.match.matchState) ? `${this.match.matchScore || '0'}:0` : ':'}`.split(':');
      return { score1: score[0], score2: score[1] };
    },
    flagColor() {
      const sportColor = SportsColors[this.match.sportID] || SportsColors.others;
      return sportColor[this.match.tournamentID] || sportColor.others;
    },
    matchTime() {
      const m = `0${parseInt(this.pushMatchTime / 60, 10)}`.substr(-2);
      const s = `0${parseInt(this.pushMatchTime % 60, 10)}`.substr(-2);
      return `${m}′${s}″`;
    },
    matchMatchTime() {
      return this.match.matchTime;
    },
    matchTimeObject() {
      try {
        return JSON.parse(this.match.matchTime);
      } catch (e) {
        return {};
      }
    },
    period() {
      if (this.match.sportID === 11) {
        return this.matchTimeObject.period;
      }

      return null;
    },
  },
  watch: {
    matchMatchTime() {
      this.updateTime2Local();
    },
  },
  created() {
    if (this.match.matchState === 1) {
      this.intervalTimeStart();
      this.updateTime2Local();
    }
  },
  methods: {
    updateTime2Local() {
      let [m, s] = [0, 0];
      try {
        if (this.match.sportID === 11) {
          [m, s] = this.matchTimeObject.remaindTimeInPeriod.split(':');
        } else {
          [m, s] = this.matchTimeObject.matchtime.split(':');
        }
      } catch (e) {
        [m, s] = [0, 0];
      }
      this.pushMatchTime = (60 * m) + (+s);
      if (!this.timer && this.matchTimeObject.stime) {
        this.intervalTimeStart();
      }
      if (!this.matchTimeObject.stime) {
        this.intervalTimeStop();
      }
      if ([321, 33, 30, 31, 80, 81].includes(this.matchTimeObject.period)) {
        this.intervalTimeStop();
      }
    },
    intervalTimeStart() {
      this.timer = setInterval(() => {
        this.pushMatchTime += this.match.sportID === 11 ? -1 : 1;
      }, 1000);
    },
    intervalTimeStop() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
