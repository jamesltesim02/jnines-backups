<template>
  <div class="banner" >
    <v-touch @tap="toUrl">
      <swiper v-if="newBanners.length" :options="swiperOption" >
        <swiper-slide v-for="(v, k) in newBanners" :key="k" :bId="v.slideID">
          <cimg :remote="true" :src="`image/${v.imgApp}`" :bId="v.slideID" />
        </swiper-slide>
      </swiper>
    </v-touch>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { AppModes } from '@/config/constants';
import deviceInfo from '@/utils/deviceInfo';
import { openInBrowser } from '@/utils/app/AppUtils';

const { APP_MODE, HOME_STYLE } = window.NBConfig;

export default {
  props: ['banners'],
  data() {
    return {
      swiperOption: {
        loop: true,
        loopAdditionalSlides: 1,
        centeredSlides: true,
        slidesPerView: HOME_STYLE === 3 ? 1 : 1.12,
        autoplay: { delay: 3000, disableOnInteraction: false },
        // 轻量包网模式 banner显示差异化
        spaceBetween: APP_MODE === AppModes.STANDALONE_LITE ? 10 : null,
      },
      isApp: deviceInfo.appInfo.isApp,
    };
  },
  computed: {
    newBanners() {
      const dt = [];
      if (!this.banners || !this.banners.length) {
        return dt;
      }
      for (let i = 0; i < this.banners.length; i += 1) {
        const item = this.banners[i];
        item.slideID = 10001 + i;
        dt.push(item);
      }
      return dt;
    },
  },
  components: { swiper, swiperSlide },
  methods: {
    ...mapMutations('app', ['updatePtObject']),
    toUrl() {
      const e = window.event ? window.event : null;
      const bId = e && e.target ? e.target.getAttribute('bId') : '';
      if (!bId) return;
      let item = null;
      for (let i = 0; i < this.newBanners.length; i += 1) {
        if (`${this.newBanners[i].slideID}` === `${bId}`) {
          item = this.newBanners[i];
          break;
        }
      }
      if (!item) return;
      const url = item.urlApp;
      if (!url || /^\/?#\/?$/.test(url)) {
        return;
      }
      if (/^https?:\/\//i.test(url)) {
        openInBrowser(url);
        return;
      }
      this.updatePtObject({ title: item.slideTitle || '', body: item.newsBody || '' });
      this.$router.push(url);
    },
  },
  mounted() {
    this.updatePtObject();
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
  .swiper-slide-prev, .swiper-slide-next {
    transform: scale(.9);
  }
  .banner-pic-box {
    width: 100%;
    height: 100%;
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
  .swiper-slide-prev, .swiper-slide-next {
    transform: none;
  }
}
.home-three .banner {
  height: 1.68rem;
  .swiper-slide {
    height: 1.68rem; border-radius: 0;
  }
  .swiper-pagination-bullets {
    bottom: .25rem;
  }
}
</style>
