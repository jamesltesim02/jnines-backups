<template>
  <transition :name="animate ? 'box-cover' : 'box-none'">
    <div class="nb-bet-cover-box" :style="{ 'z-index': index }" v-if="show"></div>
  </transition>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetBoxCover',
  props: {
    index: Number,
    show: Boolean,
    animate: Boolean,
  },
};
</script>

<style lang="less">
.box-cover-enter-active, .box-cover-leave-active {
  transition: all 0.15s ease-out;
}
.box-cover-enter, .box-cover-leave-active {
  background: rgba(0, 0, 0, 0);
}
.nb-bet-cover-box {
  position: fixed;
  width: 3.75rem;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
}
</style>
