<template>
  <div class="x-menu flex-center">
    <v-touch
      ref="mbutton"
      tag="button"
      @tap="active = !active"
    ><icon-menu /></v-touch>
    <div :class="{
      'menu-list': true,
      active: active,
    }">
      <i class="triangle"></i>
      <ul>
        <v-touch
          tag="li"
          @tap="toLogedPath('/history/0')"
        >
          <div class="flex-center">
            <icon-history />
            <i v-if="sucSts"></i>
          </div>
          <span>投注单</span>
        </v-touch>
        <v-touch
          tag="li"
          @tap="$router.push('/settings')"
        >
          <div class="flex-center"><icon-setting /></div>
          <span>个人中心</span>
        </v-touch>
        <v-touch
          tag="li"
          @tap="toCustomerService"
        >
          <div class="flex-center"><icon-custservice class="icon-cs" /></div>
          <span>客服</span>
        </v-touch>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { toPoralUrlByKey } from '@/utils/PortalUtils';
import { toCustomerService } from '@/utils/app/AppAdapter';
import IconHistory from './icons/IconHistory';
import IconSetting from './icons/IconSetting';
import IconMenu from './icons/IconMenu';
import IconCustservice from './icons/IconCustservice';

export default {
  data() {
    return {
      active: false,
    };
  },
  computed: {
    ...mapState('app', ['isLoged']),
    ...mapState({ sucSts: state => state.bet.succStatus }),
  },
  components: {
    IconMenu,
    IconHistory,
    IconSetting,
    IconCustservice,
  },
  mounted() {
    document.body.addEventListener('touchstart', this.hideMenu.bind(this));
  },
  destroyed() {
    document.body.removeEventListener('touchstart', this.hideMenu);
  },
  methods: {
    hideMenu(e) {
      if (this.$refs.mbutton && e.target !== this.$refs.mbutton.$el) {
        this.active = false;
      }
    },
    toCustomerService() {
      toCustomerService(this);
    },
    toLogedPath(path) {
      if (!this.isLoged) {
        toPoralUrlByKey('LOGIN_PAGE_URL');
        return;
      }
      this.$router.push(path);
    },
  },
};
</script>
<style lang="less">
.x-menu {
  position: relative;
  font-size: .14rem;
  width: .54rem;
  height: 100%;
  button {
    position: relative;
    padding: 0 .13rem;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
    }
  }
  .menu-list {
    position: absolute;
    top: .24rem;
    right: .1rem;
    width: 1.3rem;
    height: 0;
    overflow: hidden;
    transition: all .25s ease-out;
    &::before {
      content: "";
      display: block;
      width: 100%;
      height: .12rem;
    }
    &.active {
      height: 1.51rem;
    }
  }
  .triangle {
    position: absolute;
    display: block;
    top: 0.04rem;
    right: 0.1rem;
    width: .11rem;
    height: .11rem;
    z-index: 2;
    &::before, &::after {
      position: absolute;
      content: "";
      display: block;
      top: 0;
      left: 0;
      border-left: .06rem solid transparent;
      border-right: .06rem solid transparent;
      border-bottom: .09rem solid #c4c4c4;
    }
    &::after {
      top: .01rem;
      border-bottom: .1rem solid #fff;
    }
  }
  ul {
    border: 1px solid #c4c4c4;
    border-radius: 5px;
    background: #fcfcfc;
    line-height: .45rem;
    overflow: hidden;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
    padding: 0 .06rem;
    li {
      display: flex;
      border-bottom: 1px solid #efefef;
      div {
        position: relative;
        width: .4rem;
        i {
          position: absolute;
          display: block;
          top: .08rem;
          right: .06rem;
          width: .08rem;
          height: .08rem;
          border-radius: 50%;
          background: #ff5353;
        }
      }
      span {
        flex-grow: 1;
        padding-left: .05rem;
      }
      &:last-child {
        border: 0;
      }
    }
  }
}
.blue .x-menu {
  .triangle::before { border-bottom: .09rem solid #3a393f; }
  .triangle::after { border-bottom: .1rem solid #3a393f; }
  ul {
    border: 1px solid #3c3c3c;
    background: linear-gradient(to bottom, #3a393f, #333238);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);
    li { border-bottom: 1px solid #2e2f34; }
  }
}
</style>
