<template>
  <transition name="arrow">
    <div class="nb-bet-arrow-box flex-center">
      <icon-arrow :color="color" :direction="type" />
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import IconArrow from '@/components/common/icons/IconArrow';

export default {
  inheritAttrs: false,
  name: 'BetArrowBox',
  props: {
    type: String,
  },
  computed: {
    ...mapState('app', {
      theme: state => state.theme,
    }),
    color() {
      return /black/i.test(this.theme) ? '#bababa' : '#C8C8CA';
    },
  },
  components: {
    IconArrow,
  },
};
</script>

<style lang="less">
.arrow-enter-active, .arrow-leave-active {
  transition: all 0.15s linear;
}
.arrow-enter, .arrow-leave-active {
  transform: rotate(180deg);
}
.nb-bet-arrow-box {
  width: .28rem;
  height: .28rem;
}
</style>
