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
    <li
      v-for="({state, countKey}) in states"
      :key="state"
      tag="li"
      :class="{ active: state === value }"
      @click="$emit('change', state)"
    >
      <div>
        {{$t(`xsports.states.${state}`)}}
        <span
          v-if="typeof counts[countKey] === 'number'"
          class="match-count"
        >{{counts[countKey]}}</span>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Number,
      default: 1,
    },
    counts: {
      default: {
        // 滚球
        grounderNum: undefined,
        // 早盘
        morningPlateNum: undefined,
        // 近24小时
        todayNum: undefined,
      },
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
    };
  },
  computed: {
    shuttleLeft() {
      const index = this.states.findIndex(({ state }) => state === this.value);
      return (index * this.itemWidth) + (this.itemWidth - this.shuttleWidth) / 2;
    },
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
  },
};
</script>
<style lang="less">
.x-state-filter {
  position: relative;
  color: #909090;
  display: inline-flex;
  letter-spacing: -0.33px;
  color: #909090;
  font-size: 16px;
  text-align: center;
  margin-left: 20px;
  li {
    width: 100px;
    display: inline-block;
    transition: all .25s ease-out;
    padding: 28px 0 24px 0;
    cursor: pointer;
    div {
      position: relative;
      display: inline-block;
      line-height: 22px;
    }
    .match-count {
      display: inline-block;
      position: absolute;
      top: -12px;
      right: -38px;
      width: 36px;
      height: 20px;
      font-size: 12px;
      color: #3a3a3a;
      text-align: center;
      border-radius: 5px;
      background-color: #ecebeb;
      line-height: 20px;
      transition: all .25s ease-out;
    }
  }
  li.active {
    color: #ff5353;
    .match-count {
      background: #ff5353;
      color: #fff;
    }
  }
  li.shuttle {
    position: absolute;
    padding: 0;
    bottom: -2px;
    left: 0px;
    height: 3px;
    width: 50px;
    background-color: #ff5353;
  }
}

.dark .x-state-filter {
  li .match-count {
    color: #909090;
    background-color: #36383d;
  }
  li.active {
    color: #53fffd;
    .match-count {
      color: #53fffd;
      background-color: #36383d;
    }
  }
  li.shuttle {
    background: #53fffd;
  }
}
</style>
