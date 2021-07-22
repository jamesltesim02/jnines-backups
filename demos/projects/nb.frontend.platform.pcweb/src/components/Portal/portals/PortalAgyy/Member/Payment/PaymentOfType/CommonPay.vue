<template>
  <div class="agyy-commonpay">
    <h3>2、{{$t('agPage.payment.step2')}}</h3>
    <channels
      :channels="channels"
      v-model="channel"
    />
    <template v-if="banklist">
      <h3>3、{{$t('agPage.payment.stepbank')}}</h3>
      <bank-chooser
        v-if="banklist"
        :banklist="banklist"
        v-model="bank"
      />
    </template>
    <h3>{{3 + (banklist ? 1 : 0)}}、{{$t('agPage.payment.amount')}}</h3>
    <amount-input
      v-bind="channel"
      v-model="amount"
    />
    <h3>{{4 + (banklist ? 1 : 0)}}、{{$t('agPage.payment.arrivalLabel')}}</h3>
    <arrival-amount
      :amount="amount"
      :water="channel.handleFee"
    />
    <div class="paysubmit">
      <button @click="submit">{{$t('agPage.payment.nextLabel')}}</button>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import moneyFormat from '@/filters/moneyFormat';
import {
  payScanQRSync,
  getScanOrderSync,
  payOnlineSync,
  getOnlineOrderSync,
} from '@/api/portalAgyy';
import { openToPayment } from '@/utils/AgPortalUtils';
import { PaymentPayType } from '../../../agyy-constant';
import Channels from './Channels';
import AmountInput from './AmountInput';
import BankChooser from './BankChooser';
import ArrivalAmount from './ArrivalAmount';

export default {
  props: ['type', 'channels'],
  data() {
    return {
      channel: {},
      amount: '',
      bank: '',
    };
  },
  computed: {
    banklist() {
      if (this.channel.key === 'online_bank') {
        const { bankList } = this.channel;
        if (bankList && bankList.length) {
          return bankList[0];
        }
      }
      return null;
    },
    bankCode() {
      if (this.channel.key === 'online_unionpay') {
        return 'CNCB';
      }
      return this.bank;
    },
  },
  components: {
    Channels,
    AmountInput,
    BankChooser,
    ArrivalAmount,
  },
  methods: {
    ...mapMutations('agyy', ['pushRouter', 'setPayresult']),
    toast(key, params = {}) {
      this.$toast(this.$t(key, params));
    },
    async submit() {
      const {
        type,
        amount,
        channel: {
          key: channelKey,
          handleFee,
          payid,
          amountType,
          maxamount,
          minamount,
          amountValuesList,
        },
        bankCode,
      } = this;
      // 在线需要bankCode
      if (type === 'online' && !bankCode) {
        this.toast('agPage.payment.message.bank');
        return;
      }

      // 如果金额不在选择列表中
      if (amountValuesList && amountValuesList.length) {
        if (!amountValuesList.includes(amount)) {
          this.toast('agPage.payment.message.amountFailed');
          return;
        }
      } else if (amount < minamount || amount > maxamount) {
        // 小于最小值或大于最大值
        this.toast('agPage.payment.message.amountRange', {
          min: moneyFormat(minamount),
          max: moneyFormat(maxamount),
        });
        return;
      }
      // 仅支持整数
      if (amountType === 1 && String(amount).includes('.')) {
        this.toast('agPage.payment.message.amountInteger');
        return;
      }
      // 仅支持两位小数
      if (amountType === 2 && !/\.\d{2}$/.test(amount)) {
        this.toast('agPage.payment.message.amountFloat');
        return;
      }
      const payMethod = this.type === 'online' ? payOnlineSync : payScanQRSync;
      this.$loading(this.$t('message.submitting'));
      try {
        // 提交订单并获得订单号
        const rtn = await payMethod({
          amount,
          bankCode,
          payId: payid,
          payType: PaymentPayType[channelKey],
          reChargeFeeAmount: amount * handleFee / 100,
          reChargeFeeRate: handleFee,
        });

        const getMethod = this.type === 'online' ? getOnlineOrderSync : getScanOrderSync;
        const order = await getMethod();
        if (order && order.orderMap) {
          this.setPayresult({
            type,
            inputAmount: amount,
            resultAmount: rtn.amount,
            channel: channelKey,
            water: handleFee,
            ...order.orderMap,
          });
          this.pushRouter('/member/payresult');
          openToPayment(order);
        }
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
