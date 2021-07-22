<template>
  <list-page
    class="home-lite"
    ref="listComp"
  >
    <home-lite-header slot="header" />
    <sliders />
    <home-nav />
    <quick-bet ref="quickBet" />
    <hot-news />
  </list-page>
</template>
<script>
import ListPage from '@/components/common/ListPage';
import HomeLiteHeader from '@/components/Home/HomeLiteHeader';
import HomeNav from '@/components/Home/HomeNav';
import Sliders from '@/components/Home/Sliders';
import QuickBet from '@/components/Home/QuickBet';
import HotNews from '@/components/Home/HotNews';

const BET_TOGGLE_ATTR = '$store.state.bet.betCount';

export default {
  watch: {
    [BET_TOGGLE_ATTR](n) {
      if (n > 0) {
        this.$refs.listComp.scorllTo(this.$refs.quickBet.$el.offsetTop);
      }
    },
  },
  components: {
    ListPage,
    HomeLiteHeader,
    HomeNav,
    Sliders,
    QuickBet,
    HotNews,
  },
};
</script>
<style lang="less">
.home-lite .page-content {
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
</style>
