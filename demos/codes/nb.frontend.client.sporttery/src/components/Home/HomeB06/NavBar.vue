<template>
  <div class="nav-bar-b06">
    <ul>
      <v-touch
        tag="li"
        v-for="(m, i) in menus"
        :key="m.text"
        :class="{ active: state && state.state === m.state }"
        @tap="changeState(i)"
      >
        {{$t(`portal.b06.navs.${m.state}`)}}
        <i v-if="m.state != -1">{{m.count}}</i>
      </v-touch>
    </ul>
    <v-touch
      class="hamburger"
      @tap="toggleSites()"
    >
      <span>
        <i></i>
        <i></i>
        <i></i>
      </span>
    </v-touch>
    <v-touch
      class="member-icon"
      :class="{loged: isLoged}"
      @tap="toMember"
    >
      <icon-member />
      <div>{{balance | moneyFormat}}</div>
    </v-touch>
    <div class="site-switcher"></div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import appConfig from '@/config/business.config';
import { toPoralUrlByKey } from '@/utils/PortalUtils';
import deviceInfo from '@/utils/deviceInfo';
import { findCountInfo } from '@/api/pull';
import IconMember from './icons/IconMember';

export default {
  props: {
    state: {
      default: {},
    },
  },
  data() {
    return {
      menus: [
        {
          state: 2,
          count: 0,
        },
        {
          state: 1,
          count: 0,
        },
        {
          state: 0,
          count: 0,
        },
        // {
        //   state: -1,
        //   count: '',
        // },
      ],
      reloadTimer: null,
    };
  },
  computed: {
    ...mapState('app', ['isLoged', 'userinfo']),
    ...mapState('portal', ['b06Siteswither']),
    balance() {
      if (!this.userinfo) {
        return '0.00';
      }
      return this.userinfo.balance;
    },
  },
  watch: {
    state() {
      this.queryMatchCount();
    },
  },
  async created() {
    await this.queryMatchCount();
    let defaultIndex = this.menus.findIndex(s => s.count > 0);
    if (defaultIndex === -1) {
      defaultIndex = 2;
    }
    this.changeState(defaultIndex);
  },
  components: {
    IconMember,
  },
  methods: {
    ...mapMutations('portal', ['updateSiteswitcher']),
    toggleSites() {
      if (!deviceInfo.appInfo.isApp) {
        this.updateSiteswitcher(!this.b06Siteswither);
      }
    },
    async queryMatchCount() {
      const countResult = await findCountInfo(this.sno);
      this.$set(this.menus, 0, {
        state: this.menus[0].state,
        count: countResult.grounderNum,
      });
      this.$set(this.menus, 1, {
        state: this.menus[1].state,
        count: countResult.todayNum,
      });
      this.$set(this.menus, 2, {
        state: this.menus[2].state,
        count: countResult.morningPlateNum,
      });
      // 定时刷新页面
      if (appConfig.matchsReloadTime) {
        clearTimeout(this.reloadTimer);
        this.reloadTimer = setTimeout(() => {
          this.queryMatchCount();
        }, appConfig.matchsReloadTime);
      }
    },
    changeState(index) {
      this.$emit('update:state', this.menus[index]);
    },
    toMember() {
      const portalSetting = window.NBConfig.PORTAL_SETTING;
      if (!portalSetting || !portalSetting.USER_CENTER_URL || !portalSetting.LOGIN_PAGE_URL) {
        this.$toast(this.$t('message.portalSettingError'));
        console.warn('portal setting fail, field [USER_CENTER_URL] or [LOGIN_PAGE_URL] invalid.');
        return;
      }
      if (!this.isLoged) {
        toPoralUrlByKey('LOGIN_PAGE_URL');
        return;
      }
      toPoralUrlByKey('USER_CENTER_URL');
    },
  },
};
</script>
<style lang="less">
.nav-bar-b06 {
  position: relative;
  border-bottom: 1px solid #ecebeb;
  background: #fb796c;
  // height: .44rem;
  ul {
    display: flex;
    justify-content: center;
    line-height: .44rem;
    font-size: .14rem;
    color: #ffc8c8;
    li {
      position: relative;
      padding: 0 .16rem;
      i {
        position: absolute;
        font-size: 0.11rem;
        font-style: normal;
        background: #fec5c4;
        color: #949494;
        width: 26px;
        text-align: center;
        border-radius: 5px;
        line-height: 0.14rem;
        top: 5px;
        right: -9px;
        transform: scale(.9166666666666666);
      }
      &.active {
        color: #fff;
        i {
          background: #fff;
          color: #000;
        }
        &::before {
          content: "";
          position: absolute;
          display: block;
          width: 85%;
          height: 3px;
          bottom: 0;
          border-radius: 2px;
          box-shadow: 0 -1px 6px 0 #fae5f5;
          background-color: #fff;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .hamburger, .member-icon {
    position: absolute;
    top: 0;
  }
  .hamburger {
    left: 0;
    width: .46rem;
    height: .44rem;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      display: inline-block;
      i, i::before {
        display: block;
        background: #fff;
        height: .03rem;
      }
      i {
        position: relative;
        border-radius: 1rem;
        width: .15rem;
        margin-top: .03rem;
        transform: translateX(.025rem);
        &::before {
          content: "";
          position: absolute;
          width: .03rem;
          top: 0;
          left: -.05rem;
          border-radius: 50%;
        }
      }
    }
  }
  .member-icon {
    right: 0;
    height: .44rem;
    width: .66rem;
    text-align: center;
    padding: .06rem 0;
    font-size: .12rem;
    color: #fff;
    svg {
      display: block;
      margin: 0 auto;
      width: .24rem;
      height: .24rem;
      margin-top: .05rem;
      transform: translateX(.1rem);
      g g {
        fill: #fff;
      }
    }
    div {
      display: none;
    }
    &.loged {
      svg {
        margin-top: 0;
        transform: translateX(0);
        width: .16rem;
        height: .16rem;
        g g {
          fill: #fff;
        }
      }
      div {
        display: block;
        margin-top: .04rem;
      }
    }
  }
}
</style>
