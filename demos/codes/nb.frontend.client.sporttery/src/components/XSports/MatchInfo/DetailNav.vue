<template>
  <nav-bar
    class="x-detail-nav"
    @back="$emit('back')"
    cust-back
  >
    <span
      v-if="!this.matchInfo"
      slot="content"
    >赛果</span>
    <ul
      v-else
      slot="content"
      class="team-info"
    >
      <li class="team">
        <rolling-text
          :text="matchInfo.competitor1Name"
          :max-length="12"
          scrollamount="3"
        />
      </li>
      <li class="score">
        <span class="score1">{{score.team1}}</span>
        <span class="vs">vs</span>
        <span class="score2">{{score.team2}}</span>
      </li>
      <li class="team">
        <rolling-text
          :text="matchInfo.competitor2Name"
          :max-length="12"
          scrollamount="3"
        />
      </li>
    </ul>
  </nav-bar>
</template>
<script>
export default {
  props: {
    matchInfo: {},
    transparent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    score() {
      if (this.matchInfo.isSettled === false) {
        return { team1: '', team2: '' };
      }
      const {
        matchState,
        matchScore,
        resultNB,
      } = this.matchInfo;
      const scoreStr = ![1, 2, 3].includes(matchState) ? ':' : `${resultNB || matchScore || '0'}:0`;
      const [hscore, ascore] = scoreStr.split(':');
      return { team1: hscore, team2: ascore };
    },
  },
};
</script>
<style lang="less">
.x-detail-nav {
  z-index: 2;
  border-bottom: solid 1px #ecebeb;
  .nav-content {
    font-size: .14rem;
  }
  .team-info{
    display: flex;
    padding: 0 .45rem;
    font-size: .14rem;
    li {
      height: .44rem;
    }
    .team {
      width: 1.3rem;
    }
    .score {
      display: flex;
      span {
        display: inline-block;
        line-height: .44rem;
      }
      .score1,
      .score2 {
        padding: 0 .03rem;
        color: #ff5353;
        font-size: .18rem;
        flex-grow: 1;
      }
      .vs {
        width: .24rem;
        padding: 0 .05rem;
      }
    }
  }
}
.blue .x-detail-nav {
  border-bottom: solid 1px #2e2f34;
}
</style>
