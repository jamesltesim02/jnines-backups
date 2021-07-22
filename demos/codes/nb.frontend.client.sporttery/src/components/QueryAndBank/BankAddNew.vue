<template>
  <svg v-bind="attrs" class="bank-add-new" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" class="bank-add-new" stroke-width="1" fill="none" fill-rule="evenodd">
      <g class="bank-add-new" transform="translate(-161, -47)" :fill="fill">
        <g class="bank-add-new" transform="translate(115, 47)">
          <g class="bank-add-new" transform="translate(46, 0)">
            <path class="bank-add-new" :d="dataOne" fill-rule="nonzero"></path>
            <path class="bank-add-new" :d="dataTwo"></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BankAddNew',
  props: {
    size: String,
    color: String,
  },
  computed: {
    height() {
      const size = this.size || '0.34';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.34');
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
        viewBox: '0 0 34 34',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
    dataOne() {
      let dt = 'M29.0208153,4.97918472 C22.3819023,-1.65972824 11.6180977,-1.65972824 4.97918472,4.97918472 C-1.65972824,11.6180977 ';
      dt += '-1.65972824,22.3819023 4.97918472,29.0208153 C11.6180977,35.6597282 22.3819023,35.6597282 29.0208153,29.0208153 ';
      dt += 'C35.6597282,22.3819023 35.6597282,11.6180977 29.0208153,4.97918472 Z M27.6190948,27.5129038 C21.8129783,33.3190203 ';
      dt += '12.3994036,33.3190203 6.59328712,27.5129038 C0.787170665,21.7067874 0.787170665,12.2932126 6.59328712,6.48709618 ';
      dt += 'C12.3994036,0.680979717 21.8129783,0.680979717 27.6190948,6.48709618 C33.4252112,12.2932126 33.4252112,21.7067874 ';
      dt += '27.6190948,27.5129038 Z';
      return dt;
    },
    dataTwo() {
      let dt = 'M25.3950617,15.9506173 L18.0493827,15.9506173 L18.0493827,8.60493828 C18.0493827,8.0253802 17.5795581,7.55555556 17,7.55555556 ';
      dt += 'C16.4204419,7.55555556 15.9506173,8.0253802 15.9506173,8.60493828 L15.9506173,15.9506173 L8.60493828,15.9506173 C8.0253802,';
      dt += '15.9506173 7.55555556,16.4204419 7.55555556,17 C7.55555556,17.5795581 8.0253802,18.0493827 8.60493828,18.0493827 L15.9506173,';
      dt += '18.0493827 L15.9506173,25.3950617 C15.9506173,25.9746198 16.4204419,26.4444444 17,26.4444444 C17.5795581,26.4444444 18.0493827,';
      dt += '25.9746198 18.0493827,25.3950617 L18.0493827,18.0493827 L25.3950617,18.0493827 C25.9746198,18.0493827 26.4444444,17.5795581 ';
      dt += '26.4444444,17 C26.4444444,16.4204419 25.9746198,15.9506173 25.3950617,15.9506173 Z';
      return dt;
    },
  },
};
</script>
