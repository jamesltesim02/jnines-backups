<template>
<div class="x-detail-tabs">
  <ul ref="container">
    <li
      ref="shuttle"
      class="shuttle"
      :style="{
        left: `${shuttleLeft}px`,
        opacity: `${shuttleLeft > 0 ? 1 : 0}`,
      }"
    ></li>
    <v-touch
      tag="li"
      v-for="t in tabList"
      :key="t"
      :class="{
        active: t === value
      }"
      @tap="$emit('change', t)"
    >
      <span>
        {{$t(`xsports.detailtab.${t}`)}}
        <i v-if="t === 'settlement' && settleCount" >{{settleCount}}</i>
        <i v-if="t === 'program' && programCount" >{{programCount}}</i>
      </span>
    </v-touch>
  </ul>
</div>
</template>
<script>
import { mapState } from 'vuex';
import { getPlanCountByMatchId } from '@/api/activity';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
    },
    matchState: {
      type: Number,
    },
    mid: {},
  },
  data() {
    return {
      itemWidth: 0,
      shuttleWidth: 0,
      spaceWidth: 0,
      programCount: 0,
    };
  },
  computed: {
    ...mapState({ settleCount: state => state.bet.matchHisCount }),
    tabList() {
      /*
       * 根据比赛状态显示不同的tab
       *    0 = 早盘
       *    1 = 滚球
       *    3 = 结束
       *    4 = 延期
       *    5 = 腰斩
       */
      return ({
        //  早盘
        0: [
          // 投注
          'betting',
          // 分析
          'match.headToHead',
          // 提前结算
          'settlement',
          // 方案
          'program',
        ],
        // 滚球
        1: [
          // 投注
          'betting',
          // 赛况
          'match.statistics',
          // 阵容
          'match.lineups',
          // 分析
          'match.headToHead',
          // 提前结算
          'settlement',
        ],
      })[this.matchState]
      // 其他情况算已结束
      || [
        // 赛果
        'result',
        // 赛况
        'match.statistics',
        // 阵容
        'match.lineups',
      ];
    },
    shuttleLeft() {
      const index = this.tabList.findIndex(value => value === this.value);
      return index * this.itemWidth + (this.itemWidth - this.shuttleWidth) / 2 + this.spaceWidth;
    },
  },
  created() {
    if (!this.value) {
      this.$emit('change', this.tabList[0]);
    }
    this.initShuttle();
    this.queryProgramCount();
  },
  mounted() {
    this.initShuttle();
    window.addEventListener('resize', this.initShuttle.bind(this));
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.initShuttle);
  },
  methods: {
    initShuttle() {
      if (this.$refs.container) {
        const {
          clientWidth: containerWidth,
          lastElementChild: {
            clientWidth: itemWidth,
          },
        } = this.$refs.container;
        this.itemWidth = itemWidth;
        this.shuttleWidth = this.$refs.shuttle.clientWidth;
        this.spaceWidth = (containerWidth - this.itemWidth * this.tabList.length) / 2;
      }
    },
    async queryProgramCount() {
      const result = await getPlanCountByMatchId({
        matchId: this.mid,
      });
      this.programCount = result.count;
    },
  },
};
</script>
<style lang="less">
.x-detail-tabs {
  height: .4rem;
  // padding: 0 .1rem;
  background: #fbfbfb;
  box-shadow: 0 2px 4px 0 rgba(236, 236, 236, 0.5);
  ul {
    position: relative;
    display: flex;
    line-height: .39rem;
    justify-content: center;
    font-size: .14rem;
    font-weight: bold;
    color: #909090;
    text-align: center;
  }
  li {
    width: .8rem;
    transition: all .25s ease-out;
    span {
      position: relative;
      display: inline-block;
      line-height: .14rem;
      i {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(95%,-80%);
        display: inline-block;
        font-style: normal;
        color: #fff;
        background: #ff5353;
        font-size: .12rem;
        font-weight: normal;
        line-height: .13rem;
        width: .23rem;
        border-radius: 5px;
      }
    }
    &.active {
      color: #2e2f34;
    }
  }
  li.shuttle {
    position: absolute;
    bottom: 0;
    left: 0;
    width: .3rem;
    height: .03rem;
    border-radius: 2px;
    box-shadow: 0 -1px 6px 0 #fae5f5;
    background: linear-gradient(95deg, #ff5353, rgba(245, 56, 1, 0.61));
  }
}
.blue .x-detail-tabs {
  background: #2e2f34;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.5);
  ul { color: #909090; }
  li i { color: #53fffd; background: #434249; }
  li.active { color: #ecebeb; }
  li.shuttle {
    box-shadow: 0 -1px 6px 0 #00aabd;
    background: linear-gradient(103deg, #00ffd8, #00e5fe);
  }
}
</style>
