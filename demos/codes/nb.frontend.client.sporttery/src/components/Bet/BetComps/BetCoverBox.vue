<template>
  <v-touch :class="boxClass" :style="s" v-if="wh" @touchmove.stop @tap="eFun">
    <bet-box-cover :index="s['z-index'] + 3" />
    <bet-box-body :index="s['z-index'] + 6" :animate="animate" ><slot /></bet-box-body>
  </v-touch>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetBoxCover from './BetCoverPro/BetBoxCover';
import BetBoxBody from './BetCoverPro/BetBoxBody';

export default {
  inheritAttrs: false,
  name: 'BetCoverBox',
  data() {
    return { wh: false, cShow: false, s: { 'z-index': 0 } };
  },
  props: { index: Number, show: Boolean, animate: Boolean },
  computed: {
    ...mapState('app', ['horizScreen']),
    ...mapState({ iphX: state => state.bet.isIphoneX }),
    boxClass() {
      return `nb-bet-public-cover-box box-${this.cShow ? 'show' : 'hide'}`;
    },
  },
  watch: {
    show() {
      this.checkShow();
    },
    iphX() {
      this.setHeight();
    },
    horizScreen() {
      this.setHeight();
    },
    wh() {
      this.setLockIOSSwipe(this.wh);
    },
  },
  components: { BetBoxCover, BetBoxBody },
  methods: {
    ...mapMutations('app', ['setNbFilterClass', 'setLockIOSSwipe']),
    eFun(e) {
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/(nb-bet-public-box-body|nb-bet-public-box-cover|close)/i.test(cName)) {
        this.$emit('close', cName);
      }
    },
    checkShow() {
      this.setHeight();
      this.setNbFilterClass(!!this.show);
      if (this.show) {
        this.wh = this.show;
        setTimeout(() => {
          this.cShow = true;
          this.setNbFilterClass(!!this.show);
        }, 10);
      } else {
        this.cShow = false;
        setTimeout(() => { this.wh = this.show; }, 150);
      }
    },
    setHeight() {
      this.s.height = `${document.getElementById('app').offsetHeight}px`;
    },
  },
  mounted() {
    const nIndex = this.index + 9000000;
    this.s['z-index'] = nIndex * 10;
    this.setHeight();
    this.checkShow();
  },
};
</script>

<style lang="less">
.nb-bet-public-cover-box { position: fixed; left: 0; right: 0; top: 0; bottom: 0; transform: translateZ(.5rem); }
</style>
