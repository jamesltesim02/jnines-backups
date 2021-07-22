<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-269, -394)" :fill="fill" fill-rule="nonzero">
        <g transform="translate(270, 395)">
          <path :d="dataOne" :stroke="fill" stroke-width="0.2"></path>
          <path :d="dataTwo"></path>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'PublishAlert',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '0.18';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.18');
    },
    width() {
      return this.height;
    },
    fill() {
      return this.color || '#FF5353';
    },
    attrs() {
      return {
        width: `${this.width}rem`,
        height: `${this.height}rem`,
        viewBox: '0 0 18 18',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
    dataOne() {
      let dt = 'M8,0 C3.58190399,0 0,3.58135468 0,8 C0,12.4181143 3.58190399,16 8,16 C12.4181143,16 16,12.4181143 16,8 C16,3.58135468 ';
      dt += '12.4181143,0 8,0 Z M8,15.2381476 C4.00216061,15.2381476 0.761852442,11.9973084 0.761852442,8 C0.761852442,4.00216061 ';
      dt += '4.0021423,0.761852442 8,0.761852442 C11.9973084,0.761852442 15.2381659,4.0021423 15.2381659,8 C15.2381659,11.9973084 ';
      dt += '11.9972901,15.2381476 8,15.2381476 Z';
      return dt;
    },
    dataTwo() {
      let dt = 'M7.9838715,3.30368923 C7.52787895,3.30368923 7.15795375,3.67361443 7.15795375,4.12960698 L7.15795375,9.08511343 C7.15795375,';
      dt += '9.54106943 7.52789721,9.91101289 7.9838715,9.91101289 C8.43986405,9.91101289 8.80978925,9.54106943 8.80978925,9.08511343 ';
      dt += 'L8.80978925,4.1295887 C8.80978925,3.67361443 8.43986405,3.30368923 7.9838715,3.30368923 Z M7.9838715,11.0122548 C7.52787895,';
      dt += '11.0122548 7.15795375,11.38218 7.15795375,11.8381543 C7.15795375,12.2941286 7.52789721,12.664072 7.9838715,12.664072 ';
      dt += 'C8.43986405,12.664072 8.80978925,12.2941286 8.80978925,11.8381543 C8.80978925,11.38218 8.43986405,11.0122548 ';
      dt += '7.9838715,11.0122548 Z';
      return dt;
    },
  },
};
</script>
