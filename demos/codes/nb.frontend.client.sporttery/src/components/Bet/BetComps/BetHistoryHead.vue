<template>
  <div class="nb-bet-history-head">
    <nav-bar :title="$t('pageBet.betHis')" @back="backFun" custBack />
    <div class="history-head-change flex-between">
      <v-touch :class="`change-item-${hisType ? 'normal' : 'active'} flex-center`" @tap="changeRoot(0)">
        {{$t('pageBet.setNo')}}
      </v-touch>
      <v-touch :class="`change-item-${hisType ? 'active' : 'normal'} flex-center`" @tap="changeRoot(1)">
        <div class="change-item-text flex-center">
          {{$t('pageBet.setYes')}}
          <i :style="{ background: flagColor }" v-if="earSucc"></i>
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
    ...mapState('app', ['theme']),
    flagColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_TAB_COLOR ? pSet.BLACK_TAB_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_TAB_COLOR ? pSet.BLUE_TAB_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_TAB_COLOR ? pSet.WHITE_TAB_COLOR : '#ff5353';
    },
  },
  components: {
    NavBar,
  },
  methods: {
    ...mapMutations(['changeSubStatus']),
    backFun() {
      this.$router.go(-1);
      this.changeSubStatus(false);
    },
    changeRoot(id) {
      this.$router.replace(`/history/${id ? 1 : 0}`);
    },
  },
};
</script>

<style lang="less">
.white .nb-bet-history-head {
  background: #FFF;
  .history-head-title { color: #2E2F34; }
  .history-head-change {
    border-bottom: .01rem solid #ECEBEB;
    .change-item-normal { background: #ECEBEB; color: #AAA; .change-item-text { color: #AAA; } }
    .change-item-active { background: #FFF; color: #2E2F34; .change-item-text { color: #2E2F34; } }
  }
}
.black .nb-bet-history-head {
  background: #28272d;
  .history-head-title { color: #FFF; }
  .history-head-change {
    border-bottom: .01rem solid #28272d;
    .change-item-normal { background: #232327; color: #716d6d; .change-item-text { color: #716d6d; } }
    .change-item-active { background: linear-gradient(to bottom, #3a393f, #333238); color: #ecebeb; .change-item-text { color: #ecebeb; } }
  }
}
.blue .nb-bet-history-head {
  background: #232327;
  .history-head-title { color: #ecebeb; }
  .history-head-change {
    .change-item-normal { background: #232327; color: #777777; .change-item-text { color: #777777; } }
    .change-item-active { background: linear-gradient(to bottom, #3a393f, #333238); color: #ecebeb; .change-item-text { color: #ecebeb; } }
  }
}
.nb-bet-history-head {
  width: 3.75rem;
  .history-head-box {
    width: 3.75rem;
    height: .45rem;
    position: relative;
    .history-head-back { width: .45rem; height: .45rem; }
    .history-head-title { width: 100%; height: .45rem; font-size: .18rem; }
  }
  .history-head-change {
    width: 100%;
    height: .35rem;
    .change-item-normal, .change-item-active {
      width: 50%;
      height: 100%;
      font-size: .14rem;
      .change-item-text { position: relative; width: 90%; height: .3rem; font-size: .14rem; }
      .change-item-text i { position: absolute; display: block; top: 0.05rem; right: 0.42rem; width: 0.1rem; height: 0.1rem; border-radius: 50%; }
    }
  }
}
</style>
