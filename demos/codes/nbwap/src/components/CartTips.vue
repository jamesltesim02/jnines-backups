<template>
  <div v-if="bettingList.length" class="cart-tips">{{bettingList.length}}</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('betcart', [
      'bettingList'
    ])
  }
}
</script>
<style lang="less" scoped>
  .cart-tips {
    position: fixed;
    top: .1rem;
    right: .1rem;
    color: red;
    border: 1px solid red;
    border-radius: 50%;
    width: .2rem;
    height: .2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

