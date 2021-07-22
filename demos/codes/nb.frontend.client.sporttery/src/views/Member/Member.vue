<template>
  <list-page class="member-page img-bg-page" v-if="!horizScreen">
    <nav-bar :title="$t('page.membercenter')" :transparent="true" slot="header" >
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
  <div class="member-page" v-else>
    <div class="member-page-left img-bg-page flex-none-col">
      <div class="member-left-header">
        <nav-bar :title="$t('page.membercenter')" :transparent="true" >
          <btn-customer-service />
        </nav-bar>
      </div>
      <div class="member-left-content">
        <div class="member-content">
          <member-info :userinfo="userinfo" />
          <main-operation />
        </div>
      </div>
    </div>
    <div class="member-page-right">
      <list-page>
        <div class="member-content">
          <secondary-operation />
        </div>
        <div class="quit">
          <v-touch tag="button" @tap="doLogout">{{$t('page.quittitle')}}</v-touch>
        </div>
      </list-page>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
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
      horizScreen: state => state.horizScreen,
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
    ...mapActions('app', ['reloadBalance', 'transferToNB']),
    doLogout: logout,
  },
  async mounted() {
    if (this.userinfo && this.userinfo.token) {
      await this.transferToNB();
    }
  },
};
</script>
<style lang="less">
.member-page {
  background-image: url(./images/background.png);
  background-repeat: no-repeat;
  background-size: 3.75rem auto;
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
.member-page-left {
  float: left;
  width: 3.75rem;
  height: 100%;
  .member-left-header {
    position: relative;
    z-index: 13;
  }
  .member-left-content {
    position: relative;
    flex-grow: 1;
    z-index: 10;
    width: 3.75rem;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
  }
}
.member-page-right {
  float: right;
  width: 3.75rem;
  height: 100%;
  .member-content {
    margin-top: .05rem;
  }
}
.horizontal .member-page {
  width: 100%;
  height: 100%;
}
</style>
