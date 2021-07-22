<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-1285, -256)" :fill="fill" fill-rule="nonzero">
        <g transform="translate(920, 248)">
          <g transform="translate(359, 0)">
            <g transform="translate(6, 8)">
              <path :d="data"></path>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'IconSearch',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '15';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '15');
    },
    width() {
      return this.height;
    },
    fill() {
      return this.color || '#fff';
    },
    attrs() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        viewBox: '0 0 15 15',
        style: { width: `${this.width}px`, height: `${this.height}px` },
      };
    },
    data() {
      let dt = 'M14.9176578,13.8174274 L11.1569037,10.0829876 C12.034413,9.08713693 12.5358469,7.71784232 12.5358469,6.22406639 ';
      dt += 'C12.5358469,2.73858921 9.77796055,0 6.26792343,0 C2.75788631,0 0,2.73858921 0,6.22406639 C0,9.70954357 2.75788631,';
      dt += '12.4481328 6.26792343,12.4481328 C7.77222505,12.4481328 9.1511682,11.9502075 10.154036,11.0788382 L13.91479,14.813278 ';
      dt += 'C14.1655069,15.0622407 14.5415824,15.0622407 14.7922993,14.813278 C15.0430162,14.5643154 15.0430162,14.06639 14.9176578,';
      dt += '13.8174274 Z M1.25358469,6.22406639 C1.25358469,3.48547718 3.51003712,1.24481328 6.26792343,1.24481328 C9.02580974,';
      dt += '1.24481328 11.2822622,3.48547718 11.2822622,6.22406639 C11.2822622,8.9626556 9.02580974,11.2033195 6.26792343,11.2033195 ';
      dt += 'C3.51003712,11.2033195 1.25358469,8.9626556 1.25358469,6.22406639 Z';
      return dt;
    },
  },
};
</script>
