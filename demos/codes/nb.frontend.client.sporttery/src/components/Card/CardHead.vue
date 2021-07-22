<template>
  <nav-bar :title="cardTitle" custBack @operate="usedFun" @back="backFun" >
    <span v-if="!state">{{$t('share.usedCard')}}</span>
  </nav-bar>
</template>

<script>
import NavBar from '@/components/common/NavBar';

export default {
  inheritAttrs: false,
  name: 'CardHead',
  props: { state: Number },
  computed: {
    cardTitle() {
      return this.state ? this.$t('share.usedCard') : this.$t('share.myCard');
    },
  },
  components: { NavBar },
  methods: {
    usedFun() {
      if (!this.state) {
        this.$router.replace('/mycard/1');
      }
    },
    backFun() {
      if (this.state) {
        this.$router.replace('/mycard/0');
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>
