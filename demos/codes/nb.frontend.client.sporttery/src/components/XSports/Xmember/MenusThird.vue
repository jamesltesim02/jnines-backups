<template>
  <div class="x-menu-third">
    <menu-item  @tap="toPath('/member/following')">
      <icon-followers slot="icon" />
      <label>我的关注</label>
    </menu-item>
    <menu-item
      class="messages"
      split-content
      @tap="toPath('/member/messages')"
    >
      <icon-messages slot="icon" />
      <label>我的消息</label>
      <span v-if="isLoged">{{ memberInfo && memberInfo.mailCount ? memberInfo.mailCount : '' }}</span>
    </menu-item>
    <menu-item @tap="toPath('/member/guide')">
      <icon-guide slot="icon" />
      <label>新手帮助</label>
    </menu-item>
    <menu-item @tap="toCustomerService">
      <icon-online-service slot="icon" />
      <label>在线客服</label>
    </menu-item>
    <menu-item>
      <icon-moon slot="icon" />
      <label>夜间模式</label>
      <toggle-button
        :checked="this.theme !== 'white'"
        @change="toggleTheme"
        slot="operation"
      />
    </menu-item>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { pushToLogedPath } from '@/utils/PortalUtils';
import { toCustomerService } from '@/utils/app/AppAdapter';
import MenuItem from './MenuItem';
import IconFollowers from './icons/IconFollowers';
import IconMessages from './icons/IconMessages';
import IconGuide from './icons/IconGuide';
import IconOnlineService from './icons/IconOnlineService';
import IconMoon from './icons/IconMoon';

export default {
  computed: {
    ...mapState('app', ['isLoged', 'theme']),
    ...mapState('member', ['memberInfo']),
  },
  components: {
    MenuItem,
    IconFollowers,
    IconMessages,
    IconGuide,
    IconOnlineService,
    IconMoon,
  },
  methods: {
    ...mapMutations('app', ['toggleTheme']),
    toCustomerService,
    toPath(url) {
      pushToLogedPath(url);
    },
  },
};
</script>
<style lang="less">
.x-menu-third {
  margin: .1rem 0;
  .x-menu-item.messages .content span {
    color: #ff5353;
    font-size: .16rem;
  }
}
.blue .x-menu-third .x-menu-item.messages .content span { color: #53fffd; }
</style>
