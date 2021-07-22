<template>
  <header
    :class="{
      'x-nav-bar': true,
      full: full,
    }"
  >
    <div class="back-control">
      <button @click="$router.replace(lastLocation || '/sports')">
        <icon-arrow
          direction="left"
          :color="{
            white: '#bababa',
            dark: '#666',
          }[theme]"
          size="20"
        />
      </button>
    </div>
    <div class="state-container">
      <state-filter
        @change="state => $emit('update:state', state)"
        :value="state"
        :counts="counts"
      />
    </div>
    <div class="menus">
      <theme-toggle-button />
      <button
        class="btn-operation"
        @click="toHistory"
      >
        <span>{{$t('xsports.operations.records')}}</span>
        <i v-if="succSts"></i>
      </button>
      <button
        class="btn-operation"
        @click="showGameRule"
      >{{$t('xsports.operations.rules')}}</button>
    </div>
    <member-info v-if="accountVisible" />
  </header>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { toPortalUrlByKey, getSettingAttr } from '@/utils/PortalUtils';
import StateFilter from './StateFilter';
import ThemeToggleButton from './ThemeToggleButton';
import MemberInfo from './MemberInfo';

export default {
  props: {
    counts: {
      default: () => ({}),
    },
    state: {},
    full: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('app', ['theme', 'isLoged', 'lastLocation']),
    ...mapState({ succSts: state => state.bet.succStatus }),
    accountVisible() {
      console.log(getSettingAttr('ACCOUNT_VISIBLE'));
      return !(getSettingAttr('ACCOUNT_VISIBLE') === false);
    },
  },
  components: {
    StateFilter,
    ThemeToggleButton,
    MemberInfo,
  },
  methods: {
    ...mapMutations('xsports', ['showGameRule']),
    ...mapMutations(['showBetHistory']),
    toHistory() {
      if (this.isLoged) {
        this.showBetHistory(true);
      } else {
        toPortalUrlByKey('LOGIN_PAGE_URL');
      }
    },
  },
};
</script>
<style lang="less">
.x-nav-bar {
  position: relative;
  display: flex;
  width: 100%;
  height: 75px;
  padding-left: 15px;
  &::before {
    position: absolute;
    content: "";
    display: block;
    background: #e1e1e1;
    height: 2px;
    width: calc(100% - 15px);
    left: 15px;
    bottom: -1px;
  }
  .state-container {
    flex-grow: 1;
  }
  .menus {
    width: 270px;
    display: flex;
    align-items: center;
    button {
      margin-right: 20px;
    }
    .btn-operation {
      position: relative;
      font-size: 12px;
      color: #909090;
      line-height: 26px;
      width: 90px;
      background: #fff;
      border-radius: 6px;
      transition: all .25s ease-out;
      &:hover {
        background: #ff5353;
        color: #fff;
      }
      i {
        position: absolute;
        display: block;
        width: 6px;
        height: 6px;
        right: 10px;
        top: 8px;
        border-radius: 100%;
        background: #ff5353;
      }
    }
  }
  .back-control {
    display: none;
    width: 68px;
    justify-content: flex-end;
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      padding: 0;
      margin-top: 24px;
    }
  }
  .btn-theme-toggle {
    line-height: 40px;
    padding: 0 10px;
    border-radius: 60px;
    &:hover {
      color: #fff;
      background: #ff5353;
      transition: all .25s ease-out;
    }
  }
}
.x-nav-bar.full {
  padding-left: 0;
  &::before {
    left: 12px;
  }
  .back-control {
    display: flex;
  }
  .x-state-filter {
    margin-left: 0;
  }
}

.dark .x-nav-bar {
  &::before {
    background: #434343;
  }
  .menus .btn-operation {
    color: #bababa;
    background: #393a40;
    &:hover {
      background: #00b5b3;
      color: #fff;
    }
    i {
      background: #53fffd;
    }
  }
}
</style>
