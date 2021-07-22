<template>
  <v-touch tag="div" class="nb-bet-cover-box" :style="s" v-if="wh" @touchmove.stop @tap="eFun">
    <bet-box-cover :animate="animate" :index="s['z-index'] + 3" :show="show"/>
    <bet-box-body :animate="animate" :index="s['z-index'] + 6" :show="show">
      <slot />
    </bet-box-body>
  </v-touch>
</template>

<script>
import BetBoxCover from './BetCoverPro/BetBoxCover';
import BetBoxBody from './BetCoverPro/BetBoxBody';

export default {
  inheritAttrs: false,
  name: 'BetCoverBox',
  data() {
    return {
      wh: false,
      s: { 'z-index': 0 },
    };
  },
  props: {
    index: Number,
    show: Boolean,
    animate: Boolean,
  },
  watch: {
    show() {
      this.checkShow();
    },
  },
  components: {
    BetBoxCover,
    BetBoxBody,
  },
  methods: {
    eFun(e) {
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/(nb-bet-body-box|nb-bet-cover-box|close)/i.test(cName)) {
        this.$emit('close', true);
      }
    },
    checkShow() {
      if (this.show) {
        this.wh = this.show;
      } else {
        setTimeout(() => { this.wh = this.show; }, 150);
      }
    },
  },
  mounted() {
    const nIndex = this.index + 9000000;
    this.s['z-index'] = nIndex * 10;
    this.checkShow();
  },
};
</script>

<style lang="less">
.nb-bet-cover-box {
  position: fixed;
  width: 3.75rem;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
