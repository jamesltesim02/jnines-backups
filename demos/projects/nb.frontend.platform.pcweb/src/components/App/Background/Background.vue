<template>
  <div class="background">
    <div class="left">
      <cimg :src="leftBg" />
    </div>
    <div class="right">
      <cimg :src="rightBg" />
    </div>
    <div class="blank-holder"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import deviceInfo from '@/utils/deviceInfo';

const bgs = {
  // 白色jpg背景
  'white-left-jpg': require('./images/white/background-left.jpg'),
  'white-right-jpg': require('./images/white/background-right.jpg'),
  // 白色webp背景
  'white-left-webp': require('./images/white/background-left.webp'),
  'white-right-webp': require('./images/white/background-right.webp'),

  // 黑色jpg背景
  'dark-left-jpg': require('./images/dark/background-left.jpg'),
  'dark-right-jpg': require('./images/dark/background-right.jpg'),
  // 黑色webp背景
  'dark-left-webp': require('./images/dark/background-left.webp'),
  'dark-right-webp': require('./images/dark/background-right.webp'),
};

export default {
  data() {
    return {
      isWebpEnv: deviceInfo.isWebpEnv,
      appWidth: document.body.clientWidth,
    };
  },
  computed: {
    ...mapState('app', ['theme']),
    leftBg() {
      return bgs[`${this.theme}-left-${this.isWebpEnv ? 'webp' : 'jpg'}`];
    },
    rightBg() {
      return bgs[`${this.theme}-right-${this.isWebpEnv ? 'webp' : 'jpg'}`];
    },
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.appWidth = document.body.clientWidth;
    });
  },
};
</script>
<style lang="less">
.background {
  position: fixed;
  display: flex;
  height: 100%;
  width: 100%;
  top: 0;
  z-index: -1;
  .left {
    position: relative;
    height: 100%;
    width: calc((100% - 1440px)/2);
    overflow: hidden;
    background: #28272D;
    z-index: 2;
    img {
      height: 100%;
      opacity: .6;
    }
  }
  .right {
    position: relative;
    height: 100%;
    flex-grow: 1;
    width: calc((100% + 1440px)/2);
    background: #2C2629;
    overflow: hidden;
    z-index: 1;
    img {
      filter: blur(2px);
      position: absolute;
      right: 0;
      height: 120%;
    }
  }
  .blank-holder {
    position: absolute;
    top: 0;
    border-radius: 0;
    box-shadow: 0 2px 4px 0 rgba(236, 236, 236, 0.77);
    background: rgba(246, 247, 249, .9);
    width: 100%;
    max-width: 1440px;
    height: 100%;
    z-index: 2;
    left: 50%;
    transform: translateX(-50%);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
}
.dark .background {
  .left img {
    opacity: 1;
  }
  .blank-holder {
    background: #28272d;
    box-shadow: none;
  }
}
</style>
