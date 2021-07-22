<template>
<transition name="double">
  <div class="nb-bet-double flex-between" :style="st.o" v-if="show" v-bind="$attrs">
    <v-touch tag="div" class="double-select flex-center" :style="st.i" @tap="submitFun">
      <div class="double-select-title flex-center">{{$t('pageBet.mySelect')}}</div>
      <div class="double-select-games flex-start">
        <span class="num-txt">{{$t('pageBet.selected')}}</span>
        <span class="num-cnt">{{bCnt}}</span>
        <span class="num-txt">{{$t('pageBet.games')}}</span>
      </div>
    </v-touch>
    <v-touch tag="div" class="double-history flex-center" :style="st.i" @tap="historyFun">
      <div :class="`double-history-title${sSts ? ' order-changed' : ''} flex-center`">
        {{$t('pageBet.betSlips')}}
      </div>
    </v-touch>
  </div>
</transition>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  inheritAttrs: false,
  name: 'BetDouble',
  data() {
    return {
      st: { o: {}, i: {} },
    };
  },
  props: {
    show: Boolean,
  },
  computed: {
    ...mapState({
      bCnt: state => state.bet.betCount,
      iphX: state => state.bet.isIphoneX,
      sSts: state => state.bet.succStatus,
    }),
    ...mapState('app', {
      user: state => state.userinfo,
    }),
  },
  methods: {
    ...mapMutations([
      'changeSubStatus',
    ]),
    ...mapMutations('app', [
      'getUserInfo',
    ]),
    submitFun() {
      this.getUserInfo();
      if (this.bCnt > 0 && this.user && this.user.token) {
        this.$router.push('/master');
      } else if (this.bCnt > 0) {
        this.$toast(this.$t('pageBet.notLogin'));
      }
    },
    historyFun() {
      this.getUserInfo();
      if (this.user && this.user.token) {
        this.$router.push('/history');
      } else {
        this.$toast(this.$t('pageBet.notLogin'));
      }
    },
  },
  mounted() {
    this.st.o.height = this.iphX ? '.67rem' : '.52rem';
    if (this.iphX) {
      this.st.i.paddingBottom = '.15rem';
    }
  },
};
</script>
<style lang="less">
.double-enter-active, .double-leave-active {
  transition: all 0.15s ease-out;
}
.double-enter, .double-leave-active {
  transform: translateY(1rem);
}
.white .nb-bet-double {
  background: #FFF;
  box-shadow: 0 -.04rem .1rem 0 rgba(236,236,236,0.50);
  .double-select .double-select-title {
    color: #666;
  }
  .double-select .double-select-games .num-txt {
    color: #666;
  }
  .double-select .double-select-games .num-cnt {
    color: #ff5353;
  }
  .double-history .double-history-title {
    color: #666;
    border-left: .01rem solid #ECEBEB;
  }
}
.black .nb-bet-double {
  box-shadow: 0 -.04rem .1rem 0 rgba(37, 37, 37, 0.5);
  background-image: linear-gradient(to bottom, #3a393f, #333238);
  .double-select .double-select-title {
    color: #bababa;
  }
  .double-select .double-select-games .num-txt {
    color: #bababa;
  }
  .double-select .double-select-games .num-cnt {
    color: #ff5353;
  }
  .double-history .double-history-title {
    color: #bababa;
    border-left: .01rem solid #2e2f34;
  }
}
.nb-bet-double {
  position: fixed;
  width: 3.75rem;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 999999;
  min-height: .52rem;
  border-top-left-radius: .06rem;
  border-top-right-radius: .06rem;
  .double-select {
    width: 2.35rem;
    min-height: .52rem;
    .double-select-title {
      width: 1rem;
      height: .3rem;
      font-size: .16rem;
    }
    .double-select-games {
      width: 1.11rem;
      height: .3rem;
      .num-txt, .num-cnt {
        font-size: .13rem;
        user-select: none;
      }
      .num-cnt {
        padding: 0 .03rem;
      }
    }
  }
  .double-history {
    width: 1.4rem;
    min-height: .52rem;
    .double-history-title {
      position: relative;
      width: 1.39rem;
      height: .36rem;
      font-size: .16rem;
    }
    .double-history-title.order-changed::before {
      content: "";
      position: absolute;
      display: block;
      top: 0.08rem;
      right: 0.28rem;
      width: 0.1rem;
      height: 0.1rem;
      border-radius: 50%;
      background: #ff5353;
    }
  }
}
</style>
