<template>
  <div class="x-menus-second">
    <menu-item
      class="wallet"
      split-content
      @tap="toPortal('DEPOSIT_PAGE_URL')"
    >
      <icon-wallet slot="icon" />
      <label>我的钱包</label>
      <span v-if="isLoged">{{ userinfo.balance || 0 | moneyFormat }}</span>
      <button slot="operation">
        <icon-save />
      </button>
    </menu-item>
    <menu-item @tap="toPath('/member/rakehistory')">
      <icon-rake-history slot="icon" />
      <span>我的佣金</span>
    </menu-item>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { toLogedPortalUrlKey, pushToLogedPath } from '@/utils/PortalUtils';
import MenuItem from './MenuItem';
import IconWallet from './icons/IconWallet';
import IconRakeHistory from './icons/IconRakeHistory';
import IconSave from './icons/IconSave';

export default {
  computed: {
    ...mapState('app', ['isLoged', 'userinfo']),
    ...mapState('member', ['memberInfo']),
  },
  components: {
    IconWallet,
    IconRakeHistory,
    IconSave,
    MenuItem,
  },
  methods: {
    toPortal(url, extraBrowser) {
      toLogedPortalUrlKey(url, extraBrowser);
    },
    toPath(url) {
      pushToLogedPath(url);
    },
  },
};
</script>

<style lang="less">
.x-menus-second {
  margin-top: .1rem;
  .x-menu-item.wallet {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-left-radius:0;
    .content span {
      color: #ff5353;
      font-size: .2rem;
    }
    button svg circle { fill: url(#icon-save-1); }
  }
}
.blue .x-menus-second {
  .x-menu-item.wallet .content span { color: #53fffd; }
  .x-menu-item.wallet button svg circle { fill: url(#icon-save-2); }
}
</style>
