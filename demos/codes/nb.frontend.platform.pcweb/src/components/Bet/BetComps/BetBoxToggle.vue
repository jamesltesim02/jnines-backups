<template>
  <div :class="`nb-bet-box-toggole ${betCheck ? 'mix' : 'none'} flex-start-wrap`">
    <span class="nb-bet-box-item flex-start" :style="iStyle" v-for="(v, k) in bArr" :key="k">
      {{v.oids.join('/')}}
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { toSerList } from '@/utils/betUtils';

export default {
  inheritAttrs: false,
  name: 'BetBoxToggle',
  data() {
    return { bArr: [] };
  },
  props: { data: Object, opts: Array },
  computed: {
    ...mapState('app', ['bettingMode', 'bettingStyle']),
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
    iStyle() {
      let wd = this.data.nm >= 6 ? '50%' : '33.333%';
      wd = this.data.nm >= 10 ? '100%' : wd;
      return { width: wd };
    },
  },
  methods: {
    toToggleFun() {
      const data = toSerList(this.opts, this.data.nm, 1);
      this.bArr = data && data.length ? data : [];
    },
  },
  mounted() {
    this.toToggleFun();
  },
};
</script>

<style lang="less">
.nb-bet-box-toggole { width: 100%; .nb-bet-box-item { min-width: 33.333%; height: 30px; font-size: 13px; font-weight: 500; padding: 0 10px; } }
.black .nb-bet-box-toggole { border-bottom: 1px solid #2e2f34; .nb-bet-box-item { color: #bababa; } }
.black .nb-bet-box-toggole.none { border-top: 1px solid #2e2f34; }
.white .nb-bet-box-toggole { border-bottom: 1px solid #ECEBEB; .nb-bet-box-item { color: #bababa; } }
.white .nb-bet-box-toggole.none { border-top: 1px solid #ECEBEB; }
</style>
