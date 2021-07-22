<template>
  <div class="nb-bet-teach-new" :style="teachStyle" v-if="show">
    <swiper class="nb-teach-swipe" :options="swiperOption" >
      <swiper-slide v-for="(v, k) in list" :key="k" >
        <div :class="`nb-teach-box${v && v.height ? '-h' : ''}`">
          <div class="nb-teach-basic">
            <cimg :src="v.bottom" />
          </div>
          <div class="nb-teach-front" :style="frontStyle(v)" >
            <cimg :src="v.bottom" />
          </div>
          <div class="nb-teach-cover" >
            <cimg :src="v.cover" />
          </div>
          <v-touch class="bet-teach-close flex-end" @tap="hideFun" >
            <bet-cover-close :color="closeColor" />
          </v-touch>
        </div>
      </swiper-slide>
    </swiper>
    <div class="nb-teach-pagination flex-center"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import BetCoverClose from './BetComps/BetCoverClose';

export default {
  inheritAttrs: false,
  name: 'BetTeachNew',
  data() {
    return {
      list: [],
      teachStyle: { height: `${window.innerHeight}px` },
      swiperOption: { pagination: { el: '.nb-teach-pagination' }, on: { click() { this.slideNext(0); } } },
    };
  },
  computed: {
    ...mapState({ tArr: state => state.bet.betTeachList, iphX: state => state.bet.isIphoneX }),
    ...mapState('app', { theme: state => state.theme, tArr: state => state.teachList }),
    show() {
      return !!(this.list && this.list.length);
    },
    closeColor() {
      const defColor = /black/i.test(this.theme) ? '#bababa' : '#ddd';
      return /blue/i.test(this.theme) ? '#bababa' : defColor;
    },
  },
  watch: {
    tArr() {
      this.updateList();
    },
    iphX() {
      if (this.show) {
        this.list = [];
        setTimeout(() => { this.updateList(); }, 10);
      }
    },
  },
  components: { swiper, swiperSlide, BetCoverClose },
  methods: {
    ...mapMutations('app', ['setTeachList']),
    frontStyle(v) {
      return { height: v && v.height ? v.height : '0' };
    },
    updateList() {
      const dt = [];
      this.teachStyle = { height: `${window.innerHeight}px` };
      if (this.tArr && this.tArr.length) {
        for (let i = 0; i < this.tArr.length; i += 1) {
          const foldName = /blue/i.test(this.theme) ? 'blue' : 'white';
          const coverImg = `./img/teach/${foldName}/${this.tArr[i].cover}`;
          const bottomImg = `./img/teach/${foldName}/${this.tArr[i].bottom}`;
          dt.push({ bottom: bottomImg, cover: coverImg, height: this.tArr[i].height || 0 });
        }
      }
      this.list = dt;
    },
    hideFun() {
      this.setTeachList();
    },
  },
  mounted() {
    this.updateList();
  },
};
</script>

<style lang="less">
.nb-bet-teach-new {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999999990;
  img { width: 100%; height: auto; }
  .nb-teach-swipe { width: 3.75rem; height: 100%; }
  .nb-teach-box, .nb-teach-box-h { position: relative; width: 3.75rem; height: 100%; z-index: 999999991; }
  .nb-teach-basic { position: absolute; width: 3.75rem; height: 100%; top: 0; left: 0; overflow: hidden; z-index: 999999992; }
  .nb-teach-front { position: absolute; width: 3.75rem; bottom: 0; left: 0; overflow: hidden; z-index: 999999993; img { position: absolute; bottom: 0 } }
  .nb-teach-cover { position: absolute; width: 3.75rem; height: 100%; left: 0; overflow: hidden; z-index: 999999994; }
  .nb-teach-box .nb-teach-cover { top: 0; img { position: absolute; top: 0 } }
  .nb-teach-box-h .nb-teach-cover { bottom: 0; img { position: absolute; bottom: 0 } }
  .bet-teach-close { position: absolute; width: 3.75rem; height: .5rem; padding: 0 .15rem; top: .1rem; left: 0; z-index: 999999995; }
  .nb-teach-pagination { position: absolute; width: 3.75rem; height: .5rem; left: 0; bottom: .2rem; z-index: 999999995; }
  .swiper-pagination-bullet { width: .06rem; height: .06rem; margin: 0 .03rem; background: #3a3b40; opacity: 1; }
  .swiper-pagination-bullet-active { width: .1rem; border-radius: .03rem; background: #bababa; opacity: 1; }
}
</style>
