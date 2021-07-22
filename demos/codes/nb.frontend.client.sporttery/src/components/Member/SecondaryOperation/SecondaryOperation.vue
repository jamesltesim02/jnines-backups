<template>
  <ul class="secondary-operation">
    <!--
    <oper-item @click="doSomething">
      {{$t('page.reqpromo')}}
    </oper-item>
    -->
    <oper-item @click="toPage('/bank')">
      {{$t('page.cardmanage')}}
    </oper-item>
    <!--
    <oper-item @click="doSomething">
      {{$t('page.modifyinfo')}}
    </oper-item>
    -->
    <oper-item @click="queryReport('/query')">
      {{$t('page.queryreport')}}
    </oper-item>
    <oper-item @click="toPage('/settings')">
      {{$t('page.setLabel')}}
    </oper-item>
    <oper-item v-for="(v, k) in userArr" :key="k" @click="toPage(v.url)">
      {{v.title}}
    </oper-item>
  </ul>
</template>
<script>
import { mapState } from 'vuex';
import OperItem from './OperItem';
import { openInBrowser } from '@/utils/app/AppUtils';

export default {
  computed: {
    ...mapState('app', {
      user: state => state.userinfo,
    }),
    userArr() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      const arr = pSet && pSet.USER_CENTER_JUMP && pSet.USER_CENTER_JUMP.length ? pSet.USER_CENTER_JUMP : [];
      return arr.filter(v => v.title && v.url);
    },
  },
  components: {
    OperItem,
  },
  methods: {
    doSomething() {
      this.$toast.center('此功能暂不开放');
    },
    toPage(url) {
      if (!/\/\//.test(url) && /^(\/[a-z0-9_-]*)+$/i.test(url)) {
        this.$router.push(url);
      } else if (/^[a-z]+:\/\//i.test(url)) {
        openInBrowser(url);
      }
    },
    queryReport(url) {
      if (!this.user || !this.user.token) {
        this.$toast(this.$t('pageBet.notLogin'));
      } else {
        this.toPage(url);
      }
    },
  },
};
</script>

<style lang="less">
.secondary-operation {
  padding-left: .3rem;
  line-height: .5rem;
  font-size: .14rem;
  background: #fff;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  overflow: hidden;
  transition: all .5s;
}
.black .secondary-operation {
  background: #28272d;
}
</style>
