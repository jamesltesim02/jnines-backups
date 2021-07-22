<template>
  <div class="home-nav-two">
    <swiper :options="swiperOption" class="sport-menus" >
      <swiper-slide :style="{width: menuWidth}">
        <ul :style="{width: menuWidth}" class="flex-between">
          <v-touch tag="li" v-for="(sno, i) in sports" :key="i" @tap="toMatch(sno)" >
            <div class="icon-container flex-center">
              <icon-sports :sno="getSno(sno)" />
            </div>
            <div>{{getSnoStr(sno)}}</div>
          </v-touch>
        </ul>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import { mapState } from 'vuex';
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
    ...mapState('app', ['horizScreen']),
    menuWidth() {
      let width = APP_MODE === AppModes.STANDALONE_LITE ? 0.76 : 0.66;
      width = this.horizScreen ? 0.84 : width;
      width = this.sports.length * width + 0.24;
      width = parseInt(width * 100 + 0.999, 10);
      width = width < 355 ? 355 : width;
      return `${width / 100}rem`;
    },
  },
  components: { IconSports, swiper, swiperSlide },
  methods: {
    getSno(s) {
      return typeof s === 'object' ? s.SNO || s.SPORT_ID : s;
    },
    getSnoStr(s) {
      let str = this.getSno(s);
      str = `common.sports.${str}`;
      return this.$t(str);
    },
    toMatch(s) {
      this.$router.push(`/matchs/0/${this.getSno(s)}`);
    },
  },
};
</script>
<style lang="less">
.home-nav-two {
  position: relative;
  display: flex;
  width: 3.55rem;
  height: .71rem;
  margin: -.22rem auto 0;
  border-radius: .1rem;
  z-index: 5200;
  transform: translateZ(.1rem);
  background: linear-gradient(#ebe9e9,#f1f1f1);
  .swiper-slide {
    padding: .06rem 0 !important;
  }
  li {
    position: relative;
    padding: .04rem 0;
    color: #fff;
    width: .66rem;
    text-align: center;
    padding: .04rem;
    border-radius: 6px;
    color: #909090;
    * { position: relative; z-index: 5100; }
  }
  .icon-container {
    width: 100%;
    height: .3rem;
    background: transparent;
    border-radius: 6px;
    margin-bottom: .03rem;
  }
}
.black .home-nav-two {
  background: linear-gradient(to bottom, #3a393f, #2c2b31);
  li { color: #909090; background: transparent; }
}
.black.dark .home-nav-two {
  background: linear-gradient(to bottom, #252528, #1c1c1f);;
}
.horizontal .home-nav-two {
  li { width: .74rem; }
}
</style>
