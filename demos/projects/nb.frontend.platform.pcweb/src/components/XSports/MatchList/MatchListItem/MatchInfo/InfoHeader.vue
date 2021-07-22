<template>
  <header
    :class="{
      'x-match-info-header': true,
      active: active,
      finished: match.matchState === 3
    }"
  >
    <icon-sports
      :sno="match.sportID"
      :class="{
        active: active,
      }"
    />
    <i class="spliter"></i>
    <rolling-text
      class="tour-name"
      :text="match.tournamentName"
      :max-length="match.matchState === 3 ? 30 : 12"
      scrollamount="3"
    />
    <span
      v-if="[0, 3].includes(match.matchState)"
      class="match-time"
    >
      {{+match.matchDate | dateFormat('MM-dd HH:mm')}}
    </span>
    <icon-video />
    <span class="icon-live">滚</span>
    <span
      v-if="match.matchState == 1"
      class="match-time"
    >{{matchTime}}</span>
    <span
      v-if="period"
      class="period"
    >
      {{$t(`common.periods.${period}`)}}
    </span>
  </header>
</template>
<script>
import IconSports from './icons/IconSports';
import IconVideo from './icons/IconVideo';

export default {
  props: {
    match: {},
  },
  data() {
    return {
      pushMatchTime: null,
    };
  },
  computed: {
    active() {
      if (this.match) {
        return [1, 2].includes(+this.match.matchState);
      }
      return false;
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
  components: {
    IconSports,
    IconVideo,
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
.x-match-info-header {
  height: 38px;
  border-bottom: 1px solid #e8e8e8;
  padding-left: 20px;
  display: flex;
  align-items: center;
  .icon-sports {
    width: 16px;
    height: 16px;
    opacity: .7;
  }
  .spliter {
    display: inline-block;
    width: 1px;
    height: 13px;
    background: #c1c1c1;
    margin-left: 8px;
  }
  .match-time, .tour-name {
    font-size: 14px;
    color: #7e7d7f;
    letter-spacing: -0.29px;
  }
  .match-time {
    margin-right: 20px;
  }
  .tour-name {
    margin: 0 12px 0 8px;
    font-weight: bolder;
    max-width: 85px;
  }
  marquee.tour-name {
    margin: 0 2px;
    max-width: 66px;
  }
  .icon-video {
    margin-left: 4px;
    width: 20px;
    height: 18px;
    .g-fill {
      fill: #bababa;
    }
  }
  .icon-live {
    display: inline-block;
    font-size: 12px;
    color: #bababa;
    border: 1px solid #bababa;
    border-radius: 3px;
    width: 18px;
    line-height: 16px;
    text-align: center;
    margin-left: 6px;
  }
}
.x-match-info-header.active {
  .icon-sports {
    opacity: 1;
    .main-fill {
      fill: #ff5353;
    }
  }
  .spliter {
    background: #ff5353;
  }
  .tour-name {
    color: #ff5353;
  }
  .match-time {
    margin-left: 6px;
    color: #ff5353;
  }
  .icon-live {
    background: #ff5353;
    border-color: #ff5353;
    color: #fff;
  }
  .icon-video .g-fill {
    fill: #ff5353;
  }
  .period {
    font-size: 12px;
    margin-left: 6px;
    color: #ff5353;
  }
}
.x-match-info-header.finished {
  .icon-video,.icon-live {
    display: none;
  }
  .tour-name {
    max-width: 180px;
  }
}
.dark .x-match-info-header {
  border-bottom-color: #303136;
  .icon-sports {
    opacity: 1;
    .g-main {
      fill: #777;
    }
  }
  .match-time, .tour-name {
    color: #909090;
    font-weight: normal;
  }
  .spliter {
    background: #777;
  }
  .icon-video .g-fill {
    fill: #777777;
  }
  .icon-live {
    color: #777;
    border-color: #777;
  }
  &.active {
    .icon-sports .main-fill{
      fill: #53fffd;
    }
    .match-time, .tour-name {
      color: #53fffd;
      font-weight: normal;
    }
    .spliter {
      background: #53fffd;
    }
    .icon-video .g-fill {
      fill: #53fffd;
    }
    .period {
      color: #53fffd;
    }
    .icon-live {
      background: transparent;
      color: #53fffd;
      border-color: #53fffd;
    }
  }
}
</style>
