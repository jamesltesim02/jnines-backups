<template>
  <v-touch
    tag="button"
    class="btn-customer-service"
    @tap="toCustomerService"
  ><icon-customer-service /></v-touch>
</template>
<script>
import { toCustomerService } from '@/utils/app/AppAdapter';
import IconCustomerService from '@/components/common/icons/IconCustomerService';

export default {
  components: {
    IconCustomerService,
  },
  methods: {
    toCustomerService() {
      toCustomerService(this);
    },
  },
};
</script>
<style lang="less">
  .btn-customer-service {
    position: absolute;
    padding: .13rem;
    line-height: 0;
    top: 0;
    right: 0;
    svg {
      width: .22rem;
      height: .18rem;
      path {
        fill: #909090;
      }
    }
  }
  .black .btn-customer-service svg path {
    fill: #F1F1F1;
  }
</style>
