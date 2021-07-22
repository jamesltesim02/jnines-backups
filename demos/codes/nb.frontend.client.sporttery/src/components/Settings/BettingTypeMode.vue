<template>
  <div class="match-list-style">
    <div >{{$t('page.matchStyleTitle')}}</div>
    <ul :class='[`cols-${listStyles.length} flex-between`]' >
      <v-touch
        tag="li"
        v-for="(s, i) in listStyles"
        :key="i"
        :class="{ active: s === matchListStyle }"
        @tap="updateMatchListStyle(s)"
      >{{$t(`page.matchStyles.${s}`)}}</v-touch>
    </ul>
    <!-- <div v-if="showBetMode" >{{$t('page.betModeTitle')}}</div>
    <ul class="bet-mode flex-start" v-if="showBetMode" >
      <v-touch
        tag="li"
        v-for="(s, i) in betModes"
        :key="i"
        :class="{ active: s === bettingMode }"
        @tap="updateBettingMode(s)"
      >{{$t(`page.betModes.${s}`)}}</v-touch>
    </ul> -->
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

/**
 * 赛程列表展示样式
 * 1: 宽松两胜平负盘口样式
 * 2: 紧凑两胜平负盘口样式
 * 3: 紧凑但盘口样式
 * 4: 宽松让分大和小盘口样式
 */
const LIST_STYLES = [
  1,
  2,
  3,
  // 4,
];

/**
 * 投注模式
 * 1: 小白模式
 * 2: 专家模式
 */
const BET_MODES = [1, 2];

export default {
  data() {
    return { listStyles: LIST_STYLES, betModes: BET_MODES };
  },
  computed: {
    ...mapState('app', ['matchListStyle', 'bettingMode']),
    showBetMode() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      return !!(pSet && pSet.SHOW_CHANGE_BET_MODE);
    },
  },
  methods: {
    ...mapMutations('app', ['updateMatchListStyle', 'updateBettingMode']),
  },
};
</script>
<style lang="less">
.match-list-style {
  div { color: #6a6c74; padding: .1rem .3rem; }
  ul {
    background: #ecebeb;
    padding: .14rem .14rem .14rem .3rem;
    line-height: .38rem;
    font-size: .14rem;
    color: #ff5353;
    transition: all  .25s ease-out;
    li {
      border: 1px solid #ff5353;
      border-radius: 6px;
      text-align: center;
      transition: all .3s;
      &.active { background: #ff5353; color: #fff; }
    }
    &.cols-3 li { width: 1rem; }
    &.cols-4 li { width: .77rem; }
  }
  .bet-mode {
    li { width: 1.25rem; margin-right: .08rem; }
  }
}

.black .match-list-style ul {
  background: #232227;
  li {
    color: #909090;
    border-color: rgba(144, 144, 144, .5);
    &.active { background: transparent; color: #ff5353; border-color: #ff5353; }
  }
}
</style>
