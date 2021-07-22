<template>
  <list-page>
    <nav-bar
      :title="$t('page.saveDeposit')"
      slot="header"
    />
    <loading-bar v-if="loading" />
    <div v-else>
      <types :type="type" :type-list="orderedTypes" />
      <transition :name="pageToggleName">
        <router-view :type="type" />
      </transition>
    </div>
  </list-page>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import Types from '@/components/Payment/Types';
import LoadingBar from '@/components/common/LoadingBar';

export default {
  data() {
    return {
      pageToggleName: '',
      type: null,
    };
  },
  computed: {
    ...mapState('payment', ['types', 'loading', 'lastType']),
    orderedTypes() {
      return [...this.types].sort(v => (v === this.lastType ? -1 : 1));
    },
  },
  watch: {
    $route(to, from) {
      const fromType = from.fullPath.replace('/payment/', '');
      this.type = to.fullPath.replace('/payment/', '');

      const [toIndex, fromIndex] = [
        this.orderedTypes.indexOf(this.type),
        this.orderedTypes.indexOf(fromType),
      ];

      this.pageToggleName = toIndex > fromIndex ? 'page-to-left' : 'page-to-right';
    },
  },
  components: {
    ListPage,
    NavBar,
    Types,
    LoadingBar,
  },
  async created() {
    this.type = this.$route.fullPath.replace('/payment/', '');
    await this.reloadPaymentInfo();

    if (!this.types || !this.types.length) {
      this.$toast.center(this.$t('message.noPaymentChannel'));
      this.$router.go(-1);
    }

    if (this.$route.fullPath === '/payment') {
      if (this.lastType && this.types.includes(this.lastType)) {
        this.type = this.lastType;
      } else {
        [this.type] = this.types;
      }
      this.$router.replace(`/payment/${this.type}`);
    }
  },
  methods: {
    ...mapActions('payment', ['reloadPaymentInfo']),
  },
};
</script>
