<template>
  <div class="agyy-virtual">
    <h3>2、{{$t('agPage.payment.step2v')}}</h3>
    <div class="rate">
      {{$t('agPage.payment.rateLable')}}:
      <span>{{source}}</span>
      {{$t('agPage.payment.btcLabel')}} =
      <span>
        {{(rate || channel.rate) | moneyFormat(2)}}
      </span>
      {{$t('agPage.payment.rmbLabel')}}
    </div>
    <h3>3、{{$t('agPage.payment.amount')}}</h3>
      <div class="amount-field">
        <label>{{$t('agPage.payment.btcLabel')}}</label>
        <edit-text
          v-model="inputAmount"
        />
      </div>
      <div class="amount-field">
        <label>{{$t('agPage.payment.rmbLabel')}}</label>
        <edit-text
          v-model="ratedRmb"
          readonly
        />
      </div>
    <h3>4、{{$t('agPage.payment.arrivalLabel')}}</h3>
    <arrival-amount
      :amount="ratedRmb"
      :water="channel.handleFee"
    />
    <div class="paysubmit">
      <button @click="submit">{{$t('agPage.payment.nextLabel')}}</button>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { getExchange, payVirtualSync } from '@/api/portalAgyy';
import moneyFormat from '@/filters/moneyFormat';
import { openToPayment } from '@/utils/AgPortalUtils';
import { AgyyConfig } from '../../../agyy-constant';
import EditText from './EditText';
import ArrivalAmount from './ArrivalAmount';

export default {
  props: ['type', 'channels'],
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
        maxLimit,
        minLimit,
        btcRate,
        id,
      } = this.channels[0] || {};

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
      return moneyFormat(this.inputAmount * (this.rate || this.channel.rate), 2);
    },
  },
  components: {
    EditText,
    ArrivalAmount,
  },
  async created() {
    await this.getVerRate();
  },
  methods: {
    ...mapMutations('agyy', ['pushRouter', 'setPayresult']),
    toast(key, params = {}) {
      this.$toast.center(this.$t(key, params));
    },
    async getVerRate() {
      this.rate = +(await getExchange({
        currency: AgyyConfig.VIRTUAL_CURRENCY,
      }));
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
          handleFee,
        },
      } = this;

      // 金额校验
      if (!inputAmount) {
        this.toast('agPage.payment.message.amountFailed');
        return;
      }
      if (inputAmount < minamount || inputAmount > maxamount) {
        this.toast(
          'agPage.payment.message.amountRange',
          {
            min: minamount,
            max: maxamount,
          },
        );
        return;
      }

      const oRate = parseInt(this.rate * 10, 10) / 10;
      await this.getVerRate();
      const nRate = parseInt(this.rate * 10, 10) / 10;
      if (nRate !== oRate) {
        this.$toast(this.$t('agPage.payment.message.rateChanged'));
        return;
      }

      try {
        this.$loading(this.$t('message.submitting'));
        const order = await payVirtualSync({
          amount: inputAmount,
          rate,
          payId: payid,
        });

        this.setPayresult({
          type,
          inputAmount: `${inputAmount} BTC`,
          resultAmount: `${inputAmount} BTC`,
          channel: channelKey,
          water: handleFee,
          ...order,
        });
        this.pushRouter('/member/payresult');
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
.agyy-virtual {
  .rate {
    font-size: 12px;
    letter-spacing: 0.2px;
    line-height: 26px;
    span {
      color: #ff5353;
    }
  }
  .amount-field {
    label {
      font-size: 14px;
      color: #909090;
      letter-spacing: -0.3px;
      margin-right: 27px;
    }
    .agyy-edittext {
      width: 376px;
    }
    margin-top: 10px;
  }
}
</style>
