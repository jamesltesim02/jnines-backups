<template>
  <svg v-bind="attrs" version="1.1">
    <defs>
      <linearGradient x1="30.9041516%" y1="0.543684074%" x2="72.8885491%" y2="71.3362888%" id="tv-color-1">
        <stop stop-color="#bababa" offset="0%"></stop>
        <stop stop-color="#bababa" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="0.543684074%" x2="72.8885491%" y2="71.3362888%" id="tv-color-2">
        <stop stop-color="#777777" offset="0%"></stop>
        <stop stop-color="#777777" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="0.543684074%" x2="72.8885491%" y2="71.3362888%" id="tv-color-3">
        <stop stop-color="#ff5353" offset="0%"></stop>
        <stop stop-color="#ff5353" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="0.543684074%" x2="72.8885491%" y2="71.3362888%" id="tv-color-4">
        <stop stop-color="#00FFD8" offset="0%"></stop>
        <stop stop-color="#00E5FE" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="29.051429%" x2="72.8885491%" y2="59.0375668%" id="tv-color-5">
        <stop stop-color="#bababa" offset="0%"></stop>
        <stop stop-color="#bababa" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="29.051429%" x2="72.8885491%" y2="59.0375668%" id="tv-color-6">
        <stop stop-color="#777777" offset="0%"></stop>
        <stop stop-color="#777777" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="29.051429%" x2="72.8885491%" y2="59.0375668%" id="tv-color-7">
        <stop stop-color="#ff5353" offset="0%"></stop>
        <stop stop-color="#ff5353" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="29.051429%" x2="72.8885491%" y2="59.0375668%" id="tv-color-8">
        <stop stop-color="#00FFD8" offset="0%"></stop>
        <stop stop-color="#00E5FE" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g fill-rule="nonzero" >
        <path :d="dataOne" :fill="fillOne"></path>
        <path :d="dataTwo" :fill="fillTwo"></path>
      </g>
    </g>
  </svg>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props: { size: String, live: Boolean },
  computed: {
    ...mapState('app', ['theme']),
    height() {
      const size = this.size || '0.17';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.17');
    },
    width() {
      const num = (20 / 17) * this.height;
      return parseInt(num * 1000, 10) / 1000;
    },
    attrs() {
      return {
        width: `${this.width}rem`,
        height: `${this.height}rem`,
        viewBox: '0 0 20 17',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
    fillOne() {
      const defAct = /white/i.test(this.theme) ? 3 : 4;
      const defNor = /white/i.test(this.theme) ? 1 : 2;
      return `url(#tv-color-${this.live ? defAct : defNor})`;
    },
    fillTwo() {
      const defAct = /white/i.test(this.theme) ? 7 : 8;
      const defNor = /white/i.test(this.theme) ? 5 : 6;
      return `url(#tv-color-${this.live ? defAct : defNor})`;
    },
    dataOne() {
      let dt = 'M15.0856931,15.8 L5.02857143,15.8 C4.71997404,15.8 4.46979889,16.0465881 4.46979889,16.3507817 C4.46979889,16.6549544 4.71997404,';
      dt += '16.9015426 5.02857143,16.9015426 L15.0856931,16.9015426 C15.3942905,16.9015426 15.6444656,16.6549544 15.6444656,16.3507817 C15.6444656,';
      dt += '16.046609 15.3942905,15.8 15.0856931,15.8 Z M18.4381376,0 L1.67610571,0 C0.750737364,0.00106522063 0.000890001391,0.740223907 0,';
      dt += '1.65224075 L0,12.6665803 C0.00103833496,13.5785972 0.750822126,14.3176514 1.67604214,14.318654 L18.43818,14.318654 C19.3634636,14.3176305 ';
      dt += '20.1132686,13.5785972 20.1142857,12.666643 L20.1142857,1.65230341 C20.1133533,0.740182134 19.363506,0.00106522063 18.4382436,0 L18.4381376,';
      dt += '0 Z M18.9969313,12.6666012 C18.9967194,12.9706904 18.7466714,13.2171532 18.43818,13.2173621 L1.6761269,13.2173621 C1.36761428,13.2171532 ';
      dt += '1.11756627,12.9706904 1.11733317,12.6666221 L1.11733317,1.6523243 C1.11754508,1.34823514 1.36759309,1.10177232 1.67608452,1.10156346 ';
      dt += 'L18.4381376,1.10156346 C18.7466502,1.10177232 18.9966983,1.34823514 18.9969313,1.65230341 L18.9969313,12.6666012 Z';
      return dt;
    },
    dataTwo() {
      let dt = 'M9.24496983,4.34782609 L4.91407843,4.34782609 C4.61507129,4.34782609 4.37267081,4.62619597 4.37267081,4.96957226 C4.37267081,5.31294856 ';
      dt += '4.61507129,5.59131843 4.91407843,5.59131843 L6.53809598,5.59131843 L6.53809598,9.94309365 C6.53809598,10.2864699 6.78049646,10.5648398 ';
      dt += '7.0795036,10.5648398 C7.37851073,10.5648398 7.62093175,10.2864699 7.62093175,9.94309365 L7.62093175,5.59131843 L9.2449493,5.59131843 ';
      dt += 'C9.54395643,5.59131843 9.78637745,5.31294856 9.78637745,4.96957226 C9.78637745,4.62619597 9.54397697,4.34782609 9.2449493,4.34782609 ';
      dt += 'L9.24496983,4.34782609 Z M15.4421355,4.41339839 C15.3715671,4.37211213 15.2882484,4.34787324 15.1999814,4.34787324 C14.9890154,4.34787324 ';
      dt += '14.8061987,4.48616219 14.7164329,4.68809 L13.0346589,8.55280045 L11.3533161,4.69157964 C11.2624416,4.48616219 11.0797686,4.34787324 ';
      dt += '10.8690079,4.34787324 C10.5699597,4.34787324 10.3275182,4.6262667 10.3275182,4.96971373 C10.3275182,5.07105489 10.3486456,5.16680791 ';
      dt += '10.3861164,5.25136105 L12.5503507,10.2213928 C12.6411842,10.4268574 12.8238777,10.5652171 13.0346589,10.5652171 C13.2454402,10.5652171 ';
      dt += '13.4280926,10.4268574 13.5175504,10.2249296 L15.6843923,5.24782425 C15.720467,5.16678433 15.7416149,5.07107847 15.7416149,4.96966658 ';
      dt += 'C15.7416149,4.7275607 15.6211128,4.51780478 15.4452359,4.41509606 L15.4421355,4.41339839 Z';
      return dt;
    },
  },
};
</script>
