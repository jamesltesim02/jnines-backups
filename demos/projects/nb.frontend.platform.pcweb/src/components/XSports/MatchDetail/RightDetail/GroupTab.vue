<template>
  <ul
    ref="container"
    class="x-group-tab"
  >
    <li
      ref="shuttle"
      class="shuttle"
      :style="{
        left: `${shuttleLeft}px`,
      }"
    ></li>
    <li
      v-for="g in groups"
      :key="g"
      :class="{ active: g === value }"
      @click="$emit('change', g)"
    >{{$t(`common.groups.${g}`)}}</li>
  </ul>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    groups: {},
    value: {},
  },
  data() {
    return {
      itemWidth: 0,
      shuttleWidth: 0,
    };
  },
  computed: {
    shuttleLeft() {
      const index = this.groups.findIndex(group => group === this.value);
      return index * this.itemWidth + (this.itemWidth - this.shuttleWidth) / 2;
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
        this.itemWidth = this.$refs.container.lastElementChild.clientWidth;
        this.shuttleWidth = this.$refs.shuttle.clientWidth;
      }
    },
  },
};
</script>
<style lang="less">
.x-group-tab {
  position: relative;
  display: flex;
  text-align: center;
  font-size: 14px;
  height: 43px;
  &::before {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    right: 0;
    width: calc(100% + 10px);
    height: 2px;
    background: #ecebeb;
  }
  li {
    width: 100%;
    line-height: 43px;
    cursor: pointer;
    transition: all .25s ease-out;
  }
  li.active {
    color: #2e2f34;
  }
  li.shuttle {
    position: absolute;
    bottom: 0;
    width: 52px;
    background: #ff5353;
    height: 2px;
  }
}

.dark .x-group-tab {
  &::before {
    background: #434249;
  }
  li.active {
    color: #ecebeb;
  }
  li.shuttle {
    background: #53fffd;
  }
}
</style>
