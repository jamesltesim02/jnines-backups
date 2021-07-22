<template>
  <svg v-bind="attrs" class="nb-bet-box-alert" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-102, -526)" :fill="fill" fill-rule="nonzero">
        <g transform="translate(10, 525)">
          <path :d="data"></path>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetBoxAlert',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '16';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '16');
    },
    width() {
      return this.height;
    },
    fill() {
      return this.color || '#fff';
    },
    attrs() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        viewBox: '0 0 16 16',
        style: { width: `${this.width}px`, height: `${this.height}px` },
      };
    },
    data() {
      let dt = 'M100,16 C103.865993,16 107,12.8659932 107,9 C107,5.13400675 103.865993,2 100,2 C96.1340068,2 ';
      dt += '93,5.13400675 93,9 C93,12.8659932 96.1340068,16 100,16 Z M100,17 C95.581722,17 92,13.418278 92,9 ';
      dt += 'C92,4.581722 95.581722,1 100,1 C104.418278,1 108,4.581722 108,9 C108,13.418278 104.418278,17 100,17 Z ';
      dt += 'M100,6 C100.552285,6 101,5.55228475 101,5 C101,4.44771525 100.552285,4 100,4 C99.4477153,4 99,4.44771525 ';
      dt += '99,5 C99,5.55228475 99.4477153,6 100,6 Z M100,7 C99.4477153,7 99,7.44771525 99,8 L99,13 C99,13.5522847 ';
      dt += '99.4477153,14 100,14 C100.552285,14 101,13.5522847 101,13 L101,8 C101,7.44771525 100.552285,7 100,7 Z';
      return dt;
    },
  },
};
</script>
