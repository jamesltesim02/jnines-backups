<template>
  <header
    class="nav-bar"
    :class="{ transparent: transparent }"
  >
    <div class="nav-content">
      {{title}}
      <slot name="content" />
    </div>
    <div class="nav-operators">
      <v-touch
        v-if="backable"
        tag="a"
        @tap="goback"
        class="opr-back"
      ><icon-arrow /></v-touch>
      <div class="opr-others flex-end"><slot /></div>
    </div>
  </header>
</template>
<script>
import { mapState } from 'vuex';
import appConfig from '@/config/business.config';
import IconArrow from './icons/IconArrow';

export default {
  props: {
    title: String,
    backable: {
      type: Boolean,
      default: true,
    },
    backurl: String,
    custBack: {
      type: Boolean,
      default: false,
    },
    transparent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('app', ['lastLocation']),
  },
  methods: {
    goback() {
      if (this.backurl) {
        this.$router.replace(this.backurl);
        return;
      }

      if (this.custBack) {
        this.$emit('back');
        return;
      }

      if (!this.lastLocation) {
        this.$router.replace('/');
        return;
      }

      if (this.$route.path === '/login' && /^(4\d{2}|500|5[1-9]\d)$/.test(this.lastLocation.meta.index)) {
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
  components: {
    IconArrow,
  },
};
</script>

<style lang="less">
.nav-bar {
  position: relative;
  background: #fff;
  color: #2e2f34;
  transition: all .5s;
  .nav-content {
    text-align: center;
    line-height: .44rem;
    font-size: .17rem;
  }
  .nav-operators {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    height: .44rem;
    width: 100%;
    font-size: .15rem;
    z-index: 3;
    a {
      color: #fff;
    }
    .opr-others {
      flex-grow: 1;
      height: .44rem;
    }
  }
  .opr-back {
    display: flex;
    align-items: center;
    padding: 0 .15rem;
    line-height: .44rem;
  }

  .icon-arrow path{
    fill: #909090;
  }
}

.nav-bar.transparent,
.black .nav-bar.transparent {
  background: transparent;
  color: #fff;
  box-shadow: none;
  svg path{
    fill: #fff;
  }
}

.black .nav-bar {
  background: #28272d;
  color: #fff;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.25);
  .icon-arrow path{
    fill: #bababa;
  }
}
</style>
