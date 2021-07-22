<template>
  <div class="head-bar">
    <router-link
      to="/"
      class="logo"
    >
      <cimg src="@/assets/logo.png" />
    </router-link>
    <div class="menus">
      <ul>
        <li><router-link to="/">{{$t('page.navmenu.home')}}</router-link></li>
        <!-- <li><router-link to="/blockade">{{$t('page.navmenu.blockade')}}</router-link></li> -->
        <!-- <li><router-link to="/jackpot">{{$t('page.navmenu.jackpot')}}</router-link></li> -->
        <li><router-link to="/result">{{$t('page.navmenu.result')}}</router-link></li>
        <!-- <li><router-link to="/news">{{$t('page.navmenu.news')}}</router-link></li> -->
        <!-- <li><a>{{$t('page.navmenu.promotion')}}</a></li> -->
        <template v-if="isLoged && userinfo">
          <li class="orders">
            <a @click="toHistory">{{$t('pageBet.betSlips')}}</a>
          </li>
          <li class="balance">
            <a @click="toPortalUrlByKey('DEPOSIT_PAGE_URL')">
              ￥{{ userinfo.balance | moneyFormat(2) }}
              <button>&nbsp;</button>
            </a>
          </li>
          <li class="account">
            <a @click="toPortalUrlByKey('USER_CENTER_URL')">
              <icon-member />{{ userinfo.loginName || userinfo.nbUser }}
            </a>
          </li>
        </template>
        <template v-else>
          <li><a @click="toPortalUrlByKey('REGISTER_PAGE_URL')" class="btn-signup">{{$t('page.navmenu.register')}}</a></li>
          <li><a @click="toPortalUrlByKey('LOGIN_PAGE_URL')" class="btn-signin">{{$t('page.navmenu.login')}}</a></li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { toPortalUrlByKey, getSettingAttr } from '@/utils/PortalUtils';
import IconMember from './icons/IconMember';

export default {
  computed: {
    ...mapState('app', ['userinfo', 'isLoged']),
  },
  components: {
    IconMember,
  },
  methods: {
    ...mapMutations(['showBetHistory']),
    toPortalUrlByKey(key) {
      toPortalUrlByKey(key);
    },
    toHistory() {
      if (this.userinfo && this.userinfo.token) {
        this.showBetHistory(true);
      } else {
        toPortalUrlByKey('LOGIN_PAGE_URL');
      }
    },
  },
};
</script>

<style lang="less">
.head-bar {
  position: relative;
  z-index: 2;
  .logo {
    position: relative;
    padding: 13px 20px;
    display: inline-block;
    height: 80px;
    align-items: center;
    z-index: 2;
  }
  .menus {
    position: absolute;
    height: 80px;
    width: 100%;
    top: 0;
    left: 0;
    text-align: right;
    padding-left: 206px;
    overflow: hidden;
    z-index: 1;
    min-width: 780px;
    ul {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      line-height: 30px;
      a {
        display: block;
        color: #fff;
        padding: 10px 13px;
        cursor: pointer;
        transition: color .35s ease-out;
      }
      a:hover {
        color: #ff5353;
      }
      .btn-signup,
      .btn-signin {
        font-size: 14px;
        padding: 8px 18px;
        border-radius: 6px;
        border: 1px solid #ff5353;
        margin-left: 14px;
        line-height: 18px;
      }
      .btn-signup {
        color: #ff5353;
        margin-left: 80px;
      }
      .btn-signin {
        color: #fff;
        background: #ff5353;
        &:hover {
          color: #fff;
        }
      }
    }
    .orders a {
      font-size: 16px;
      border-left: 1px solid #72767b;
      padding: 0 20px;
      margin-left: 7px;
    }
    .balance,
    .account {
      a {
        display: block;
        font-size: 14px;
        padding: 0 20px;
        color: #fff;
        border-left: 2px solid #72767b;
      }
    }
    .balance {
      a {
        color: #ff5353;
      }
      button {
        position: relative;
        background-image: linear-gradient(to right, #fe597d, #ffb775);
        border-radius: 50%;
        line-height: 22px;
        height: 22px;
        width: 22px;
        margin-left: 15px;
        &::before,
        &::after {
          content: "";
          display: block;
          position: absolute;
          background: #2a292f;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        &::before {
          width: 14px;
          height: 1px;
        }
        &::after {
          width: 1px;
          height: 14px;
        }
      }
    }
    .account a svg{
      vertical-align: middle;
      margin-right: 15px;
    }
  }
}
</style>
