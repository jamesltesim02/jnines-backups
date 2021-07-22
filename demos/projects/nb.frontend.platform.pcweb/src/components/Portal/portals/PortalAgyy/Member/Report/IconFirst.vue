<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-944, -394)">
        <g transform="translate(920, 383)">
          <g transform="translate(25, 11)">
            <path d="M0.5,2 L0.5,12" :stroke="fill" stroke-width="2" stroke-linecap="square"></path>
            <polygon :fill="fill" transform="translate(4.5, 7) rotate(-90) translate(-4.5, -7)" points="4.5 4 11 10 -2 10"></polygon>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'IconFirst',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '14';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '14');
    },
    width() {
      const num = (9 / 14) * this.height;
      return parseInt(num * 1000, 10) / 1000;
    },
    fill() {
      return this.color || '#716D6D';
    },
    attrs() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        viewBox: '0 0 9 14',
        style: { width: `${this.width}px`, height: `${this.height}px` },
      };
    },
  },
};
</script>
