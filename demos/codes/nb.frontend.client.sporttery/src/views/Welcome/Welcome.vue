<template>
  <div class="welcome-page" :style="backStyle" v-if="!horizScreen" >
    <cimg class="logo agyy" :src="logoUrl" v-if="logoUrl" />
    <cimg class="logo agyy" src="./images/welcome-logo.png" v-else />
    <div class="buttons">
      <v-touch tag="button" @tap="toPage" >{{$t('page.loginLabel')}}</v-touch>
      <br>
      <v-touch tag="button" class="btn-no-login" @tap="$router.replace('/')" >{{$t('page.guestLabel')}}</v-touch>
    </div>
  </div>
  <div class="welcome-page" :style="backStyle" v-else>
    <div class="welcome-page-left">
      <cimg class="logo agyy" :src="logoUrl" v-if="logoUrl" />
      <cimg class="logo agyy" src="./images/welcome-logo.png" v-else />
    </div>
    <div class="welcome-page-right">
      <div class="buttons">
        <v-touch tag="button" @tap="toPage" >{{$t('page.loginLabel')}}</v-touch>
        <br>
        <v-touch tag="button" class="btn-no-login" @tap="$router.replace('/')" >{{$t('page.guestLabel')}}</v-touch>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { AppModes } from '@/config/constants';

const { APP_MODE, PORTAL_SETTING } = window.NBConfig;

export default {
  data() {
    return {
      isLite: APP_MODE === AppModes.STANDALONE_LITE,
    };
  },
  computed: {
    ...mapState('app', ['horizScreen', 'toLoginPage']),
    logoUrl() {
      return PORTAL_SETTING && PORTAL_SETTING.WELCOME_LOGO_URL ? PORTAL_SETTING.WELCOME_LOGO_URL : '';
    },
    backStyle() {
      let urlStr = PORTAL_SETTING && PORTAL_SETTING.WELCOME_BACKGROUND_URL ? PORTAL_SETTING.WELCOME_BACKGROUND_URL : '';
      urlStr = this.horizScreen && PORTAL_SETTING && PORTAL_SETTING.WELCOME_H_BACKGROUND_URL ? PORTAL_SETTING.WELCOME_H_BACKGROUND_URL : urlStr;
      const backObj = /^[a-z]+:\/\//i.test(urlStr) ? { backgroundImage: `url(${urlStr})` } : { };
      backObj.backgroundColor = PORTAL_SETTING && PORTAL_SETTING.WELCOME_BACKGROUND_COLOR ? PORTAL_SETTING.WELCOME_BACKGROUND_COLOR : '#fd6b64';
      return backObj;
    },
  },
  methods: {
    toPage() {
      this.toLoginPage(this);
    },
  },
};
</script>

<style lang="less">
.welcome-page {
  position: relative;
  width: 3.75rem;
  height: 100%;
  background-image: url(./images/login-bg.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .welcome-page-back, .logo { position: absolute; left: 50%; transform: translateX(-50%); }
  .welcome-page-back { width: 100%; height: 100%; top: 0; }
  .logo { width: 2.4rem; height: .88rem; top: 16.5%; }
  .logo.agyy { width: auto; height: .88rem; }
  .buttons {
    position: absolute;
    right: 0;
    bottom: 8%;
    text-align: center;
    width: 100%;
    button {
      font-size: .14rem;
      width: 1.4rem;
      line-height: .4rem;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 10rem;
      margin-top: .2rem;
    }
    .btn-no-login { color: #ecebeb; opacity: .8; }
  }
}

.welcome-page-left {
  position: relative;
  float: left;
  width: 3.75rem;
  height: 100%;
  .logo { left: 15%; top: 50%; transform: translateY(-50%); }
}
.welcome-page-right {
  position: relative;
  float: right;
  width: 3.75rem;
  height: 100%;
  .buttons {
    position: absolute;
    width: 80%;
    top: 50%;
    transform: translateY(-36%);
  }
}
.horizontal .welcome-page { width: 100%; height: 100%; }
</style>
