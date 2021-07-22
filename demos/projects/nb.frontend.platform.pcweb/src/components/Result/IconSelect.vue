<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-1615, -173)" fill-rule="nonzero">
        <g transform="translate(459, 154)">
          <g transform="translate(0, 19)">
            <polygon transform="translate(1164, 11) rotate(-180) translate(-1164, -11)" :points="data"></polygon>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'IconSelect',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '22';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '22');
    },
    width() {
      const num = (16 / 22) * this.height;
      return parseInt(num * 1000, 10) / 1000;
    },
    attrs() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        viewBox: '0 0 16 22',
        style: { width: `${this.width}px`, height: `${this.height}px` },
      };
    },
    data() {
      return '1160.86797 11.1637451 1172 0 1167.71093 0 1156 11.2020033 1156.00611 11.2081247 1167.43905 22 1171.80907 21.9586811 1160.82826 11.2020033';
    },
  },
};
</script>
