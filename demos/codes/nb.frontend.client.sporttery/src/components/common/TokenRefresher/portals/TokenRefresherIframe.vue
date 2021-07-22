<template>
  <div
    class="token-refresher"
    v-if="!!tokenRefreshUrl"
    v-html="content"
  ></div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import appConfig from '@/config/business.config';
import { loadFromStorage } from '@/utils/StorageUtil';
import { StorageKey } from '@/config/constants';

const { PORTAL_SETTING } = window.NBConfig;

export default {
  data() {
    return {
      tokenRefreshUrl: (PORTAL_SETTING || {}).TOKEN_REFRESH_URL,
    };
  },
  computed: {
    ...mapState('portal', ['tokenRefreshTime']),
    src() {
      if (!this.tokenRefreshUrl) {
        return '';
      }
      const tu = new URL(this.tokenRefreshUrl);

      return `${
        tu.protocol
      }//${
        tu.host
      }${
        tu.pathname
      }?t=${
        this.tokenRefreshTime
      }&memberToken=${
        loadFromStorage(StorageKey.PORTAL_MEMBER_TOKEN, '')
      }${tu.hash}`;
    },
    content() {
      return `<iframe src="${this.src}"></iframe>`;
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
