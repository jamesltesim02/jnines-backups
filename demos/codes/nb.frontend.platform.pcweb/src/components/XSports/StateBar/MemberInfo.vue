<template>
<div class="x-memberinfo">
  <ul>
    <template v-if="isLoged && userinfo">
      <li class="balance">
        <a @click="toPortalUrlByKey('DEPOSIT_PAGE_URL')">
          ￥{{ userinfo.balance | moneyFormat(2) }}
          <button>&nbsp;</button>
        </a>
      </li>
      <li class="account">
        <a @click="toPortalUrlByKey('USER_CENTER_URL')">
          <icon-member />{{ userinfo.memberAccount || userinfo.loginName || userinfo.nbUser }}
        </a>
      </li>
    </template>
    <template v-else>
      <li><button @click="toPortalUrlByKey('LOGIN_PAGE_URL')" class="btn-signin">{{$t('page.navmenu.login')}}</button></li>
    </template>
  </ul>
</div>
</template>
<script>
import { mapState } from 'vuex';
import { toPortalUrlByKey } from '@/utils/PortalUtils';
import IconMember from './icons/IconMember';

export default {
  computed: {
    ...mapState('app', ['userinfo', 'isLoged']),
  },
  components: {
    IconMember,
  },
  methods: {
    toPortalUrlByKey,
  },
};
</script>
<style lang="less">
.x-memberinfo {
  display: flex;
  align-items: center;
  padding-right: 20px;
  ul {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    line-height: 30px;
    a {
      display: block;
      padding: 10px 13px;
      cursor: pointer;
      transition: color .35s ease-out;
    }
    a:hover {
      color: #ff5353;
    }
    .btn-signin {
      font-size: 12px;
      border-radius: 6px;
      border: 1px solid #ff5353;
      margin-right: 20px;
      line-height: 26px;
      padding: 0;
      width: 90px;
      text-align: center;
      color: #fff;
      background: #ff5353;
    }

    .balance,
    .account {
      a {
        display: block;
        font-size: 14px;
        padding: 0 18px;
      }
    }
    .balance {
      border-right: 1px solid #cdcdcd;
      a {
        color: #ff5353;
        padding-left: 0;
      }
      button {
        position: relative;
        background-image: linear-gradient(to right, #fe597d, #ffb775);
        border-radius: 50%;
        line-height: 22px;
        height: 22px;
        width: 22px;
        margin-left: 12px;
        &::before,
        &::after {
          content: "";
          display: block;
          position: absolute;
          background: #fff;
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
      margin-right: 13px;
    }
  }
}
.dark .x-memberinfo {
  ul {
    .btn-signin {
      background: #00b5b3;
      border-color: #00b5b3;
      &:hover {
        color: #fff;
      }
    }
    a:hover {
      color: #53fffd;
    }
  }
  .balance {
    border-color: #403f46;
    button {
      background-image: linear-gradient(157deg, #00e9c6, #00dff7);
    }
    a {
      color: #53fffd;
    }
  }
  .account a svg > g > g {
    fill: #53fffd;
  }
}
</style>
