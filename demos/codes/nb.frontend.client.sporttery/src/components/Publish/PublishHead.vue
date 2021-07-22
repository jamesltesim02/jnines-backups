<template>
  <div class="nb-publish-head">
    <cimg class="publish-head-back" :src="`./img/publish/back_${actType}.png`" />
    <v-touch class="nb-publish-front" @tap="toMenuDetail">
      <swiper class="nb-publish-swipe" v-if="swipShow" :options="swiperOption" >
        <swiper-slide type="0">
          <publish-top-menu :data="data.ReturnRate" type="0" />
        </swiper-slide>
        <swiper-slide type="1">
          <publish-top-menu :data="data.LongRed" type="1" />
        </swiper-slide>
        <swiper-slide type="2">
          <publish-top-menu :data="data.HitRate" type="2" />
        </swiper-slide>
        <swiper-slide type="3">
          <publish-top-menu :data="data.Flow" type="3" />
        </swiper-slide>
        <swiper-slide type="4">
          <publish-top-menu :data="data.Commission" type="4" />
        </swiper-slide>
      </swiper>
    </v-touch>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { findShortRank } from '@/api/activity';
import PublishTopMenu from '@/components/Publish/PublishTopMenu';

export default {
  inheritAttrs: false,
  name: 'PublishHead',
  data() {
    const context = this;
    return {
      actType: 0,
      data: null,
      swiperOption: {
        loop: true,
        effect: 'coverflow',
        loopAdditionalSlides: 1,
        centeredSlides: false,
        slidesPerView: 1,
        autoplay: { delay: 3000, disableOnInteraction: false },
        coverflowEffect: {
          rotate: 0,
          stretch: 25,
          depth: 120,
          modifier: 2,
          slideShadows: false,
        },
        on: {
          slideChangeTransitionStart() {
            let actId = this.activeIndex - 2;
            actId = actId < 0 ? 0 : actId;
            actId = actId > 4 ? 0 : actId;
            context.actType = actId;
          },
        },
      },
    };
  },
  computed: {
    ...mapState('app', ['userinfo']),
    swipShow() {
      return this.getSwipShow(this.data);
    },
  },
  components: { swiper, swiperSlide, PublishTopMenu },
  methods: {
    toMenuDetail() {
      const e = window.event ? window.event : null;
      const type = e && e.target ? e.target.getAttribute('type') : '';
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (!/(publish|shine)-user/i.test(cName) && /^[0-4]$/.test(type)) {
        this.$router.push(`/ranking/${type}`);
      }
    },
    getSwipShow(dt) {
      let rst = dt && typeof dt.ReturnRate === 'object' && dt.ReturnRate.constructor === Array;
      rst = rst && typeof dt.LongRed === 'object' && dt.LongRed.constructor === Array;
      rst = rst && typeof dt.HitRate === 'object' && dt.HitRate.constructor === Array;
      rst = rst && typeof dt.Flow === 'object' && dt.Flow.constructor === Array;
      rst = rst && typeof dt.Commission === 'object' && dt.Commission.constructor === Array;
      return !!rst;
    },
    async getShortList() {
      const params = { size: 5, userId: 0 };
      if (this.userinfo && this.userinfo.token && this.userinfo.nbUser) {
        params.userId = this.userinfo.nbUser;
      }
      this.data = null;
      try {
        const dt = await findShortRank(params);
        this.data = this.getSwipShow(dt) ? dt : null;
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.getShortList();
  },
};
</script>

<style lang="less">
.nb-publish-head {
  position: relative;
  width: 3.75rem;
  height: 2.36rem;
  z-index: 1;
  .publish-head-back { position: absolute; width: 100%; height: 2.1rem; z-index: 20; }
  .nb-publish-front { position: absolute; width: 3.65rem; height: 2rem; left: .1rem; top: .3rem; z-index: 30; }
}
</style>
