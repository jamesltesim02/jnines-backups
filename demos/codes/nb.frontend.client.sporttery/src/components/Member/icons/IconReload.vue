<template>
  <svg :width="width" :height="height" :style="svgStyle" viewBox="17 13 20 20" >
    <filter id="filter-2" y="-125.0%" x="-145.0%" height="390.0%" width="390.0%" filterUnits="objectBoundingBox">
    <feOffset result="shadowOffsetOuter1" in="SourceAlpha" dy="4" dx="0" />
    <feGaussianBlur result="shadowBlurOuter1" in="shadowOffsetOuter1" stdDeviation="9" />
    <feColorMatrix values="0 0 0 0 0.144903274 0 0 0 0 0.144903274 0 0 0 0 0.144903274  0 0 0 0.5 0" in="shadowBlurOuter1" type="matrix" />
    </filter>
    <g>
      <g transform="translate(17.000000, 13.000000)">
        <g>
          <g>
            <g filter="url(#filter-2)"><circle cx="10" cy="10" r="10"/></g>
            <g><circle fill="#FF5353" cx="10" cy="10" r="10" /></g>
          </g>
          <g transform="translate(4.000000, 4.000000)">
            <path fill="#2E2D33" d="M1.92,7.583C1.603,5.462,2.692,3.319,4.638,2.508C6.08,1.906,7.635,2.194,8.736,3.053 L7.799,4.675L12,4.658L10.498,0L9.729,1.332C8.107,0.208,5.896-0.159,3.96,0.648c-2.683,1.118-4.227,4.01-3.922,6.935H1.92z" />
            <path fill="#2E2D33" d="M10.115,5.417c0.311,2.083-0.758,4.189-2.669,4.985 c-1.302,0.543-2.738,0.339-3.841-0.394c0.21-0.365,0.831-1.44,0.831-1.44L0,8.289L1.877,13l0.787-1.363 c1.593,1.104,3.546,1.384,5.447,0.591c2.634-1.099,4.15-3.938,3.852-6.811L10.115,5.417L10.115,5.417z" />
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    width: {
      default: '.20rem',
    },
    height: {
      default: '.20rem',
    },
  },
  computed: {
    svgStyle() {
      return { width: this.width, height: this.height };
    },
  },
};
</script>
