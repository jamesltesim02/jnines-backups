<template>
  <svg width=".26rem" height=".26rem" style="width:.26rem;height:.26rem" viewBox="0 0 26 26" version="1.1" >
    <defs>
      <linearGradient x1="20.8835821%" y1="26.1621094%" x2="68.0169072%" y2="85.8544922%" id="linearGradient-1" >
        <stop stop-color="#F7F7F7" offset="0%"></stop>
        <stop stop-color="#ECEBEB" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="29.5262%" y1="11.0438651%" x2="66.9787332%" y2="85.8544922%" id="linearGradient-2" >
        <stop stop-color="#00E5FE" stop-opacity="0.2" offset="0%"></stop>
        <stop stop-color="#00E5FE" stop-opacity="0.08" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="-20.0451879%" x2="72.8885491%" y2="80.2186754%" id="linearGradient-3">
        <stop stop-color="#979797" offset="0%"></stop>
        <stop stop-color="#979797" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="30.9041516%" y1="-20.0451879%" x2="72.8885491%" y2="80.2186754%" id="linearGradient-4">
        <stop stop-color="#00FFD8" offset="0%"></stop>
        <stop stop-color="#00E5FE" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="0%" y1="48.6472553%" x2="50%" y2="53.6951843%" id="linearGradient-5">
        <stop stop-color="#979797" offset="0%"></stop>
        <stop stop-color="#979797" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="0%" y1="48.6472553%" x2="50%" y2="53.6951843%" id="linearGradient-6">
        <stop stop-color="#0BFFDA" offset="0%"></stop>
        <stop stop-color="#00E5FE" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-337, -29)">
        <g transform="translate(337, 30)">
          <path
            d="M10,22 C15.5228475,22 17.5332031,17.5228475 17.5332031,12 C17.5332031,6.4771525 15.5228475,2 10,2 C4.4771525,2 3.01980663e-14,6.4771525 3.01980663e-14,12 C3.01980663e-14,17.5228475 4.4771525,22 10,22 Z"
            :fill="`url(#linearGradient-${/blue/i.test(theme) ? 2 : 1})`"
          ></path>
          <path
            d="M19.8756755,2.16384873 C17.9284625,0.800176691 15.5576769,0 13,0 C6.372583,0 1,5.372583 1,12 C1,18.627417 6.372583,24 13,24 L13,24 C19.627417,24 25,18.627417 25,12 C25,9.96100678 24.4914588,8.04078971 23.5942918,6.35926402"
            :stroke="`url(#linearGradient-${/blue/i.test(theme) ? 4 : 3})`"
            stroke-width="1.5"
          ></path>
          <rect :stroke="`url(#linearGradient-${/blue/i.test(theme) ? 6 : 5})`" stroke-width="1" x="6.75" y="8.75" width="12.5" height="1" rx="0.5" ></rect>
          <rect :stroke="`url(#linearGradient-${/blue/i.test(theme) ? 6 : 5})`" stroke-width="1" x="6.75" y="11.75" width="12.5" height="1" rx="0.5" ></rect>
          <rect :stroke="`url(#linearGradient-${/blue/i.test(theme) ? 6 : 5})`" stroke-width="1" x="6.75" y="14.75" width="12.5" height="1" rx="0.5" ></rect>
        </g>
      </g>
    </g>
  </svg>
</template>
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('app', ['theme']),
  },
};
</script>
