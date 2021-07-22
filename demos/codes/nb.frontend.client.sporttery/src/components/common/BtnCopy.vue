<template>
  <v-touch
    tag="button"
    class="btn-copy"
    @tap="$emit('copy')"
  >{{$t('payment.copyLabel')}}</v-touch>
</template>
<style lang="less">
.btn-copy {
  background: #ff5353;
  color: #fff;
  border-radius: 10rem;
  line-height: .2rem;
  padding: .01rem .1rem;
  font-size: .12rem;
  margin-left: .05rem;
}
</style>
