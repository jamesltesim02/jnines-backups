<template>
  <section class="match-item-1">
    <i
      class="match-color-flag"
      :style="{background: flagColor}"
    ></i>
    <v-touch
      class="match-header"
      @tap="$router.push(`/detail/${match.sportID}/${match.matchID}`)"
    >
      <div class="tour-title">
        <span class="tour-name">{{match.tournamentName}}</span>
        <live-flag :active="match.matchState == 1" />
        <span v-if="match.matchState == 1" class="match-time">{{matchTime}}</span>
        <span v-else class="match-time">{{match.matchDate | dateFormat('HH:mm')}}</span>
      </div>
      <ul class="match-teams">
        <li class="team">
          <rolling-text
            :text="match.competitor1Name"
            :max-length="14"
          />
        </li>
        <li class="score">
          <span>{{matchScore.score1}}</span>
          <span class="spliter flex-center"></span>
          <span>{{matchScore.score2}}</span>
        </li>
        <li class="team">
          <rolling-text
            :text="match.competitor2Name"
            :max-length="14"
          />
        </li>
      </ul>
    </v-touch>
    <list-options
      :match="match"
      :games="games"
    />
  </section>
</template>
<script>
import LiveFlag from '@/components/common/LiveFlag';
import ListOptions from '@/components/Matchs/MatchList/ListOptions';
import RollingText from '@/components/common/RollingText';

export default {
  props: [
    'match',
    'flagColor',
    'matchTime',
    'games',
    'matchScore',
  ],
  components: {
    LiveFlag,
    ListOptions,
    RollingText,
  },
};
</script>
<style lang="less">
.match-item-1 {
  position: relative;
  background: #fff;
  box-shadow: 0 10px 20px 0 rgba(236, 236, 236, 0.5);
  margin-bottom: .1rem;
  border-radius: 6px;
  overflow: hidden;
  padding-left: .05rem;
  & + .match-list-ad {
    margin-bottom: .1rem;
    border-radius: 6px;
  }
  .match-color-flag {
    position: absolute;
    left: 0;
    width: .05rem;
    height: 100%;
  }
  &:first-child {
    margin-top: .02rem;
  }
  .match-header {
    padding: .08rem 0 .06rem;
  }
  .tour-title {
    padding: 0 .22rem .054rem;
    font-size: .14rem;
    display: flex;
  }
  .tour-name {
    color: #c6c4c4;
    flex-grow: 1;
  }
  .match-time {
    color: #888;
    padding-left: .08rem;
  }
  .match-teams {
    display: flex;
    color: #2e2f34;
    font-size: .15rem;
    line-height: .18rem;
    li {
      text-align: center;
    }
    li.team {
      width: 1.6rem;
      padding: 0 .05rem;
    }
    .score {
      display: flex;
      color: #ff5353;
      font-size: .18rem;
      width: .58rem;
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

.black .match-item-1 {
  box-shadow: 0 10px 20px 0 rgba(37, 37, 37, 0.5);
  background: linear-gradient(133deg, #3d4046, #35363c);
  .tour-name {
    color: #909090;
  }
  .match-teams {
    color: #ecebeb;
  }
  .score .spliter::before {
    background: #716d6d;
  }
}
</style>
