<template>
  <transition :name="slideClass">
    <div
      v-if="!!portalUrl"
      class="payment-portal">
      <nav-bar
        :title="$t('page.finishDeposit')"
        slot="header"
        :custBack="true"
        @back="onBack"
      />
      <iframe :src="portalUrl"></iframe>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import NavBar from '@/components/common/NavBar';

export default {
  data() {
    return {
      slideClass: '',
    };
  },
  computed: {
    ...mapState('payment', ['portalUrl']),
  },
  watch: {
    portalUrl(n) {
      if (n) {
        this.slideClass = 'page-to-left';
      }
    },
  },
  components: {
    NavBar,
  },
  methods: {
    ...mapMutations('payment', ['updatePortalUrl']),
    onBack() {
      this.slideClass = 'page-to-right';
      this.$nextTick(() => {
        this.updatePortalUrl(null);
      });
    },
  },
};
</script>
<style lang="less">
.payment-portal {
  position: absolute;
  z-index: 5;
  top: 0;
  width: 3.75rem;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  iframe {
    flex-grow: 1;
    border: 0;
    background: #f5f5f5;
  }
}
.black .payment-portal {
  background: #28272d;
}
</style>
