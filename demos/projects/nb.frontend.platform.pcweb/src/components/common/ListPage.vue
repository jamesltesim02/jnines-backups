<template>
  <div class="list-page">
    <div class="page-header"><slot name="header" /></div>
    <div class="page-content flex-center" v-if="loading && first"><icon-loading /></div>
    <swiper ref="scroller" class="page-content" :options="swiperOpt" v-else >
      <swiper-slide :style="swiperStyle">
        <div class="page-slide-box" >
          <slot />
          <div v-if="loading && !first" class="page-loading flex-center"><icon-loading size="32" /></div>
        </div>
      </swiper-slide>
    </swiper>
    <div class="page-footer"><slot name="footer" /></div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  inheritAttrs: false,
  name: 'ListPage',
  props: ['loading', 'first', 'bottomHeight', 'toggle'],
  data() {
    const context = this;
    return {
      scroll: null,
      mouseFlag: false,
      swiperStyle: { },
      scrollTimer: [null, null, null, null, null],
      swiperOpt: {
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        mousewheel: true,
        on: {
          reachEnd(e) {
            context.$emit('scrollBottom', e);
          },
          touchMove() {
            context.setScroll();
          },
        },
      },
    };
  },
  watch: {
    loading() {
      if (this.loading) this.updateScroll();
    },
    toggle() {
      this.updateScroll(2);
    },
  },
  components: { swiper, swiperSlide },
  methods: {
    setScroll() {
      const boxEle = this.$el.querySelector('.page-slide-box');
      const bHeight = boxEle ? boxEle.offsetHeight : 0;
      const pHeight = /^\d+$/.test(this.bottomHeight) ? this.bottomHeight : 50;
      this.swiperStyle = bHeight ? { height: `${bHeight + pHeight}px` } : { };
    },
    updateScroll(num) {
      const len = num || 11;
      for (let i = 0; i < len; i += 1) {
        clearTimeout(this.scrollTimer[i]);
        this.scrollTimer[i] = setTimeout(this.setScroll, 200 * i);
      }
    },
  },
  mounted() {
    this.updateScroll();
  },
  beforeDestroy() {
    for (let i = 0; i < 11; i += 1) {
      clearTimeout(this.scrollTimer[i]);
    }
  },
};
</script>
<style lang="less">
.list-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .page-header { position: relative; z-index: 3; }
  .page-content {
    position: relative;
    flex-grow: 1;
    z-index: 1;
    width: 100%;
    .page-slide-box { padding-bottom: 10px; }
    .page-loading { width: 100%; height: 35px; margin-top: 15px; }
  }
  .page-footer { width: 100%; position: relative; z-index: 3; }
}
</style>
