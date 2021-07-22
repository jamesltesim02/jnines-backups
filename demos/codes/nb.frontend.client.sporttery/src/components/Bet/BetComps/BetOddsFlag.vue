<template>
  <svg v-bind="attrs" class="nb-bet-up-down" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
      <linearGradient id="oddslinear1" x1="50%" y1="5.48131442%" x2="50%" y2="96.4522484%">
        <stop stop-color="#FFD8D8" offset="0%"></stop>
        <stop stop-color="#FF6E6E" offset="100%"></stop>
      </linearGradient>
      <path id="oddspath1" :d="data"></path>
      <filter id="oddsfilter1" x="-75%" y="-41.4%" width="250%" height="224.1%" filterUnits="objectBoundingBox">
        <feOffset dx="0" dy="6" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
        <feGaussianBlur stdDeviation="5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
        <feColorMatrix values="0 0 0 0 0.981239371   0 0 0 0 0.353155576   0 0 0 0 0.353155576  0 0 0 1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
      </filter>
    </defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.8">
      <g transform="translate(-190, -8)" fill-rule="nonzero">
        <g transform="translate(199, 11)">
          <use fill="black" fill-opacity="1" filter="url(#oddsfilter1)" xlink:href="#oddspath1"></use>
          <use fill="url(#oddslinear1)" xlink:href="#oddspath1"></use>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetOddsFlag',
  props: {
    size: String,
  },
  computed: {
    height() {
      const size = this.size || '0.48';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.48');
    },
    width() {
      return parseInt(875 * this.height, 10) / 1000;
    },
    attrs() {
      return {
        width: `${this.width}rem`,
        height: `${this.height}rem`,
        viewBox: '0 0 42 48',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
    data() {
      let dt = 'M12,0 L0,17.0588235 L5.14285715,17.0588235 L5.14285715,20.4705882 L18.8571429,20.4705882 L18.8571429,17.0588235 ';
      dt += 'L24,17.0588235 L12,0 Z M5.14285712,25.5882353 L18.8571428,25.5882353 L18.8571428,22.1764706 L5.14285712,22.1764706 ';
      dt += 'L5.14285712,25.5882353 Z M5.14285712,29 L18.8571428,29 L18.8571428,27.2941176 L5.14285712,27.2941176 L5.14285712,29 Z';
      return dt;
    },
  },
};
</script>
