<template>
  <section
    :class="{
      'x-match-info-content': true,
      finished: match.matchState === 3
    }"
  >
    <div class="team team1">
      <div class="tlogo">
        <cimg
          remote
          :src="tlogo1"
        />
      </div>
      <rolling-text
        class="tname"
        :text="match.competitor1Name"
        :max-length="24"
        scrollamount="3"
      />
      <div class="tscore">{{matchScore.score1}}</div>
    </div>
    <div class="team team2">
      <div class="tlogo">
        <cimg
          remote
          :src="tlogo2"
        />
      </div>
      <rolling-text
        class="tname"
        :text="match.competitor2Name"
        :max-length="20"
        scrollamount="3"
      />
      <div class="tscore">{{matchScore.score2}}</div>
    </div>
  </section>
</template>
<script>
// 默认球队logo
const TLOGOS = [
  require('@/components/XSports/images/match/tlogo-1.png'),
  require('@/components/XSports/images/match/tlogo-2.png'),
];

export default {
  props: {
    match: {},
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
      let scoreStr = ':';
      if ([1, 2, 3].includes(+this.match.matchState)) {
        scoreStr = this.match.matchScore;
      }

      const [score1, score2] = scoreStr.split(':');

      return { score1, score2 };
    },
  },
};
</script>
<style lang="less">
.x-match-info-content {
  padding: 15px;
  .team {
    height: 30px;
    display: grid;
    align-items: center;
    grid-template-columns: 30px 1fr 32px;
  }
  .team2 {
    margin-top: 12px;
  }
  .tlogo {
    display: inline-flex;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    img {
      max-width: 26px;
      max-height: 22px;
      background: #fff;
    }
  }
  .tname {
    margin-left: 8px;
    font-size: 16px;
    font-weight: bolder;
    color: #2e2f34;
    flex-grow: 1;
    white-space: nowrap;
  }
  .tscore {
    font-size: 20px;
    color: #ff5353;
    text-align: center;
    letter-spacing: -0.41px;
    width: 32px;
  }
}
.x-match-info-content.finished .tscore{
  color: #2e2f34;
}
.dark .x-match-info-content {
  .tname {
    color: #ecebeb;
  }
  .tlogo img {
    background: transparent;
  }
  .tscore {
    color: #ffb900;
  }
}
</style>
