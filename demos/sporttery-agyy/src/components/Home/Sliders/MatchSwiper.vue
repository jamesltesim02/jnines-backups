<template>
  <div class="match-swiper">
    <swiper
      v-if="matchs && matchs.length"
      :options="swiperOption"
    >
      <swiper-slide
        v-for="({ slideMatch: m, matchID }, i) in matchs"
        :key="i"
      >
        <v-touch @tap="$router.push(`/detail/${m.sportID}/${matchID}`)">
          <div class="slide-title">
            <span class="startdate">{{m.matchDate | dateFormat('MM/dd')}}</span>
            <span class="tourname">{{m.tournamentName}}</span>
            <live-flag :active="false" />
            <span class="starttime">{{m.matchDate | dateFormat('HH:mm')}}</span>
          </div>
          <div class="ah-row">
            <span>{{m.competitor1Name}}</span>
            <i></i>
            <span>{{m.competitor2Name}}</span>
          </div>
        </v-touch>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import LiveFlag from '@/components/common/LiveFlag';

export default {
  props: ['matchs'],
  data() {
    return {
      swiperOption: {
        direction: 'vertical',
        autoplay: true,
        autoplayTimeout: 15000,
        pagination: {
          el: '.swiper-pagination',
        },
      },
    };
  },
  components: {
    swiper,
    swiperSlide,
    LiveFlag,
  },
};
</script>
<style lang="less">
.match-swiper {
  position: relative;
  margin-top: .2rem;
  width: 3.75rem;
  &::before {
    content: "";
    display: block;
    position: absolute;
    height: .64rem;
    width: 3.21rem;
    top: 0;
    left: .26rem;
    box-shadow: 0 10px 20px 0 rgba(242, 228, 233, 0.5);
    background-image: linear-gradient(-42deg, #F9F9F9 0%, #FFFFFF 100%);
    border: 1px solid #F8ECEF;
    border-radius: 6px;
  }

  .swiper-container {
    padding: 0 .26rem;
    height: .66rem;
  }


  .swiper-slide {
    padding: .1rem;
  }

  .slide-title {
    position: relative;
    display: flex;
    padding-left: .3rem;
  }
  .startdate {
    position: absolute;
    display: inline-block;
    color: #fff;
    font-size: .12rem;
    background-image: linear-gradient(137deg, #967EEC 0%, #C47AD1 32%, #F86EA7 73%, #FFAECF 100%);
    left: -.3rem;
    top: -.04rem;
    padding: .05rem .13rem .05rem .05rem;
    border-top-right-radius: 10rem;
    border-bottom-right-radius: 10rem;
  }

  .tourname {
    flex-grow: 1;
    font-size: .14rem;
    color: #BABABA;
  }

  .starttime {
    padding: 0 .08rem;
    color: #888;
  }

  .ah-row {
    display: flex;
    margin-top: .05rem;
    span {
      display: inline-block;
      flex-grow: 1;
      text-align: center;
      font-size: .16rem;
      color: #666666;
      font-weight: 500;
    }
    i {
      position: relative;
      display: inline-block;
      width: .12rem;
      height: .03rem;
      background-image: linear-gradient(137deg, #967EEC 0%, #C47AD1 32%, #F86EA7 73%, #FFAECF 100%);
      border-radius: .015rem;
      top: .09rem;
    }
  }

  .swiper-container-vertical > .swiper-pagination-bullets {
    right: .15rem;
  }

  .swiper-pagination-bullet {
    height: .05rem;
    width: .05rem;
  }

  .swiper-pagination-bullet-active {
    background: #FE617C;
  }
}

.black .match-swiper {
  &::before {
    box-shadow: 0 10px 20px 0 rgba(37, 37, 37, 0.5);
    border-color: transparent;
    background: #28272d;
    background-image: linear-gradient(116deg, #3d4046, #35363c);
  }

  .startdate {
    background-image: linear-gradient(103deg, #fe597d, #ffb775);
  }
  .tourname {
    color: #cccfdc;
  }
  .swiper-pagination-bullet {
    background: #fff;
    opacity: 1;
  }
  .swiper-pagination-bullet-active {
    background: #FE617C;
    opacity: 1;
  }

  .ah-row {
    span {
      color: #e8e6e8;
    }
    i {
      background-image: linear-gradient(96deg, #fe597d, #ffb775);
    }
  }
}
</style>
