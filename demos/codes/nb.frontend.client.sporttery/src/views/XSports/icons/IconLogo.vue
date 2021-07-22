<template>
  <cimg
    class="x-logo"
    :src="src"
  />
</template>
<script>
import { mapState } from 'vuex';

const portalSetting = window.NBConfig.PORTAL_SETTING;
const defaultLogoWhite = require('./images/logo-white.png');
const defaultLogoBlue = require('./images/logo-blue.png');

export default {
  computed: {
    ...mapState('app', ['theme']),
    src() {
      let logoUrl = portalSetting.LOGO_URL;
      if (!/white/i.test(this.theme)) {
        logoUrl = portalSetting.DARK_LOGO_URL || logoUrl;
      }
      const defLogo = /white/i.test(this.theme) ? defaultLogoWhite : defaultLogoBlue;
      return logoUrl || defLogo;
    },
  },
};
</script>
<style lang="less">
.x-logo { height: .28rem; }
</style>
