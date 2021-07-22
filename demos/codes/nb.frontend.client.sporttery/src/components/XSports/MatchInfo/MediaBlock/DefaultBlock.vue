<template>
<div class="x-mediablock-defaul">
  <cimg
    class="detail-video-image"
    :src="bgSrc"
  />
  <div class="title">
    <div
      v-if="matchInfo.matchState === 0"
    >
      <div class="tname">{{matchInfo.tournamentName}}</div>
      <div class="tdate">{{matchInfo.matchDate | dateFormat('MM/dd HH:mm')}}</div>
    </div>
    <div
      v-else
    >{{matchInfo.tournamentName}}</div>
  </div>
  <ul class="teams">
    <li class="team">
      <div>
        <cimg remote :src="tlogo1" />
      </div>
      <p>{{matchInfo.competitor1Name}}</p>
    </li>
    <li class="detail">
      <template v-if="matchInfo.matchState === 0">
        <div class="state">未开赛</div>
        <div class="vs">vs</div>
      </template>
      <template v-else>
        <div class="state">
          <!-- 阶段 -->
          {{period ? $t(`common.periods.${period}`) : ''}}
          <!-- 时间 -->
          {{matchTime}}
        </div>
        <div class="score">
          <span class="score">{{matchScore.score1}}</span>
          <span class="svs">vs</span>
          <span class="score">{{matchScore.score2}}</span>
        </div>
      </template>
    </li>
    <li class="team">
      <div>
        <cimg remote :src="tlogo2" />
      </div>
      <p>{{matchInfo.competitor2Name}}</p>
    </li>
  </ul>
</div>
</template>
<script>
// 电竞背景
const GAME_BACKGROUND = require('./images/detail-bg-game.jpg');

const BACKGROUNDS = {
  10: require('./images/detail-bg-10.jpg'),
  11: require('./images/detail-bg-11.jpg'),
  14: GAME_BACKGROUND,
  15: GAME_BACKGROUND,
  16: GAME_BACKGROUND,
  17: GAME_BACKGROUND,
  18: GAME_BACKGROUND,
  19: GAME_BACKGROUND,
};

// 默认球队logo
const TLOGOS = [
  require('./images/detail-tlogo-1.png'),
  require('./images/detail-tlogo-2.png'),
];

export default {
  props: {
    matchInfo: {},
  },
  data() {
    return {
      pushMatchTime: null,
    };
  },
  computed: {
    bgSrc() {
      return BACKGROUNDS[this.matchInfo.sportID];
    },
    tlogo1() {
      if (this.matchInfo.logo1) {
        return `logo/${this.matchInfo.logo1}`;
      }
      return TLOGOS[0];
    },
    tlogo2() {
      if (this.matchInfo.logo2) {
        return `logo/${this.matchInfo.logo2}`;
      }
      return TLOGOS[1];
    },
    matchScore() {
      const score = `${[1, 2, 3].includes(+this.matchInfo.matchState) ? `${this.matchInfo.matchScore || '0'}:0` : ':'}`.split(':');
      return { score1: score[0], score2: score[1] };
    },
    matchTime() {
      const m = `0${parseInt(this.pushMatchTime / 60, 10)}`.substr(-2);
      const s = `0${parseInt(this.pushMatchTime % 60, 10)}`.substr(-2);
      return `${m}′${s}″`;
    },
    matchMatchTime() {
      return this.matchInfo.matchTime;
    },
    matchTimeObject() {
      try {
        return JSON.parse(this.matchInfo.matchTime);
      } catch (e) {
        return {};
      }
    },
    period() {
      if (this.matchInfo.sportID === 11) {
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
    if (this.matchInfo.matchState === 1) {
      // this.intervalTimeStart();
      this.updateTime2Local();
    }
  },
  methods: {
    updateTime2Local() {
      let [m, s] = [0, 0];
      try {
        if (this.matchInfo.sportID === 11) {
          [m, s] = this.matchTimeObject.remaindTimeInPeriod.split(':');
        } else {
          [m, s] = this.matchTimeObject.matchtime.split(':');
        }
      } catch (e) {
        [m, s] = [0, 0];
      }
      this.pushMatchTime = (60 * m) + (+s);
      if (!this.timer && this.matchTimeObject.stime) {
        // this.intervalTimeStart();
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
        this.pushMatchTime += this.matchInfo.sportID === 11 ? -1 : 1;
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
.x-mediablock-defaul {
  position: relative;
  width: 100%;
  height: 100%;
  .detail-video-image {
    width: 100%;
    height: 100%;
  }
  .title {
    position: absolute;
    top: 0;
    width: 100%;
    height: .44rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #f9f9f9;
    letter-spacing: -0.35px;
    opacity: .9;
    .tname, .tdate {
      font-size: .12rem;
    }
    .tname {
      line-height: .17rem;
    }
    .tdate {
      line-height: .15rem;
    }
  }
  .teams {
    position: absolute;
    display: flex;
    justify-content: center;
    top: .7rem;
    width: 100%;
    color: #fff;
  }
  .team {
    width: .8rem;
    text-align: center;
    div {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: .5rem;
      height: .5rem;
      background: #fff;
      border-radius: 50%;
      overflow: hidden;
      img {
        max-width: .4rem;
        max-height: .4rem;
      }
    }
    p {
      margin: .03rem -.25rem 0;
    }
  }
  .detail {
    width: 1.17rem;
    text-align: center;
    .state {
      display: inline-block;
      background: rgba(0, 0, 0, .1);
      border-radius: 10rem;
      line-height: .2rem;
      margin-top: .12rem;
      padding: 0 .07rem;
    }
    .vs {
      font-size: .24rem;
      margin-top: .05rem;
    }
    .score {
      font-size: .24rem;
      line-height: .3rem;
      margin-top: .04rem;
      letter-spacing: -0.7px;
      span {
        display: inline-block;
        margin: 0 .06rem;
      }
      .svs {
        font-size: .14rem;
        transform: translateY(-.03rem);
      }
    }
  }
}
</style>
