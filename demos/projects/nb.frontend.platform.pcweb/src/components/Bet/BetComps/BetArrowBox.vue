<template>
  <transition name="arrow">
    <div class="nb-bet-arrow-box flex-center">
      <icon-arrow :color="color" :size="size" :direction="type" />
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';

export default {
  inheritAttrs: false,
  name: 'BetArrowBox',
  props: { type: String, size: String },
  computed: {
    ...mapState('app', ['theme']),
    color() {
      return !/^white$/i.test(this.theme) ? '#bababa' : '#C8C8CA';
    },
  },
};
</script>

<style lang="less">
.arrow-enter-active, .arrow-leave-active { transition: all 0.15s linear; }
.arrow-enter, .arrow-leave-active { transform: rotate(180deg); }
.nb-bet-arrow-box { width: 35px; height: 35px; }
</style>
