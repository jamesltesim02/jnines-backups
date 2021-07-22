<template>
  <svg v-bind="attrs" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-314, -535)" fill-rule="nonzero">
        <g transform="translate(314, 535)">
          <path d="M12,0 C18.627417,0 24,5.372583 24,12 C24,18.627417 18.627417,24 12,24 C5.372583,24 0,18.627417 0,12 C0,5.372583 5.372583,0 12,0 Z" fill="#FF5353"></path>
          <path d="M6.9,17.4 L6.9,15.0675 L8.06749999,15.0675 L8.06749999,15.845 L16.2325,15.845 L16.2325,15.0675 L17.4,15.0675 L17.4,17.4 L6.9,17.4 Z M8.06749999,10.4 L10.8,10.44 L10.8,6.9 L13.51,6.9 L13.51,10.4 L16.2325,10.4 L12.1925,14.6775 L8.06749999,10.4 Z" fill="#FFFFFF"></path>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'ShareLc',
  props: { size: String },
  computed: {
    height() {
      const size = this.size || '0.24';
      const arr = size.match(/(\d+(\.\d+)?)/);
      return +(arr ? arr[1] : '0.24');
    },
    width() {
      return this.height;
    },
    attrs() {
      return {
        width: `${this.width}rem`,
        height: `${this.height}rem`,
        viewBox: '0 0 24 24',
        style: { width: `${this.width}rem`, height: `${this.height}rem` },
      };
    },
  },
};
</script>
