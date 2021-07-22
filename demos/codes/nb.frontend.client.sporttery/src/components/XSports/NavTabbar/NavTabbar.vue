<template>
<nav-bar :backable="false">
  <div class="nav-tabbar-container">
    <ul class="tabs">
      <v-touch
        v-for="m in menus"
        :key="m.path"
        tag="li"
        @tap="$router.replace(m.path)"
        :class="{active: m.activePattern.test($route.path),}"
      >{{m.text}}</v-touch>
    </ul>
    <v-touch
      tag="a"
      class="nav-single-icon"
      @tap="$router.push('/xmember')"
    >
      <span
        :class="{
          'icon-member-container': true,
          'msg-notify': notify,
        }"
      >
        <icon-member />
      </span>
    </v-touch>
  </div>
</nav-bar>
</template>
<script>
import { mapState } from 'vuex';
import IconMember from './icons/IconMember';

export default {
  data() {
    return {
      menus: [
        {
          path: '/xsports/1',
          text: '赛事',
          activePattern: /^\/xsports\/.+/i,
        },
        {
          path: '/publish/1',
          text: '方案',
          activePattern: /^\/publish\/.+/i,
        },
        {
          path: '/shine/0',
          text: '晒单',
          activePattern: /^\/shine\/.+/i,
        },
      ],
    };
  },
  computed: {
    ...mapState({ sucSts: state => state.bet.succStatus }),
    ...mapState('member', ['msgNotify']),
    notify() {
      return this.sucSts || this.msgNotify;
    },
  },
  components: {
    IconMember,
  },
};
</script>
<style lang="less">
.nav-tabbar-container {
  width: 100%;
  display: flex;
  .tabs {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .16rem;
    text-align: center;
    padding-right: .03rem;
    li {
      width: .85rem;
    }
    li.active {
      color: #ff5353;
      font-size: .18rem;
    }
  }
  .icon-member-container {
    display: inline-block;
    position: relative;
    &.msg-notify::before {
      content: "";
      display: inline-block;
      width: .05rem;
      height: .05rem;
      background: #ff5353;
      border-radius: 50%;
      position: absolute;
      top: -.03rem;
      right: -.03rem;
    }
  }
  .nav-single-icon { width: .51rem; }
}
.blue .nav-tabbar-container {
  .tabs li.active {
    color: #53fffd;
  }
  .icon-member-container.msg-notify::before {
    background: #53fffd;
  }
}
</style>
