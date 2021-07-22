<template>
  <ul class="channels">
    <li
      v-for="c in channels"
      :key="c.key"
      @click="$emit('change', c)"
      :class="{active: c === channel}"
    >
      <div class="icon">
        <icon-channel :channel="c.key" />
      </div>
      <span>
        {{$t(`agPage.payment.channel.${c.key}`)}}
      </span>
      <choose-flag :active="c === channel" />
    </li>
  </ul>
</template>
<script>
import ChooseFlag from '@/components/common/ChooseFlag';
import IconChannel from './icons/IconChannel';

export default {
  model: {
    prop: 'channel',
    event: 'change',
  },
  props: ['channels', 'channel'],
  components: {
    IconChannel,
    ChooseFlag,
  },
  mounted() {
    this.$emit('change', this.channels[0]);
  },
};
</script>
<style lang="less">
.channels {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  li {
    position: relative;
    display: flex;
    height: 50px;
    line-height: 48px;
    border-radius: 6px;
    box-shadow: 0 10px 10px 0 rgba(37, 37, 37, 0.08);
    background-image: linear-gradient(to bottom, #323237, #29292e);
    border: 1px solid #3a3a3a;
    margin-left: 10px;
    padding: 0 10px;
    overflow: hidden;
    cursor: pointer;
    .icon {
      position: relative;
      width: 50px;
      img {
        position: absolute;
        top: 50%;
        max-width: 38px;
        max-height: 38px;
        transform: translateY(-50%);
      }
    }
    span {
      white-space: nowrap;
      font-size: 14px;
    }
  }
}
</style>
