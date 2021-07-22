<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <polygon :fill="fill" points="48.87 50.7 81.86 50.7 3.05 145.39 29.32 78.72 0 78.72 29.32 0 86.14 0 48.87 50.7"/>
  </svg>
</template>

<script>
import { mapState } from 'vuex';

export default {
  inheritAttrs: false,
  name: 'BetFastFlag',
  props: { size: String },
  computed: {
    ...mapState('app', ['theme']),
    height() {
      const size = this.size || '0.13';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.13');
    },
    width() {
      const num = (86.14 / 145.39) * this.height;
      return parseInt(num * 1000, 10) / 1000;
    },
    fill() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_LIVE_FLAG_COLOR ? pSet.BLACK_LIVE_FLAG_COLOR : '#FF5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_LIVE_FLAG_COLOR ? pSet.BLUE_LIVE_FLAG_COLOR : '#FF5353';
      }
      return pSet && pSet.WHITE_LIVE_FLAG_COLOR ? pSet.WHITE_LIVE_FLAG_COLOR : '#FF5353';
    },
    attrs() {
      return {
        width: `${this.width}rem`,
        height: `${this.height}rem`,
        viewBox: '0 0 86.14 145.39',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
  },
};
</script>
