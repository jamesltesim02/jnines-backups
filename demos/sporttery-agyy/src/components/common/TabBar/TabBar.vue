<template>
  <nav class="tab-bar" :style="{paddingBottom: isIphoneX ? '.15rem' : '0'}">
    <ul>
      <v-touch
        tag="li"
        v-for="(t, i) in tabs"
        :key="i"
        @tap="t.url && $router.push(t.url)"
        :class="{ active: index === i }"
      >
        <div class="tab-icon-container flex-center">
          <span :class="[`icon-${t.text}`, succStatus ? 'order-changed' : '']">
            <component :is="t.icon" :active="i === index" />
          </span>
        </div>
        <div>{{$t(`common.tabs.${t.text}`)}}</div>
      </v-touch>
    </ul>
  </nav>
</template>
<script>
import { mapState } from 'vuex';
import IconHome from './icons/IconHome';
import IconMatch from './icons/IconMatch';
import IconHistory from './icons/IconHistory';
import IconMember from './icons/IconMember';

const tabs = [
  {
    icon: IconHome,
    text: 'home',
    url: '/',
  },
  {
    icon: IconMatch,
    text: 'matchs',
    url: '/matchs/0/10',
  },
  {
    icon: IconHistory,
    text: 'history',
    url: '/history',
  },
  {
    icon: IconMember,
    text: 'member',
    url: '/member',
  },
];

export default {
  props: {
    index: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState({
      succStatus: state => state.bet.succStatus,
      isIphoneX: state => state.bet.isIphoneX,
    }),
  },
  data() {
    return {
      tabs,
    };
  },
};
</script>
<style lang="less">
.tab-bar {
  position: fixed;
  width: 3.75rem;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: #fff;
  box-shadow: 0 -1px 20px 0 #f5f0f5;
  // padding-bottom: env(safe-area-inset-bottom);
  ul {
    display: flex;
    li {
      width: 100%;
      text-align: center;
      padding: .06rem 0 0 0;
      .tab-icon-container {
        height: .27rem;
      }
      span {
        display: inline-block;
      }
      &.active {
        color: #f50177;
      }
    }
  }
}
.icon-history {
  position: relative;
  display: inline-block;
  &.order-changed::before {
    content: "";
    position: absolute;
    display: block;
    right: -.05rem;
    width: .1rem;
    height: .1rem;
    border-radius: 50%;
    background: #ff5353;
  }
}
.black .tab-bar {
  background: #26252b;
  box-shadow: 0 -6px 10px 0 #1a1a1eb3;
  border-top: 1px solid #2a2a2f;
  ul li {
    color: #777;
    &.active {
      color: #FF5353;
    }
  }
}
</style>
