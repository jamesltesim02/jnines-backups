<template>
  <div class="banner">
    <loading-bar
      full
      v-if="loading"
    />
    <no-more-bar
      full
      v-if="!hasMore"
    />
    <swiper
      v-if="banners.length"
      ref="bswiper"
      :options="swiperOption"
      @click="toUrl"
    >
      <swiper-slide
        v-for="b in banners"
        :key="b.slideID"
      >
        <cimg
          :remote="true"
          :src="`image/${b.imgWeb}`"
        />
      </swiper-slide>
    </swiper>
    <div class="swiper-pagination" slot="pagination"></div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { findSlide } from '@/api/pull';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  data() {
    return {
      loading: false,
      swiperOption: {
        loop: true,
        loopAdditionalSlides: 1,
        centeredSlides: true,
        slidesPerView: 1,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
      banners: [],
    };
  },
  computed: {
    hasMore() {
      return this.loading || this.banners.length > 0;
    },
  },
  components: {
    swiper,
    swiperSlide,
  },
  async mounted() {
    try {
      this.loading = true;
      const slideData = await findSlide();
      this.banners = slideData.filter(s => !+s.matchID);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapMutations('agyy', ['pushRouter']),
    toUrl() {
      const {
        slideTitle,
        newsBody,
        urlWeb,
      } = this.banners[this.$refs.bswiper.swiper.realIndex];

      const url = urlWeb;
      if (!url || /^\/?#\/?$/.test(url)) {
        return;
      }
      if (/^https?:\/\//i.test(url)) {
        window.open(url);
        return;
      }
      if (/^agyy:\/\//i.test(url)) {
        this.pushRouter({
          path: url.replace(/^agyy:\/\//i, '/'),
          param: {
            title: slideTitle,
            content: newsBody,
          },
        });
        return;
      }
      this.$router.push(url);
    },
  },
};
</script>
<style lang="less">
.banner {
  position: relative;
  margin-top: -34px;
  transform: translateY(2px);
  img {
    width: 100%;
    height: 335px;
  }
  .swiper-pagination {
    width: 100%;
    bottom: -16px;
    text-align: right;
    padding-right: 35px;
  }
  .swiper-pagination-bullet {
    height: 5px;
    width: 5px;
    margin-left: 10px;
    background: #ff5353;
    opacity: 1;
    transition: all .25s ease-in;
  }
  .swiper-pagination-bullet-active {
    width: 25px;
    border-radius: 100px;
  }
}
</style>
