<template>
  <div class="nb-result-head">
    <nav-bar :title="$t('pageResult.resultTitle')" />
    <div class="result-nav-box">
      <swiper :options="swiperOption" class="result-nav" >
        <swiper-slide :style="{ width: dWidth }">
          <ul class="flex-between" :style="{ width: dWidth }">
            <v-touch tag="li" v-for="(v, k) in dateArr" :ref="v.date" :key="k" :class="{ active: v.active }" @tap="changeDate(v)" >
              <div class="result-date-box flex-center-col" :style="{ background: getBtnColor(v) }" v-if="v.text[1]">
                <span class="flex-center result-date-day">{{v.text[0]}}</span>
                <span class="flex-center result-date-week">{{v.text[1]}}</span>
              </div>
              <div class="result-date-box flex-center-col" :style="{ background: getBtnColor(v) }" v-else>
                {{v.text[0]}}
              </div>
            </v-touch>
          </ul>
        </swiper-slide>
      </swiper>
    </div>
    <div class="result-total flex-between">
      <span>{{matchStr}}</span>
      <span>{{$t('pageResult.explan')}}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import NavBar from '@/components/common/NavBar';

export default {
  props: { dayNum: { default: 7 }, matchNum: { default: 0 } },
  data() {
    return {
      dateArr: [],
      selDate: null,
    };
  },
  computed: {
    ...mapState('app', ['theme']),
    swiperOption() {
      return { slidesPerView: 'auto', freeMode: true, initialSlide: this.dayNum };
    },
    dWidth() {
      let width = (this.dayNum + 4) * 0.5 + 0.24;
      width = parseInt(width * 100 + 0.999, 10);
      width = width < 375 ? 375 : width;
      return `${width / 100}rem`;
    },
    matchStr() {
      const dStr = this.selDate && this.selDate.dateStr ? this.selDate.dateStr : '';
      const wStr = this.selDate && this.selDate.weekDay ? this.selDate.weekDay : '';
      const str = `${dStr} ${this.$t('pageResult.week')}${wStr} ${this.$t('pageResult.total')}`;
      return `${str} ${this.matchNum} ${this.$t('pageResult.games')}`;
    },
  },
  components: { swiper, swiperSlide, NavBar },
  methods: {
    getDateArr() {
      let arr = [];
      for (let i = -3; i < this.dayNum + 1; i += 1) {
        const dt = new Date(Date.now() - i * 86400000);
        const obj = { date: this.dateFmt(dt.getTime(), 'YYYYMMDD') };
        obj.dateStr = `${obj.date.slice(0, 4)}-${obj.date.slice(4, 6)}-${obj.date.slice(-2)}`;
        obj.weekDay = this.$t('pageResult.weekDays')[dt.getDay()];
        [obj.text, obj.active] = [[!i ? this.$t('pageResult.today') : obj.date.slice(-2)], false];
        obj.text[1] = i ? obj.weekDay : '';
        arr = [obj].concat(arr);
      }
      return arr;
    },
    changeDate(v) {
      if (!v.active) {
        const dt = this.dateArr;
        for (let i = 0; i < dt.length; i += 1) {
          dt[i].active = `${dt[i].date}` === `${v.date}`;
        }
        [this.dateArr, this.selDate] = [dt, v];
        this.$emit('change', v.date);
      }
    },
    getBtnColor(v) {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (v.active) {
        if (/^black$/i.test(this.theme)) {
          return pSet && pSet.BLACK_BOTTON_BACKGROUND ? pSet.BLACK_BOTTON_BACKGROUND : '#ff5353';
        }
        if (/^blue$/i.test(this.theme)) {
          return pSet && pSet.BLUE_BOTTON_BACKGROUND ? pSet.BLUE_BOTTON_BACKGROUND : '#00b5b3';
        }
        return pSet && pSet.WHITE_BOTTON_BACKGROUND ? pSet.WHITE_BOTTON_BACKGROUND : '#ff5353';
      }
      return 'transparent';
    },
  },
  mounted() {
    this.dateArr = this.getDateArr();
    this.changeDate(this.dateArr[this.dateArr.length - 4]);
  },
};
</script>
<style lang="less">
.white .nb-result-head {
  background: #FFF;
  .result-nav-box {
    background: #f5f4f5;
    border-top: .01rem solid #ecebeb;
    .result-date-box { color: #858585; span { color: #716d6d; } }
    .active .result-date-box { color: #ffffff; span { color: #ffffff; } }
  }
  .result-total {
    border-top: .01rem solid #EBE9E9;
    background: linear-gradient(to top, #f5f4f5, #fbf8f8);
    color: #858585;
  }
}
.black .nb-result-head {
  background: #28272d;
  .result-nav-box {
    background: linear-gradient(to bottom, #2a292f, #29292e);
    .result-date-box { color: #858585; span { color: #716d6d; } }
    .active .result-date-box { color: #ffffff; span { color: #ffffff; } }
  }
  .result-total {
    background: linear-gradient(to bottom, #2a292f, #29292e);
    border-top: .01rem solid #242327;
    color: #858585;
  }
}
.nb-result-head {
  width: 3.75rem;
  .result-nav-box {
    width: 100%;
    height: .4rem;
    .result-nav { width: 100%; }
    ul {
      li {
        width: .32rem;
        height: .32rem;
        border-radius: 100%;
        margin: .04rem .09rem;
        overflow: hidden;
        .result-date-box {
          width: 100%;
          height: 100%;
          border-radius: 100%;
          font-size: .13rem;
          font-weight: 500;
          letter-spacing: .004rem;
          span { width: 100%; height: 45%; }
          .result-date-day { font-size: .11rem; }
          .result-date-week { font-size: .1rem; }
        }
      }
    }
  }
  .result-total {
    width: 100%;
    height: .3rem;
    font-size: .12rem;
    font-weight: 500;
    letter-spacing: .004rem;
    padding: 0 .12rem;
  }
}
</style>
