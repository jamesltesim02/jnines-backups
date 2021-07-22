<template>
<div class="nb-share-select">
  <ul ref="container" class="flex-center">
    <li ref="shuttle" class="shuttle" :style="shuttleStyle" ></li>
    <v-touch tag="li" v-for="v in tabList" :key="v" :class="liClass(v)" @tap="changeFun(v)" >
      <span>{{$t(`share.${v}`)}}</span>
    </v-touch>
  </ul>
</div>
</template>
<script>
export default {
  model: { prop: 'value', event: 'change' },
  props: { value: String, tabList: Array, full: Boolean },
  data() {
    return { itemWidth: 0, shuttleWidth: 0, spaceWidth: 0 };
  },
  computed: {
    shuttleLeft() {
      const id = this.tabList.findIndex(v => v === this.value);
      return (id + 0.5) * this.itemWidth + this.spaceWidth;
    },
    shuttleStyle() {
      const obj = { left: `${this.shuttleLeft}px`, opacity: `${this.shuttleLeft > 0 ? 1 : 0}` };
      obj.width = this.full && this.itemWidth ? `${this.itemWidth}px` : '.3rem';
      return obj;
    },
  },
  methods: {
    changeFun(v) {
      if (v !== this.value) {
        this.$emit('change', v);
      }
    },
    liClass(v) {
      return `flex-center${v === this.value ? ' active' : ''}`;
    },
    initShuttle() {
      if (this.$refs.container) {
        const { clientWidth: containerWidth, lastElementChild: { clientWidth: itemWidth } } = this.$refs.container;
        this.itemWidth = itemWidth;
        this.shuttleWidth = this.$refs.shuttle.clientWidth;
        this.spaceWidth = (containerWidth - this.itemWidth * this.tabList.length) / 2;
      }
    },
  },
  created() {
    if (!this.value) {
      this.$emit('change', this.tabList[0]);
    }
    this.initShuttle();
  },
  mounted() {
    this.initShuttle();
    window.addEventListener('resize', this.initShuttle.bind(this));
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.initShuttle);
  },
};
</script>
<style lang="less">
.nb-share-select {
  width: 100%;
  height: .4rem;
  padding: 0 .1rem;
  background: #ffffff;
  ul { position: relative; width: 100%; height: 100%; font-size: .14rem; font-weight: 500; color: #2e2f34; }
  li { width: 100%; max-width: .8rem; height: 100%; }
  li.shuttle { transition: all .25s ease-out; position: absolute; height: .03rem; bottom: 0; left: -1rem; transform: translateX(-50%); border-radius: .02rem; box-shadow: 0 -.01rem .06rem 0 #fae5f5; background: linear-gradient(95deg, #ff5353, rgba(245,56,1,.61)); }
  li.active { color: #ff5353; font-weight: bold; }
  li span { position: relative; display: inline-block; line-height: .14rem; }
}
.blue .nb-share-select {
  background: #2e2f34;
  ul { color: #909090; }
  li.active { color: #ff5353; }
  li.shuttle { box-shadow: 0 -.01rem .06rem 0 #00aabd; background: linear-gradient(103deg, #00ffd8, #00e5fe); }
}
</style>
