<template>

  <swiper
    :options="swiperOption"
    class="match-nav"
  >
    <swiper-slide style="width: 7.22rem">
      <ul style="width: 7.22rem">
        <v-touch
          tag="li"
          v-for="(s, i) in sports"
          :key="i"
          :class="{
            active: s === +sno
          }"
          @tap="$emit('update:sno', s)"
        >{{$t(`common.sports.${s}`)}}</v-touch>
      </ul>
    </swiper-slide>
  </swiper>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';

const AvailableSports = window.NBConfig.AVAILABLE_SPORTS;

export default {
  props: {
    sno: {
      default: 10,
    },
  },
  data() {
    return {
      sports: AvailableSports,
      swiperOption: {
        slidesPerView: 'auto',
        freeMode: true,
      },
    };
  },
  components: {
    swiper,
    swiperSlide,
  },
};
</script>
<style lang="less">
.match-nav {
  background: #fff;
  box-shadow: 0 1px 6px 0 rgba(236, 236, 236, 0.5);
  width: 3.75rem;
  ul {
    display: flex;
    li {
      position: relative;
      padding: .1rem .15rem .14rem .15rem;
      font-size: .18rem;
      text-align: center;
      color: #2e2f34;
      &.active {
        color: #fe6246;
      }
      &.active::before {
        content: "";
        position: absolute;
        display: block;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: .3rem;
        height: .03rem;
        border-radius: 2px;
        box-shadow: 0 -1px 6px 0 #fae5f5;
        background-image: linear-gradient(95deg, #fe6246, rgba(245, 56, 1, 0.61));
      }
    }
  }
}

.black .match-nav {
  background: #28272d;
  box-shadow: none;
  ul li {
    color: #bababa;
    &.active {
      color: #fe6246;
    }
    &.active::before {
      box-shadow: 0 -1px 6px 0 #ff5353;
    }
  }
}
</style>
