<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-22, -640)" :fill="fill" fill-rule="nonzero">
        <path :d="data"></path>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'PublishSendAlert',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '0.16';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.16');
    },
    width() {
      return this.height;
    },
    fill() {
      return this.color || '#ff5353';
    },
    attrs() {
      return {
        width: `${this.width}rem`,
        height: `${this.height}rem`,
        viewBox: '0 0 16 16',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
    data() {
      let dt = 'M30,655 C33.8659932,655 37,651.865993 37,648 C37,644.134007 33.8659932,641 30,641 C26.1340068,641 23,644.134007 23,648 ';
      dt += 'C23,651.865993 26.1340068,655 30,655 Z M30,656 C25.581722,656 22,652.418278 22,648 C22,643.581722 25.581722,640 30,640 ';
      dt += 'C34.418278,640 38,643.581722 38,648 C38,652.418278 34.418278,656 30,656 Z M30,645 C30.5522847,645 31,644.552285 31,644 ';
      dt += 'C31,643.447715 30.5522847,643 30,643 C29.4477153,643 29,643.447715 29,644 C29,644.552285 29.4477153,645 30,645 Z M30,646 ';
      dt += 'C29.4477153,646 29,646.447715 29,647 L29,652 C29,652.552285 29.4477153,653 30,653 C30.5522847,653 31,652.552285 31,652 ';
      dt += 'L31,647 C31,646.447715 30.5522847,646 30,646 Z';
      return dt;
    },
  },
};
</script>
