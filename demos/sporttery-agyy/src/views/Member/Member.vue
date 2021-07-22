<template>
  <list-page class="member-page img-bg-page">
    <nav-bar
      :title="$t('page.membercenter')"
      :transparent="true"
      slot="header"
    >
      <btn-customer-service />
    </nav-bar>
    <div class="member-content">
      <member-info :userinfo="userinfo" />
      <main-operation />
      <secondary-operation />
    </div>
    <div class="quit">
      <v-touch tag="button" @tap="doLogout">{{$t('page.quittitle')}}</v-touch>
    </div>
  </list-page>
</template>
<script>
import { mapState } from 'vuex';
import { logout } from '@/utils/UserinfoUtil';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import BtnCustomerService from '@/components/common/BtnCustomerService';
import MemberInfo from '@/components/Member/MemberInfo';
import MainOperation from '@/components/Member/MainOperation';
import SecondaryOperation from '@/components/Member/SecondaryOperation';

export default {
  computed: {
    ...mapState('app', {
      userinfo: state => state.userinfo || {},
    }),
  },
  components: {
    ListPage,
    NavBar,
    BtnCustomerService,
    MemberInfo,
    MainOperation,
    SecondaryOperation,
  },
  methods: {
    doLogout: logout,
  },
};
</script>
<style lang="less">
.member-page {
  background-image: url(./images/background.png);
}
.member-content {
  padding-left: .1rem;
  transition: all .5s;
}
.quit {
  margin-top: .5rem;
  padding: 0 .15rem;
  button {
    display: block;
    background: #ecebeb;
    border-radius: 6px;
    width: 100%;
    color: #909090;
    line-height: .5rem;
    transition: all .5s;
    font-size: .14rem;
  }
}
.black .quit button {
  background: #323136;
  color: #716d6d;
}

.webp .member-page {
  background-image: url(./images/background.webp);
}
</style>
