<template>
  <div class="payment-tips">{{$t(`payment.tips.${type}`)}}</div>
</template>
<script>
export default {
  props: ['type'],
};
</script>
<style lang="less">
.payment-tips {
  color: #ff5353;
  padding: .16rem;
  font-size: .12rem;
  line-height: .18rem;
  &::before {
    content: "i";
    display: inline-block;
    width: .14rem;
    height: .14rem;
    font-size: .14rem;
    border: .02rem solid #ff5353;
    border-radius: 50%;
    text-align: center;
    line-height: .14rem;
    transform: rotate(180deg) scale(.9);
    margin-right: .08rem;
  }
}
</style>
