<template>
  <div :class="`nb-bet-public-cover-box box-${cShow ? 'show' : 'hide'}`" :style="s" v-if="wh" @click="eFun">
    <bet-box-cover :index="s['z-index'] + 3" />
    <bet-box-body :index="s['z-index'] + 6" ><slot /></bet-box-body>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import BetBoxCover from './BetCoverPro/BetBoxCover';
import BetBoxBody from './BetCoverPro/BetBoxBody';

export default {
  inheritAttrs: false,
  name: 'BetCoverBox',
  data() {
    return { wh: false, cShow: false, s: { 'z-index': 0 } };
  },
  props: { index: Number, show: Boolean },
  watch: {
    show() {
      this.checkShow();
    },
  },
  components: { BetBoxCover, BetBoxBody },
  methods: {
    ...mapMutations('app', ['setNbFilterClass']),
    eFun(e) {
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/(nb-bet-public-box-body|nb-bet-public-box-cover|close)/i.test(cName)) {
        this.$emit('close', true);
      }
    },
    checkShow() {
      this.setNbFilterClass({ time: this.show ? '0.15s' : '', blur: this.show ? '1px' : '' });
      if (this.show) {
        this.wh = this.show;
        setTimeout(() => { this.cShow = true; }, 10);
      } else {
        this.cShow = false;
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
.nb-bet-public-cover-box { position: fixed; left: 0; right: 0; top: 0; bottom: 0; }
</style>
