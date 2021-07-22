<template>
  <bet-cover-box class="nb-bet-succ-fail" :index="999999" :show="show" @close="closeFun">
    <div class="succ-fail-body" :class="bodyClass">
      <div class="body-blank"></div>
      <div class="body-title flex-center">
        <span class="body-title-text flex-stast" v-if="/(succ|fail)/i.test(title)">
          {{$t('pageBet.betAct')}}<span class="body-title-text-alert flex-center">{{$t(`pageBet.bet${title}`)}}</span>{{errStr}}
        </span>
        <span class="body-title-text flex-stast" v-else>{{$t(`pageBet.bet${title}`)}}{{errStr}}</span>
        <span class="body-title-num" v-if="/^-1$/.test(type)">{{count}}</span>
        <span class="body-title-sec" v-if="/^-1$/.test(type)">{{$t('pageBet.second')}}</span>
      </div>
      <div class="body-alert flex-center">{{$t(`pageBet.bet${/^301$/.test(eCode) ? 'Bal' : ''}Alert`)}}</div>
    </div>
    <div class="succ-fail-close flex-center"><bet-cover-close /></div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import BetCoverClose from './BetComps/BetCoverClose';
import BetCoverBox from './BetComps/BetCoverBox';

export default {
  inheritAttrs: false,
  name: 'BetSuccFail',
  data() {
    return { bodyClass: 'succ-body', timer: null, count: 10 };
  },
  props: { show: Boolean, type: Number },
  computed: {
    ...mapState({ eCode: state => state.bet.errorCode }),
    ...mapState('app', { user: state => state.userinfo }),
    title() {
      let rt = /^(2|3|8|9)$/.test(this.type) ? 'Succ' : 'Fail';
      rt = /^-1$/.test(this.type) ? 'Live' : rt;
      return /^-[2-9]$/.test(this.type) ? 'Proc' : rt;
    },
    errStr() {
      return /^(0|4|5|6|7)$/.test(this.type) ? `(${this.eCode})` : '';
    },
  },
  watch: {
    show() {
      clearInterval(this.timer);
    },
    type() {
      this.changeClass();
    },
    eCode(n) {
      if (/^301$/.test(n) && this.user && this.user.token) {
        this.reloadBalance(true);
      }
    },
  },
  components: {
    BetCoverClose,
    BetCoverBox,
  },
  methods: {
    ...mapMutations(['pushPopSlipList']),
    ...mapActions('app', ['reloadBalance']),
    closeFun() {
      clearInterval(this.timer);
      if (/^-[1-9]$/.test(this.type)) {
        this.pushPopSlipList();
      }
      this.$emit('close', true);
    },
    changeClass() {
      const rt = /^(2|3|8|9)$/.test(this.type) ? 'succ-body' : 'fail-body';
      this.bodyClass = /^-[1-9]$/.test(this.type) ? 'proc-body' : rt;
      clearInterval(this.timer);
      this.count = 10;
      this.timer = setInterval(() => {
        this.count = this.count > 0 ? this.count - 1 : 10;
      }, 1000);
    },
  },
  mounted() {
    this.changeClass();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="less">
.nb-bet-succ-fail .nb-bet-body-box {
  top: 1.6rem;
  .succ-fail-body {
    border-radius: .1rem;
    width: 3.15rem;
    height: 2.16rem;
    margin: 0 auto;
    .body-blank {
      width: 100%;
      height: 1.48rem;
    }
    .body-title {
      width: 100%;
      height: .3rem;
      .body-title-text, .body-title-num, .body-title-text-alert  {
        font-size: .2rem;
        height: 100%;
      }
      .body-title-text {
        color: #2E2F34;
        .body-title-text-alert {
          padding: 0 0 .01rem .02rem;
          color: #ff5353;
        }
      }
      .body-title-num {
        color: #ff5353;
      }
      .body-title-sec {
        font-size: .12rem;
        color: #909090;
        padding-left: .1rem;
      }
    }
    .body-alert {
      width: 100%;
      height: .24rem;
      font-size: .14rem;
      color: #909090;
    }
  }
  .succ-fail-close {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -.72rem;
    height: .72rem;
  }
  .succ-body {
    background: url(./images/bet-success.png) no-repeat, #fff;
    background-size: 50% auto;
    background-position: center 15%;
  }
  .fail-body {
    background: url(./images/bet-failure.png) no-repeat, #fff;
    background-size: 50% auto;
    background-position: center 15%;
  }
  .proc-body {
    background: url(./images/bet-process.png) no-repeat, #fff;
    background-size: 50% auto;
    background-position: center 15%;
  }
}
</style>
