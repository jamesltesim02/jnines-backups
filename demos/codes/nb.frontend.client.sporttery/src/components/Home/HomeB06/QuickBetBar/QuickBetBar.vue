<template>
  <div class="quik-bet-bar-b06">
    <swiper :options="swiperOption">
      <swiper-slide
        v-for="(m, i) in matchs"
        :key="i"
      >
        <quick-item :slide="m" />
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import QuickItem from './QuickItem';

export default {
  props: ['matchs'],
  data() {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
        },
      },
    };
  },
  components: {
    swiper,
    swiperSlide,
    QuickItem,
  },
};
</script>

<style lang="less">
.quik-bet-bar-b06 {
  background-image: url(./images/quick-bet-bg.jpg);
  background-size: 100% 100%;
  padding-top: .58rem;
  padding-bottom: .1rem;
  .swiper-pagination {
    bottom: -.02rem;
    .swiper-pagination-bullet {
      background: #ff5353;
      opacity: .2;
      height: 6px;
      width: 6px;
      transition: all .25s ease-out;
    }
    .swiper-pagination-bullet-active {
      opacity: .5;
      width: 14px;
      border-radius: 10rem;
    }
  }
}
.webp .quik-bet-bar-b06 {
  background-image: url(./images/quick-bet-bg.webp);
}
</style>
