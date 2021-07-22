<template>
  <div class="nb-bet-history-head">
    <nav-bar :title="$t('pageBet.betSlips')" @back="backFun" custBack />
    <div class="history-head-change flex-between">
      <v-touch tag="div" :class="`change-item-${hisType ? 'normal' : 'active'} flex-center`" @tap="changeHisType(0)">
        {{$t('pageBet.setNo')}}
      </v-touch>
      <v-touch tag="div" :class="`change-item-${hisType ? 'active' : 'normal'} flex-center`" @tap="changeHisType(1)">
        <div :class="`change-item-text${earSucc ? ' order-changed' : ''} flex-center`">
          {{$t('pageBet.setYes')}}
        </div>
      </v-touch>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import NavBar from '@/components/common/NavBar';

export default {
  inheritAttrs: false,
  name: 'BetHistoryHead',
  computed: {
    ...mapState({
      hisType: state => state.bet.hisType,
      earSucc: state => state.bet.earlySuccess,
    }),
  },
  components: {
    NavBar,
  },
  methods: {
    ...mapMutations([
      'changeHisType',
      'changeSubStatus',
    ]),
    backFun() {
      this.$router.go(-1);
      this.changeSubStatus(false);
    },
  },
};
</script>

<style lang="less">
.white .nb-bet-history-head {
  background: #FFF;
  .history-head-title {
    color: #2E2F34;
  }
  .history-head-change {
    border-top: .01rem solid #ECEBEB;
    border-bottom: .01rem solid #ECEBEB;
    .change-item-normal {
      background: #ECEBEB;
      color: #AAA;
      .change-item-text {
        color: #AAA;
      }
    }
    .change-item-active {
      background: #FFF;
      color: #2E2F34;
      .change-item-text {
        color: #2E2F34;
      }
    }
  }
}
.black .nb-bet-history-head {
  background: #28272d;
  .history-head-title {
    color: #FFF;
  }
  .history-head-change {
    border-top: .01rem solid #2a2a2f;
    border-bottom: .01rem solid #28272d;
    .change-item-normal {
      background: #232327;
      color: #716d6d;
      .change-item-text {
        color: #716d6d;
      }
    }
    .change-item-active {
      background-image: linear-gradient(to bottom, #3a393f, #333238);
      color: #ecebeb;
      .change-item-text {
        color: #ecebeb;
      }
    }
  }
}
.nb-bet-history-head {
  width: 3.75rem;
  .history-head-box {
    width: 3.75rem;
    height: .45rem;
    position: relative;
    .history-head-back {
      width: .45rem;
      height: .45rem;
    }
    .history-head-title {
      width: 100%;
      height: .45rem;
      font-size: .18rem;
    }
  }
  .history-head-change {
    width: 100%;
    height: .35rem;
    .change-item-normal, .change-item-active {
      width: 50%;
      height: .33rem;
      font-size: .14rem;
      .change-item-text {
        position: relative;
        width: 90%;
        height: .3rem;
        font-size: .14rem;
      }
      .change-item-text.order-changed::before {
        content: "";
        position: absolute;
        display: block;
        top: 0.05rem;
        right: 0.42rem;
        width: 0.1rem;
        height: 0.1rem;
        border-radius: 50%;
        background: #ff5353;
      }
    }
  }
}
</style>
