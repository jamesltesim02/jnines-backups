<template>
  <div class="nb-bet-box-toggole flex-start-wrap">
    <span class="nb-bet-box-item flex-start" :style="iStyle" v-for="(v, k) in bArr" :key="k">
      {{v.oids.join('/')}}
    </span>
  </div>
</template>

<script>
import { toSerList } from '@/utils/betUtils';

export default {
  inheritAttrs: false,
  name: 'BetBoxToggle',
  data() {
    return { bArr: [] };
  },
  props: { data: Object, opts: Array },
  computed: {
    iStyle() {
      let wd = this.data.nm >= 4 ? '33.333%' : '25%';
      wd = this.data.nm >= 7 ? '50%' : wd;
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
.white .nb-bet-box-toggole {
  border-top: .01rem solid #ECEBEB;
  border-bottom: .01rem solid #ECEBEB;
  .nb-bet-box-item { color: #bababa; }
}
.black .nb-bet-box-toggole {
  border-top: .01rem solid #2e2f34;
  border-bottom: .01rem solid #2e2f34;
  .nb-bet-box-item { color: #bababa; }
}
.blue .nb-bet-box-toggole {
  border-top: .01rem solid #2e2f34;
  border-bottom: .01rem solid #2e2f34;
  .nb-bet-box-item { color: #bababa; }
}
.nb-bet-box-toggole {
  width: 100%;
  .nb-bet-box-item {
    min-width: 25%;
    height: .3rem;
    font-size: .13rem;
    font-weight: 500;
    padding: 0 .1rem;
  }
}
</style>
