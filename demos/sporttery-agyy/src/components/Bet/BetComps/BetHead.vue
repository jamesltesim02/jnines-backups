<template>
  <nav-bar :title="$t('pageBet.sureBet')" @back="backFun" custBack />
</template>

<script>
import { mapMutations } from 'vuex';
import NavBar from '@/components/common/NavBar';

export default {
  inheritAttrs: false,
  name: 'BetHead',
  components: {
    NavBar,
  },
  methods: {
    ...mapMutations([
      'changeSubStatus',
    ]),
    backFun() {
      this.$router.go(-1);
      this.changeSubStatus(false);
    },
  },
};
</script>
