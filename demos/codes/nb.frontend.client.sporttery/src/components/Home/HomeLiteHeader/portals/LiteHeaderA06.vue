<template>
  <div  v-if="!isLoged" class="lite-header-a06">
    <home-lite-header />
    <div class="login-bar">
      <v-touch
        tag="button"
        class="btn-signin"
        @tap="toPortal('LOGIN_PAGE_URL')"
      >
        <span>{{$t('portal.a06.sign.in')}}</span>
        <i></i>
      </v-touch>
      <v-touch
        tag="button"
        class="btn-signup"
        @tap="toPortal('REGISTER_PAGE_URL')"
      >
        <span>{{$t('portal.a06.sign.up')}}</span>
        <i></i>
      </v-touch>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { toPoralUrlByKey } from '@/utils/PortalUtils';
import HomeLiteHeader from '../HomeLiteHeader';

export default {
  computed: {
    ...mapState('app', ['isLoged']),
  },
  components: {
    HomeLiteHeader,
  },
  methods: {
    toPortal(type) {
      const portalSetting = window.NBConfig.PORTAL_SETTING;
      if (!portalSetting || !portalSetting[type]) {
        this.$toast(this.$t('message.portalSettingError'));
        console.warn(`portal setting fail, field [${type}] invalid.`);
        return;
      }
      toPoralUrlByKey(type);
    },
  },
};
</script>
<style lang="less">
.lite-header-a06 .login-bar{
  background: #202024;
  display: flex;
  padding: .08rem 0;
  justify-content: space-around;
  button {
    position: relative;
    width: 1.7rem;
    line-height: .45rem;
    border-radius: 8px;
    font-size: .14rem;
    span {
      position: relative;
      z-index: 2;
    }
    i, i::before, &::before {
      content: "";
      position: absolute;
      display: block;
      z-index: 1;
      border-radius: 8px;
    }
    &::before {
      width: calc(100% + 2px);
      height: calc(100% + 2px);
      top: -1px;
      left: -1px;
    }
    i, i::before {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    i {
      background: #202024;
    }
    i::before {
      height: 84.444444444%;
      z-index: 3;
      opacity: .3;
    }
  }
  .btn-signin {
    color: #fff;
    &::before {
      background: linear-gradient(#63616b, #444248);
    }
    i::before {
      background: linear-gradient(#74727c, rgba(255, 255, 255, 0));
    }
  }
  .btn-signup {
    color: #ff5353;
    &::before {
      background: linear-gradient(#cc4c4c, #434348);
    }
    i::before {
      opacity: .2;
      background: linear-gradient(#ff5353, rgba(255, 255, 255, 0));
    }
  }
}
</style>
