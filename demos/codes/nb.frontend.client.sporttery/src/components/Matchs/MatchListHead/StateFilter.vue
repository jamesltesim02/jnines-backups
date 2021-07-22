<template>
  <ul class="match-state-filter">
    <v-touch
      tag="li"
      v-for="(s, i) in states"
      :key="i"
      :class="{ active: state.state === s.state }"
      @tap="changeState(i)"
      :style="textStyle(s)"
    >
      {{$t(`page.statefilters.${s.state}`)}}
      <span class="count" :style="textStyle(s)">{{s.count}}</span>
      <i v-if="state.state === s.state" :style="{ background: lineColor }"></i>
    </v-touch>
  </ul>
</template>
<script>
import { mapState } from 'vuex';
import { findCountInfo } from '@/api/pull';

const pSet = window.NBConfig.PORTAL_SETTING;

export default {
  props: {
    state: { default: 0 },
    sno: {},
  },
  data() {
    return {
      states: [
        // 滚球
        {
          state: 2,
          count: 0,
        },
        // 今日
        {
          state: 1,
          count: 0,
        },
        // 早盘
        {
          state: 0,
          count: 0,
        },
      ],
    };
  },
  computed: {
    ...mapState('app', ['theme', 'matchListUpdateFlag']),
    textColor() {
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_MATCH_TEXT_COLOR ? pSet.BLACK_MATCH_TEXT_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_MATCH_TEXT_COLOR ? pSet.BLUE_MATCH_TEXT_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_MATCH_TEXT_COLOR ? pSet.WHITE_MATCH_TEXT_COLOR : '#ff5353';
    },
    lineColor() {
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_MATCH_LINE_COLOR ? pSet.BLACK_MATCH_LINE_COLOR : 'linear-gradient(95deg, #fe6246, rgba(245, 56, 1, 0.61))';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_MATCH_LINE_COLOR ? pSet.BLUE_MATCH_LINE_COLOR : 'linear-gradient(95deg, #00c4a5, #00c0d5)';
      }
      return pSet && pSet.WHITE_MATCH_LINE_COLOR ? pSet.WHITE_MATCH_LINE_COLOR : 'linear-gradient(95deg, #fe6246, rgba(245, 56, 1, 0.61))';
    },
  },
  watch: {
    sno() {
      this.queryMatchCount();
    },
    matchListUpdateFlag() {
      this.queryMatchCount();
    },
  },
  async mounted() {
    await this.queryMatchCount();
  },
  methods: {
    textStyle(s) {
      return this.state.state === s.state ? { color: this.textColor } : { };
    },
    async queryMatchCount() {
      const countResult = await findCountInfo(this.sno);
      this.$set(this.states, 0, {
        state: this.states[0].state,
        count: countResult.grounderNum,
      });
      this.$set(this.states, 1, {
        state: this.states[1].state,
        count: countResult.todayNum,
      });
      this.$set(this.states, 2, {
        state: this.states[2].state,
        count: countResult.morningPlateNum,
      });
      let defaultIndex = this.states.findIndex(s => s.count > 0);
      if (defaultIndex === -1) {
        defaultIndex = 2;
      }
      this.changeState(defaultIndex);
    },
    changeState(index) {
      this.$emit('update:state', this.states[index]);
    },
  },
};
</script>
<style lang="less">
.match-state-filter {
  display: flex;
  color: #bababa;
  line-height: .35rem;
  font-size: .14rem;
  letter-spacing: -0.3px;
  height: 100%;
  li {
    position: relative;
    width: 100%;
    text-align: center;
    .count {
      margin-left: .04rem;
      color: #716d6d;
      font-size: .12rem;
    }
    &::after {
      content: "";
      position: absolute;
      display: block;
      background: #dbdadb;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: .24rem;
    }
    &:last-child::after {
      display: none;
    }
    &.active i {
      content: "";
      position: absolute;
      display: block;
      height: 3px;
      width: .5rem;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 6px;
    }
  }
}
.black .match-state-filter {
  li {
    &::after { background: #201f23; }
    &.active::before { bottom: 1px; }
  }
}
</style>
