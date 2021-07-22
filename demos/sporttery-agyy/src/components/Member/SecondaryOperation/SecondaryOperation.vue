<template>
  <ul class="secondary-operation">
    <!--
    <oper-item @click="doSomething">
      {{$t('page.reqpromo')}}
    </oper-item>
    -->
    <oper-item @click="toBankPage">
      {{$t('page.cardmanage')}}
    </oper-item>
    <!--
    <oper-item @click="doSomething">
      {{$t('page.modifyinfo')}}
    </oper-item>
    -->
    <oper-item @click="queryReport">
      {{$t('page.queryreport')}}
    </oper-item>
    <oper-item @click="$router.push('/settings')">
      {{$t('page.setLabel')}}
    </oper-item>
  </ul>
</template>
<script>
import { mapState } from 'vuex';
import OperItem from './OperItem';

export default {
  computed: {
    ...mapState('app', {
      user: state => state.userinfo,
    }),
  },
  components: {
    OperItem,
  },
  methods: {
    doSomething() {
      this.$toast.center('此功能暂不开放');
    },
    toBankPage() {
      this.$router.push('/bank');
    },
    queryReport() {
      if (!this.user || !this.user.token) {
        this.$toast(this.$t('pageBet.notLogin'));
      } else {
        this.$router.push('/query');
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
