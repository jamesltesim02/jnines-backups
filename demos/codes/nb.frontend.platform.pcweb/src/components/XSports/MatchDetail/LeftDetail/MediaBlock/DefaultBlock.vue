<template>
  <div :class="{
    'x-default-block': true,
    finished: finished,
  }">
    <cimg
      class="detail-video-image"
      :src="bgSrc"
    />
    <div class="infos">
      <div class="title">
        <div class="tname">{{match.tournamentName}}</div>
        <div
          v-if="match.matchState === 0"
          class="tdate"
        >{{match.matchDate | dateFormat('MM/dd HH:mm')}}</div>
        <div
          v-else-if="finished"
          class="tdate"
        >已结束</div>
        <div
          v-else
          class="tdate"
        >{{matchTime}}</div>
      </div>
      <ul class="teams">
        <li class="team">
          <div>
            <cimg remote :src="tlogo1" />
          </div>
          <p class="cname">{{match.competitor1Name}}</p>
        </li>
        <li class="score">
          <span>{{matchScore.score1}}</span>
          <span class="svs">vs</span>
          <span>{{matchScore.score2}}</span>
        </li>
        <li class="team">
          <div>
            <cimg remote :src="tlogo2" />
          </div>
          <p class="cname">{{match.competitor2Name}}</p>
        </li>
      </ul>
    </div>
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
  require('@/components/XSports/images/match/tlogo-1.png'),
  require('@/components/XSports/images/match/tlogo-2.png'),
];

export default {
  props: {
    match: {},
  },
  data() {
    return {
      pushMatchTime: null,
      timer: null,
    };
  },
  computed: {
    finished() {
      return this.match.matchState === 3;
    },
    bgSrc() {
      return BACKGROUNDS[this.match.sportID];
    },
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
<style lang="less">
.x-default-block {
  position: relative;
  height: 100%;
  width: 100%;
  .detail-video-image {
    width: 100%;
    height: 100%;
  }
  .infos {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: 6.5%;
  }
  .title {
    width: 100%;
    text-align: center;
    color: #f9f9f9;
    .tname {
      font-size: 24px;
      line-height: 33px;
      letter-spacing: -0.7px;
    }
    .tdate {
      font-size: 16px;
      line-height: 22px;
      margin-top: 8px;
    }
  }
  .teams {
    margin-top: 6%;
    display: flex;
    justify-content: center;
    color: #fff;
    letter-spacing: -0.9px;
    text-shadow: 0 2px 4px rgba(37, 37, 37, 0.5);
    .team {
      width: 180px;
      text-align: center;
      & > div {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        background: #fff;
        border-radius: 50%;
        overflow: hidden;
        img {
          max-width: 40px;
          max-height: 40px;
        }
      }
      .cname {
        margin-top: 8px;
        font-size: 24px;
        line-height: 33px;
      }
    }
    .score {
      display: flex;
      align-items: flex-end;
      font-size: 40px;
      text-align: center;
      span {
        display: inline-block;
        width: 65px;
      }
      .svs {
        font-size: 34px;
        width: 30px;
      }
    }
  }
}
.x-default-block.finished {
  .detail-video-image {
    filter: grayscale(100%);
  }
}
</style>
