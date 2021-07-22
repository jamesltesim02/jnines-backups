<template>
  <nav class="tab-bar" :style="{paddingBottom: isIphoneX ? '.15rem' : '0'}">
    <ul>
      <v-touch
        tag="li"
        v-for="(t, i) in tabs"
        :key="i"
        @tap="toTabPage(t)"
        :class="{ active: isActive(t) }"
      >
        <div class="tab-icon-container flex-center">
          <span :class="`icon-${t.text}`">
            <component :is="t.icon" :active="isActive(t)" :color="tabColor" />
            <i :style="{ background: tabColor }" v-if="succStatus && t.text === 'history'"></i>
          </span>
        </div>
        <div class="tab-icon-text" v-if="!isActive(t)">{{$t(`common.tabs.${t.text}`)}}</div>
        <div class="tab-icon-text-active" :style="{ color: tabColor }" v-else>{{$t(`common.tabs.${t.text}`)}}</div>
      </v-touch>
    </ul>
  </nav>
</template>
<script>
import { mapState } from 'vuex';
import IconHome from './icons/IconHome';
import IconMatch from './icons/IconMatch';
import IconHistory from './icons/IconHistory';
import IconResult from './icons/IconResult';
import IconMember from './icons/IconMember';
import { toPortalUrl } from '@/utils/PortalUtils';

export default {
  props: {
    index: {
      type: Number,
      default: 0,
    },
    tabs: {
      type: Array,
      default() {
        let userUrl = '/member';
        const pSet = window.NBConfig.PORTAL_SETTING;
        if (pSet && pSet.USER_CENTER_URL) {
          userUrl = pSet.USER_CENTER_URL;
        }
        return [
          {
            icon: IconHome,
            text: 'home',
            url: '/',
            activePattern: /^\/(home)?$/i,
          },
          {
            icon: IconMatch,
            text: 'matchs',
            url: '/matchs/0/10',
            activePattern: /^\/matchs\/.*$/i,
          },
          {
            icon: IconHistory,
            text: 'history',
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
            icon: IconMember,
            text: 'member',
            url: userUrl,
          },
        ];
      },
    },
  },
  computed: {
    ...mapState({
      succStatus: state => state.bet.succStatus,
      isIphoneX: state => state.bet.isIphoneX,
    }),
    ...mapState('app', ['theme']),
    tabColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_TAB_COLOR ? pSet.BLACK_TAB_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_TAB_COLOR ? pSet.BLUE_TAB_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_TAB_COLOR ? pSet.WHITE_TAB_COLOR : '#ff5353';
    },
  },
  methods: {
    isActive(t) {
      return t.activePattern && t.activePattern.test(this.$route.path);
    },
    toTabPage(t) {
      if (!/\/\//.test(t.url) && /^(\/[a-z0-9_-]*)+$/i.test(t.url)) {
        this.$router.push(t.url);
      } else if (/^[a-z]+:\/\//i.test(t.url)) {
        // openInBrowser(t.url);
        // location = t.url;
        toPortalUrl(t.url, true);
      }
    },
  },
};
</script>
<style lang="less">
.tab-bar {
  position: absolute;
  width: 3.75rem;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background: #fff;
  box-shadow: 0 -1px 20px 0 #f5f0f5;
  ul {
    display: flex;
    li {
      width: 100%;
      text-align: center;
      padding: .06rem 0 0 0;
      .tab-icon-container { height: .27rem; }
      span { display: inline-block; }
      .tab-icon-text { color: #777; }
    }
  }
}
.horizontal .tab-bar { position: fixed; }
.icon-history {
  position: relative;
  display: inline-block;
  i {
    position: absolute;
    display: block;
    top: 0;
    right: -.05rem;
    width: .1rem;
    height: .1rem;
    border-radius: 50%;
  }
}
.black .tab-bar {
  background: #26252b;
  box-shadow: 0 -6px 10px 0 #1a1a1eb3;
  border-top: 1px solid #2a2a2f;
  ul li .tab-icon-text { color: #777; }
}
.blue .tab-bar {
  background: linear-gradient(to top, #28272d, #333238);
  box-shadow: 0 -6px 10px 0 #1a1a1eb3;
  border-top: 1px solid #2a2a2f;
  ul li .tab-icon-text { color: #666; }
}
</style>
