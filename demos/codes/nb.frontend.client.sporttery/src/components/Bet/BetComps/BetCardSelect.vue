<template>
  <svg v-bind="attrs" class="nb-bet-box-alert" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-338, -405)" :fill="fill" fill-rule="nonzero">
        <path :d="data"></path>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetBoxAlert',
  props: { size: String, color: String, opacity: String },
  computed: {
    height() {
      const size = this.size || '0.14';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.14');
    },
    width() {
      const num = (17 / 14) * this.height;
      return parseInt(num * 1000, 10) / 1000;
    },
    fill() {
      return this.color || '#FFFFFF';
    },
    attrs() {
      return {
        width: `${this.width}rem`,
        height: `${this.height}rem`,
        viewBox: '0 0 17 14',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
    data() {
      let dt = 'M344.648171,418.179377 C344.648171,418.179377 347.140292,414.359131 350.005948,411.055797 C352.218861,408.505194 ';
      dt += '354.976984,406.271529 354.976984,406.271529 L354.401589,405 C354.401589,405 351.130327,406.80542 ';
      dt += '348.479736,409.023992 C345.791415,411.272749 343.723766,413.936546 343.723766,413.936546 ';
      dt += 'L339.662043,410.914307 L338,412.31978 L344.648171,418.179377 L344.648171,418.179377 Z';
      return dt;
    },
  },
};
</script>
