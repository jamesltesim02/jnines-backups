<template>
<div class="x-detail-tabs">
  <ul ref="container">
    <li
      ref="shuttle"
      class="shuttle"
      :style="{
        left: `${shuttleLeft}px`,
      }"
    ></li>
    <li
      tag="li"
      v-for="t in tabList"
      :key="t"
      :class="{
        active: t === value
      }"
      @click="$emit('change', t)"
    >
      <span>
        {{$t(`xsports.detailtab.${t}`)}}
        <i v-if="t === 'settlement' && settleCount">{{settleCount}}</i>
      </span>
    </li>
  </ul>
</div>
</template>
<script>
import { mapState } from 'vuex';

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
    };
  },
  computed: {
    ...mapState({ settleCount: state => state.bet.matchHisCount }),
    tabList() {
      // 0 = 早盘
      // 1 = 滚球
      // 3 = 结束
      // 4 = 延期
      // 5 = 腰斩
      return ({
        //  早盘
        0: [
          // 投注
          // 'betting',
          // 分析
          'match.headToHead',
          // 提前结算
          'settlement',
        ],
        // 滚球
        1: [
          // 投注
          // 'betting',
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
        // 'result',
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
  },
};
</script>
<style lang="less">
.x-detail-tabs {
  text-align: center;
  padding-top: 20px;
  border-bottom: solid 4px #ededed;
  ul {
    position: relative;
    display: inline-flex;
    line-height: 22px;
    padding: 10px 0;
    li {
      cursor: pointer;
      width: 176px;
      font-weight: bolder;
      transition: all .25s ease-out;
      span {
        position: relative;
        display: inline-block;
        line-height: 14px;
        i {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(102%, -90%);
          display: inline-block;
          font-style: normal;
          color: #fff;
          background: #ff5353;
          font-size: 12px;
          line-height: 20px;
          min-width: 36px;
          font-weight: normal;
          width: 23px;
          border-radius: 5px;
        }
      }
    }
    li.active {
      color: #2e2f34;
    }
    li.shuttle {
      position: absolute;
      bottom: -4px;
      background: #ff5353;
      height: 4px;
      width: 80px;
    }
  }
}

.dark .x-detail-tabs {
  border-bottom-color: #434249;
  li.active {
    color: #ecebeb;
  }
  li.shuttle {
    background: #53fffd;
  }
  li span i {
    color: #53fffd;
    background: #36383d;
  }
}
</style>
