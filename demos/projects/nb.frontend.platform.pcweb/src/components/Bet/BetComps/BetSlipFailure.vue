<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-1817, -585)" :stroke="fill">
        <g transform="translate(1818, 586)">
          <path :d="data" stroke-width="0.4" :fill="fill" fill-rule="nonzero"></path>
          <g transform="translate(6.4, 6.4)" stroke-linecap="square" stroke-width="1.3">
            <path d="M-4.17443857e-14,-4.4408921e-16 L7.04563256,7.0964119"></path>
            <path d="M-4.88498131e-14,7.07106781 L7.07106781,-2.22044605e-15"></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'BetSlipFailure',
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
    data() {
      let dt = 'M10.0035291,20 C4.48800831,20 0,15.5147369 0,9.99824002 C0,4.48174309 4.48800831,0 10.0035487,0 C15.519089,0 ';
      dt += '20,4.48878303 20,9.99824002 C20,15.507697 15.5120112,20 10.0035291,20 Z M10.0035291,0.99593639 C5.03884479,';
      dt += '0.99593639 1.00283796,5.03619702 1.00283796,9.99824002 C1.00283796,14.960283 5.04238369,19.0005241 10.0035291,';
      dt += '19.0005241 C14.9646746,19.0005241 18.9971816,14.9602635 18.9971816,9.99824002 C18.9971816,5.03621658 ';
      dt += '14.9611552,0.99593639 10.0035291,0.99593639 Z';
      return dt;
    },
  },
};
</script>
