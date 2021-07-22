<template>
  <div
    class="banner"
    :class="{
      'standalone-lite': true
    }"
  >
    <swiper
      v-if="banners && banners.length"
      :options="swiperOption"
    >
      <swiper-slide
        v-for="(b, i) in banners"
        :key="i"
      >
        <v-touch @tap="toUrl(isApp ? b.urlApp : b.urlWeb)">
          <cimg
            :remote="true"
            :src="`image/${isApp ? b.imgApp : b.imgWeb}`"
          />
        </v-touch>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { AppModes } from '@/config/constants';
import deviceInfo from '@/utils/deviceInfo';
import { openInBrowser } from '@/utils/app/AppUtils';

const { APP_MODE } = window.NBConfig;

export default {
  props: ['banners'],
  data() {
    return {
      swiperOption: {
        loop: true,
        loopAdditionalSlides: 1,
        centeredSlides: true,
        slidesPerView: 1.12,
        autoplay: true,
        autoplayTimeout: 10000,
        // 轻量包网模式 banner显示差异化
        spaceBetween: APP_MODE === AppModes.STANDALONE_LITE ? 10 : null,
      },
      isApp: deviceInfo.appInfo.isApp,
    };
  },
  components: {
    swiper,
    swiperSlide,
  },
  methods: {
    toUrl(url) {
      if (!url || /^\/?#\/?$/.test(url)) {
        return;
      }
      if (/^https?:\/\//i.test(url)) {
        openInBrowser(url);
        return;
      }
      this.$router.push(url);
    },
  },
};
</script>
<style lang="less">
.banner {
  width: 3.75rem;
  height: 1.62rem;
  .swiper-slide {
    height: 1.62rem;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0px -4px 8px 1px rgba(255, 74, 74, 0.17);
  }

  .swiper-slide-prev,
  .swiper-slide-next {
    transform: scale(.9);
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.standalone-lite .banner {
  .swiper-slide {
    box-shadow: none;
  }
  .swiper-slide-prev,
  .swiper-slide-next {
    transform: none;
  }
}
</style>
