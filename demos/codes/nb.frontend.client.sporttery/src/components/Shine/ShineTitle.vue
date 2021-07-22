<template>
  <div class="nb-shine-title" >
    <share-select :tabList="data" :value="value" @change="changeFun" />
  </div>
</template>

<script>
import ShareSelect from '@/components/common/ShareSelect';

export default {
  inheritAttrs: false,
  name: 'ShineTitle',
  data() {
    return {
      data: ['share0', 'share1', 'share2', 'share3', 'share4'],
    };
  },
  props: { state: Number },
  computed: {
    idx() {
      return this.getIdx(this.state);
    },
    value() {
      return this.data[this.idx];
    },
  },
  components: { ShareSelect },
  methods: {
    getIdx(id) {
      let idx = /^-?\d+$/.test(id) ? +id : 0;
      idx = idx < 0 ? 0 : idx;
      return idx > 4 ? 4 : idx;
    },
    changeFun(val) {
      this.$emit('change', this.getIdx(this.data.findIndex(v => v === val)));
    },
  },
};
</script>

<style lang="less">
.nb-shine-title { width: 100%; }
.blue .nb-shine-title .nb-share-select li.active { color: #53fffd; }
</style>
