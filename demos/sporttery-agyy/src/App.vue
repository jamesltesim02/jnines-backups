<template>
  <div id="app" ref="app" :class="appClasses">
    <transition :name="pageName">
      <router-view />
    </transition>
    <tab-bar v-if="tbIndex.show" :index="tbIndex.id" />
    <input id="hide-input-for-copy" type="text" readonly />
    <bet-pop v-if="frontId" />
    <payment-order-popup />
    <payment-portal />
    <common-toast />
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { AppModes } from '@/config/constants';
import CommonToast from '@/components/common/CommonToast';
import PaymentOrderPopup from '@/components/Payment/OrderPopup';
import PaymentPortal from '@/components/Payment/PaymentPortal';
import BetPop from '@/components/Bet/BetPop';
import TabBar from '@/components/common/TabBar';
import setPagePortal from '@/utils/setPageportal';
import deviceInfo from '@/utils/deviceInfo';

const { APP_MODE } = window.NBConfig;

export default {
  data() {
    return {
      pageName: '',
      tbIndex: {
        id: 0,
        show: false,
        height: 0,
      },
    };
  },
  computed: {
    ...mapState({ isIphoneX: state => state.bet.isIphoneX, bCnt: state => state.bet.betCount }),
    ...mapState('app', ['frontId', 'theme', 'portalInfo']),
    /**
     * 页面中需要设定的样式class
     * 主要根据不同的环境设定
     */
    appClasses() {
      return {
        // 当前皮肤 white 白色, black 黑色
        [this.theme]: true,
        // seamless模式 1: 包网  2: Seamless模式  3: 轻量包网模式
        seamless: APP_MODE === AppModes.SEAMLESS,
        'standalone-lite': APP_MODE === AppModes.STANDALONE_LITE,
        // 支持webp图片
        webp: deviceInfo.isWebpEnv,
      };
    },
  },
  components: {
    CommonToast,
    BetPop,
    TabBar,
    PaymentOrderPopup,
    PaymentPortal,
  },
  watch: {
    portalInfo(n) {
      this.setPagePortalinfo(n);
    },
    $route(to, from) {
      this.pageName = to.meta.index > from.meta.index ? 'page-to-left' : 'page-to-right';
      this.setFootTabIndex();
    },
    bCnt() {
      this.setFootTabIndex();
    },
  },
  methods: {
    ...mapMutations('app', ['setTabHeight']),
    setPagePortalinfo(info) {
      if (info) {
        setPagePortal({
          pageTitle: this.$t('page.defaultTitle'),
          ...info,
        });
      }
    },
    setFootTabIndex() {
      const idx = this.$route.meta.index;
      const pid = parseInt(idx / 100, 10);
      this.tbIndex.id = pid - 2;
      this.tbIndex.show = APP_MODE !== AppModes.SEAMLESS && /^[234]00$/.test(idx);
      setTimeout(() => {
        let ht = this.isIphoneX ? '0.15rem' : '0';
        if (this.$el.querySelector('.nb-bet-multiple,.nb-bet-double,.tab-bar')) {
          ht = this.isIphoneX ? '0.66rem' : '0.51rem';
        }
        this.tbIndex.height = ht;
        this.setTabHeight(ht);
      }, 200);
    },
  },
  mounted() {
    this.setFootTabIndex();
    this.setPagePortalinfo(this.portalInfo);
  },
};
</script>

<style lang="less">
.page-to-right-enter-active,
.page-to-right-leave-active,
.page-to-left-enter-active,
.page-to-left-leave-active {
  will-change: transform;
  transition: all .25s ease-out;
  position: absolute;
}
.page-to-right-enter, .page-to-left-leave-active {
  transform: translateX(-3.75rem);
}
.page-to-left-enter, .page-to-right-leave-active {
  transform: translateX(3.75rem);
}

#app {
  position: relative;
  transition: all .5s;
  height: 100%;
  z-index: 1;
  width: 3.75rem;
  margin: 0 auto;
  overflow-x: hidden;
  #bottom-blank {
    width: 100%;
    background: transparent;
  }
}
#hide-input-for-copy {
  position: absolute;
  width: 10px;
  height: 5px;
  opacity: 0;
  top: 0;
  left: 0;
}
</style>
