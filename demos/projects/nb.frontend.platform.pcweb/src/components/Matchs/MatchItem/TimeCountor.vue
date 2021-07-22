<template>
  <div class="time-countor">
    <span class="countor">{{timeText}}</span>
    <span
      v-if="period"
      class="period"
    >{{$t(`common.periods.${period}`)}}</span>
  </div>
</template>
<script>
export default {
  props: ['sno', 'matchTime'],
  data() {
    return {
      timestamp: 0,
    };
  },
  created() {
    this.timestamp = this.toTimestamp();
    this.startInterval();
  },
  computed: {
    timeText() {
      const [m, s] = [
        `0${Math.max(parseInt(this.timestamp / 60, 10), 0)}`.substr(-2),
        `0${Math.max(parseInt(this.timestamp % 60, 10), 0)}`.substr(-2),
      ];
      return `${m}′${s}″`;
    },
    timeObj() {
      return JSON.parse(this.matchTime || '{}');
    },
    period() {
      if (this.sno === 11) {
        return this.timeObj.period;
      }

      return null;
    },
  },
  watch: {
    matchTime() {
      this.timestamp = this.toTimestamp();
      if ([321, 33, 30, 31, 80, 81].includes(this.timeObj.period)) {
        this.stopInterval();
        return;
      }
      if (!this.timer && this.timeObj.stime) {
        this.startInterval();
        return;
      }
      this.stopInterval();
    },
  },
  methods: {
    toTimestamp() {
      let time = '0';
      if (this.sno === 11) {
        time = this.timeObj.remaindTimeInPeriod;
      } else {
        time = this.timeObj.matchtime;
      }
      if (!time) {
        return 0;
      }
      const [minutes = 0, seconds = 0] = time.split(':');
      return (+minutes) * 60 + (+seconds);
    },
    startInterval() {
      this.stopInterval();
      this.interval = setInterval(() => {
        if ([321, 33, 30, 31, 80, 81].includes(this.timeObj.period)) {
          this.stopInterval();
          return;
        }
        this.timestamp += (this.sno === 11 ? -1 : 1);
      }, 1000);
    },
    stopInterval() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
  },
};
</script>

<style lang="less">
.time-countor {
  display: inline-block;
  font-size: 14px;
  .countor {
    color: #ff5353;
    opacity: .85;
    line-height: 16px;
  }

  .period {
    margin-left: 15px;
  }
}
</style>
