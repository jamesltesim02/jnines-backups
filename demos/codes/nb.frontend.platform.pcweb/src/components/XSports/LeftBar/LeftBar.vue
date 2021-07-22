<template>
  <div class="x-left-bar">
    <div class="logo">
      <cimg :src="logo" />
    </div>
    <sports-list
      :sno="sno"
      :mid="mid"
      @update:sno="sno => $emit('update:sno', sno)"
      @update:mid="tno => $emit('update:mid', tno)"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { getSettingAttr } from '@/utils/PortalUtils';
import SportsList from './SportsList';

const LOGOS = {
  white: require('./images/logo-white.png'),
  dark: require('./images/logo-dark.png'),
};

// window.

export default {
  props: {
    // 当前选中的体育类型id
    sno: null,
    // 当前选中的联赛id
    mid: null,
  },
  computed: {
    ...mapState('app', ['theme']),
    logo() {
      let logoUrl = null;
      if (this.theme === 'dark') {
        logoUrl = getSettingAttr('DARK_LOGO_URL');
      }

      if (!logoUrl) {
        logoUrl = getSettingAttr('LOGO_URL') || LOGOS[this.theme];
      }

      return logoUrl;
    },
  },
  components: {
    SportsList,
  },
};
</script>
<style lang="less">
.x-left-bar {
  background: #f6f7f9;
  height: 100%;
  overflow: hidden;
  width: 250px;
  .logo {
    width: 250px;
    text-align: center;
    padding: 16px 0 32px 0;
    img {
      width: 118px;
    }
  }
  .x-sports-list {
    width: 250px;
    height: calc(100% - 95px);
    overflow: hidden;
  }
}

.dark .x-left-bar {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  background-color: #2d2c32;
}
</style>
