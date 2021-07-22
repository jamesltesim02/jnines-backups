<template>
  <v-touch id="app" ref="app" :class="appClasses" @tap="setFullScreen">
    <div class="app-box" :class="{ 'nb-page-filter': nbFilterClass && openFilter }">
      <transition :name="pageName">
        <router-view />
      </transition>
      <tab-bar v-if="tbIndex.show" :index="tbIndex.id" />
      <input id="hide-input-for-copy" type="text" readonly />
      <token-refresher v-if="isLoged" />
    </div>
    <bet-pop v-if="frontId" />
    <common-toast />
  </v-touch>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { AppModes } from '@/config/constants';
import CommonToast from '@/components/common/CommonToast';
import TokenRefresher from '@/components/common/TokenRefresher';
import BetPop from '@/components/Bet/BetPop';
import TabBar from '@/components/common/TabBar';
import setPagePortal from '@/utils/setPageportal';
import deviceInfo from '@/utils/deviceInfo';

const { FRONT_ID, APP_MODE, PORTAL_SETTING } = window.NBConfig;

export default {
  data() {
    return {
      setTime: 0,
      isMobile: false,
      pageName: '',
      tbIndex: {
        id: 0,
        show: false,
        height: 0,
      },
    };
  },
  computed: {
    ...mapState('app', [
      'isLoged',
      'frontId',
      'theme',
      'scanInfo',
      'portalInfo',
      'horizScreen',
      'nbFilterClass',
      'lockIOSSwipe',
      'pageAziFlag',
    ]),
    ...mapState({
      isIphoneX: state => state.bet.isIphoneX,
      bCnt: state => state.bet.betCount,
    }),
    /**
     * 页面中需要设定的样式class
     * 主要根据不同的环境设定
     */
    appClasses() {
      return {
        // seamless模式 1: 包网  2: Seamless模式  3: 轻量包网模式
        seamless: APP_MODE === AppModes.SEAMLESS,
        'standalone-lite': APP_MODE === AppModes.STANDALONE_LITE,
        // 支持webp图片
        webp: deviceInfo.isWebpEnv,
        [`portal-${FRONT_ID}`]: true,
      };
    },
    openFilter() {
      return !!(PORTAL_SETTING && PORTAL_SETTING.BACKGROUND_FILTER);
    },
  },
  components: {
    CommonToast,
    BetPop,
    TabBar,
    TokenRefresher,
  },
  watch: {
    portalInfo(n) {
      this.setPagePortalinfo(n);
    },
    $route(to, from) {
      const [mTo, mFrom, flag] = [to.meta.index, from.meta.index, this.pageAziFlag];
      const azi = mTo > mFrom || (mTo === mFrom && flag) ? 'page-to-left' : 'page-to-right';
      this.pageName = this.horizScreen ? `${azi}-horizScreen` : azi;
      this.setFootTabIndex();
      this.setLockIOSSwipe();
      this.setPageAziFlag();
    },
    bCnt() {
      this.setFootTabIndex();
    },
    isLoged(n) {
      if (n) {
        this.loadMemberInfo();
      }
    },
  },
  methods: {
    ...mapMutations('app', ['setTabHeight', 'setHorizontal', 'setLockIOSSwipe', 'setPageAziFlag']),
    ...mapMutations(['checkIsIphoneX', 'setNewRegister']),
    ...mapActions('member', ['loadMemberInfo']),
    setPagePortalinfo(info) {
      if (info) {
        setPagePortal({
          pageTitle: this.$t('page.defaultTitle'),
          ...info,
        });
      }
    },
    checkIsNewUser() {
      setTimeout(() => {
        if (!this.isLoged && this.scanInfo && !/^102$/.test(this.$route.meta.index)) {
          this.setNewRegister(true);
        }
      }, 2000);
    },
    setFootTabIndex() {
      this.checkIsIphoneX();
      const [that, idx] = [this, this.$route.meta.index];
      const pid = parseInt(idx / 100, 10);
      this.tbIndex.id = pid - 2;
      const tShow = !this.horizScreen ? /^[2345]00$/.test(idx) : /^([2345]00|310)$/.test(idx);
      this.tbIndex.show = APP_MODE !== AppModes.SEAMLESS && tShow;
      for (let i = 0; i < 3; i += 1) {
        setTimeout(() => {
          let ht = that.isIphoneX && !/^340$/.test(idx) ? '0.15rem' : '0';
          const bottomEles = '.nb-bet-multiple,.nb-bet-double,.tab-bar';
          if (!that.horizScreen && that.$el.querySelector(bottomEles)) {
            ht = that.isIphoneX ? '0.66rem' : '0.51rem';
          } else if (!that.horizScreen && that.$el.querySelector('.nb-bet-mix-bet')) {
            ht = that.isIphoneX ? '.85rem' : '.7rem';
          }
          that.tbIndex.height = ht;
          that.setTabHeight(ht);
        }, 200 * i);
      }
    },
    setRootHorizontal() {
      const { body } = document;
      const className = `${body.className || ''}`.trim();
      const isHori = /horizontal/i.test(className);
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (pSet && pSet.BACKGROUND_STYLE_ID && /^3$/.test(window.NBConfig.HOME_STYLE)) {
        if (!/dark/i.test(className)) {
          body.className = `${className} dark`.trim();
        }
      } else if (/dark/i.test(className)) {
        body.className = className.replace(/\s*dark/i, '').replace(/\s\s+/, ' ').trim();
      }
      if ((!this.horizScreen && isHori) || (this.horizScreen && !isHori)) {
        this.setHorizontal(isHori);
      }
      this.setFootTabIndex();
    },
    setFullScreen() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      const noNeed = !!(pSet && pSet.CLICK_SET_FULL_SCREEN);
      if (!noNeed || !this.isMobile || Date.now() - this.setTime < 300000) return;
      this.setTime = Date.now();
      const de = document.documentElement;
      if (de.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (de.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (de.oRequestFullscreen) {
        document.documentElement.oRequestFullscreen();
      } else if (de.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (de.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    },
    disableScroll(event) {
      if (this.lockIOSSwipe && event && event.preventDefault) {
        event.preventDefault();
      }
      return !this.lockIOSSwipe;
    },
  },
  mounted() {
    this.loadMemberInfo();
    this.checkIsNewUser();
    this.setPagePortalinfo(this.portalInfo);
    this.isMobile = /(phone|pad|pod|ios|Android|Mobile|MQQBrowser)/i.test(window.navigator.userAgent);
    document.addEventListener('touchmove', this.disableScroll);
    window.addEventListener('resize', this.setRootHorizontal);
    this.setRootHorizontal();
    this.setTime = 0;
  },
};
</script>

<style lang="less">
.page-to-right-enter-active, .page-to-right-horizScreen-enter-active,
.page-to-right-leave-active, .page-to-right-horizScreen-leave-active,
.page-to-left-enter-active, .page-to-left-horizScreen-enter-active,
.page-to-left-leave-active, .page-to-left-horizScreen-leave-active {
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
.page-to-right-horizScreen-enter, .page-to-left-horizScreen-leave-active {
  transform: translateX(-7.5rem);
}
.page-to-left-horizScreen-enter, .page-to-right-horizScreen-leave-active {
  transform: translateX(7.5rem);
}
#app {
  position: relative;
  transition: all .5s;
  width: 3.75rem;
  height: 100%;
  z-index: 1;
  margin: 0 auto;
  overflow-x: hidden;
  #bottom-blank { width: 100%; background: transparent; }
  .app-box {width: 100%; height: 100%; }
}
.horizontal #app { width: 7.5rem; }
.nb-page-filter { filter: blur(.1rem); }
#hide-input-for-copy {
  position: absolute;
  width: 10px;
  height: 5px;
  opacity: 0;
  top: 0;
  left: 0;
}
</style>
