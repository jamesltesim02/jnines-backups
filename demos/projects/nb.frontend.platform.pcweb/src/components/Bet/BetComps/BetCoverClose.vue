<template>
  <svg v-bind="attrs" class="nb-cover-close" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g class="nb-cover-close" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g class="nb-cover-close" transform="translate(-173, -396)" :fill="fill">
        <g class="nb-cover-close" transform="translate(173, 396)">
          <path class="nb-cover-close" :d="data"></path>
          <polygon class="nb-cover-close" :points="poly"></polygon>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetCoverClose',
  props: {
    size: String,
    color: String,
  },
  computed: {
    height() {
      const size = this.size || '30';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '30');
    },
    width() {
      return this.height;
    },
    fill() {
      return this.color || 'rgba(255,255,255,0.7)';
    },
    attrs() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        viewBox: '0 0 30 30',
        style: { width: `${this.width}px`, height: `${this.height}px` },
      };
    },
    data() {
      let dt = 'M15,30 C6.729375,30 0,23.270625 0,15 C0,6.729375 6.729375,0 15,0 C23.270625,0 30,6.729375 30,15 ';
      dt += 'C30,23.270625 23.270625,30 15,30 Z M15,1.42875 C7.516875,1.42875 1.42875,7.516875 1.42875,15 ';
      dt += 'C1.42875,22.483125 7.516875,28.569375 15,28.569375 C22.483125,28.569375 28.569375,22.483125 ';
      dt += '28.569375,15 C28.569375,7.516875 22.483125,1.42875 15,1.42875 Z';
      return dt;
    },
    poly() {
      let dt = '22.3636364 9.18346354 20.8165365 7.63636364 15.000932 13.4538321 9.18346354 7.63636364 7.63636364 ';
      dt += '9.18346354 13.4538321 15.000932 7.63636364 20.8165365 9.18346354 22.3636364 15.000932 16.5480319 ';
      dt += '20.8165365 22.3636364 22.3636364 20.8165365 16.5480319 15.000932';
      return dt;
    },
  },
};
</script>
