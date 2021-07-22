<template>
  <div class="nb-publish-title" >
    <share-select :tabList="data" :value="value" @change="changeFun" full />
  </div>
</template>

<script>
import ShareSelect from '@/components/common/ShareSelect';

export default {
  inheritAttrs: false,
  name: 'PublishTitle',
  data() {
    return {
      data: ['publish0', 'publish1', 'publish2', 'publish3', 'publish4', 'publish5'],
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
      let idx = /^-?\d+$/.test(id) ? +id : 1;
      idx = idx < 0 ? 1 : idx;
      return idx > 5 ? 5 : idx;
    },
    changeFun(val) {
      this.$emit('change', this.getIdx(this.data.findIndex(v => v === val)));
    },
  },
};
</script>

<style lang="less">
.nb-publish-title {
  width: 100%;
  .nb-share-select {
    background: #f5f4f5;
    ul { color: #909090; border-bottom: .03rem solid #ececec; }
    li.shuttle { bottom: -.03rem; }
    li.active { font-size: .16rem; color: #2e2f34; }
  }
}
.blue .nb-publish-title .nb-share-select {
  background: #28272d;
  ul { color: #909090; border-bottom: .03rem solid #2e2f34; }
  li.active { color: #ecebeb; }
}
</style>
