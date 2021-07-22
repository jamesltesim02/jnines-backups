<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-45, -131)" :fill="fill" fill-rule="nonzero">
        <g transform="translate(45, 129)">
          <path :d="data"></path>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'QueryAlert',
  props: {
    size: String,
    color: String,
  },
  computed: {
    height() {
      const size = this.size || '0.14';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.14');
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
        viewBox: '0 0 14 14',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
    data() {
      let dt = 'M7,2 C3.13400889,2 0,5.13400889 0,9 C0,12.8659911 3.13400889,16 7,16 C10.8659911,16 14,12.8659911 14,9 C13.9958044,5.13575111 ';
      dt += '10.8642489,2.00419555 7,2 Z M7,14.4766044 C3.97535999,14.4766044 1.52339555,12.02464 1.52339555,9 C1.52339555,5.97535999 ';
      dt += '3.97535999,3.52339555 7,3.52339555 C10.02464,3.52339555 12.4766044,5.97535999 12.4766044,9 C12.4724089,12.0228978 ';
      dt += '10.0229156,14.4724089 7,14.4766044 Z M7,5 C6.44999112,5 6,5.45000889 6,6 L6,9 C6,9.55000888 6.45000889,10 7,10 ';
      dt += 'C7.55000888,10 8,9.54999111 8,9 L8,6 C8,5.44999112 7.54999111,5 7,5 Z M7,11 C6.44999112,11 6,11.4500089 6,12 ';
      dt += 'C6,12.5500089 6.45000889,13 7,13 C7.55000888,13 8,12.5499911 8,12 C8,11.4499911 7.54999111,11 7,11 Z';
      return dt;
    },
  },
};
</script>
