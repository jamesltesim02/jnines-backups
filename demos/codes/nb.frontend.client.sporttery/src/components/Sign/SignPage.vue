<template>
  <div class="sign-page" :style="backStyle" v-if="!horizScreen">
    <nav-bar :title="title" :transparent="true" />
    <v-touch tag="section" class="logo-container flex-center"  @tap="versionCount" >
      <cimg :src="logoUrl" v-if="logoUrl" />
      <cimg src="./images/login-logo.png" v-else />
    </v-touch>
    <slot />
    <login-register-toggle v-if="!centerUrl"
      :to="`/${/login/.test(type) ? 'register' : 'login'}`"
      :label="$t(`page.toggle${/login/.test(type) ? 'Register' : 'Login'}`)"
    />
  </div>
  <div class="sign-page" :style="backStyle" v-else>
    <div class="sign-page-left">
      <nav-bar :title="title" :transparent="true" />
      <v-touch tag="section" class="logo-container flex-center" @tap="versionCount" >
        <cimg :src="logoUrl" v-if="logoUrl" />
        <cimg src="./images/login-logo.png" v-else />
      </v-touch>
      <login-register-toggle v-if="!centerUrl"
        :to="`/${/login/.test(type) ? 'register' : 'login'}`"
        :label="$t(`page.toggle${/login/.test(type) ? 'Register' : 'Login'}`)"
      />
    </div>
    <div class="sign-page-right"><slot /></div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import NavBar from '@/components/common/NavBar';
import deviceInfo from '@/utils/deviceInfo';
import LoginRegisterToggle from '@/components/Sign/LoginRegisterToggle';

const pSet = window.NBConfig.PORTAL_SETTING;

export default {
  props: ['title', 'type'],
  data() {
    return { versionCounter: 0 };
  },
  computed: {
    ...mapState('app', ['horizScreen']),
    logoUrl() {
      return pSet && pSet.LOGIN_LOGO_URL ? pSet.LOGIN_LOGO_URL : '';
    },
    centerUrl() {
      return pSet && pSet.USER_CENTER_URL ? pSet.USER_CENTER_URL : '';
    },
    backStyle() {
      return { backgroundColor: pSet && pSet.WELCOME_BACKGROUND_COLOR ? pSet.WELCOME_BACKGROUND_COLOR : '#fd6b64' };
    },
  },
  components: { NavBar, LoginRegisterToggle },
  methods: {
    versionCount() {
      this.versionCounter += 1;
      if (this.versionCounter % 5 === 0) {
        this.$toast.top(deviceInfo.appInfo.appua);
      }
    },
  },
};
</script>

<style lang="less">
.sign-page {
  position: relative;
  height: 100%;
  width: 3.75rem;
  min-height: 5.5rem;
  background: url(./images/background.jpg) no-repeat;
  background-size: cover;
  .logo-container {
    height: 1.9rem;
    color: #fff;
    font-size: 0.18rem;
    img { width: auto; height: auto; max-width: 2.5rem; max-height: 1.155rem; }
  }
  .input-field { padding: 0 .28rem; }
  .input-field::after { left: .28rem; width: 3.19rem; }
  .submit { padding: 0 .3rem; }
}
.standalone-lite .sign-page .logo-container img { height: 1.4rem; width: auto; }
.black .sign-page .nav-bar { background: transparent; color: #fff; box-shadow: none; }
.sign-page-left {
  position: relative;
  float: left;
  width: 3.75rem;
  height: 100%;
  .logo-container { height: 2.2rem; }
}
.sign-page-right {
  position: relative;
  float: right;
  width: 3.75rem;
  height: 100%;
  padding-top: .2rem;
}
.horizontal .sign-page { width: 100%; height: 100%; min-height: 2.5rem; }
</style>
