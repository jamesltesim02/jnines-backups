<template>
  <div class="home-nav">
    <swiper
      :options="swiperOption"
      class="sport-menus"
    >
      <swiper-slide :style="{width: menuWidth}">
        <ul :style="{width: menuWidth}" class="flex-around">
          <v-touch
            tag="li"
            v-for="(sno, i) in sports"
            :key="i"
            @tap="$router.push(`/matchs/0/${sno}`)"
          >
            <div class="icon-container flex-center">
              <icon-sports :sno="sno" />
            </div>
            <div>{{$t(`common.sports.${sno}`)}}</div>
          </v-touch>
        </ul>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { AppModes } from '@/config/constants';
import IconSports from './icons/IconSports';

const AvailableSports = window.NBConfig.AVAILABLE_SPORTS;
const { APP_MODE } = window.NBConfig;

export default {
  data() {
    return {
      sports: AvailableSports,
      swiperOption: {
        slidesPerView: 'auto',
        freeMode: true,
      },
    };
  },
  computed: {
    menuWidth() {
      return `${
        this.sports.length
        * (APP_MODE === AppModes.STANDALONE_LITE ? 0.76 : 0.66)
        + 0.24
      }rem`;
    },
  },
  components: {
    IconSports,
    swiper,
    swiperSlide,
  },
};
</script>
<style lang="less">
.home-nav {
  display: flex;
  width: 3.75rem;
  .btn-setting {
    display: block;
    padding: .11rem .12rem .12rem;
  }
  .sport-menus {
    flex-grow: 1;
    ul {
      padding: .04rem 0;
    }
  }

  li {
    padding: .04rem 0;
    color: #fff;
    width: .56rem;
    text-align: center;
  }
  .icon-container {
    width: .56rem;
    height: .3rem;
    background-image: linear-gradient(180deg, #FFF0F0 4%, #E8DFDF 98%);
    border-radius: 6px;
    margin-bottom: .03rem;
  }
}

.standalone-lite .home-nav {
  position: relative;
  margin-top: -.16rem;
  padding-top: .11rem;
  z-index: 2;
  border-radius: 6px;
  ul {
    padding: .04rem .08rem;
  }
  li {
    position: relative;
    width: .66rem;
    padding: .04rem;
    border-radius: 6px;
    background: linear-gradient(#dcdcdc,#ebe9e9);
    color: #909090;
    * {
      position: relative;
      z-index: 1;
    }
    &::before {
      position: absolute;
      content: "";
      display: block;
      width: .64rem;
      height: .56rem;
      top: .01rem;
      left: .01rem;
      background: #f5f4f5;
      border-radius: 6px;
      z-index: 0;
    }
  }
  .icon-container {
    background: transparent;
  }
  g[fill-rule="nonzero"] {
    fill: #ff5353;
  }
}

.black.standalone-lite .home-nav {
  background: #28272d;
  border-top: 1px solid #3a393f;
  li {
    color: #909090;
    background: linear-gradient(#3C3B43,#2B2A31);
    &::before {
      background: #28272d;
    }
  }
}

.black .home-nav { }
</style>
