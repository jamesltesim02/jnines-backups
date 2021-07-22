<template>
  <div class="welcome-page">
    <cimg
      v-if="isLite"
      class="logo agyy"
      src="./images/agyy_logo.png"
    />
    <cimg
      v-else
      class="logo"
      src="./images/login-logo.png"
    />
    <div class="buttons">
      <v-touch
        tag="button"
        @tap="$router.push('/login')"
      >{{$t('page.loginLabel')}}</v-touch>
      <br>
      <v-touch
        tag="button"
        class="btn-no-login"
        @tap="$router.replace('/')"
      >{{$t('page.guestLabel')}}</v-touch>
    </div>
  </div>
</template>
<script>
import { AppModes } from '@/config/constants';

const { APP_MODE } = window.NBConfig;

export default {
  data() {
    return {
      isLite: APP_MODE === AppModes.STANDALONE_LITE,
    };
  },
};
</script>

<style lang="less">
.welcome-page {
  position: relative;
  width: 3.75rem;
  height: 100%;
  background: #fd6b64;
  background-image: url(./images/login-bg.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .logo {
    position: absolute;
    width: 2.4rem;
    height: .88rem;
    top: 16.5%;
    left: 50%;
    transform: translateX(-50%);
  }
  .logo.agyy {
    width: auto;
    height: .72rem;
  }
  .buttons {
    position: absolute;
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
    .btn-no-login {
      color: #ecebeb;
      opacity: .8;
    }
  }
}
.webp .welcome-page {
  background-image: url(./images/login-bg.webp);
}
</style>
