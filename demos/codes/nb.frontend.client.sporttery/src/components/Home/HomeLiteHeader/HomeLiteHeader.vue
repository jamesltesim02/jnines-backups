<template>
  <div @click="showVersion" class="home-lite-header">
    <cimg :src="logoUrl" v-if="logoUrl" />
    <cimg src="./home-logo.png" v-else />
    <btn-customer-service />
  </div>
</template>
<script>
import BtnCustomerService from '@/components/common/BtnCustomerService';

export default {
  data() {
    return {
      clickCount: 0,
    };
  },
  computed: {
    logoUrl() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      return pSet && pSet.HOME_LOGO_URL ? pSet.HOME_LOGO_URL : '';
    },
  },
  components: {
    BtnCustomerService,
  },
  methods: {
    showVersion() {
      if (this.clickCount < 3) {
        this.clickCount = this.clickCount + 1;
        return;
      }
      console.log('test logo click.');
    },
  },
};
</script>

<style lang="less">
.home-lite-header {
  position: relative;
  height: .44rem;
  color: #fff;
  padding: .05rem 0;
  text-align: center;
  background: #ffffff;
  img {
    height: .34rem;
    line-height: .44rem;
  }
}

.black .home-lite-header {
  background: transparent;
}
</style>
