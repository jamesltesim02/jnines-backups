<template>
<svg width=".25rem" height=".24rem" viewBox="0 0 25 24" >
  <defs>
    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="lol-color-1">
      <stop stop-color="#BFBFBF" stop-opacity="0.7" offset="0%"></stop>
      <stop stop-color="#8A8A8A" stop-opacity="0.7" offset="100%"></stop>
    </linearGradient>
    <linearGradient x1="24.1422287%" y1="3.88141257%" x2="99.2251648%" y2="99.0182144%" id="lol-color-2">
      <stop stop-color="#E5EBF1" stop-opacity="0.4" offset="0%"></stop>
      <stop stop-color="#B8BCBF" stop-opacity="0.24" offset="100%"></stop>
    </linearGradient>
  </defs>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" >
    <g class="main-fill" transform="translate(-195, -230)" :fill="`url(#lol-color-${/blue/i.test(theme) ? 2 : 1})`" >
      <g transform="translate(10, 219)">
        <g transform="translate(5, 3)">
          <g transform="translate(169.2, 0)">
            <path d="M23,8 C16.372583,8 11,13.372583 11,20 C11,26.627417 16.372583,32 23,32 C29.627417,32 35,26.627417 35,20 C35,16.8174021 33.7357179,13.7651552 31.4852814,11.5147186 C29.2348448,9.26428208 26.1825979,8 23,8 Z M27.955,27.1 L17.77,27.1 L17.77,26.185 L17.795,26.185 L19.645,23.88 L19.645,15.38 L17.645,12.91 L24.335,12.91 L22.335,15.38 L22.335,23.79 L26.41,23.79 L29.28,21.29 L27.955,27.1 Z"></path>
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
