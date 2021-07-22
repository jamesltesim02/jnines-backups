<template>
  <container :type="type">
    <div class="virtual-rate">
      {{$t('payment.rateLable')}}:&nbsp;
      <span class="rate-no">{{source}}</span>
      {{$t('payment.btcLabel')}}&nbsp;=&nbsp;
      <span class="rate-no">{{(rate || channel.rate) | moneyFormat(2)}}</span>
      {{$t('payment.rmbLabel')}}
    </div>
    <amount-input
      v-bind="channel"
      v-model="inputAmount"
    />
    <revert-label-text>
      <template slot="value">{{ratedRmb | moneyFormat(2)}}</template>
      <template slot="label">{{$t('payment.rmbLabel')}}</template>
    </revert-label-text>
    <arrival-amount
      :amount="ratedRmb"
      :water="channel.handleFee"
    />
    <submit @submit="submit">{{$t('payment.nextLabel')}}</submit>
  </container>
</template>
<script>
import { mapMutations } from 'vuex';
import { PortalAgyyConfig } from '@/config/constants';
import { getExchange, payVirtual } from '@/api/portalAgyy';
import { openToPayment } from '@/utils/app/AppAdapter';
import Container from '@/components/Payment/Container';
import AmountInput from '@/components/Payment/AmountInput';
import ArrivalAmount from '@/components/Payment/ArrivalAmount';
import RevertLabelText from '@/components/Payment/RevertLabelText';
import Submit from '@/components/Payment/Submit';

export default {
  props: ['type'],
  data() {
    return {
      inputAmount: '',
      source: 1,
      rate: 0,
    };
  },
  computed: {
    channel() {
      const {
        key,
        result: {
          maxLimit,
          minLimit,
          btcRate,
          id,
        },
      } = this.$store.state.payment.channels[this.type][0];

      return {
        key,
        maxamount: +maxLimit,
        minamount: +minLimit,
        rate: +btcRate,
        handleFee: 0,
        payid: id,
      };
    },
    ratedRmb() {
      if (!this.inputAmount) {
        return 0;
      }
      return (this.inputAmount * (this.rate || this.channel.rate)).toFixed(2);
    },
  },
  async created() {
    this.rate = +(await getExchange({
      currency: PortalAgyyConfig.VIRTUAL_CURRENCY,
    }));
  },
  components: {
    Container,
    AmountInput,
    ArrivalAmount,
    RevertLabelText,
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
        inputAmount,
        rate,
        channel: {
          key: channelKey,
          maxamount,
          minamount,
          payid,
        },
      } = this;

      // 金额校验
      if (!inputAmount) {
        this.toast('payment.message.amountFailed');
        return;
      }
      if (inputAmount < minamount || inputAmount > maxamount) {
        this.toast(
          'payment.message.amountRange',
          {
            min: minamount,
            max: maxamount,
          },
        );
        return;
      }

      try {
        this.$loading(this.$t('message.submitting'));
        const order = await payVirtual({
          amount: inputAmount,
          rate,
          payId: payid,
        });

        const {
          billno,
          timeLimit,
          btcAmount,
          amount,
        } = order;
        this.updatePopInfo({
          type,
          channel: channelKey,
          water: 0,
          btcAmount,
          amount,
          timeLimit,
          billno,
        });

        // 转到提交页面
        openToPayment({
          orderMap: order,
          orderUrl: order.bridgeURL,
        });
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
<style lang="less">
.virtual-rate {
  padding: .04rem 0 0 .3rem;
  color: #716d6d;
}
.rate-no {
  color: #ff5353;
}
</style>
