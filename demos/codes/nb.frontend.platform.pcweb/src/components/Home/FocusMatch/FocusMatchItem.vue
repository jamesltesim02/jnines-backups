<template>
  <div class="focus-match-item">
    <span class="date">{{match.matchDate | dateFormat('MM/dd')}}</span>
    <div
      class="minfo"
      @click="$router.push(`/detail/${match.sportID}/${match.matchID}`)"
    >
      <h4>{{match.tournamentName}}</h4>
      <ul>
        <li class="team">
          <rolling-text
            :text="match.competitor1Name"
            :max-length="20"
            scrollamount="3"
          />
        </li>
        <li class="time-score">
          <time-countor
            class="time"
            v-if="match.matchState === 1"
            :match-time="match.matchTime"
          />
          <div v-else class="time">{{match.matchDate | dateFormat('HH:mm')}}</div>
          <div class="score">
            <span>{{score[0]}}</span>
            <span>{{score[1]}}</span>
          </div>
        </li>
        <li class="team">
          <rolling-text
            :text="match.competitor2Name"
            :max-length="20"
            scrollamount="3"
          />
        </li>
      </ul>
    </div>
    <focus-options
      :match="{
        ...match,
        isQuickBet: true,
      }"
    />
  </div>
</template>
<script>
import TimeCountor from '@/components/Matchs/MatchItem/TimeCountor';
import FocusOptions from './FocusOptions';

export default {
  props: ['match'],
  computed: {
    score() {
      if (this.match.matchState !== 1) {
        return ['', ''];
      }

      return (this.match.matchScore || '0:0').split(':');
    },
  },
  components: {
    TimeCountor,
    FocusOptions,
  },
};
</script>
<style lang="less">
.focus-match-item {
  position: relative;
  padding: 20px 10px 20px 17px;
  .minfo {
    cursor: pointer;
  }
  .date {
    position: absolute;
    display: block;
    left: 0;
    background-image: linear-gradient(to right, #fe597d, #ffb775);
    color: #fff;
    font-size: 12px;
    padding: 3px 10px;
    border-top-right-radius: 1000px;
    border-bottom-right-radius: 1000px;
  }
  h4 {
    color: #bababa;
    text-align: center;
    line-height: 22px;
  }
  & ul {
    display: flex;
    margin-top: 6px;
    .team {
      width: 42%;
      text-align: center;
      color: #e8e6e8;
      padding: 5px 0;
      line-height: 25px;
    }
    .time-score {
      width: 16%;
      text-align: center;
      .time {
        font-size: 12px;
        color: #888;
        &.time-countor {
          color: #ff5353;
        }
      }
      .score {
        position: relative;
        display: flex;
        height: 20px;
        line-height: 20px;
        margin-top: -2px;
        span {
          display: block;
          width: 50%;
          color: #ff5353;
        }
        span:first-child {
          padding-right: 18px;
          text-align: right;
        }
        span:last-child {
          padding-left: 18px;
          text-align: left;
        }
        &::before {
          content: "";
          position: absolute;
          display: block;
          width: 18px;
          height: 2px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(93deg, #fe597d, #ffb775);
        }
      }
    }
  }
}
</style>
