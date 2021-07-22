<template>
<div class="nb-app">
  <router-view />
  <cart-tips />
</div>
</template>
<script>
import CartTips from '@/components/CartTips'

export default {
  components: {
    CartTips
  }
}
</script>
<style lang="less" scoped>
.nb-app {
  box-sizing: border-box;
  // padding: 0 .1rem;
}
</style>
