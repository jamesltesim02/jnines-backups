<template>
  <sub-panel
    class="agyy-payresult"
    :title="$t('agPage.payment.title')"
  >
    <h4>{{$t('agPage.payment.resultTitle')}}</h4>
    <div class="info">
      <div class="title">{{$t(`agPage.payment.titles.${payresult.type}`)}}</div>
      <div class="bill">{{$t('agPage.payment.billno')}}: {{payresult.billno}}</div>
      <div class="amount">{{$t('agPage.payment.billamount')}}: {{payresult.resultAmount}}</div>
      <div
        v-if="payresult.water > 0"
        class="arrival-amount"
      >
        {{$t('agPage.payment.arrivalLabel')}}:
        {{ payresult.amount * (10000 - payresult.water * 100) / 10000}}
        <span>({{$t('agPage.payment.waterLabel')}}: {{payresult.water}}%)</span>
      </div>
      <div class="tips-line">
        <div
          v-if="payresult.type === 'virtual'"
          class="warning"
        >
          {{$t('agPage.payment.results.virtual1', { time: payresult.timeLimit })}}<br>
          {{$t('agPage.payment.results.virtual2')}}
        </div>
        <template v-else>
          <div
            v-if="+payresult.resultAmount !== +payresult.inputAmount"
            class="dib-tip"
          >{{$t('agPage.payment.results.dib2')}}</div>
          <div
            v-else
            class="warning"
          >{{$t('agPage.payment.results.warning')}}</div>
        </template>
      </div>
    </div>
    <div class="operation">
      <button
        class="done"
        @click="pushRouter('/member')"
      >{{$t('agPage.payment.results.already')}}</button>
      <button
        class="retry"
        @click="goRouter(-1)"
      >{{$t('agPage.payment.results.retry')}}</button>
    </div>
    <div
      class="cs"
      slot="footer"
    >
      <span
        class="online"
        @click="toCustomerService"
      >
        <icon-contacts /> {{$t('agPage.payment.results.ocs')}}
      </span>
      <span class="phone">
        <icon-phone /> {{$t('agPage.payment.results.phonecs')}}
      </span>
    </div>
  </sub-panel>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { toCustomerService } from '@/utils/AgPortalUtils';
import { saveToStorage } from '@/utils/StorageUtil';
import { AgyyStorageKey } from '../../../agyy-constant';
import SubPanel from '../../SubPanel';
import IconContacts from './icons/IconContacts';
import IconPhone from './icons/IconPhone';

export default {
  computed: {
    ...mapState('agyy', ['payresult']),
  },
  components: {
    SubPanel,
    IconContacts,
    IconPhone,
  },
  mounted() {
    saveToStorage(AgyyStorageKey.LAST_PAYMENT_TYPE_KEY, this.payresult.type);
  },
  unmounted() {
    this.setPayresult(null);
  },
  methods: {
    ...mapMutations('agyy', ['pushRouter', 'goRouter', 'hide', 'setPayresult']),
    toCustomerService() {
      toCustomerService(this);
    },
  },
};
</script>
<style lang="less">
.agyy-payresult {
  h4 {
    width: 387px;
    padding: 40px 0 20px 60px;
    font-size: 22px;
    color: #ddd;
    border-bottom: 1px solid #28272d;
  }
  .info {
    color: #ddd;
    padding-left: 100px;
    div {
      margin-bottom: 5px;
    }
    .title {
      font-size: 20px;
      font-weight: 500;
      margin: 20px 0;
    }
    .bill {
      font-size: 16px;
    }
    .amount {
      font-size: 18px;
    }
    .arrival-amount {
      font-size: 18px;
      span {
        margin-left: 20px;
        color: #ff5353;
      }
    }
    .tips-line {
      margin-top: 20px;
    }
    .dib-tip,
    .warning {
      font-size: 14px;
      color: #ff5353;
    }
  }
  .operation {
    margin-top: 75px;
    text-align: center;
    button {
      width: 318px;
      line-height: 48px;
      border-radius: 6px;
      border: 1px solid #ff5353;
      color: #ff5353;
    }
    .done {
      background: #ff5353;
      color: #fff;
      margin-right: 15px;
    }
  }
  .cs {
    padding-bottom: 40px;
    text-align: center;
    font-size: 18px;
    .online {
      color: #ff5353;
      margin-right: 32px;
      cursor: pointer;
    }
    span svg {
      vertical-align: text-bottom;
      margin-right: 4px;
    }
  }
}
</style>
