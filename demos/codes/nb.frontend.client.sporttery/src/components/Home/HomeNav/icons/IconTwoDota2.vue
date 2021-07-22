<template>
<svg width=".25rem" height=".24rem" style="width:.25rem;height:.24rem" viewBox="0 0 25 24">
  <defs>
    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="dota-color">
      <stop stop-color="#BFBFBF" offset="0%"></stop>
      <stop stop-color="#8A8A8A" offset="100%"></stop>
    </linearGradient>
  </defs>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.7">
    <g transform="translate(-255, -230)" fill="url(#dota-color)">
      <g transform="translate(10, 219)">
        <g transform="translate(5, 3)">
          <g transform="translate(232.6, 0)">
            <path d="M20,8 C13.372583,8 8,13.372583 8,20 C8,26.627417 13.372583,32 20,32 C26.627417,32 32,26.627417 32,20 C32,16.8174021 30.7357179,13.7651552 28.4852814,11.5147186 C26.2348448,9.26428208 23.1825979,8 20,8 Z M14.035,26.145 C14.035,26.145 13.145,23.875 13.145,23.765 C13.145,23.655 14.21,20.355 14.21,20.355 L14.565,20.855 L17.905,25.305 L14.035,26.145 Z M24.795,26.855 L15.135,15.385 L14.565,14.465 L14.915,14.095 C15.0537862,14.18867 15.2011066,14.2690266 15.355,14.335 C15.5874375,14.5549199 15.856474,14.7325855 16.15,14.86 C16.319898,14.9993694 16.5042915,15.1200633 16.7,15.22 C16.9917294,15.4390703 17.3226789,15.6003021 17.675,15.695 L26.855,23.66 L24.795,26.855 Z M26.215,17.415 L23.93,15.785 L21.5,14.035 L24.185,13.15 L26.865,14.78 L26.215,17.415 Z"></path>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>
</template>
<script>
export default {
  props: ['color'],
};
</script>
