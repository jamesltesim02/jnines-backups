<template>
  <section class="match-item-1">
    <i class="match-color-flag" :style="{ background: flagColor }" ></i>
    <v-touch @tap="$router.push(`/detail/${match.sportID}/${match.matchID}`)" >
      <div class="match-header">
        <icon-tv
          v-if="!!match.matchVideo"
          class="match-icon-tv"
        />
        <div class="more-games flex-center">+{{match.matchGame || 0}}</div>
        <div class="tour-title">
          <rolling-text class="tour-name" :text="match.tournamentName" :max-length="18" scrollamount="3" />
          <span v-if="match.matchState == 1" class="match-time">{{matchTime}}</span>
          <span v-else class="match-time flex-center">{{match.matchDate | dateFormat('HH:mm')}}</span>
          <live-flag
            v-if="match.liveState === 1"
            class="type-one-live-flag"
            :active="match.matchState == 1"
          />
          <span
            v-if="period"
            class="period"
          >{{$t(`common.periods.${period}`)}}</span>
        </div>
        <ul class="match-teams">
          <li class="team">
            <rolling-text
              :text="match.competitor1Name"
              :max-length="14"
              scrollamount="3"
            />
          </li>
          <li class="score">
            <span :style="{ color: oddsColor }">{{matchScore.score1}}</span>
            <span class="spliter flex-center"></span>
            <span :style="{ color: oddsColor }">{{matchScore.score2}}</span>
          </li>
          <li class="team">
            <rolling-text :text="match.competitor2Name" :max-length="14" scrollamount="3" />
          </li>
        </ul>
      </div>
      <!--
      <match-momentum
        v-if="match.matchState === 1 && match.sportID === 10"
        :video-id="videoId"
      />
      -->
    </v-touch>
    <list-options :match="match" :games="games" />
  </section>
</template>
<script>
import { mapState } from 'vuex';
import LiveFlag from '@/components/common/LiveFlag';
import ListOptions from '@/components/Matchs/MatchList/ListOptions';
// import MatchMomentum from '@/components/Matchs/MatchList/MatchItem/MatchMomentum';
import RollingText from '@/components/common/RollingText';
import IconTv from './icons/IconTv';

export default {
  props: ['match', 'flagColor', 'matchTime', 'period', 'games', 'matchScore'],
  computed: {
    ...mapState('app', ['theme']),
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_OPTION_COLOR ? pSet.BLUE_OPTION_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    videoId() {
      return (this.match.betradarKey || '').split(':').pop();
    },
  },
  components: {
    LiveFlag,
    ListOptions,
    RollingText,
    // MatchMomentum,
    IconTv,
  },
};
</script>
<style lang="less">
.match-item-1 {
  position: relative;
  background: #fff;
  box-shadow: 0 10px 20px 0 rgba(236, 236, 236, 0.5);
  margin-top: .1rem;
  border-radius: 6px;
  overflow: hidden;
  padding-left: .05rem;
  & + .match-list-ad {
    margin-top: .1rem;
    border-radius: 6px;
  }
  .match-color-flag {
    position: absolute;
    left: 0;
    width: .05rem;
    height: 100%;
  }
  .match-header {
    position: relative;
    padding: .08rem 0 .06rem;
    overflow: hidden;
  }
  .tour-title {
    padding: 0 .02rem .054rem;
    font-size: .14rem;
    display: flex;
  }
  .tour-name {
    width: 1.35rem;
    color: #c6c4c4;
    white-space: nowrap;
    text-align: center;
  }
  .match-time {
    color: #888;
    padding-left: .22rem;
  }
  .type-one-live-flag {
    margin-left: .08rem;
  }
  .period {
    color: #888;
    font-size: .12rem;
    margin-left: .1rem;
  }
  .more-games {
    position: absolute;
    width: .4rem;
    height: .25rem;
    top: 0;
    right: 0;
    border-bottom-left-radius: 6px;
    border-top-right-radius: 6px;
    background: #f7f7f7;
    border: 1px solid #ececec;
    color: rgb(183, 183, 183);
  }
  .match-teams {
    display: flex;
    color: #2e2f34;
    font-size: .15rem;
    line-height: .18rem;
    li { text-align: center; }
    li.team {
      width: 1.6rem;
      padding: 0 .05rem;
    }
    .score {
      display: flex;
      font-size: .18rem;
      width: .58rem;
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
  .momentum-bar + .list-options li:first-child {
    border-top: 0;
  }
  .match-icon-tv {
    position: absolute;
    top: .06rem;
    right: .46rem;
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
  .more-games {
    background: #2e2f34;
    color: #716d6d;
    border: 0;
  }
  .score .spliter::before {
    background: #716d6d;
  }
}
</style>
