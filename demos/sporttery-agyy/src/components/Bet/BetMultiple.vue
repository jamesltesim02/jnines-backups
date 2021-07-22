<template>
<transition name="multiple">
  <div class="nb-bet-multiple flex-between" :style="st.o" v-if="show" v-bind="attrs">
    <v-touch tag="div" class="mult-can flex-center" :style="st.i" @tap="clearFun">
      <div class="mult-can-box flex-center">
        <bet-mult-can :color="/black/i.test(theme) ? '#4c4c4c' : '#999'" />
      </div>
    </v-touch>
    <div class="mult-sel-box flex-center-col" :style="st.i">
      <div class="sel-num flex-start">
        <span class="num-txt">{{$t('pageBet.selected')}}</span>
        <span class="num-cnt">{{bCnt}}</span>
        <span class="num-txt">{{$t('pageBet.games')}}</span>
      </div>
      <div class="sel-alert flex-start">{{$t(`pageBet.must${!/^2$/.test(bMod) ? 'Two' : 'One'}`)}}</div>
    </div>
    <div class="mult-odds-box flex-center-col" :style="st.i">
      <div class="odds-txt flex-center" v-if="/^2$/.test(bMod)">{{$t('pageBet.hightOdds')}}</div>
      <div class="odds-txt flex-center" v-else>{{$t('pageBet.multOdds')}}</div>
      <div v-if="/^2$/.test(bMod) || bCnt > 1" class="odds-num flex-center">{{changeType(qObj.mOdds, true)}}</div>
      <div v-else class="odds-txt flex-center">- - -</div>
    </div>
    <v-touch tag="div" :class="`mult-bet-${/^2$/.test(bMod) || bCnt > 1 ? 'active' : 'normal'} flex-center`"
    :style="st.i" @tap="confilmFun">
      {{$t('pageBet.confirm')}}
    </v-touch>
  </div>
</transition>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import BetMultCan from './BetComps/BetMultCan';

export default {
  inheritAttrs: false,
  name: 'BetMultiple',
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
      qObj: state => state.bet.quoteObj,
      bPct: state => state.bet.betPerct,
      bCnt: state => state.bet.betCount,
      iphX: state => state.bet.isIphoneX,
    }),
    ...mapState('app', {
      bMod: state => state.bettingMode,
      user: state => state.userinfo,
      theme: state => state.theme,
    }),
    attrs() {
      return Object.assign({}, this.$attrs, {
        style: { transform: `scaleY(${this.bPct})`, 'transform-origin': '50% 100% 0' },
      });
    },
  },
  components: {
    BetMultCan,
  },
  methods: {
    ...mapMutations([
      'clearBetItem',
      'changeSubStatus',
    ]),
    ...mapMutations('app', [
      'getUserInfo',
    ]),
    changeType(num, fnum) {
      const arr = `${Math.abs(num) + 0.000005}`.match(/^(\d+)(\.\d{2})/);
      const [len, flag] = [arr[1].length % 3, num < 0 ? '-' : ''];
      const str = `${new Array(len ? 4 - len : 1).join('0')}${arr[1]}`;
      let rtn = '';
      for (let i = 0; i < str.length; i += 3) {
        rtn += `${str.slice(i, i + 3)}${i === str.length - 3 ? '' : ','}`;
      }
      rtn = `${flag}${`${rtn}`.replace(/^0{1,2}/, '')}`;
      return fnum ? `${rtn}${arr[2]}` : `${rtn}${`${arr[2]}`.replace(/[.0]+$/, '')}`;
    },
    clearFun() {
      this.clearBetItem();
    },
    confilmFun() {
      this.getUserInfo();
      const bPass = /^2$/.test(this.bMod) || this.bCnt > 1;
      if (bPass && this.user && this.user.token) {
        this.changeSubStatus(true);
        this.$router.push(/^2$/.test(this.bMod) ? '/master' : '/bet');
      } else if (bPass) {
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
.multiple-enter-active, .multiple-leave-active {
  transition: all 0.15s ease-out;
}
.multiple-enter, .multiple-leave-active {
  transform: translateY(1rem);
}
.white .nb-bet-multiple {
  background: #FFF;
  box-shadow: 0 -.04rem .1rem 0 rgba(236,236,236,0.50);
  .mult-can .mult-can-box {
    background: #F5F4F5;
  }
  .mult-sel-box .sel-num .num-txt {
    color: #666;
  }
  .mult-sel-box .sel-num .num-cnt {
    color: #ff5353;
  }
  .mult-sel-box .sel-alert {
    color: #999;
  }
  .mult-odds-box .odds-txt {
    color: #666;
  }
  .mult-odds-box .odds-num {
    color: #FE6246;
  }
  .mult-bet-active {
    color: #FFF;
    background: #FF5353;
  }
  .mult-bet-normal {
    color: #BABABA;
    border-left: .01rem solid #ECEBEB;
  }
}
.black .nb-bet-multiple {
  box-shadow: 0 -.04rem .1rem 0 rgba(37, 37, 37, 0.5);
  background-image: linear-gradient(to bottom, #3a393f, #333238);
  .mult-can .mult-can-box {
    background: #28272d;
  }
  .mult-sel-box .sel-num .num-txt {
    color: #bababa;
  }
  .mult-sel-box .sel-num .num-cnt {
    color: #ff5353;
  }
  .mult-sel-box .sel-alert {
    color: #909090;
  }
  .mult-odds-box .odds-txt {
    color: #9b9b9b;
  }
  .mult-odds-box .odds-num {
    color: #fe6246;
  }
  .mult-bet-active {
    color: #FFF;
    background: #FF5353;
  }
  .mult-bet-normal {
    color: #716d6d;
    border-left: .01rem solid #2e2f34;
  }
}
.nb-bet-multiple {
  position: fixed;
  width: 3.75rem;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 999999;
  min-height: .52rem;
  .mult-can {
    width: .62rem;
    height: 100%;
    min-height: .52rem;
    .mult-can-box {
      width: .32rem;
      height: .32rem;
      border-radius: 100%;
    }
  }
  .mult-sel-box {
    width: .75rem;
    height: 100%;
    min-height: .52rem;
    .sel-num, .sel-alert {
      width: 100%;
      height: 40%;
    }
    .sel-num {
      font-size: .13rem;
    }
    .sel-alert {
      font-size: .11rem;
    }
    .num-cnt {
      padding: 0 .03rem;
    }
  }
  .mult-odds-box {
    width: .98rem;
    height: 100%;
    min-height: .52rem;
    .odds-txt, .odds-num {
      font-size: .13rem;
    }
  }
  .mult-bet-active, .mult-bet-normal {
    width: 1.4rem;
    height: 100%;
    min-height: .52rem;
    font-size: .16rem;
  }
}
</style>
