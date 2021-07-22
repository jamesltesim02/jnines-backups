<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
      <ellipse id="rank_two_1" cx="6.36363636" cy="11.9829545" rx="6.36363636" ry="6.15340909"></ellipse>
      <filter x="-30.6%" y="-35.8%" width="161.3%" height="163.4%" filterUnits="objectBoundingBox" id="rank_two_2">
        <feMorphology radius="0.65" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
        <feOffset dx="0" dy="-0.5" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
        <feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
        <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite>
        <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
      </filter>
      <linearGradient x1="18.7754451%" y1="15.6035211%" x2="59.493421%" y2="60.6585921%" id="rank_two_3">
        <stop stop-color="#C8E7EA" offset="0%"></stop>
        <stop stop-color="#FFF7D6" stop-opacity="0.6" offset="100%"></stop>
      </linearGradient>
      <path d="M1.55598285,15.2061688 C0.973983716,14.3169855 0.636363636,13.2586874 0.636363636,12.1229002 C0.636363636,8.97083674 3.23666827,6.41558442 6.44430659,6.41558442 C7.32551158,6.41558442 8.16088017,6.6084332 8.90909091,6.95352523 C5.26140818,8.16243671 2.44131401,11.2967055 1.55598285,15.2061688 Z" id="rank_two_4"></path>
      <filter x="-120.9%" y="-91.0%" width="341.8%" height="327.5%" filterUnits="objectBoundingBox" id="rank_two_5">
        <feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
        <feGaussianBlur stdDeviation="3" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
        <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite>
        <feColorMatrix values="0 0 0 0 0.374348942   0 0 0 0 0.615472832   0 0 0 0 0.631029212  0 0 0 1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
      </filter>
    </defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(5, 0)">
        <g transform="translate(1.060606, 0.323864)">
          <path d="M1,1.77635684e-15 L9.60606061,1.77635684e-15 C10.1583454,1.67490378e-15 10.6060606,0.44771525 10.6060606,1 L10.6060606,4.86930378 C10.6060606,5.23644612 10.4048747,5.57406588 10.0819763,5.74879469 L5.3030303,8.33480823 L0.524084308,5.74879469 C0.201185954,5.57406588 4.8905118e-16,5.23644612 0,4.86930378 L0,1 C-1.78657678e-16,0.44771525 0.44771525,1.8778099e-15 1,1.77635684e-15 Z" fill="#1479E1"></path>
          <polygon fill="#4BBEF4" points="3.31439394 2.66453526e-15 7.29166667 2.66453526e-15 7.29166667 7.28693182 5.3030303 8.33480823 3.31439394 7.28693182"></polygon>
        </g>
        <g>
          <use fill="black" fill-opacity="1" filter="url(#rank_two_2)" xlink:href="#rank_two_1"></use>
          <use stroke="#819EA2" stroke-width="1.3" fill="#B1CFD2" fill-rule="evenodd" xlink:href="#rank_two_1"></use>
        </g>
        <g transform="translate(0.636364, 6.415584)"></g>
        <g opacity="0.3">
          <use fill="black" fill-opacity="1" filter="url(#rank_two_5)" xlink:href="#rank_two_4"></use>
          <use fill-opacity="0.7" fill="url(#rank_two_3)" fill-rule="evenodd" xlink:href="#rank_two_4"></use>
        </g>
        <text font-family="PingFangTC-Regular, PingFang TC" font-size="9" font-weight="normal" letter-spacing="-0.1845" fill="#59787B">
          <tspan x="3.8" y="15.7">2</tspan>
        </text>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'RankTwo',
  props: { size: String },
  computed: {
    height() {
      const size = this.size || '0.22';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.22');
    },
    width() {
      const num = (21 / 22) * this.height;
      return parseInt(num * 1000, 10) / 1000;
    },
    attrs() {
      return {
        width: `${this.width}rem`,
        height: `${this.height}rem`,
        viewBox: '0 0 21 22',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
  },
};
</script>
