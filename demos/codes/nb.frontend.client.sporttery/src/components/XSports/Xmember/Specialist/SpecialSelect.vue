<template>
  <div :class="`x-select${transparent ? ' transparent' : ''}`">
    <share-select :tabList="data" :value="value" @change="changeRoot" />
  </div>
</template>
<script>
import ShareSelect from '@/components/common/ShareSelect';

export default {
  inheritAttrs: false,
  name: 'SpecialSelect',
  data() {
    return { data: ['xSel1', 'xSel2'] };
  },
  props: { type: Number, transparent: Boolean },
  computed: {
    value() {
      return this.data[this.type ? 1 : 0];
    },
  },
  components: { ShareSelect },
  methods: {
    changeRoot(val) {
      const id = this.data.findIndex(v => v === val);
      this.$router.replace(this.$route.path.replace(/^(.+)\/\d+/, `$1/${id ? 1 : 0}`));
    },
  },
};
</script>
<style lang="less">
.x-select {
  width: 3.75rem;
  border-bottom: .01rem solid #ecebeb;
  .nb-share-select { height: .4rem; box-shadow: 0 .01rem .06rem 0 rgba(236,236,236,.5); background: #ffffff; li { max-width: 50%; } }
}
.black .x-select {
  border-bottom: .01rem solid #2e2f34;
  .nb-share-select { box-shadow: 0 .01rem .06rem 0 rgba(0,0,0,.3); background: #2e2f34; li.active { color: #ff5353; } }
}
.blue .x-select {
  border-bottom: .01rem solid #2e2f34;
  .nb-share-select { box-shadow: 0 .01rem .06rem 0 rgba(0,0,0,.3); background: #2e2f34; li.active { color: #53fffd; } }
}
.x-select.transparent { opacity: 0; }
</style>
