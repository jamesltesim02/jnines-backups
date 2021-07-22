<template>
  <div
    :class="[
      'app',
      theme || 'black',
      isWebpEnv ? 'webp' : '',
    ]"
  >
    <background />
    <div class="container">
      <router-view />
    </div>
    <bet-pop />
    <customer-service />
    <common-toast />
    <sports-chooser />
    <game-rules />
    <!-- 篮球世界杯活动,赛完删除 start -->
    <!-- <basketball-cup side="left" />
    <basketball-cup side="right" /> -->
    <!-- 篮球世界杯活动,赛完删除 end -->
  </div>
</template>
<script>
import { mapState } from 'vuex';
import deviceInfo from '@/utils/deviceInfo';
import Background from '@/components/App/Background';
import CommonToast from '@/components/common/CommonToast';
import CustomerService from '@/components/XSports/CustomerService';
import BetPop from '@/components/Bet/BetPop';
import SportsChooser from '@/components/XSports/LeftBar/SportsList/SportsChooser';
import GameRules from '@/components/XSports/GameRules';
// import BasketballCup from '@/components/Promotions/BasketballCup';

export default {
  computed: {
    ...mapState('app', ['theme']),
    isWebpEnv: () => deviceInfo.isWebpEnv,
  },
  components: {
    Background,
    BetPop,
    CommonToast,
    CustomerService,
    SportsChooser,
    GameRules,
    // BasketballCup,
  },
};
</script>
<style lang="less">
.app {
  position: relative;
  height: 100%;
  overflow: hidden;
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 1440px;
    min-width: 768px;
    z-index: 1;
    margin: 0 auto;
  }
}
</style>
