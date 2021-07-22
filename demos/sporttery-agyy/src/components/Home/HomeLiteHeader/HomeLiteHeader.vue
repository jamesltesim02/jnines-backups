<template>
  <div class="home-lite-header">
    <cimg src="./agyy_logo.png" />
    <btn-customer-service />
  </div>
</template>
<script>
import BtnCustomerService from '@/components/common/BtnCustomerService';

export default {
  components: {
    BtnCustomerService,
  },
};
</script>

<style lang="less">
.home-lite-header {
  position: relative;
  height: .44rem;
  color: #fff;
  padding: .05rem 0;
  text-align: center;
  background: #ffffff;
  img {
    height: .34rem;
    line-height: .44rem;
  }
}

.black .home-lite-header {
  background: transparent;
}
</style>
