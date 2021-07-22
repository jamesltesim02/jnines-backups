<template>
  <bet-cover-box class="nb-bet-early-cash" :index="399999" :show="show" @close="closeFun">
    <div class="early-cash-body">
      <div class="body-blank"></div>
      <div class="body-title flex-center">
        <span class="body-title-text">{{$t('pageBet.rtnMoney')}}</span>
        <span class="body-title-num">{{data && data.money ? data.money : ''}}</span>
      </div>
      <div class="body-btns flex-center">
        <v-touch tag="div" class="body-btn-cancel flex-center" @tap="closeFun">
          {{$t('pageBet.think')}}
        </v-touch>
        <v-touch tag="div" class="body-btn-submit flex-center" @tap="cashFun">
          {{$t('pageBet.confirm')}}
        </v-touch>
      </div>
    </div>
    <div class="early-cash-close flex-center"><bet-cover-close /></div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { postPreCash } from '@/api/bet';
import BetCoverClose from './BetComps/BetCoverClose';
import BetCoverBox from './BetComps/BetCoverBox';

export default {
  inheritAttrs: false,
  name: 'BetEarlyCash',
  components: {
    BetCoverClose,
    BetCoverBox,
  },
  computed: {
    ...mapState({
      data: state => state.bet.earlyStatus,
    }),
    show() {
      return !!this.data;
    },
  },
  watch: {
    show() {
      this.clearEarlyTimer();
    },
  },
  methods: {
    ...mapMutations(['changeEarlyObject', 'changeEarlySuccess', 'clearEarlyTimer']),
    closeFun() {
      this.$emit('close', true);
    },
    async cashFun() {
      if (this.data && this.data.mstid) {
        try {
          await postPreCash({ wid: this.data.mstid, btp: 1 });
          this.$toast(this.$t('pageBet.earlySucc'));
          this.changeEarlyObject({ mstid: this.data.mstid, btp: 1 });
          this.changeEarlySuccess(true);
        } catch (ev) {
          this.$toast(this.$t('pageBet.earlyFail'));
        }
      } else {
        this.$toast(this.$t('pageBet.earlyFail'));
      }
      this.closeFun();
    },
  },
  beforeDestroy() {
    this.clearEarlyTimer();
  },
};
</script>

<style lang="less">
.nb-bet-early-cash .nb-bet-body-box {
  top: 1.6rem;
  .early-cash-body {
    border-radius: .1rem;
    width: 3.15rem;
    height: 2.16rem;
    margin: 0 auto;
    background: url(./images/bet-return.png) no-repeat, #fff;
    background-size: 70% auto;
    background-position: center 15%;
    overflow: hidden;
    .body-blank {
      width: 100%;
      height: 1.08rem;
    }
    .body-title {
      width: 100%;
      height: .3rem;
      .body-title-text {
        color: #2e2f34;
        font-size: .2rem;
        font-weight: 500;
      }
      .body-title-num {
        padding-left: .2rem;
        color: #ff5353;
        font-size: .22rem;
        font-weight: 500;
      }
    }
    .body-btns {
      width: 100%;
      height: .5rem;
      margin-top: .28rem;
      .body-btn-cancel, .body-btn-submit {
        height: .5rem;
        color: #fff;
        font-size: .16rem;
      }
      .body-btn-cancel {
        width: 1.15rem;
        background: #909090;
      }
      .body-btn-submit {
        width: 2rem;
        background: #ff5353;
      }
    }
  }
  .early-cash-close {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -.72rem;
    height: .72rem;
  }
}
</style>
