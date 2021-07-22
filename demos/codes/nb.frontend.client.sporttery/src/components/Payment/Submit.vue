<template>
  <div class="payment-submit">
    <v-touch
      tag="button"
      @tap="$emit('submit')"
    ><slot /></v-touch>
  </div>
</template>
<style lang="less">
.payment-submit {
  margin-top: .26rem;
  padding: 0 .1rem 0 .15rem;
  button {
    width: 100%;
    line-height: .5rem;
    background: #ff5353;
    color: rgba(255, 255, 255, .84);
    border-radius: 6px;
    font-size: .14rem;
  }
}
</style>
