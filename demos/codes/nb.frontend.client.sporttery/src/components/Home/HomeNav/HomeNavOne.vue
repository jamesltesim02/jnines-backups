<template>
  <div class="home-nav-one">
    <swiper :options="swiperOption" class="sport-menus" >
      <swiper-slide :style="{width: menuWidth}">
        <ul :style="{width: menuWidth}" class="flex-between">
          <v-touch
            tag="li"
            v-for="(sno, i) in sports"
            :key="i"
            @tap="toMatch(sno)"
          >
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
      width = width < 375 ? 375 : width;
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
.home-nav-one {
  display: flex;
  width: 3.75rem;
  .btn-setting { display: block; padding: .11rem .12rem .12rem; }
  .sport-menus { flex-grow: 1; ul { padding: .04rem 0; } }
  li {
    padding: .04rem 0;
    color: #fff;
    width: .56rem;
    text-align: center;
  }
  .icon-container {
    width: 100%;
    height: .3rem;
    background-image: linear-gradient(180deg, #FFF0F0 4%, #E8DFDF 98%);
    border-radius: 6px;
    margin-bottom: .03rem;
  }
}
.standalone-lite .home-nav-one {
  position: relative;
  margin-top: -.02rem;
  padding-top: .15rem;
  z-index: 2;
  border-radius: 6px;
  box-shadow: 0 -4px 4px 0 var(--black-50);
  margin-bottom: .2rem;
  ul {
    padding: 0 .12rem;
  }
  li {
    position: relative;
    width: .66rem;
    padding: .04rem;
    border-radius: 6px;
    background: linear-gradient(#dcdcdc,#ebe9e9);
    color: #909090;
    * { position: relative; z-index: 1; }
    &::before {
      position: absolute;
      content: "";
      display: block;
      top: .01rem;
      bottom: .01rem;
      left: .01rem;
      right: .01rem;
      background: #f5f4f5;
      border-radius: 6px;
      z-index: 0;
    }
  }
  .icon-container { background: transparent; }
}
.black .standalone-lite .home-nav-one {
  background: #28272d;
  border-top: 1px solid #3a393f;
  li {
    color: #909090;
    background: linear-gradient(#3C3B43,#2B2A31);
    &::before { background: #28272d; }
  }
}
.horizontal .home-nav-one {
  margin-top: -.05rem;
  margin-bottom: .05rem;
  li { width: .74rem; }
}
</style>
