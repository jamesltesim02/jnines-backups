<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-1817, -585)" :fill="fill" fill-rule="nonzero">
        <g transform="translate(1818, 586)">
          <path :d="data1" :stroke="fill" stroke-width="0.4"></path>
          <path :d="data2"></path>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetSlipSuccess',
  props: { size: String, color: String },
  computed: {
    height() {
      const size = this.size || '22';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '22');
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
        viewBox: '0 0 22 22',
        style: { width: `${this.width}px`, height: `${this.height}px` },
      };
    },
    data1() {
      let dt = 'M10.0035291,20 C4.48800831,20 0,15.5147369 0,9.99824002 C0,4.48174309 4.48800831,0 10.0035487,0 C15.519089,0 ';
      dt += '20,4.48878303 20,9.99824002 C20,15.507697 15.5120112,20 10.0035291,20 Z M10.0035291,0.99593639 C5.03884479,';
      dt += '0.99593639 1.00283796,5.03619702 1.00283796,9.99824002 C1.00283796,14.960283 5.04238369,19.0005241 10.0035291,';
      dt += '19.0005241 C14.9646746,19.0005241 18.9971816,14.9602635 18.9971816,9.99824002 C18.9971816,5.03621658 ';
      dt += '14.9611552,0.99593639 10.0035291,0.99593639 Z';
      return dt;
    },
    data2() {
      let dt = 'M8.95357143,12.8990393 L8.7807143,13.071176 L8.74714287,13.0376058 C8.65642857,13.0804614 8.55642857,13.1076033 ';
      dt += '8.44928572,13.1076033 C8.29714287,13.1076033 8.16357143,13.049034 8.04785715,12.9683226 L8.0307143,12.9847505 ';
      dt += 'L7.945,12.8990393 C7.94428572,12.8983251 7.94428572,12.8983251 7.94357143,12.8976108 L5,9.9541445 L6.0107143,';
      dt += '8.94418057 L8.44928572,11.3826649 L13.8314286,6 L14.8421429,7.0106782 L8.955,12.8976108 C8.95428572,';
      dt += '12.8983251 8.95428572,12.8983251 8.95357143,12.8990393 Z';
      return dt;
    },
  },
};
</script>
