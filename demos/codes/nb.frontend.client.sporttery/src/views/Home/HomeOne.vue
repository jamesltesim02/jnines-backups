<template>
  <list-page class="home-one" v-if="!horizScreen">
    <home-nav slot="header" />
    <sliders />
    <home-notice>{{$t('page.notice')}}</home-notice>
    <ads />
    <hot-news />
  </list-page>
  <div class="hori-home-one" v-else>
    <div class="home-one-left">
      <home-nav />
      <sliders />
      <home-notice>{{$t('page.notice')}}</home-notice>
    </div>
    <list-page class="home-one-right" ref="listComp" >
      <ads slot="header" />
      <hot-news />
    </list-page>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ListPage from '@/components/common/ListPage';
import HomeNav from '@/components/Home/HomeNav';
import Sliders from '@/components/Home/Sliders';
import Ads from '@/components/Home/Ads';
import HotNews from '@/components/Home/HotNews';
import HomeNotice from '@/components/Home/HomeNotice';

export default {
  computed: {
    ...mapState('app', ['userinfo', 'horizScreen']),
  },
  components: {
    ListPage,
    HomeNav,
    Sliders,
    Ads,
    HotNews,
    HomeNotice,
  },
  methods: {
    ...mapActions('app', ['transferToNB']),
  },
  mounted() {
    if (this.userinfo && this.userinfo.token) {
      this.transferToNB();
    }
  },
};
</script>
<style lang="less">
.home-one, .home-one-left { background-image: url(./images/white_bg.png); background-repeat: no-repeat; background-size: 100%; }
.webp .home-one, .webp .home-one-left { background-image: url(./images/white_bg.webp); }
.black .home-one, .black .home-one-left { background-image: url(./images/black_bg.png); }
.black .webp .home-one, .black .webp .home-one-left { background-image: url(./images/black_bg.webp); }
.home-one .home-nav { margin-top: -.08rem; }
.home-one-left { width: 3.75rem; float: left; }
.home-one-right { float: right; }
.horizontal .hori-home-one { width: 100%; height: 100%; }
</style>
