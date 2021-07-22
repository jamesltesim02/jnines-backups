<template>
<svg width=".24rem" height=".24rem" viewBox="0 0 24 24">
  <defs>
    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="over-watch-color-1">
      <stop stop-color="#BFBFBF" stop-opacity="0.7" offset="0%"></stop>
      <stop stop-color="#8A8A8A" stop-opacity="0.7" offset="100%"></stop>
    </linearGradient>
    <linearGradient x1="24.1422287%" y1="3.88141257%" x2="99.2251648%" y2="99.0182144%" id="over-watch-color-2">
      <stop stop-color="#E5EBF1" stop-opacity="0.4" offset="0%"></stop>
      <stop stop-color="#B8BCBF" stop-opacity="0.24" offset="100%"></stop>
    </linearGradient>
  </defs>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" >
    <g class="main-fill" transform="translate(-224, -247)" :fill="`url(#over-watch-color-${/blue/i.test(theme) ? 2 : 1})`" >
      <g transform="translate(10, 218)">
        <g transform="translate(5, 0)">
          <g transform="translate(209, 0)">
            <path d="M12,29 C5.372583,29 7.77156117e-16,34.372583 0,41 C-7.77156117e-16,47.627417 5.372583,53 12,53 C18.627417,53 24,47.627417 24,41 C24,34.372583 18.627417,29 12,29 Z M5.75,44.4686624 L6.97957749,45.9 L9.97486441,42.918123 L9.97486441,39.1 L8.96227119,41.3290723 L5.75,44.4686624 Z M6.63283431,47.6394242 L4,44.5775358 L8.493281,40.1850826 L11.2279809,34 L11.2279809,43.065324 L6.63283431,47.6394242 Z M17.9779809,44.4686624 L14.7657097,41.3290723 L13.7531165,39.1 L13.7531165,42.918123 L16.7484034,45.9 L17.9779809,44.4686624 Z M17.0951466,47.6394242 L12.5,43.065324 L12.5,34 L15.2346999,40.1850826 L19.7279809,44.5775358 L17.0951466,47.6394242 Z"></path>
          </g>
        </g>
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
