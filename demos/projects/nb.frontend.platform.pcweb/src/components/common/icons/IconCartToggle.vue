<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-1609, -724)" :fill="fill">
        <g transform="translate(1590, 709)">
          <g transform="translate(27, 23)">
            <path :d="data" transform="translate(7.5, 5) rotate(-180) translate(-7.5, -5)"></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'IconCartToggle',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '25';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '25');
    },
    width() {
      const num = (31 / 25) * this.height;
      return parseInt(num * 1000, 10) / 1000;
    },
    fill() {
      return this.outColor || '#FF5353';
    },
    attrs() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        viewBox: '0 0 31 25',
        style: { width: `${this.width}px`, height: `${this.height}px` },
      };
    },
    data() {
      let dt = 'M14.9999426,9.1375861 C14.9999426,8.95169245 14.9458205,8.76495431 14.8337295,8.60682331 L9.48092293,1.07163837 ';
      dt += 'C8.99747931,0.391147268 8.27004603,0 7.4854477,0 C6.70008386,0 5.97265058,0.391147268 5.48920696,1.07248287 ';
      dt += 'L0.16615986,8.56476764 C-0.0999532617,8.94079851 -0.0397261495,9.48078737 0.298843232,9.77437478 C0.638139855,';
      dt += '10.0679411 1.12920038,10.0023241 1.39533264,9.62800332 L6.71837974,2.13489517 C6.90443884,1.87246949 7.18352749,';
      dt += '1.72272007 7.48546684,1.72272007 C7.78665982,1.72272007 8.06574847,1.87244838 8.25180757,2.13405068 L13.6046142,';
      dt += '9.6700801 C13.8707273,10.0443798 14.3610032,10.1100179 14.7011036,9.81645156 C14.897057,9.64653991 15,9.3933403 ';
      dt += '15,9.13762833 L14.9999426,9.1375861 Z';
      return dt;
    },
  },
};
</script>
