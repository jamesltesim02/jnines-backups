<template>
  <div class="virtual-desc">
    <ul class="order-info">
      <li>
        <label>{{$t('payment.amount')}}</label>
        <span>{{info.btcAmount}} {{$t('payment.btcLabel')}}</span>
      </li>
      <li>
        <label>{{$t('payment.arrivalLabel')}}</label>
        <span>￥ {{info.amount}}</span>
      </li>
    </ul>
    <!--
    <div class="qr-code">
      <btn-copy @copy="copy({ content: info.address })" />
      <cimg :src="src" />
    </div>
    -->
    <ul class="payment-rules">
      <li>
        <a>{{$t('payment.vrules.2a')}}</a>
        <span>{{$t('payment.vrules.2b', { time: info.timeLimit })}}</span>
      </li>
      <li>
        {{$t('payment.vrules.3')}}
        <v-touch tag="a" @tap="toCustomerService" >{{$t('payment.vrules.3cs')}}</v-touch>
      </li>
    </ul>
  </div>
</template>
<script>

import { toCustomerService } from '@/utils/app/AppAdapter';
import copy from '@/utils/copy';
// import BtnCopy from '@/components/common/BtnCopy';

const { PORTAL_API_URL } = window.NBConfig;

export default {
  props: ['info'],
  computed: {
    src() {
      return `${PORTAL_API_URL}/api/pay/virtual/qr-code?site=11&address=${this.info.address}`;
    },
  },
  // components: {
  //   BtnCopy,
  // },
  methods: {
    copy,
    toCustomerService() {
      toCustomerService(this);
    },
  },
};
</script>
<style lang="less">
.virtual-desc {
  .order-info {
    border: 0 !important;
  }
  .qr-code {
    position: relative;
    text-align: center;
    img {
      width: 1.5rem;
    }
    .btn-copy {
      position: absolute;
      right: .15rem;
      top: .05rem;
    }
  }
}
</style>
