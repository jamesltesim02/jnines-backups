<template>
  <svg :class="['icon-arrow', 'arrow-' + direction]" v-bind="attrs" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <path
        d="M4.48528137,12.4852814 L14.4852814,12.4852814 L14.4852814,14.4852814 L4.48528137,14.4852814 L2.48528137,14.4852814 L2.48528137,2.48528137 L4.48528137,2.48528137 L4.48528137,12.4852814 Z"
        :fill="color"
        transform="translate(8.485281, 8.485281) rotate(-315.000000) translate(-8.485281, -8.485281)"
      ></path>
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: '#fff',
    },
    direction: {
      type: String,
      default: 'left',
    },
    size: {
      type: String,
      default: '0.17',
    },
    height: {},
    width: {},
  },
  computed: {
    heightsb() {
      const size = this.size || '0.17';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return `${+(arr ? arr[1] : '0.17') || 0.11}rem`;
    },
    widthsb() {
      const num = (11 / 17) * this.height;
      return `${parseInt(num * 1000, 10) / 1000 || 0.17}rem`;
    },
    attrs() {
      return {
        width: this.width || this.widthsb,
        height: this.height || this.heightsb,
        viewBox: '0 0 11 17',
        style: {
          width: this.width || this.widthsb,
          height: this.height || this.heightsb,
        },
      };
    },
  },
};
</script>
<style lang="less">
.icon-arrow {
  transition: transform 0.25s ease-out;
}
.arrow-right {
  transform: rotate(-180deg);
}
.arrow-up {
  transform: rotate(-270deg);
}
.arrow-down {
  transform: rotate(-90deg);
}
</style>
