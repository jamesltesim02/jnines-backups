<template>
  <header class="nav-bar" :class="{ transparent: transparent }">
    <div class="nav-content" :style="contentStyle">
      {{title}}
      <slot name="content" />
    </div>
    <div class="nav-operators">
      <v-touch
        v-if="backable"
        tag="a"
        @tap="goback"
        class="opr-back flex-center"
      >
        <icon-arrow />
      </v-touch>
      <a v-else class="opr-back"></a>
      <v-touch
        class="opr-others flex-end"
        @tap="operateFun"
      >
        <slot />
      </v-touch>
    </div>
  </header>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { StorageKey } from '@/config/constants';
import { loadFromStorage, removeFromStorage } from '@/utils/StorageUtil';
import appConfig from '@/config/business.config';

export default {
  props: {
    title: String,
    backable: {
      type: Boolean,
      default: true,
    },
    custBack: {
      type: Boolean,
      default: false,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
    backurl: String,
    opacity: Number,
  },
  computed: {
    ...mapState('app', ['lastLocation', 'lastGoBackTime']),
    contentStyle() {
      return this.opacity !== undefined ? { opacity: this.opacity } : {};
    },
  },
  methods: {
    ...mapMutations('app', ['updateLastGoBackTime']),
    operateFun() {
      this.$emit('operate');
    },
    goback() {
      const fromURL = loadFromStorage(StorageKey.FROM_URL_KEY, null);
      if (fromURL) {
        window.location = decodeURIComponent(fromURL);
        removeFromStorage(StorageKey.FROM_URL_KEY);
        return;
      }
      if (Date.now() - this.lastGoBackTime < 1000) return;
      this.updateLastGoBackTime();
      if (this.backurl) {
        this.$router.replace(this.backurl);
        return;
      }
      if (this.custBack) {
        this.$emit('back');
        return;
      }
      if (!this.lastLocation || this.lastLocation.path === '/') {
        this.$router.replace('/');
        return;
      }
      if (
        this.$route.path === '/login'
        && /^(4\d{2}|800|8[1-9]\d)$/.test(this.lastLocation.meta.index)
      ) {
        this.$router.replace('/');
        return;
      }
      const isIframe = appConfig.iframePages.findIndex(p => p.test(this.$route.path)) > -1;
      if (isIframe) {
        this.$router.replace(this.lastLocation.path);
        return;
      }
      if (window.history.length < 2) {
        this.$router.replace('/');
        return;
      }
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less">
.nav-bar {
  position: relative;
  width: 3.75rem;
  height: 0.44rem;
  background: #fff;
  color: #2e2f34;
  transition: all 0.5s;
  border-bottom: 1px solid #f1f0f1;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.03);
  z-index: 1;
  .nav-content {
    text-align: center;
    line-height: 0.44rem;
    font-size: 0.17rem;
  }
  .nav-operators {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    height: 0.44rem;
    width: 100%;
    font-size: 0.15rem;
    z-index: 3;
    a {
      color: #fff;
    }
    .opr-others {
      flex-grow: 1;
      min-width: 0.44rem;
      height: 0.44rem;
    }
  }
  .opr-back {
    width: 0.54rem;
    height: 0.44rem;
    padding-right: 0.1rem;
  }
  .icon-arrow path {
    fill: #909090;
  }
}
.black .nav-bar {
  background: #28272d;
  color: #fff;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid #2e2f34;
  .icon-arrow path {
    fill: #bababa;
  }
}
.blue .nav-bar {
  background: #2e2f34;
  color: #ecebeb;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid #2e2f34;
  .icon-arrow path {
    fill: #bababa;
  }
}
.nav-bar.transparent {
  background: transparent;
  color: #fff;
  box-shadow: none;
  border-bottom: none;
  svg path {
    fill: #fff;
  }
}
.black .nav-bar.transparent {
  color: #fff;
  svg path {
    fill: #fff;
  }
}
.blue .nav-bar.transparent {
  color: #fff;
  svg path {
    fill: #fff;
  }
}
</style>
