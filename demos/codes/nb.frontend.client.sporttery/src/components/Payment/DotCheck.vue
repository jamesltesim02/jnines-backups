<template>
  <div class="dot-check">
    <bet-cover-box class="dot-check-box" :index="999999" :show="!!dotPayment" @close="closeBox">
      <div class="dot-check-body">
        <div class="dot-check-alert flex-between-top">
          <div class="alert-head-flag"><query-alert /></div>
          <div class="alert-text">{{$t('payment.dotAlert')}}</div>
        </div>
        <div class="dot-check-money flex-start">
          <span class="dot-check-money-text">{{$t('payment.amount')}}</span>
          <span class="dot-check-money-num">¥ {{dotPayment || 0}}</span>
        </div>
        <div class="dot-check-btn-close flex-center">{{$t('payment.iKnowIt')}}</div>
      </div>
      <div class="dot-check-close flex-center"><bet-cover-close /></div>
    </bet-cover-box>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import BetCoverClose from '@/components/Bet/BetComps/BetCoverClose';
import BetCoverBox from '@/components/Bet/BetComps/BetCoverBox';
import QueryAlert from '@/components/QueryAndBank/QueryAlert';

export default {
  data() {
    return { promot: null, getActed: false, getSucc: false };
  },
  computed: {
    ...mapState('payment', ['dotPayment']),
  },
  components: { BetCoverClose, BetCoverBox, QueryAlert },
  methods: {
    ...mapMutations('payment', ['setDotPayment']),
    closeBox() {
      this.setDotPayment();
    },
  },
};
</script>
<style lang="less">
.dot-check-box .nb-bet-public-box-body {
  top: 1.6rem;
  .dot-check-body {
    position: relative;
    border-radius: .1rem;
    width: 3.3rem;
    height: 1.7rem;
    background: #fff;
    margin: 0 auto;
    overflow: hidden;
    .dot-check-alert {
      width: 100%;
      padding: .2rem .15rem;
      border-bottom: .01rem solid rgba(236, 236, 236, 0.5);
      .alert-head-flag { width: .14rem; height: 100%; padding-top: .02rem; }
      .alert-text { width: 2.77rem; font-size: .12rem; color: #909090; }
    }
    .dot-check-money {
      width: 100%;
      height: .49rem;
      padding-left: .15rem;
      .dot-check-money-text { font-size: .14rem; font-weight: 500; }
      .dot-check-money-text { color: #909090; padding-right: .3rem; }
      .dot-check-money-num { color: #ff5353; font-family: PingFangSC; }
    }
    .dot-check-btn-close {
      position: absolute;
      width: 100%;
      height: .49rem;
      left: 0;
      bottom: 0;
      background: #ff5353;
      color: #fff;
      font-size: .16rem;
      font-family: PingFangSC;
    }
  }
  .dot-check-close {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -.72rem;
    height: .72rem;
  }
}
.horizontal .dot-check-box .nb-bet-public-box-body { top: .1rem; }
</style>
