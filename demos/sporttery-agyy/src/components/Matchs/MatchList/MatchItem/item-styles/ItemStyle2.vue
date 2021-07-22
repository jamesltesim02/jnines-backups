<template>
  <section
    class="item-style-2"
    :style="{borderColor: flagColor}"
  >
    <v-touch
      class="left"
      @tap="toDetail"
    >
      <div>
        <div class="tour">
          <rolling-text
            :text="match.abbrName || match.tournamentName"
            :max-length="8"
          />
        </div>
        <div>
          <span v-if="match.matchState == 1" class="match-time live">{{matchTime}}</span>
          <span v-else class="match-time">{{match.matchDate | dateFormat('HH:mm')}}</span>
        </div>
      </div>
    </v-touch>
    <div class="right">
      <v-touch
        class="teams"
        @tap="toDetail"
      >
        <div class="team">
          <rolling-text
            :text="match.competitor1Name"
            :max-length="10"
          />
        </div>
        <div class="score">
          <span>{{matchScore.score1}}</span>
          <span class="spliter flex-center"></span>
          <span>{{matchScore.score2}}</span>
        </div>
        <div class="team">
          <rolling-text
            :text="match.competitor2Name"
            :max-length="10"
          />
        </div>
      </v-touch>
      <list-options
        :match="match"
        :games="games"
      />
    </div>
  </section>
</template>
<script>
import RollingText from '@/components/common/RollingText';
import ListOptions from '@/components/Matchs/MatchList/ListOptions';

export default {
  props: [
    'match',
    'flagColor',
    'matchTime',
    'games',
    'matchScore',
  ],
  components: {
    RollingText,
    ListOptions,
  },
  methods: {
    toDetail() {
      this.$router.push(`/detail/${this.match.sportID}/${this.match.matchID}`);
    },
  },
};
</script>
<style lang="less">
.item-style-2 {
  box-shadow: 0 2px 10px 0 rgba(236, 236, 236, 0.5);
  background-image: linear-gradient(to top, #f9f9f9, #ffffff);
  margin-bottom: .01rem;
  border-left: 4px solid transparent;
  display: flex;
  &:first-child {
    margin-top: .04rem;
  }
  & + .match-list-ad {
    margin-bottom: .01rem;
  }
  .left {
    width: .72rem;
    display: flex;
    align-items: center;
    text-align: center;
    font-size: .14rem;
    border-right: 1px solid #ecebeb;
    & > div {
      width: 100%;
    }
    .tour {
      color: #909090;
    }
    .match-time {
      display: inline-block;
      color: #888;
    }
    .match-time.live {
      position: relative;
      color: #ff5353;
    }
    .match-time.live::before {
      content: "";
      display: block;
      position: absolute;
      width: .06rem;
      height: .06rem;
      background: #ff5353;
      top: -.03rem;
      right: -.07rem;
      border-radius: 50%;
    }
  }
  .right {
    flex-grow: 1;
  }
  .teams {
    display: flex;
    text-align: center;
    font-size: .15rem;
    line-height: .4rem;
    height: .4rem;
    .team {
      width: 1.01rem;
      padding: 0 .05rem;
      color: #2e2f34;
      font-weight: bold;
      white-space: nowrap;
    }
    .score {
      display: flex;
      color: #ff5353;
      font-size: .18rem;
      width: .68rem;
      span {
        width: 100%;
      }
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

.black .item-style-2 {
  box-shadow: 0 2px 10px 0 rgba(37, 37, 37, 0.5);
  background-image: linear-gradient(129deg, #3d4046, #35363c);
  .left {
    border-color: #2e2f34;
  }
  .match-time {
    color: #bababa;
  }
  .teams .score,.match-time.live {
    color: #53fffd;
  }
  .teams .team {
    color: #bababa;
  }
  .teams .score .spliter::before {
    background: #5c5c5c;
  }
}
</style>
