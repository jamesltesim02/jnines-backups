<template>
  <div v-if="checking" class="bet-span-check-box" :style="boxStyle">
    <span class="bet-span-text" :class="cName">{{text}}</span>
    <div class="bet-span-space" :style="{ width: space || '.2rem' }"></div>
  </div>
  <div v-else-if="isOut" class="bet-span-box" :style="boxStyle">
    <span class="bet-span-text" :class="cName" :style="nAttrs[0]">{{text}}</span>
    <span class="bet-span-text" :class="cName" :style="nAttrs[1]">{{text}}</span>
  </div>
  <span v-else v-bind="$attrs">{{text}}</span>
</template>
<script>

export default {
  inheritAttrs: false,
  name: 'BetSpan',
  data() {
    return {
      checking: true,
      isOut: false,
      cName: '',
      widths: [0, 0, 0, 0],
      left: [0, 0],
      nSpeed: 1,
      nAttrs: [{}, {}],
      timer: null,
    };
  },
  props: {
    text: String,
    width: String,
    maxWidth: String,
    space: String,
    speed: Number,
  },
  computed: {
    attrs() {
      const widthStr = `${this.widths[2]}px`;
      return Object.assign({}, this.$attrs, { style: { position: 'absolute', paddingRight: widthStr } });
    },
    boxStyle() {
      const obj = { position: 'relative', overflow: 'hidden' };
      if (this.width) {
        obj.width = this.width;
      }
      if (this.maxWidth) {
        obj.maxWidth = this.maxWidth;
      }
      return obj;
    },
  },
  methods: {
    setStyle() {
      const [bAttrs, widthStr] = [this.nAttrs, `${this.widths[2]}px`];
      for (let i = 0; i < this.left.length; i += 1) {
        bAttrs[i] = Object.assign({}, this.attrs, { style: { left: `${this.left[i]}px` } });
      }
      this.nAttrs = bAttrs;
    },
    runMarquee() {
      const that = this;
      this.isOut = true;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        for (let i = 0; i < that.left.length; i += 1) {
          that.left[i] -= that.nSpeed;
          if (that.nSpeed > 0 && that.left[i] < -that.widths[3]) {
            that.left[i] += 2 * that.widths[3];
          } else if (that.nSpeed < 0 && that.left[i] > that.widths[0]) {
            that.left[i] -= 2 * that.widths[3];
          }
        }
        this.setStyle();
      }, 20);
    },
  },
  mounted() {
    [this.checking, this.isOut, this.left] = [true, false, [0, 0]];
    this.nSpeed = parseInt(this.speed || 0, 10) || 1;
    const clName = this.$el.className;
    this.cName = clName.replace(/bet-span(-check)?-box\s*/, '').trim();
    const nArr = clName.match(/(bet-span(-check)?-box)/);
    this.$el.className = nArr ? nArr[1] : clName;
    setTimeout(() => {
      this.checking = false;
      if (this.width || this.maxWidth) {
        this.widths[0] = this.$el.offsetWidth;
        this.widths[1] = this.$el.querySelector('.bet-span-text').offsetWidth;
        this.widths[2] = this.$el.querySelector('.bet-span-space').offsetWidth;
        this.widths[3] = this.widths[1] + this.widths[2];
        this.left[1] = this.nSpeed > 0 ? this.widths[3] : -this.widths[3];
        this.setStyle();
        if (this.widths[0] < this.widths[1]) this.runMarquee();
      }
    }, 5);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
