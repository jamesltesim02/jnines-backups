<template>
  <svg v-bind="attrs" class="nb-bet-box-alert" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-54, -4)" :fill="fill" >
        <path :d="data"></path>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetOddsUp',
  props: { size: String, color: String, down: Boolean },
  computed: {
    height() {
      const size = this.size || '0.17';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.17');
    },
    width() {
      const num = (16 / 17) * this.height;
      return parseInt(num * 1000, 10) / 1000;
    },
    fill() {
      return this.color || `${this.down ? '#32BF67' : '#ff5353'}`;
    },
    attrs() {
      const obj = { width: `${this.width}rem`, height: `${this.height}rem`, viewBox: '0 0 16 17' };
      obj.style = { width: `${this.width}rem`, height: `${this.height}rem`, transform: `rotate(${this.down ? -180 : 0}deg)` };
      return obj;
    },
    data() {
      let dt = 'M62,20.4042553 C57.581722,20.4042553 54,16.8225333 54,12.4042553 C54,7.98597732 57.581722,4.40425532 62,4.40425532 C66.418278,4.40425532 ';
      dt += '70,7.98597732 70,12.4042553 C70,16.8225333 66.418278,20.4042553 62,20.4042553 Z M62.8320503,9.65233076 C62.7588154,9.54247847 62.6645525,';
      dt += '9.44821552 62.5547002,9.37498066 C62.0951715,9.0686282 61.4743022,9.19280207 61.1679497,9.65233076 L59.0364668,12.8495551 C58.9269551,';
      dt += '13.0138226 58.8685171,13.2068303 58.8685171,13.4042553 C58.8685171,13.9565401 59.3162323,14.4042553 59.8685171,14.4042553 L64.1314829,';
      dt += '14.4042553 C64.3289079,14.4042553 64.5219156,14.3458173 64.6861831,14.2363056 C65.1457118,13.9299532 65.2698857,13.3090838 64.9635332,';
      dt += '12.8495551 L62.8320503,9.65233076 Z';
      return dt;
    },
  },
};
</script>
