<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-14, -396)">
        <g transform="translate(14, 396)">
          <rect x="0.5" y="0.5" width="15" height="15" rx="2"></rect>
          <path :d="data" fill-rule="nonzero" v-if="select"></path>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'PublishSelect',
  props: { size: String, select: Boolean },
  computed: {
    height() {
      const size = this.size || '0.16';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.16');
    },
    width() {
      return this.height;
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
      let dt = 'M4.08488305,8.02463574 L6.63640721,10.056365 L12.9861005,4.20489839 C12.9861005,4.20489839 13.4131518,3.81666986 ';
      dt += '13.7841258,4.11862538 C13.8941238,4.20921204 14.0235334,4.47018788 13.7345188,4.87351419 L7.10443827,12.6445552 ';
      dt += 'C7.10443827,12.6445552 6.59542753,13.3390529 5.99151649,12.6359279 L3.13156633,8.77305406 C3.13156633,8.77305406 ';
      dt += '2.79294479,8.25110238 3.21568252,7.9362059 C3.3601898,7.83052147 3.6858704,7.66660276 4.08488305,8.02463574 ';
      dt += 'L4.08488305,8.02463574 L4.08488305,8.02463574 Z';
      return dt;
    },
  },
};
</script>
