<template>
  <div
    class="match-info"
    @click="$router.push(`/detail/${match.sportID}/${match.matchID}`)"
  >
    <div class="tour-and-state">
      <span class="icon-sport">
        <icon-sport :sno="match.sportID" />
      </span>
      <span class="tour-name">
        <rolling-text
          :text="match.tournamentName"
          :max-length="20"
          scrollamount="3"
        />
      </span>
      <div
        v-if="match.matchState === 1"
        class="live-block"
      >
        <live-flag active />
        <time-countor
          :match-time="match.matchTime"
          :sno="match.sportID"
        />
      </div>
      <div
        v-else
        class="match-date"
      >{{match.matchDate | dateFormat('yyyy/MM/dd HH:mm')}}</div>
    </div>
    <div class="teams">
      <rolling-text
        :text="match.competitor1Name"
        :max-length="20"
        scrollamount="3"
      />
      <span class="score">{{score[0]}}</span>&nbsp;-&nbsp;<span class="score">{{score[1]}}</span>
      <rolling-text
        :text="match.competitor2Name"
        :max-length="20"
        scrollamount="3"
      />
    </div>
    <div class="tv-and-count">
      <icon-tv v-if="!!match.matchVideo" />
      <span>{{match.matchGame}}+</span>
    </div>
  </div>
</template>
<script>
import IconSport from '@/components/common/icons/IconSport';
import LiveFlag from './icons/LiveFlag';
import IconTv from './icons/IconTv';
import TimeCountor from './TimeCountor';

export default {
  props: ['match'],
  components: {
    IconSport,
    LiveFlag,
    IconTv,
    TimeCountor,
  },
  computed: {
    score() {
      if (this.match.matchState !== 1) {
        return ['', ''];
      }

      return (this.match.matchScore || '0:0').split(':');
    },
  },
};
</script>

<style lang="less">
.match-info {
  position: relative;
  padding: 10px 30px;
  cursor: pointer;
  .tv-and-count {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    svg {
      vertical-align: middle;
      margin-right: 12px;
    }
    span {
      font-size: 14px;
      color: #ff5353;
      opacity: 0.85;
    }
  }
  .icon-sport {
    display: none;
    vertical-align: middle;
    padding-right: 5px;
    margin-right: 5px;
    border-right: 1px solid #3c3b43;
    svg {
      width: 18px;
      height: 18px;
      path {
        fill: #ff5353;
      }
    }
  }
  .tour-name {
    display: inline-block;
    font-size: 14px;
    width: 110px;
  }
  .live-block {
    display: inline-block;
  }
  .match-date {
    display: inline-block;
    color: #888;
    font-size: 14px;
    margin-left: 5px;
  }
  .teams {
    margin-top: 9px;
    color: #e8e6e8;
    .score {
      color: #ff5353;
      margin: 0 5px;
    }
    marquee {
      display: inline-block;
      max-width: 150px;
    }
  }
}
</style>
