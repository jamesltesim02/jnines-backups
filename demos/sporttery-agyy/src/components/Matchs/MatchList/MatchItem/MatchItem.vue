<template>
  <transition name="match-item">
    <component
      :is="comp"
      :match="matchinfo"
      :games="matchinfo.games"
      :flag-color="flagColor"
      :match-time="matchTime"
      :match-score="matchScore"
    />
  </transition>
</template>
<script>
import { SportsColors } from '@/config/constants';
import { mapState, mapActions } from 'vuex';
import ItemStyle1 from './item-styles/ItemStyle1';
import ItemStyle2 from './item-styles/ItemStyle2';
import ItemStyle3 from './item-styles/ItemStyle3';

const itemStyles = [
  null,
  ItemStyle1,
  ItemStyle2,
  ItemStyle3,
  ItemStyle1,
];

export default {
  props: {
    match: {
      default: {
        matchTime: '{}',
      },
    },
  },
  data() {
    return {
      pushMatchTime: null,
    };
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
        return {
          ...this.match,
          fromList: betedMatch.fromList,
        };
      }

      return this.match;
    },
    matchScore() {
      let score1 = '';
      let score2 = '';
      const score = this.match.matchState === 1 ? this.match.matchScore || '0:0' : '';

      if (score) {
        [score1, score2] = score.split(':');
      }

      return {
        score1,
        score2,
      };
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
    matchTimeObject() {
      try {
        return JSON.parse(this.match.matchTime);
      } catch (e) {
        return {};
      }
    },
  },
  watch: {
    'match.matchTime': function () { // eslint-disable-line func-names
      this.updateTime2Local();
    },
  },
  created() {
    this.quoteBetCart();
    if (this.match.matchState === 1) {
      this.updateTime2Local();
      this.intervalTimeStart();
    }
  },
  methods: {
    ...mapActions(['quoteBetCart']),
    updateTime2Local() {
      if (!this.matchTimeObject.stime) {
        this.intervalTimeStop();
      }
      if ([321, 33, 30, 31, 80, 81].includes(this.matchTimeObject.period)) {
        this.intervalTimeStop();
        return;
      }

      let [m, s] = [0, 0];
      try {
        [m, s] = this.matchTimeObject.matchtime.split(':');
      } catch (e) {
        [m, s] = [0, 0];
      }

      this.pushMatchTime = (60 * m) + (+s);
      if (!this.timer && this.matchTimeObject.stime) {
        this.intervalTimeStart();
      }
    },
    intervalTimeStart() {
      this.timer = setInterval(() => {
        this.pushMatchTime = this.pushMatchTime + 1;
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
