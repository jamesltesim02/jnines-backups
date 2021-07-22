<template>
  <list-page class="payment-page" v-if="!horizScreen">
    <nav-bar :title="$t('page.saveDeposit')" slot="header" />
    <loading-bar v-if="loading" />
    <div v-else>
      <types :type="type" :type-list="orderedTypes" />
      <transition :name="pageToggleName">
        <router-view :type="type" />
      </transition>
    </div>
    <dot-check />
  </list-page>
  <div class="payment-page" v-else>
    <div class="payment-page-left flex-none-col">
      <div class="payment-left-header">
        <nav-bar :title="$t('page.saveDeposit')" slot="header" />
      </div>
      <div class="payment-left-content">
        <loading-bar v-if="loading" />
        <div v-else>
          <types :type="type" :type-list="orderedTypes" />
        </div>
      </div>
    </div>
    <div class="payment-page-right">
      <list-page>
        <div class="payment-content" v-if="!loading">
          <transition :name="pageToggleName">
            <router-view :type="type" />
          </transition>
        </div>
      </list-page>
    </div>
    <dot-check />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/common/NavBar';
import Types from '@/components/Payment/Types';
import DotCheck from '@/components/Payment/DotCheck';
import LoadingBar from '@/components/common/LoadingBar';

export default {
  data() {
    return {
      pageToggleName: '',
      type: null,
    };
  },
  computed: {
    ...mapState('app', ['horizScreen']),
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
    DotCheck,
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

<style lang="less">
.payment-page-left {
  float: left;
  width: 3.75rem;
  height: 100%;
  .payment-left-header {
    position: relative;
    z-index: 13;
  }
  .payment-left-content {
    position: relative;
    flex-grow: 1;
    z-index: 10;
    width: 3.75rem;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .1rem;
  }
}
.payment-page-right {
  float: right;
  width: 3.75rem;
  height: 100%;
  .payment-content {
    margin-top: .05rem;
  }
}
.horizontal .payment-page {
  width: 100%;
  height: 100%;
}
</style>
