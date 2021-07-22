<template>
  <svg v-bind="attrs" class="nb-icon-close" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g class="nb-icon-close" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g class="nb-icon-close" transform="translate(-1882, -20)" :fill="fill" fill-rule="nonzero">
        <g class="nb-icon-close" transform="translate(1882, 20)">
          <polygon class="nb-icon-close" points="2.60428366e-15 16.607731 16.607731 0 18 1.39226897 1.39226897 18"></polygon>
          <polygon class="nb-icon-close" points="16.607731 18 0 1.39226897 1.39226897 0 18 16.607731"></polygon>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'IconClose',
  props: {
    size: String,
    color: String,
  },
  computed: {
    height() {
      const size = this.size || '18';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '18');
    },
    width() {
      return this.height;
    },
    fill() {
      return this.color || '#EAEAEA';
    },
    attrs() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        viewBox: '0 0 18 18',
        style: { width: `${this.width}px`, height: `${this.height}px` },
      };
    },
  },
};
</script>
