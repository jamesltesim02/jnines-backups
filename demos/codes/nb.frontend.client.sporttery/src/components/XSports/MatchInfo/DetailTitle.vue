<template>
  <div class="x-detail-title">
    <ul v-if="!!matchInfo">
      <li class="logo">
        <span><cimg remote :src="tlogo1" /></span>
      </li>
      <li
        v-if="matchInfo.matchState === 0"
        class="time"
      >
        <div class="tname">{{matchInfo.tournamentName}}</div>
        <div class="tdate">{{matchInfo.matchDate | dateFormat('MM/dd HH:mm')}}</div>
      </li>
      <li
        v-else
        class="state"
      >
        <span class="score">{{matchScore.score1}}</span>
        <span class="stage">{{period ? $t(`common.periods.${period}`) : 'vs'}}</span>
        <span class="score">{{matchScore.score2}}</span>
      </li>
      <li class="logo">
        <span><cimg remote :src="tlogo2" /></span>
      </li>
    </ul>
    <div v-else>比赛详情</div>
  </div>
</template>
<script>
// 默认球队logo
const TLOGOS = [
  require('./MediaBlock/images/detail-tlogo-1.png'),
  require('./MediaBlock/images/detail-tlogo-2.png'),
];

export default {
  props: {
    matchInfo: {},
  },
  computed: {
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
};
</script>
<style lang="less">
.x-detail-title {
  background: #57904F;
  color: #f9f9f9;
  ul, li {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ul {
    height: .44rem;
    line-height: .44rem;
    .logo {
      width: .9rem;
      span {
        display: flex;
        width: 0.3rem;
        height: 0.3rem;
        background: #fff;
        border-radius: 50%;
        overflow: hidden;
        justify-content: center;
        align-items: center;
      }
      img {
        max-width: .22rem;
        max-height: .22rem;
      }
    }
    .time {
      width: 1rem;
      font-size: .12rem;
      line-height: .15rem;
      flex-direction: column;
    }
    .state {
      display: flex;
      .stage {
        font-size: .12rem;
        width: 1rem;
      }
      .score {
        font-size: .18rem;
      }
    }
  }
}
</style>
