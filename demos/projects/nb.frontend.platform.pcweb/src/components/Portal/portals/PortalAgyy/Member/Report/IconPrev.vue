<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-969, -395)" :fill="fill">
        <g transform="translate(920, 383)">
          <g transform="translate(49, 12)">
            <polygon transform="translate(3, 6.5) rotate(-90) translate(-3, -6.5)" points="3 3.5 9.5 9.5 -3.5 9.5"></polygon>
            <polygon transform="translate(9, 6.5) rotate(-90) translate(-9, -6.5)" points="9 3.5 15.5 9.5 2.5 9.5"></polygon>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'IconPrev',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '13';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '13');
    },
    width() {
      const num = (12 / 13) * this.height;
      return parseInt(num * 1000, 10) / 1000;
    },
    fill() {
      return this.color || '#716D6D';
    },
    attrs() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        viewBox: '0 0 12 13',
        style: { width: `${this.width}px`, height: `${this.height}px` },
      };
    },
  },
};
</script>
