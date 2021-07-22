<template>
  <ul
    ref="container"
    class="x-state-filter"
  >
    <li
      ref="shuttle"
      class="shuttle"
      :style="{
        left: `${shuttleLeft}px`,
      }"
    ></li>
    <v-touch
      v-for="({state, countKey}) in states"
      :key="state"
      tag="li"
      :class="{ active: state === value }"
      @tap="$emit('change', { state, counts })"
    >
      <div>
        {{$t(`xsports.states.${state}`)}}
        <span
          v-if="typeof counts[countKey] === 'number'"
          class="match-count"
        >{{counts[countKey]}}</span>
      </div>
    </v-touch>
  </ul>
</template>
<script>
import { mapState } from 'vuex';
import { findCountOther } from '@/api/pull';
import appConfig from '@/config/business.config';

export default {
  props: {
    value: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      itemWidth: 0,
      shuttleWidth: 0,
      states: [
        // 近24小时
        {
          state: 1,
          countKey: 'todayNum',
        },
        // 滚球
        {
          state: 2,
          countKey: 'grounderNum',
        },
        // 早盘
        {
          state: 0,
          countKey: 'morningPlateNum',
        },
        // 已结束
        {
          state: 3,
          countKey: '',
        },
      ],
      counts: {
        // 滚球
        grounderNum: undefined,
        // 早盘
        morningPlateNum: undefined,
        // 近24小时
        todayNum: undefined,
      },
      // 定时刷新的timer对象
      reloadTimer: null,
    };
  },
  computed: {
    ...mapState('xsports', ['activeSports']),
    shuttleLeft() {
      const index = this.states.findIndex(({ state }) => state === this.value);
      return index * this.itemWidth + (this.itemWidth - this.shuttleWidth) / 2;
    },
  },
  created() {
    this.loadCounts();
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
        const containerWidth = this.$refs.container.clientWidth;
        this.itemWidth = containerWidth / this.states.length;
        this.shuttleWidth = this.$refs.shuttle.clientWidth;
      }
    },
    async loadCounts() {
      clearTimeout(this.reloadTimer);
      this.counts = await findCountOther({
        sportIds: this.activeSports,
      });
      // 定时刷新数量
      this.$emit('change', {
        state: this.value,
        counts: this.counts,
      });
      if (appConfig.matchsReloadTime) {
        this.reloadTimer = setTimeout(
          this.loadCounts.bind(this),
          appConfig.matchsReloadTime,
        );
      }
    },
  },
};
</script>

<style lang="less">
.x-state-filter {
  position: relative;
  display: flex;
  font-size: .14rem;
  line-height: .4rem;
  color: #2e2f34;
  letter-spacing: -0.3px;
  li {
    width: 100%;
    text-align: center;
    transition: all .25s ease-out;
    div {
      position: relative;
      display: inline-block;
    }
    .match-count {
      position: absolute;
      display: inline-block;
      width: .25rem;
      font-size: .12rem;
      top: .03rem;
      right: 0;
      line-height: .13rem;
      border-radius: 5px;
      background: #d8d8d8;
      transform: translateX(96%);
      color: #767477;
      transition: all .25s ease-out;
    }
    &.active {
      color: #ff5353;
      .match-count {
        background: #ff5353;
        color: #fff;
      }
    }
  }
  li.shuttle {
    position: absolute;
    bottom: 0;
    left: 0;
    height: .04rem;
    width: .3rem;
    border-radius: 2px;
    box-shadow: 0 -1px 6px 0 #fae5f5;
    background: linear-gradient(96deg, #ff5353, rgba(245, 56, 1, 0.61));
  }
}
.blue .x-state-filter {
  color: #bababa;
  .match-count {
    background: #434249;
    color: #bababa;
  }
  li.active {
    color: #53fffd;
    .match-count {
      background: #434249;
      color: #53fffd;
    }
  }
  li.shuttle {
    box-shadow: 0 -1px 6px 0 #00aabd;
    background: linear-gradient(108deg, #00ffd8, #00e5fe);
  }
}
</style>
