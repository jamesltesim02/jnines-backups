<template>
  <v-touch class="list-page" @tap="clickFun">
    <div class="page-header"><slot name="header" /></div>
    <div v-if="isMobile" :class="contentClass" ref="scroller" ><slot /></div>
    <swiper v-else ref="scroller" class="page-content" :options="swiperOption" >
      <swiper-slide :style="swiperStyle">
        <v-touch class="page-slide-box" @swipeup="updateScroll"><slot /></v-touch>
      </swiper-slide>
    </swiper>
    <div class="page-footer" :style="footStyle" ><slot name="footer" /></div>
  </v-touch>
</template>

<script>
import { mapState } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import deviceInfo from '@/utils/deviceInfo';

const SCROLL_BOTTOM_HEIGHT = 20;
export default {
  inheritAttrs: false,
  name: 'ListPage',
  data() {
    const context = this;
    return {
      swiperStyle: { },
      scrollTimer: null,
      isMobile: deviceInfo.isMobile,
      swiperOption: {
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        mousewheel: true,
        on: {
          reachEnd(e) {
            context.$emit('scrollBottom', e);
          },
        },
      },
    };
  },
  props: { noPadding: Boolean },
  computed: {
    ...mapState('app', ['tabHeight', 'lockIOSSwipe']),
    rout() {
      return this.$route.path;
    },
    contentClass() {
      return `page-content ${this.lockIOSSwipe ? 'unScrollable' : 'scrollable'}`;
    },
    footStyle() {
      return this.noPadding ? { } : { paddingBottom: this.tabHeight };
    },
  },
  watch: {
    rout() {
      this.swiperStyle = { height: '1rem' };
      this.updateScroll();
    },
  },
  components: { swiper, swiperSlide },
  methods: {
    scorllTo(top) {
      this.$refs.scroller.scrollTop = top;
    },
    scrollUp() {
      const boxEle = this.$el.querySelector('.page-slide-box');
      const bHeight = boxEle ? boxEle.offsetHeight : 0;
      this.swiperStyle = bHeight ? { height: `${bHeight}px` } : { };
    },
    updateScroll() {
      this.scrollUp();
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(this.scrollUp, 1000);
    },
    clickFun() {
      this.$emit('cFun', window.event);
    },
  },
  mounted() {
    let sc = this.$refs.scroller;
    sc = sc.$el ? sc.$el : sc;
    let [trigged, scrTop] = [false, sc.scrollTop];
    sc.addEventListener('scroll', (e) => {
      const toBottom = sc.scrollHeight - sc.clientHeight - sc.scrollTop;
      this.$emit('scroll', e);
      if (toBottom <= SCROLL_BOTTOM_HEIGHT && sc.scrollTop > scrTop) {
        if (!trigged) {
          trigged = true;
          setTimeout(() => { trigged = false; }, 500);
          this.$emit('scrollBottom', e);
        }
      }
      scrTop = sc.scrollTop;
    });
    this.updateScroll();
  },
};
</script>

<style lang="less">
.list-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 3.75rem;
  .page-header {
    position: relative;
    z-index: 3;
  }
  .page-content {
    position: relative;
    flex-grow: 1;
    z-index: 1;
    width: 3.75rem;
  }
  .page-content.scrollable {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
    scroll-behavior: smooth;
  }
  .page-content.unScrollable {
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
    scroll-behavior: smooth;
  }
  .page-footer {
    width: 100%;
    position: relative;
    z-index: 3;
  }
}
</style>
