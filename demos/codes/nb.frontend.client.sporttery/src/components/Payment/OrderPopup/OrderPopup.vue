<template>
  <div
    v-if="popInfo"
    class="payment-order-popup flex-center"
  >
    <section>
      <div class="pop-content">
        <cimg class="state-img" src="./images/success.png" />
        <h3 class="pop-title">{{popTitle}}</h3>
        <ul class="order-info">
          <li>
            <label>{{$t('payment.billno')}}</label>
            <span>{{popInfo.billno}}</span>
          </li>
          <template v-if="popInfo.channel !== 'virtual_btc'">
            <li v-if="popInfo.type === 'transfer'">
              <label>{{$t('payment.depositorLabel')}}</label>
              <span>{{popInfo.depositor}}</span>
            </li>
            <li>
              <label>{{$t('payment.amount')}}</label>
              <span>￥ {{popInfo.amount}}</span>
            </li>
            <li v-if="popInfo.water > 0">
              <label>{{$t('payment.arrivalLabel')}}</label>
              <span>￥ {{popInfo.amount * (100 - popInfo.water) / 100}}</span>
            </li>
          </template>
        </ul>
        <payment-description :pay-info="popInfo" />
      </div>
      <div class="operation">
        <v-touch
          tag="button"
          class="retry"
          @tap="retry"
        >{{$t('payment.retry')}}</v-touch>
        <v-touch
          tag="button"
          class="finish"
          @tap="finish"
        >{{$t('payment.finish')}}</v-touch>
      </div>
    </section>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import PaymentDescription from './PaymentDescription';

export default {
  computed: {
    ...mapState('payment', ['popInfo']),
    popTitle() {
      const tk = `payment.popTitle.${this.popInfo.channel}`;
      if (this.$te(tk)) {
        return this.$t(tk);
      }
      return this.$t(`payment.popTitle.${this.popInfo.type}`);
    },
    queryCode() {
      const code = {
        transfer: 2,
        virtual: 3,
      }[this.popInfo.type];

      return code || 1;
    },
  },
  watch: {
    popInfo(n, o) {
      if ((n && !o) || (!n && o)) {
        this.setNbFilterClass(!!n);
      }
    },
  },
  components: { PaymentDescription },
  methods: {
    ...mapMutations('app', ['setNbFilterClass']),
    ...mapMutations('payment', ['updatePopInfo']),
    retry() {
      this.$router.replace('/retrypayment');
    },
    finish() {
      this.$router.replace(`/report/${this.queryCode}`);
    },
  },
};
</script>

<style lang="less">
.payment-order-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 4999;
  section {
    width: 3.15rem;
    background: #fff;
    border-radius: 10px;
    padding-top: .2rem;
    overflow: hidden;
    .state-img {
      display: block;
      width: 2.05rem;
      margin: 0 auto;
    }
    .pop-title {
      text-align: center;
      line-height: .25rem;
      font-size: .18rem;
      margin: .12rem 0;
    }
  }
  .pop-content {
    max-height: 4.4rem;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .order-info {
    line-height: .4rem;
    border-top: 1px solid rgba(236, 236, 236, 0.5);
    li {
      border-bottom: 1px solid rgba(236, 236, 236, 0.5);
      display: flex;
    }
    label {
      display: inline-block;
      width: 1.02rem;
      padding-left: .15rem;
      font-size: .14rem;
      color: #909090;
      letter-spacing: -0.3px;
    }
    span {
      flex-grow: 1;
      letter-spacing: 1.3px;
      color: #2e2f34;
    }
  }
  .operation {
    display: flex;
    button {
      line-height: .5rem;
      color: #fff;
      font-size: .16rem;
    }
    .retry {
      width: 1.16rem;
      background: #909090;
    }
    .finish {
      flex-grow: 1;
      background: #ff5353;
    }
  }
}
.horizontal .payment-order-popup {
  .pop-content {
    max-height: 1.8rem;
  }
}
</style>
