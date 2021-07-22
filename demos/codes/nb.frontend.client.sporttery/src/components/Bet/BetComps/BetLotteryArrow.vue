<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-175, -293)" :fill="fill" fill-rule="nonzero">
        <g transform="translate(183.5, 295.5) scale(-1, 1) translate(-183.5, -295.5) translate(175, 293)">
          <polygon points="16.2797741 3.28817852 3.27977411 3.28817852 3.27977411 1.64829147 16.2797741 1.64829147 16.2797741 3.28817852"></polygon>
          <polygon points="4.13251538 4.92806558 0 2.50103273 4.13251538 0.0084044117"></polygon>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetLotteryArrow',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '0.05';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.05');
    },
    width() {
      return 3.4 * this.height;
    },
    fill() {
      return this.color || '#FF5353';
    },
    attrs() {
      return {
        width: `${this.width}rem`,
        height: `${this.height}rem`,
        viewBox: '0 0 17 5',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
  },
};
</script>
