<template>
  <transition :name="`arrow${noAnimate ? '-static' : ''}`">
    <div class="nb-bet-arrow-box flex-center">
      <icon-arrow :color="arrowColor" :size="size" :direction="type" />
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';

export default {
  inheritAttrs: false,
  name: 'BetArrowBox',
  props: {
    type: String,
    size: String,
    color: String,
    noAnimate: Boolean,
  },
  computed: {
    ...mapState('app', ['theme']),
    arrowColor() {
      let defColor = /black/i.test(this.theme) ? '#bababa' : '#C8C8CA';
      defColor = /blue/i.test(this.theme) ? '#666666' : defColor;
      return this.color || defColor;
    },
  },
};
</script>

<style lang="less">
.arrow-enter-active, .arrow-leave-active { transition: all 0.15s linear; }
.arrow-enter, .arrow-leave-active { transform: rotate(180deg); }
.nb-bet-arrow-box { width: .28rem; height: .28rem; }
</style>
