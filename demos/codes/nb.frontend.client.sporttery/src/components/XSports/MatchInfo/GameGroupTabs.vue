<template>
<div :class="{
  'x-game-group-tabs': true,
  disabled: groups.length === 1 && groups[0] === 'others'
}">
  <ul ref="container">
    <li
      ref="shuttle"
      class="shuttle"
      :style="{
        left: `${shuttleLeft}px`,
      }"
    ></li>
    <v-touch
      tag="li"
      v-for="group in groups"
      :key="group"
      @tap="$emit('change', group)"
    >{{$t(`common.groups.${group}`)}}</v-touch>
  </ul>
</div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {},
    groups: {
      type: Array,
      default: () => [],
    },
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
  watch: {
    groups: {
      deep: true,
      handler: 'initShuttle',
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
.x-game-group-tabs {
  height: .3rem;
  border-bottom: 1px solid #ecebeb;
  background: #f3f2f3;
  &.disabled {
    height: 0;
    overflow: hidden;
  }
  ul {
    position: relative;
    font-size: .12rem;
    display: flex;
    line-height: .28rem;
    text-align: center;
    font-weight: 500;
    letter-spacing: -0.35px;
  }
  li {
    width: 100%;
    color: #2e2f34;
    transition: all .25s ease-out;
  }
  li.shuttle {
    position: absolute;
    bottom: 0;
    left: .1rem;
    height: 1px;
    width: .26rem;
    background: #ff5353;
  }
}
.blue .x-game-group-tabs {
  border: 1px solid #2e2f34;
  background: linear-gradient(to bottom, #24242a, rgb(29, 29, 33));
  li { color: #bababa; }
  li.shuttle { background: #53fffd; }
}
</style>
