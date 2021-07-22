<template>
  <div
    class="channels"
    :class="[`cols-${cols}`]"
  >
    <ul>
      <v-touch
        v-for="(c, i) in list"
        :key="i"
        tag="li"
        :class="{active: c === value}"
        @tap="$emit('update', c)"
      >{{$t(`payment.channel.${c.key}`)}}</v-touch>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    cols: {
      type: Number,
      default: 3,
    },
    type: {},
    value: {
      type: Object,
      default: () => {},
    },
    custChannels: {},
  },
  computed: {
    ...mapState('payment', ['channels', 'types']),
    list() {
      if (this.custChannels && this.custChannels) {
        return this.custChannels;
      }
      const cr = this.channels[this.type] || this.channels[this.types[0]];
      return cr.map(({ key, result }) => ({ key, ...result }));
    },
  },
  mounted() {
    this.$emit('update', this.list[0]);
  },
};
</script>
<style lang="less">
.channels {
  padding: .05rem .1rem .15rem .15rem;
  ul {
    display: flex;
    flex-wrap: wrap;
  }
  li {
    margin-top: .08rem;
    text-align: center;
    line-height: .38rem;
    height: .4rem;
    border-radius: 6px;
    border: 1px solid #ff5353;
    color: #ff5353;
    font-size: .14rem;
    transition: all .3s;
  }
  li.active {
    color: #fff;
    background: #ff5353;
  }
  &.cols-3 li {
    width: 1.08rem;
    margin-right: .08rem;
  }
  &.cols-3 li:nth-child(3n) {
    margin-right: 0;
  }
  &.cols-2 li {
    width: 1.58rem;
  }
  &.cols-2 li:nth-child(odd) {
    margin-right: .3rem;
  }
}

.black .channels {
  background: #232227;
  li {
    border-color:#2E2D33;
    color: #909090;
  }
  li.active {
    color: #ff5353;
    border-color: #ff5353;
    background: transparent;
  }
}
</style>
