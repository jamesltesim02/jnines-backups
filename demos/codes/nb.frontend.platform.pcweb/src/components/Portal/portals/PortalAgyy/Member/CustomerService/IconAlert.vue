<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-920, -522)" :fill="fill" fill-rule="nonzero">
        <g transform="translate(920, 463)">
          <path :d="data"></path>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'IconAlert',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '12';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '12');
    },
    width() {
      return this.height;
    },
    fill() {
      return this.color || '#FF5353';
    },
    attrs() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        viewBox: '0 0 12 12',
        style: { width: `${this.width}px`, height: `${this.height}px` },
      };
    },
    data() {
      let dt = 'M6.00000806,71 C2.68630137,71 0,68.3137469 0,64.9999919 C0,61.6862853 2.68630137,59 6.00000806,59 C9.31371474,59 ';
      dt += '12,61.6863014 12,64.9999919 C12,68.313763 9.31371474,71 6.00000806,71 L6.00000806,71 Z M7,62.3102706 C7,61.8627438 ';
      dt += '6.48996317,61.5 5.99267593,61.5 C5.49535387,61.5 5,61.8627438 5,62.3102706 L5.2612626,65.6892744 C5.2612626,66.1368012 ';
      dt += '5.4897977,66.5 5.98614437,66.5 C6.48346643,66.5 6.7387374,66.1368169 6.7387374,65.6892744 L7,62.3102706 L7,62.3102706 ';
      dt += 'Z M5.99904955,67 C5.44677917,67 5,67.4486012 5,68.000702 C5,68.552837 5.44679631,69 5.99904955,69 C6.55126855,69 ';
      dt += '7,68.552837 7,68.000702 C7,67.4485669 6.55126854,67 5.99904955,67 L5.99904955,67 Z';
      return dt;
    },
  },
};
</script>
