<template>
  <div class="sign-page">
    <nav-bar :title="title" :transparent="true" />
    <v-touch
      tag="section"
      class="logo-container flex-center"
      @tap="versionCount"
    >
      <cimg src="./images/agyy_logo_1.png" />
    </v-touch>
    <slot />
  </div>
</template>
<script>
import NavBar from '@/components/common/NavBar';
import deviceInfo from '@/utils/deviceInfo';

export default {
  props: ['title'],
  data() {
    return {
      versionCounter: 0,
    };
  },
  components: {
    NavBar,
  },
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
  background: #fd6b64;
  .logo-container {
    height: 1.9rem;
    color: #fff;
    font-size: 0.18rem;
    img {
      width: 1.085rem;
      height: 1.155rem;
    }
  }
}

.standalone-lite .sign-page .logo-container img {
  height: 1.4rem;
  width: auto;
}

.black .sign-page .nav-bar {
  background: transparent;
  color: #fff;
  box-shadow: none;
}
</style>
