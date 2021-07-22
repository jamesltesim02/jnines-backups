<template>
  <container :type="type">
    <channels
      :type="type"
      :cols="3"
      :cust-channels="channels"
      v-model="channel"
    />
    <amount-input
      v-bind="channel"
      v-model="amount"
    />
    <div class="transfer-tips">
      温馨提示：建议存入特殊金额，以便款项能更快速匹配到账。（例： 7659、12349、50000.33...）
    </div>
    <edit-text
      :placeholder="$t('payment.accName')"
      v-model="accountName"
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
import { PortalAgyyConfig, PaymentPayType } from '@/config/constants';
import moneyFormat from '@/filters/moneyFormat';
import { payTransfer } from '@/api/portalAgyy';
import Container from '@/components/Payment/Container';
import AmountInput from '@/components/Payment/AmountInput';
import EditText from '@/components/Payment/EditText';
import Channels from '@/components/Payment/Channels';
import ArrivalAmount from '@/components/Payment/ArrivalAmount';
import Submit from '@/components/Payment/Submit';

export default {
  props: ['type'],
  data() {
    return {
      amount: '',
      accountName: '',
      channel: {},
    };
  },
  computed: {
    payment() {
      const {
        maxAmount,
        minAmount,
      } = this.$store.state.payment.channels[this.type][0];

      return {
        maxamount: +maxAmount,
        minamount: +minAmount,
      };
    },
    channels() {
      return PortalAgyyConfig.PAYMENT_TRANSFER_TYPES.map(key => ({
        key,
        ...this.payment,
        handleFee: 0,
      }));
    },
  },
  components: {
    Container,
    Channels,
    AmountInput,
    EditText,
    ArrivalAmount,
    Submit,
  },
  methods: {
    ...mapMutations('payment', ['updatePopInfo']),
    toast(key, params = {}) {
      this.$toast.center(this.$t(key, params));
    },
    async submit() {
      const {
        type,
        amount,
        accountName,
        channel: {
          key: channelKey,
          maxamount,
          minamount,
        },
      } = this;

      // 金额校验
      if (!amount) {
        this.toast('payment.message.amountFailed');
        return;
      }
      if (amount < minamount || amount > maxamount) {
        this.toast(
          'payment.message.amountRange',
          {
            min: moneyFormat(minamount),
            max: moneyFormat(maxamount),
          },
        );
        return;
      }

      // 姓名校验
      if (!accountName) {
        this.toast('payment.message.requireName');
        return;
      }
      const nameRegex = /(^[\u4e00-\u9fa5][\u4e00-\u9fa5\\.·•。]{0,18}[\u4e00-\u9fa5]$)|(^[a-zA-Z][a-zA-Z\s.]{0,18}[a-zA-Z]$)/gi;
      if (!nameRegex.test(accountName)) {
        this.toast('payment.message.nameFormat');
        return;
      }

      try {
        this.$loading(this.$t('message.submitting'));
        // 提交订单
        const {
          accountNamePinyin,
          collection,
          finalDate,
        } = await payTransfer({
          amount,
          accountName,
          transferType: PaymentPayType[channelKey],
        });

        // 显示弹窗
        this.updatePopInfo({
          type,
          channel: channelKey,
          water: 0,
          finalDate,
          amount,
          billno: collection.billno,
          depositor: accountName,
          card: {
            pinyin: accountNamePinyin,
            ...collection,
          },
        });
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
<style lang="less">
.transfer-tips {
  position: relative;
  color: #909090;
  padding: .15rem .1rem .15rem .38rem;
  font-size: .12rem;
  letter-spacing: 0.2px;
  &::before {
    position: absolute;
    content: "i";
    left: .16rem;
    display: inline-block;
    width: 0.14rem;
    height: 0.14rem;
    font-size: 0.14rem;
    color: #ff5353;
    border: 0.02rem solid #ff5353;
    border-radius: 50%;
    text-align: center;
    line-height: 0.14rem;
    -webkit-transform: rotate(180deg) scale(0.9);
    transform: rotate(180deg) scale(0.9);
    margin-right: 0.08rem;
  }
}

.black .transfer-tips {
  color: #ff5353;
}
</style>
