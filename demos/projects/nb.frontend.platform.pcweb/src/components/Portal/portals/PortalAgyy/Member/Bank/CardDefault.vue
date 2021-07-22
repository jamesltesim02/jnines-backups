<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-340, -209)" :fill="fill">
        <g transform="translate(10, 60)">
          <g transform="translate(330, 149)">
            <path :d="data"></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'CardDefault',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '11';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '11');
    },
    width() {
      const num = (15 / 11) * this.height;
      return parseInt(num * 1000, 10) / 1000;
    },
    fill() {
      return this.color || '#FF5353';
    },
    attrs() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        viewBox: '0 0 15 11',
        style: { width: `${this.width}px`, height: `${this.height}px` },
      };
    },
    data() {
      let dt = 'M14.685884,1.94250544 L6.47193929,10.6665106 C6.27790577,10.8724424 6.00992118,11 5.71395257,11 C5.41798396,11 ';
      dt += '5.14999937,10.8724424 4.95589543,10.6665106 L0.313928156,5.73520879 C0.12001202,5.53025813 0,5.24558399 ';
      dt += '0,4.93122819 C0,4.30251659 0.479907221,3.79370909 1.07092886,3.79370909 C1.36689747,3.79370909 1.63499944,3.921144 ';
      dt += '1.82903295,4.12712494 L5.71392909,8.25238557 L13.1709436,0.332434632 C13.3649771,0.127483972 13.6329617,0 ';
      dt += '13.9288833,0 C14.5197876,0 15,0.509739644 15,1.13739644 C15,1.4518013 14.8799176,1.7365245 14.685884,1.94250544 Z';
      return dt;
    },
  },
};
</script>
