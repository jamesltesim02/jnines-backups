<template>
  <div class="list-page">
    <div class="page-header"><slot name="header" /></div>
    <div v-if="isMobile" class="page-content scrollable" ref="scroller"><slot /></div>
    <swiper
      v-else
      ref="scroller"
      class="page-content"
      :options="swiperOption"
    >
      <swiper-slide><slot /></swiper-slide>
    </swiper>
    <div class="page-footer" :style="{ paddingBottom: tabHeight }">
      <slot name="footer" />
    </div>
  </div>
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
  computed: {
    ...mapState('app', ['tabHeight']),
  },
  components: {
    swiper,
    swiperSlide,
  },
  mounted() {
    let sc = this.$refs.scroller;
    if (sc.$el) {
      sc = sc.$el;
    }
    let [trigged, scrTop] = [false, sc.scrollTop];
    sc.addEventListener('scroll', (e) => {
      const toBottom = sc.scrollHeight - sc.clientHeight - sc.scrollTop;
      if (toBottom <= SCROLL_BOTTOM_HEIGHT && sc.scrollTop > scrTop) {
        if (!trigged) {
          trigged = true;
          setTimeout(() => { trigged = false; }, 500);
          this.$emit('scrollBottom', e);
        }
      }
      scrTop = sc.scrollTop;
    });
  },
  methods: {
    scorllTo(top) {
      this.$refs.scroller.scrollTop = top;
    },
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
  }
  .page-content .swiper-slide {
    padding-bottom: .1rem;
  }

  .page-footer {
    width: 100%;
    position: relative;
    z-index: 3;
  }
}
</style>
