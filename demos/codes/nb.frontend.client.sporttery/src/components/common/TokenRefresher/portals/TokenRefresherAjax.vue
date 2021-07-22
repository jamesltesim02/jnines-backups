<template>
  <div
    v-if="false"
    class="token-refresher"
  ></div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import appConfig from '@/config/business.config';
import axios from 'axios';

const { PORTAL_SETTING } = window.NBConfig;

export default {
  data() {
    return {
      tokenRefreshUrl: (PORTAL_SETTING || {}).TOKEN_REFRESH_URL,
      refershTimer: null,
    };
  },
  computed: {
    ...mapState('portal', ['tokenRefreshTime']),
  },
  watch: {
    tokenRefreshTime() {
      
      if (!this.tokenRefreshUrl) {
        return;
      }
      await axios.get(`${this.tokenRefreshUrl}?_t=${this.tokenRefreshTime}`);
    },
  },
  mounted() {
    setInterval(() => {
      this.updateToken();
    }, appConfig.keepPortalTokenTime);
  },
  methods: {
    ...mapMutations('portal', ['updateToken']),
  },
};
</script>
