<template>
  <container :type="type">
    <channels
      :type="type"
      :cols="channelCols"
      v-model="channel"
    />
    <bank-choocer
      v-if="banklist"
      :banklist="banklist"
      v-model="bank"
    />
    <amount-input
      v-bind="channel"
      v-model="amount"
    />
    <arrival-amount
      :amount="amount"
      :water="channel.handleFee"
    />
    <submit @submit="submit">{{$t('payment.nextLabel')}}</submit>
  </container>
</template>
<script>
import { mapMutations } from 'vuex';
import moneyFormat from '@/filters/moneyFormat';
import { PaymentPayType } from '@/config/constants';
// import {
//   payScanQR,
//   getScanOrder,
//   payOnline,
//   getOnlineOrder,
// } from '@/api/portalAgyy';
import {
  payScanQRSync,
  getScanOrderSync,
  payOnlineSync,
  getOnlineOrderSync,
} from '@/api/portalAgyy';
import { openToPayment } from '@/utils/app/AppAdapter';
import Container from '@/components/Payment/Container';
import Channels from '@/components/Payment/Channels';
import BankChoocer from '@/components/Payment/BankChoocer';
import AmountInput from '@/components/Payment/AmountInput';
import ArrivalAmount from '@/components/Payment/ArrivalAmount';
import Submit from '@/components/Payment/Submit';

export default {
  props: {
    type: {},
    channelCols: {
      default: 3,
    },
  },
  data() {
    return {
      amount: '',
      bank: null,
      channel: {},
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

      return (this.bank || {}).value;
    },
  },
  components: {
    Container,
    Channels,
    BankChoocer,
    AmountInput,
    ArrivalAmount,
    Submit,
  },
  methods: {
    ...mapMutations('payment', ['updatePopInfo']),
    toast(key, params = {}) {
      this.$toast.center(this.$t(key, params));
    },
    submit() {
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
        this.toast('payment.message.bank');
        return;
      }

      // 如果金额不在选择列表中
      if (
        amountValuesList
        && amountValuesList.length
      ) {
        if (!amountValuesList.includes(amount)) {
          this.toast('payment.message.amountFailed');
          return;
        }
      } else if (amount < minamount || amount > maxamount) {
        // 小于最小值或大于最大值
        this.toast(
          'payment.message.amountRange',
          {
            min: moneyFormat(minamount),
            max: moneyFormat(maxamount),
          },
        );
        return;
      }

      // 仅支持整数
      if (amountType === 1 && String(amount).includes('.')) {
        this.toast('payment.message.amountInteger');
        return;
      }

      // 仅支持两位小数
      if (amountType === 2 && !/\.\d{2}$/.test(amount)) {
        this.toast('payment.message.amountFloat');
        return;
      }

      try {
        this.$loading(this.$t('message.submitting'));
        const [payMethod, getMethod] = this.type === 'online'
          // ? [payOnline, getOnlineOrder]
          // : [payScanQR, getScanOrder];
          ? [payOnlineSync, getOnlineOrderSync]
          : [payScanQRSync, getScanOrderSync];

        // 提交订单并获得订单号
        // await payMethod({
        payMethod({
          amount,
          bankCode,
          payId: payid,
          payType: PaymentPayType[channelKey],
          reChargeFeeAmount: amount * handleFee / 100,
          reChargeFeeRate: handleFee,
        });

        // 查询订单信息
        // const order = await getMethod();
        const order = getMethod();

        // 显示弹窗
        this.updatePopInfo({
          type,
          channel: channelKey,
          water: handleFee,
          ...order.orderMap,
        });

        // 转到提交页面
        openToPayment(order);
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
