<template>
  <svg v-bind="attrs" version="1.1">
    <defs>
      <linearGradient x1="30.9041516%" y1="-20.0451879%" x2="72.8885491%" y2="80.2186754%" id="live-color-1">
        <stop stop-color="#c6c4c4" offset="0%"></stop>
        <stop stop-color="#c6c4c4" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="-20.0451879%" x2="72.8885491%" y2="80.2186754%" id="live-color-2">
        <stop stop-color="#777777" offset="0%"></stop>
        <stop stop-color="#777777" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="-20.0451879%" x2="72.8885491%" y2="80.2186754%" id="live-color-3">
        <stop stop-color="#ff5353" offset="0%"></stop>
        <stop stop-color="#ff5353" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="-20.0451879%" x2="72.8885491%" y2="80.2186754%" id="live-color-4">
        <stop stop-color="#00FFD8" offset="0%"></stop>
        <stop stop-color="#00E5FE" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <rect :stroke="stroke" :fill="fillOne" x="0.5" y="0.5" width="17" height="17" rx="2.65" ry="2.65" />
      <text :fill="fillTwo" font-family="PingFangSC-Medium, PingFang SC" font-size="11" font-weight="400" letter-spacing="-0.2122353" >
        <tspan x="3.60611765" y="12.5">滚</tspan>
      </text>
    </g>
  </svg>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props: { size: String, live: Boolean },
  computed: {
    ...mapState('app', ['theme']),
    height() {
      const size = this.size || '0.18';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.18');
    },
    width() {
      return this.height;
    },
    stroke() {
      const defAct = /white/i.test(this.theme) ? 3 : 4;
      const defNor = /white/i.test(this.theme) ? 1 : 2;
      return `url(#live-color-${this.live ? defAct : defNor})`;
    },
    fillOne() {
      return /white/i.test(this.theme) && this.live ? '#ff5353' : 'none';
    },
    fillTwo() {
      const defAct = /white/i.test(this.theme) ? '#ffffff' : '#53FFFD';
      const defNor = /white/i.test(this.theme) ? '#c6c4c4' : '#777777';
      return this.live ? defAct : defNor;
    },
    attrs() {
      return {
        width: `${this.width}rem`,
        height: `${this.height}rem`,
        viewBox: '0 0 18 18',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
  },
};
</script>
