<template>
  <v-touch
    class="x-match-header"
    @tap="$emit('tap')"
  >
    <!-- 玩法数 -->
    <span class="game-count">
      +{{match.matchGame || match.scoreGame.length || 0}}
    </span>
    <div
      :class="{
        'match-title': true,
        playing: match.matchState == 1
      }"
    >
      <!-- 体育类型图标 -->
      <div class="sport">
        <icon-sports :sno="match.sportID" />
      </div>
      <!-- 联赛名称 -->
      <div class="content">
        <!-- 已结束的比赛不显示时间 -->
        <template v-if="match.matchState !== 3">
          <rolling-text
            class="tour-name"
            :text="match.tournamentName"
            :max-length="14"
            scrollamount="3"
          />
          <!-- 比赛时间, 赛前显示时间, 滚球显示进行中的时间或倒计时 -->
          <span
            v-if="match.matchState == 1"
            class="match-live flex-center"
          ><icon-live live /></span>
          <span
            v-if="match.matchState == 1"
            class="match-time"
          >{{matchTime}}</span>
          <span
            v-else
            class="match-time"
          >{{+match.matchDate | dateFormat('HH:mm')}}</span>
          <!-- 比赛阶段 -->
          <span
            v-if="period"
            class="period"
          >{{$t(`common.periods.${period}`)}}</span>
        </template>
        <rolling-text
          v-else
          class="tour-name"
          :text="match.tournamentName"
          :max-length="38"
          scrollamount="3"
        />
      </div>
      <!-- 已结束的比赛不显示滚球和直播图标 -->
      <div
        v-if="match.matchState !== 3"
        class="flags flex-end"
      >
        <span
          v-if="match.matchState !== 1"
          class="live flex-center"
        ><icon-live /></span>
        <span
          v-if="match.matchVideo"
          class="video flex-center"
        ><icon-tv :live="match.matchState === 1" /></span>
      </div>
    </div>
    <!-- 队名和比分 -->
    <ul class="match-teams">
      <li class="team">
        <rolling-text
          :text="match.competitor1Name"
          :max-length="12"
          scrollamount="3"
        />
        <div><cimg remote :src="tlogo1" /></div>
      </li>
      <li class="score">
        <span :class="scoreClassOne">{{matchScore.score1}}</span>
        <span class="spliter flex-center"></span>
        <span :class="scoreClassTwo">{{matchScore.score2}}</span>
      </li>
      <li class="team">
        <div><cimg remote :src="tlogo2" /></div>
        <rolling-text
          :text="match.competitor2Name"
          :max-length="12"
          scrollamount="3"
        />
      </li>
    </ul>
  </v-touch>
</template>
<script>
import IconSports from '../icons/IconSports';
import IconLive from '../icons/IconLive';
import IconTv from '../icons/IconTv';

// 默认球队logo
const TLOGOS = [
  require('../MatchInfo/MediaBlock/images/detail-tlogo-1.png'),
  require('../MatchInfo/MediaBlock/images/detail-tlogo-2.png'),
];

export default {
  props: {
    match: { default: { matchTime: '{}' } },
  },
  data() {
    return { pushMatchTime: null };
  },
  computed: {
    tlogo1() {
      if (this.match.logo1) {
        return `logo/${this.match.logo1}`;
      }
      return TLOGOS[0];
    },
    tlogo2() {
      if (this.match.logo2) {
        return `logo/${this.match.logo2}`;
      }
      return TLOGOS[1];
    },
    matchScore() {
      const score = `${[1, 2, 3].includes(+this.match.matchState) ? `${this.match.matchScore || '0'}:0` : ':'}`.split(':');
      return { score1: score[0], score2: score[1] };
    },
    scoreClassOne() {
      const [s1, s2] = [+(this.matchScore.score1 || 0), +(this.matchScore.score2 || 0)];
      return s1 < s2 ? 'score-lose' : 'score-win';
    },
    scoreClassTwo() {
      const [s1, s2] = [+(this.matchScore.score1 || 0), +(this.matchScore.score2 || 0)];
      return s2 < s1 ? 'score-lose' : 'score-win';
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
  components: { IconSports, IconLive, IconTv },
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
<style lang="less">
.x-match-header {
  position: relative;
  .game-count {
    position: absolute;
    position: absolute;
    top: 0;
    right: 0;
    width: .36rem;
    height: .25rem;
    line-height: .25rem;
    text-align: center;
    border-bottom-left-radius: 6px;
    border-top-right-radius: 6px;
    background: #f7f7f7;
    border-left: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
    color: #777;
  }
  .match-title {
    display: flex;
    padding: .06rem .1rem 0;
    .sport {
      position: relative;
      width: .22rem;
      padding-right: .05rem;
      display: flex;
      align-items: center;
      &::before {
        content: "";
        display: block;
        position: absolute;
        width: .01rem;
        height: .16rem;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: #efefef;
      }
      svg {
        width: .16rem;
        height: .16rem;
      }
    }
    .content {
      flex-grow: 1;
      display: flex;
      align-items: center;
      padding-left: .05rem;
      font-size: .14rem;
      white-space: nowrap;
      .tour-name {
        display: inline-block;
        letter-spacing: -0.3px;
        color: #9b9b9b;
        max-width: 1rem;
        white-space: nowrap;
      }
      .match-live {
        height: 100%;
        margin-left: .05rem;
      }
      .match-time {
        margin-left: .05rem;
        font-weight: bold;
        color: #909090;
      }
      .period {
        margin-left: .05rem;
        color: #9b9b9b;
      }
    }
    .flags {
      width: 1rem;
      height: .18rem;
      padding-right: .35rem;
      text-align: right;
      .live {
        height: 100%;
        padding: 0 .04rem;
      }
      .video {
        width: .24rem;
        height: 100%;
      }
    }
    &.playing {
      .tour-name,
      .match-time { color: #ff5353; }
      .flags .live { display: none; }
      .main-fill { fill: #ff5353; }
    }
  }
  .match-teams {
    display: flex;
    color: #2e2f34;
    font-size: .15rem;
    line-height: .18rem;
    padding: .15rem 0;
    li { text-align: center; }
    li.team {
      width: 1.48rem;
      padding: 0 .05rem;
      color: #2e2f34;
      font-weight: bold;
      display: flex;
      span,marquee {
        flex-grow: 1;
        max-width: 1.05rem;
        line-height: .3rem;
      }
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: .3rem;
        height: .3rem;
        overflow: hidden;
        background: #fff;
        border-radius: 50%;
        border: solid 1px #ebebeb;
        img {
          max-width: .25rem;
          max-height: .25rem;
        }
      }
    }
    .score {
      display: flex;
      font-size: .18rem;
      width: .53rem;
      color: #ff5353;
      line-height: .3rem;
      span { width: 100%; }
      .spliter {
        width: .2rem;
        &::before {
          content: "";
          width: .12rem;
          height: .03rem;
          border-radius: 1.5px;
          background: #d8d8d8;
        }
      }
    }
  }
}
.blue .x-match-header {
  .game-count {
    background: #434249;
    border-left: 1px solid #434249;
    border-bottom: 1px solid #434249;
  }
  .match-title {
    .sport::before { background: #4f5155; }
    .content {
      .tour-name { color: #909090; }
      .match-time { color: #bababa; }
      .period { color: #909090; }
    }
    &.playing {
      .tour-name, .match-time { color: #32dcda; }
      .main-fill { fill: #32dcda; }
    }
  }
  .match-teams {
    color: #ecebeb;
    li.team { color: #ecebeb; font-weight: 500; div { background: transparent; border: none; } }
    .score { color: #ffb900; .spliter::before { background: #464646; } }
  }
}
</style>
