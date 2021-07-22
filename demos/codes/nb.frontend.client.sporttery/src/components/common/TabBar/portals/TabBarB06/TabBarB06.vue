<template>
  <tab-bar
    :tabs="tabs"
    :index="index"
  />
</template>
<script>
import TabBar from '../../TabBar';
import IconHome from './icons/IconHome';
import IconPromo from './icons/IconPromo';
import IconHistory from '../../icons/IconHistory';
import IconResult from '../../icons/IconResult';

export default {
  props: ['index'],
  data() {
    let promoUrl = '/';
    const { PORTAL_SETTING } = window.NBConfig;
    if (PORTAL_SETTING && PORTAL_SETTING.PROMOTION_PAGE_URL) {
      promoUrl = PORTAL_SETTING.PROMOTION_PAGE_URL;
    } else {
      this.$toast(this.$t('message.portalSettingError'));
      console.warn('portal setting fail, field [PROMOTION_PAGE_URL] invalid.');
    }
    // PROMOTION_PAGE_URL
    return {
      tabs: [
        {
          icon: IconHome,
          text: 'home',
          url: '/home',
          activePattern: /^\/(home)?$/i,
        },
        {
          icon: IconHistory,
          text: 'history_b06',
          url: '/history/0',
          activePattern: /^\/history\/\d$/i,
        },
        {
          icon: IconResult,
          text: 'result',
          url: '/result',
          activePattern: /^\/result$/i,
        },
        {
          icon: IconPromo,
          text: 'promo',
          url: promoUrl,
          activePattern: /^\/promotion\/.*$/i,
        },
      ],
    };
  },
  components: {
    TabBar,
  },
};
</script>
