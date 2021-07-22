<template>
  <swiper
    v-if="ads && ads.length"
    :options="swiperOption"
    class="home-ads"
  >
    <swiper-slide :style="{width: containerWidth}">
      <ul class="flex-between">
        <v-touch
          tag="li"
          v-for="(a, i) in ads"
          :key="i"
          @tap="toUrl(a.url)"
        >
          <cimg :src="a.img" :remote="true" />
        </v-touch>
      </ul>
    </swiper-slide>
  </swiper>
</template>
<script>
import { mapState } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  data() {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        freeMode: true,
      },
    };
  },
  computed: {
    ...mapState('app', ['portalInfo']),
    containerWidth() {
      return `${(1.32 + 0.16) * this.ads.length}rem`;
    },
    ads() {
      console.log(this.portalInfo);
      if (!this.portalInfo || !this.portalInfo.spreadUrl) {
        return [];
      }

      try {
        return JSON.parse(this.portalInfo.spreadUrl);
      } catch (e) {
        return [];
      }
    },
  },
  components: {
    swiper,
    swiperSlide,
  },
  methods: {
    toUrl(url) {
      if (/^https?:\/\//i.test(url)) {
        window.location = url;
      } else {
        this.$router.push(url);
      }
    },
  },
};
</script>
<style lang="less">
.home-ads {
  margin-top: .2rem;
  ul {
    padding: 0 .12rem;
    width: 100%;
    li {
      width: 1.32rem;
      img {
        width: 100%;
        height: .94rem;
        border-radius: 6px;
        margin-bottom: .05rem;
      }
    }
    div {
      font-size: .12rem;
      color: #676267;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}

.black .home-ads ul div{
  color: #b0b0b0;
}
</style>
