<template>
  <div>
    <template v-if="!submited">
      <h3>2、{{$t('agPage.payment.step2')}}</h3>
      <channels
        :channels="transferChannels"
        v-model="channel"
      />
      <h3>3、{{$t('agPage.payment.amount')}}</h3>
      <amount-input
        v-bind="channel"
        v-model="amount"
        auto-decimal
      />
      <h3>4、{{$t('agPage.payment.depositorLabel')}}</h3>
      <edit-text
        v-model="accountName"
        :placeholder="$t('agPage.payment.accName')"
      />
    </template>
    <template v-else>
      <h3>2、{{$t('agPage.payment.amount')}}</h3>
      <edit-text
        v-model="amount"
        readonly
      />
      <h3>3、{{$t('agPage.payment.depositorLabel')}}</h3>
      <edit-text
        v-model="accountName"
        readonly
      />
      <h3>4、{{$t('agPage.payment.step4')}}</h3>
      <card
        :card="cardinfo"
      />
      <tips>{{$t('agPage.payment.results.transfer', { time: finalDate })}}</tips>
    </template>
    <div class="paysubmit">
      <button v-if="!submited" @click="next">{{$t('agPage.payment.nextLabel')}}</button>
      <button v-else @click="submit">{{$t('agPage.payment.submitLabel')}}</button>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { payTransfer } from '@/api/portalAgyy';
import moneyFormat from '@/filters/moneyFormat';
import { AgyyConfig, PaymentPayType } from '../../../../agyy-constant';
import Channels from '../Channels';
import AmountInput from '../AmountInput';
import EditText from '../EditText';
import Card from './Card';
import Tips from '../../Tips';

export default {
  props: ['type', 'channels'],
  data() {
    return {
      amount: '',
      accountName: '',
      channel: {},
      transObj: null,
      toastFlag: false,
      submited: false,
      cardinfo: {},
      finalDate: '',
      payresult: null,
    };
  },
  computed: {
    transferChannels() {
      return AgyyConfig.PAYMENT_TRANSFER_TYPES.map(key => ({
        key,
        maxamount: +this.channels[0].maxamount,
        minamount: +this.channels[0].minamount,
      }));
    },
  },
  components: {
    Channels,
    AmountInput,
    EditText,
    Card,
    Tips,
  },
  methods: {
    ...mapMutations('agyy', ['pushRouter', 'setPayresult']),
    toast(key, params = {}) {
      this.$toast.center(this.$t(key, params));
    },
    async next() {
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
        this.toast('agPage.payment.message.amountFailed');
        return;
      }
      if (amount < minamount || amount > maxamount) {
        this.toast(
          'agPage.payment.message.amountRange',
          {
            min: moneyFormat(minamount),
            max: moneyFormat(maxamount),
          },
        );
        return;
      }

      // 姓名校验
      if (!accountName) {
        this.toast('agPage.payment.message.requireName');
        return;
      }
      const nameRegex = /(^[\u4e00-\u9fa5][\u4e00-\u9fa5\\.·•。]{0,18}[\u4e00-\u9fa5]$)|(^[a-zA-Z][a-zA-Z\s.]{0,18}[a-zA-Z]$)/gi;
      if (!nameRegex.test(accountName)) {
        this.toast('agPage.payment.message.nameFormat');
        return;
      }

      try {
        this.$loading(this.$t('message.submitting'));
        // 提交订单
        const {
          accountNamePinyin,
          collection,
          finalDate,
          // deposit,
        } = await payTransfer({
          amount,
          accountName,
          transferType: PaymentPayType[channelKey],
        });
        this.finalDate = finalDate;
        this.cardinfo = {
          accountNamePinyin,
          ...collection,
        };
        this.submited = true;
        this.payresult = {
          type,
          billno: collection.billno,
          inputAmount: amount,
          resultAmount: collection.amount,
        };
      } finally {
        this.$loading.close();
      }
    },
    async submit() {
      this.setPayresult(this.payresult);
      this.pushRouter('/member/payresult');
    },
  },
};
</script>
<style lang="less">
</style>
