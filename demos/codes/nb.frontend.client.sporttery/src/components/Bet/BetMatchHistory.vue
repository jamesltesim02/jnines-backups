<template>
  <div class="nb-bet-match-history" >
    <div :class="getItemClass(v)" v-for="(v, k) in data" :key="k">
      <bet-history-item :data="v" v-if="getNeedShow(v)" />
    </div>
    <div class="history-box-none flex-center-col" v-if="!showData.length">
      <bet-box-none :inColor="inCol" :outColor="ouCol" />
      <p class="history-box-none-text flex-center">{{$t('pageBet.noItem')}}</p>
    </div>
    <div v-if="showData.length" class="history-no-more flex-center">{{$t('pageBet.noMore')}}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BetBoxNone from '@/components/Bet/BetComps/BetBoxNone';
import BetHistoryItem from '@/components/Bet/BetComps/BetHistoryItem';

export default {
  props: { type: String },
  computed: {
    ...mapState({ data: state => state.bet.matchHisList }),
    ...mapState('app', { theme: state => state.theme }),
    showData() {
      const dt = [];
      for (let i = 0; i < this.data.length; i += 1) {
        if (this.getNeedShow(this.data[i])) {
          dt.push(this.data[i]);
        }
      }
      return dt;
    },
    inCol() {
      const defColor = /black/i.test(this.theme) ? '#37383C' : '#909090';
      return /blue/i.test(this.theme) ? '#37383C' : defColor;
    },
    ouCol() {
      const defColor = /black/i.test(this.theme) ? '#55565A' : '#AAAAAA';
      return /blue/i.test(this.theme) ? '#55565A' : defColor;
    },
  },
  components: { BetBoxNone, BetHistoryItem },
  methods: {
    getNeedShow(v) {
      let rst = true;
      if (this.type && /ear/i.test(this.type)) {
        rst = !!(v.cash && v.cashout);
      } else if (this.type && /un/i.test(this.type)) {
        rst = /^[12]$/.test(v.wst);
      } else if (this.type && /fi/i.test(this.type)) {
        rst = /^[12]$/.test(v.wst);
      }
      return rst;
    },
    getItemClass(v) {
      return `history-page-body-box${this.getNeedShow(v) ? '' : '-none'}`;
    },
  },
};
</script>

<style lang="less">
.white .nb-bet-match-history {
  .history-page-body-box { box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,0.5); background: linear-gradient(to top, #f9f9f9, #ffffff); border: .01rem solid #EBE9E9; }
  .history-box-none .history-box-none-text { color: #2E2F34; }
  .history-no-more { color: #BBB; }
}
.black .nb-bet-match-history {
  .history-page-body-box { box-shadow: 0 .1rem .2rem 0 rgba(37, 37, 37, 0.5); background: linear-gradient(133deg, #3d4046, #35363c); border: .01rem solid #2e2f34; }
  .history-box-none .history-box-none-text { color: #FFF; }
  .history-no-more { color: #716d6d; }
}
.blue .nb-bet-match-history {
  .history-page-body-box { box-shadow: 0 .1rem .2rem 0 rgba(0, 0, 0, 0.3); background: linear-gradient(to bottom, #3a393f, #28272c); border: .01rem solid #2e2f34; }
  .history-box-none .history-box-none-text { color: #FFF; }
  .history-no-more { color: #716d6d; }
}
.nb-bet-match-history {
  width: 100%;
  padding: .1rem 0 .15rem 0;
  .history-page-body-box-none { display: none; }
  .history-page-body-box { width: 3.55rem; border-radius: .06rem; margin: 0 auto .1rem; }
  .history-box-none {
    width: 100%;
    height: 3rem;
    .history-box-none-text { width: 100%; height: .53rem; font-size: .15rem; opacity: 0.7; user-select: none; }
  }
  .history-no-more { margin-top: .12rem; width: 100%; height: .26rem; font-size: .13rem; user-select: none; }
}
</style>
