<template>
<div :class="{
  'match-nav-container': true,
  'seamless': isSeamless,
}">
  <swiper :options="swiperOption" class="match-nav">
    <swiper-slide :style="{ width: tWidth }">
      <ul class="flex-between" :style="{ width: tWidth }">
        <li v-for="(s, i) in sports" :key="i" :class="{ active: checkActive(s) }">
          <span :style="{ color: textColor }" v-if="checkActive(s)">{{getSnoStr(s)}}</span>
          <v-touch tag="span" @tap="$emit('update:sno', getSno(s))" v-else>{{getSnoStr(s)}}</v-touch>
          <i
            v-if="checkActive(s)"
            :style="{ boxShadow: `0 -1px 6px 0 ${textColor}`, background: lineColor }"
          ></i>
        </li>
      </ul>
    </swiper-slide>
  </swiper>
  <v-touch
    v-if="isSeamless"
    tag="button"
    class="btn-setting"
    @tap="$router.push('/settings')"
  >
    <span>
      <i></i>
      <i></i>
      <i></i>
    </span>
  </v-touch>
</div>
</template>
<script>
import { mapState } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { AppModes } from '@/config/constants';

const { APP_MODE } = window.NBConfig;
const AvailableSports = window.NBConfig.AVAILABLE_SPORTS;
const pSet = window.NBConfig.PORTAL_SETTING;

export default {
  props: { sno: { default: 10 } },
  data() {
    return {
      isSeamless: APP_MODE === AppModes.SEAMLESS,
      sports: AvailableSports,
      swiperOption: {
        slidesPerView: 'auto',
        freeMode: true,
      },
    };
  },
  computed: {
    ...mapState('app', ['theme']),
    tWidth() {
      const width = this.getTextWidth();
      const rlWidth = width[0] < 375 ? 375 : width[0];
      return `${rlWidth / 100}rem`;
    },
    textColor() {
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_MATCH_TEXT_COLOR ? pSet.BLACK_MATCH_TEXT_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_MATCH_TEXT_COLOR ? pSet.BLUE_MATCH_TEXT_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_MATCH_TEXT_COLOR ? pSet.WHITE_MATCH_TEXT_COLOR : '#ff5353';
    },
    lineColor() {
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_MATCH_LINE_COLOR ? pSet.BLACK_MATCH_LINE_COLOR : 'linear-gradient(95deg, #fe6246, rgba(245, 56, 1, 0.61))';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_MATCH_LINE_COLOR ? pSet.BLUE_MATCH_LINE_COLOR : 'linear-gradient(95deg, #00c4a5, #00c0d5)';
      }
      return pSet && pSet.WHITE_MATCH_LINE_COLOR ? pSet.WHITE_MATCH_LINE_COLOR : 'linear-gradient(95deg, #fe6246, rgba(245, 56, 1, 0.61))';
    },
  },
  components: { swiper, swiperSlide },
  methods: {
    getSno(s) {
      return typeof s === 'object' ? s.SNO || s.SPORT_ID : s;
    },
    checkActive(s) {
      return `${this.getSno(s)}` === `${this.sno}`;
    },
    getSnoStr(s) {
      return this.$t(`common.sports.${this.getSno(s)}`);
    },
    getTextWidth(id) {
      let [width, lWidth, rWidth] = [0.24, 0, 0];
      for (let i = 0; i < this.sports.length; i += 1) {
        const isActive = typeof id === 'number' && this.checkActive(this.sports[i]);
        lWidth = isActive ? width : lWidth;
        const text = this.getSnoStr(this.sports[i]);
        width += 0.3;
        for (let j = 0; j < text.length; j += 1) {
          if (/[\u4e00-\u9fa5]/.test(text[j])) {
            width += 0.18;
          } else if (/[a-z0-9]/.test(text[j])) {
            width += 0.098;
          } else {
            width += 0.115;
          }
        }
        rWidth = isActive ? width - lWidth : rWidth;
      }
      return [
        parseInt(width * 100 + 0.999, 10),
        parseInt(lWidth * 100 + 0.999, 10),
        parseInt(rWidth * 100 + 0.999, 10),
      ];
    },
  },
  mounted() {
    setTimeout(() => {
      const wArr = this.getTextWidth(+this.sno);
      if (wArr[0] > 375 && wArr[1] + wArr[2] > 375) {
        const left = wArr[1] + wArr[2] - 375;
        this.$el.querySelector('.swiper-wrapper').style.transform = `translate3d(-${left / 100}rem, 0, 0)`;
      }
    }, 200);
  },
};
</script>
<style lang="less">
.match-nav-container {
  display: flex;
  background: #fff;
  box-shadow: 0 1px 6px 0 rgba(236, 236, 236, 0.5);
  border-bottom: 0.01rem solid #ebe9e9;
  width: 3.75rem;
  &.seamless .match-nav {
    position: relative;
    width: 3.34rem;
    &::before {
      content: "";
      display: block;
      position: absolute;
      height: 0.27rem;
      width: 0;
      background: transparent;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      box-shadow: 0px 0px 40px 40px #fff;
      z-index: 2;
    }
  }
  .btn-setting {
    position: relative;
    width: .4rem;
    height: .48rem;
    span {
      display: block;
      i {
        position: relative;
        display: block;
        width: .18rem;
        height: .02rem;
        background: #909090;
        border-radius: 1rem;
        margin: 0 auto .05rem auto;
        &:last-child {
          margin-bottom: 0;
          box-sizing: border-box;
          border-right: .01rem solid #fff;
          &::before {
            content: "";
            position: absolute;
            display: block;
            height: .02rem;
            width: .02rem;
            right: .04rem;
            background: #fff;
          }
        }
      }
    }
    &::before {
      content: "";
      position: absolute;
      display: block;
      height: .27rem;
      width: 1px;
      background: #dadada;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    &::after {
      content: "";
      position: absolute;
      display: block;
      height: .27rem;
    }
  }
  .match-nav {
    width: 3.75rem;
    ul {
      li {
        position: relative;
        padding: 0.1rem 0 0.14rem 0;
        font-size: 0.18rem;
        text-align: center;
        color: #2e2f34;
        &.active {
          color: #fe6246;
        }
        &.active i {
          position: absolute;
          display: block;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0.3rem;
          height: 0.03rem;
          border-radius: 2px;
        }
        span {
          padding: 0.1rem 0.15rem 0 0.15rem;
        }
      }
    }
  }
}
.black  .match-nav-container {
  border-bottom: 0.01rem solid #222227;
  background: #28272d;
  box-shadow: none;
  .btn-setting {
    &::before {
      background: #1d1e22;
    }
    span i {
      background: #bababa;
      &:last-child {
        border-color: #28272d;
        &::before {
          background: #28272d;
        }
      }
    }
  }
  &.seamless .match-nav::before{
    box-shadow: 0px 0px 40px 40px #28272d;
  }
  .match-nav {
    ul li {
      color: #bababa;
      &.active {
        color: #fe6246;
      }
    }
  }
}
</style>
