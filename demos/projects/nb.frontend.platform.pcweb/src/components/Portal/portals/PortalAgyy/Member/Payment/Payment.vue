<template>
  <sub-panel :title="$t('agPage.payment.title')">
    <loading-bar
      full
      v-if="loading"
    />
    <div v-else class="agyy-payment">
      <h3>1、{{$t('agPage.payment.step1')}}</h3>
      <types
        v-model="type"
        :type-list="types"
      />
      <div
        v-if="type === 'scan'"
        class="tips"
      >{{$t(`agPage.payment.tips.${type}`, { channels: scanChannelNames })}}</div>
      <div v-else class="tips">{{$t(`agPage.payment.tips.${type}`)}}</div>
      <div class="payment-block">
        <transition name="fade">
          <component
            ref="payComp"
            v-if="type"
            :is="paymengView"
            :type="type"
            :channels="channels"
            :rules="rules"
          />
        </transition>
      </div>
    </div>
  </sub-panel>
</template>
<script>
import { getPayChannel } from '@/api/portalAgyy';
import { loadFromStorage } from '@/utils/StorageUtil';
import { AgyyStorageKey } from '../../agyy-constant';

import SubPanel from '../SubPanel';
import Types from './Types';
import PaymentOfType from './PaymentOfType';

export default {
  data() {
    return {
      channelMaps: {},
      types: [],
      rules: null,
      loading: false,
      lastType: null,
      type: loadFromStorage(AgyyStorageKey.LAST_PAYMENT_TYPE_KEY, null),
    };
  },
  computed: {
    paymengView() {
      if (!this.type) {
        return null;
      }

      return PaymentOfType[this.type];
    },
    channels() {
      if (!this.type || !this.channelMaps || !this.channelMaps[this.type]) {
        return [];
      }
      return this.channelMaps[this.type].map((c) => {
        const {
          maxAmount,
          minAmount,
          key,
          result,
        } = c;
        return {
          key,
          maxamount: +maxAmount || +result.maxLimit,
          minamount: +minAmount || +result.minLimit,
          handleFee: 0,
          ...result,
        };
      });
    },
    scanChannelNames() {
      return this.channels.map(({ key }) => this.$t(`agPage.payment.channelName.${key}`)).join('/');
    },
  },
  components: {
    SubPanel,
    Types,
  },
  created() {
    this.initPayment();
  },
  methods: {
    async initPayment() {
      try {
        this.loading = true;
        const paymentInfo = await getPayChannel();
        this.types = paymentInfo.types;
        this.rules = paymentInfo.rules;
        this.channelMaps = paymentInfo.channels;

        if (!this.types || !this.types.length) {
          return;
        }

        // 去掉APP支付
        const appIndex = this.types.findIndex(v => v === 'app');
        if (appIndex !== -1) {
          this.types.splice(appIndex, 1);
        }

        // 初始化存款方式
        let type = loadFromStorage(AgyyStorageKey.LAST_PAYMENT_TYPE_KEY, null);
        if (!this.types.includes(type)) {
          [type] = this.types;
        }
        this.type = type;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="less">
.agyy-payment {
  padding: 0 50px 40px 60px;
  letter-spacing: 0;
  h3 {
    margin: 40px 0 20px;
    color: #ddd;
    font-size: 20px;
    letter-spacing: 0;
  }
  .tips {
    font-size: 12px;
    color: #ff5353;
    line-height: 17px;
    margin-top: 5px;
  }
  .payment-block {
    position: relative;
    & > div {
      position: absolute;
      width: 100%;
      top: 0;
    }
  }
}
.paysubmit {
  margin-top: 60px;
  margin-bottom: 30px;
  text-align: center;
  button {
    width: 320px;
  }
}
</style>
