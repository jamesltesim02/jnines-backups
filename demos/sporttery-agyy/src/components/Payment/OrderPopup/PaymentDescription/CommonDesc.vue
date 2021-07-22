<template>
  <ul class="payment-rules">
    <li>{{$t('payment.rules.1')}}</li>
    <li>{{$t('payment.rules.2')}}</li>
    <li>
      {{$t('payment.rules.3')}}
      <v-touch tag="a" @tap="toCustomerService" >{{$t('payment.rules.3cs')}}</v-touch>
    </li>
  </ul>
</template>
<script>
import { toCustomerService } from '@/utils/app/AppAdapter';

export default {
  methods: {
    toCustomerService() {
      toCustomerService(this);
    },
  },
};
</script>

<style lang="less">
.payment-rules {
  padding: .2rem .1rem .2rem .15rem;
  color: #909090;
  font-size: .12rem;
  li {
    list-style-type: decimal;
    list-style-position: inside;
    margin-bottom: .08rem;
    &:last-child {
      margin: 0;
    }
    a, a:visited, a:link, a:active {
      color: #ff5353;
    }
  }
}
</style>
