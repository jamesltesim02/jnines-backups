<template>
  <div
    v-show="visible"
    ref="el"
    :class="{
      'portal-agyy': true,
      in: isIn,
    }"
    @mousedown.self="closePortal"
  >
  <div
    v-if="mainPath"
    class="main-view fade-container"
  >
    <button
      @click="closePortal"
      class="close-button"
    >close</button>
    <transition name="fade">
      <component
        v-if="mainView"
        :is="mainView"
      />
      <div v-else>no view.</div>
    </transition>
  </div>
  <div
    v-if="subVisible"
    :class="{
      'sub-view': true,
      'fade-container': true,
      active: subActive,
    }"
  >

    <transition name="fade">
      <component
        v-if="subView"
        :is="subView"
      />
      <div v-else>no view.</div>
    </transition>
  </div>
  </div>
</template>
<script>
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';
import { AgyyConfig } from './agyy-constant';
import portalRouters from './portalRouters';

export default {
  data() {
    return {
      animating: false,
      visible: false,
      isIn: false,
      subVisible: false,
      subActive: false,
      tokenRefreshTimer: null,
    };
  },
  computed: {
    ...mapState('app', ['isLoged']),
    ...mapState('agyy', ['router']),
    ...mapGetters('agyy', ['mainPath', 'subPath']),
    mainView() {
      return portalRouters[this.mainPath];
    },
    subView() {
      return this.subPath ? portalRouters[this.router] : null;
    },
  },
  watch: {
    router(n) {
      this.animating = true;
      this.setNbFilterClass({ time: n ? '0.35s' : '', blur: n ? '1px' : '' });
      if (n) {
        this.visible = true;
        setTimeout(() => {
          this.isIn = true;
        }, 0);
      } else {
        this.isIn = false;
      }
      setTimeout(() => {
        this.animating = false;
        if (!this.isIn) {
          this.visible = false;
        }
      }, 350);
    },
    subPath(n) {
      if (n) {
        this.subVisible = true;
        setTimeout(() => {
          this.subActive = true;
        }, 0);
      } else {
        this.subActive = false;
      }
      setTimeout(() => {
        if (!this.subActive) {
          this.subVisible = false;
        }
      }, 350);
    },
    isLoged() {
      this.startRefreshToken();
    },
    visible() {
      if (!this.visible) {
        this.setNbFilterClass({ time: '', blur: '' });
      }
    },
  },
  created() {
    this.init();
    this.startRefreshToken();
  },
  unmounted() {
    clearInterval(this.tokenRefreshTimer);
  },
  methods: {
    ...mapMutations('app', ['setNbFilterClass']),
    ...mapMutations('agyy', ['hide']),
    ...mapActions('agyy', ['init', 'reloadBalance']),
    closePortal() {
      if (this.animating) {
        return;
      }
      this.isIn = false;
      setTimeout(this.hide.bind(this), 350);
    },
    startRefreshToken() {
      clearInterval(this.tokenRefreshTimer);
      if (!this.isLoged) {
        return;
      }
      this.tokenRefreshTimer = setInterval(
        this.reloadBalance.bind(this),
        AgyyConfig.TOKEN_REFERSH_TIME,
      );
    },
  },
};
</script>

<style lang="less">
.portal-agyy {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  &::before {
    content: "";
    position: absolute;
    background-color: #000;
    opacity: 0;
    z-index: 1;
    transition: all .35s ease-out;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: scale(0);
    width: 4000px;
    height: 4000px;
    top: 50%;
    left: 50%;
    margin: -2000px auto auto -2000px;
    border-radius: 50%;
  }
  .main-view,
  .sub-view {
    position: absolute;
    height: 100%;
    top: 0;
    opacity: 0;
    transition: all .35s ease-out;
  }
  .main-view {
    right: 0;
    width: 300px;
    background: #28272d;
    transform: translateX(100%);
    z-index: 3;
  }
  .sub-view {
    right: 300px;
    width: 760px;
    background: #2e2f34;
    transform: translateX(200%);
    z-index: 2;
  }
  .close-button {
    position: absolute;
    font-size: 0;
    display: block;
    width: 18px;
    height: 18px;
    right: 0;
    top: 0;
    padding: 20px;
    transition: all .2s ease-out;
    z-index: 4;
    border: 0;
    &::before,
    &::after {
      position: absolute;
      content: "";
      display: block;
      background-color: #eaeaea;
      width: 24px;
      height: 1px;
      top: 50%;
      left: 50%;
    }
    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    &:hover {
      background: transparent;
      transform: rotate(180deg);
    }
    &:active {
      transform: rotate(180deg) scale(1.3);
    }
  }
  &.in {
    &::before {
      opacity: .6;
      transform: scale(1);
    }
    .main-view {
      opacity: 1;
      transform: translateX(0);
    }
    .sub-view.active {
      opacity: 1;
      transform: translateX(0);
    }
  }

  button {
    border-radius: 6px;
    font-size: 16px;
    line-height: 50px;
    color: #ff5353;
    border: solid 1px #ff5353;
    transition: all .35s ease-out;
    &:hover {
      background: #ff5353;
      color: #fff;
    }
  }
}
</style>
