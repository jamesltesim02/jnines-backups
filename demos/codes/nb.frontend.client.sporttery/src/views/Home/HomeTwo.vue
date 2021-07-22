<template>
  <list-page class="home-two" ref="listComp" v-if="!horizScreen" >
    <home-lite-header slot="header" />
    <sliders />
    <home-notice>{{$t('page.notice')}}</home-notice>
    <home-nav />
    <quick-bet ref="quickBet" />
    <hot-news />
    <promotion />
  </list-page>
  <div class="home-two" v-else>
    <div class="home-two-left">
      <home-nav />
      <quick-bet ref="quickBet" />
    </div>
    <list-page class="home-two-right" ref="listComp" >
      <home-lite-header slot="header" />
      <sliders />
      <home-notice>{{$t('page.notice')}}</home-notice>
      <hot-news />
    </list-page>
    <promotion />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import ListPage from '@/components/common/ListPage';
import HomeLiteHeader from '@/components/Home/HomeLiteHeader';
import HomeNav from '@/components/Home/HomeNav';
import Sliders from '@/components/Home/Sliders';
import QuickBet from '@/components/Home/QuickBet';
import HotNews from '@/components/Home/HotNews';
import HomeNotice from '@/components/Home/HomeNotice';
import Promotion from '@/components/Home/Promotion';

export default {
  computed: {
    ...mapState('app', ['userinfo', 'horizScreen']),
  },
  components: {
    ListPage,
    HomeLiteHeader,
    HomeNav,
    Sliders,
    QuickBet,
    HotNews,
    HomeNotice,
    Promotion,
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
.home-two .page-content {
  position: relative;
  &::before {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    width: 100%;
    height: .44rem;
    margin-top: -.44rem;
    box-shadow: 0 10px 11px 0 rgba(37, 37, 37, 0.5);
  }
}
.home-two-left { width: 3.75rem; float: left; }
.home-two-right { float: right; }
.horizontal .home-two { width: 100%; height: 100%; }
</style>
