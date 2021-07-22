<template>
  <transition :name="animate ? 'box-body' : 'box-none'">
    <div class="nb-bet-body-box flex-center" :style="{ 'z-index': index }" v-if="show">
      <div class="nb-bet-body-box-posit"><slot /></div>
    </div>
  </transition>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetBoxBody',
  props: {
    index: Number,
    show: Boolean,
    animate: Boolean,
  },
};
</script>

<style lang="less">
.box-body-enter-active, .box-body-leave-active {
  transition: all .15s ease-out;
}
.box-body-enter, .box-body-leave-active {
  bottom: translateY(3rem);
}
.nb-bet-body-box {
  position: fixed;
  width: 3.75rem;
  left: 50%;
  transform: translateX(-50%);
  .nb-bet-body-box-posit {
    position: relative;
    width: 3.75rem;
  }
}
</style>
