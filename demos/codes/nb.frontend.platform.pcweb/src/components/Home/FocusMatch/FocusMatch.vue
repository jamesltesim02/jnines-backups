<template>
  <div :class="{
    'focus-match': true,
    'swipable': matchs && matchs.length > 0
  }">
    <h3>{{$t('page.blocktitle.focus')}}</h3>
    <div class="match-container">
      <loading-bar
        full
        v-if="loading"
      />
      <no-more-bar
        full
        v-if="!hasMore"
      />
      <swiper :options="swiperOption">
        <swiper-slide v-for="(m, i) in matchs" :key="i" >
          <FocusMatchItem :match="m" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <bet-keyboard class="fast-bet-box" :btnName="$t('pageBet.fastBet')"
      type="fast" v-if="matchs && matchs.length" clearAfter />
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import FocusMatchItem from './FocusMatchItem';
import BetKeyboard from '@/components/Bet/BetKeyboard';

export default {
  props: ['matchs', 'loading'],
  data() {
    return {
      swiperOption: {
        loop: true,
        loopAdditionalSlides: 1,
        centeredSlides: true,
        slidesPerView: 1,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
    };
  },
  computed: {
    hasMore() {
      return this.loading || this.matchs.length > 0;
    },
  },
  components: {
    swiper,
    swiperSlide,
    FocusMatchItem,
    BetKeyboard,
  },
};
</script>
<style lang="less">
.focus-match {
  padding-left: 14px;
  padding-right: 56px;
  h3 {
    color: #b0b0b0;
    font-size: 16px;
  }
  .match-container {
    position: relative;
    margin-top: 16px;
    border-radius: 6px;
    overflow: hidden;
    &::before {
      content: "";
      display: block;
      position: absolute;
      opacity: .5;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      box-shadow: 0 6px 9px 0 var(--black-50);
      background-image: linear-gradient(to bottom, #3c3b43, #33323b);
    }
    .fast-bet-box { margin: 8px 0 10px 0; }
  }
  .swiper-container {
    border-bottom: 1px solid #242529;
  }
  .loading-bar, .no-more {
    &.full {
      height: 200px;
    }
  }
  .swiper-pagination {
    bottom: 3px !important;
  }
  .swiper-pagination-bullet {
    width: 5px;
    height: 5px;
    background: #ff5353;
    margin: 0 2px;
    transition: all .35s ease-out;
  }
  .swiper-pagination-bullet-active {
    width: 10px;
    border-radius: 3px;
    opacity: .7;
  }
}
</style>
