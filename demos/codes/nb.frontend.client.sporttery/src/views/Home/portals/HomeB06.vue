<template>
<list-page
  class="home-b06"
  @scrollBottom="toBottomFun"
  :class="{ inquick: showQuick }"
>
  <nav-bar
    slot="header"
    :state.sync="state"
  />
  <sport-filter
    v-show="state.state !== 2"
    :sno.sync="sno"
  />
  <expand-transition
    :expanded="showQuick"
    class="qb-container"
  >
    <quick-bet-bar :matchs="slideMatchs" />
  </expand-transition>
  <match-list
    :sno="sno"
    :filter-state="state"
    :show-date="[0 , -1].includes(state.state)"
    ref="matchList"
  />
</list-page>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import ListPage from '@/components/common/ListPage';
import NavBar from '@/components/Home/HomeB06/NavBar';
import SportFilter from '@/components/Home/HomeB06/SportFilter';
import QuickBetBar from '@/components/Home/HomeB06/QuickBetBar';
import MatchList from '@/components/Matchs/MatchList';
import ExpandTransition from '@/components/common/ExpandTransition';
import { findSlide } from '@/api/pull';

export default {
  data() {
    return {
      sno: 0,
      state: {
        state: 2,
        count: 0,
      },
      slideMatchs: [],
    };
  },
  watch: {
    state(n) {
      this.sno = 0;
      this.updateMultType(n.state === -1 ? 1 : 0);
      if (n === 1 && this.sno === 0) {
        this.querySlides();
      }
    },
  },
  computed: {
    ...mapState('app', ['multType']),
    showQuick() {
      return this.slideMatchs && this.slideMatchs.length;
    },
  },
  components: {
    ListPage,
    NavBar,
    SportFilter,
    MatchList,
    QuickBetBar,
    ExpandTransition,
  },
  methods: {
    ...mapMutations('app', ['updateMultType']),
    toBottomFun() {
      if (!/^[5-9]\d{2}$/.test(this.sno)) {
        this.$refs.matchList.nextPage();
      }
    },
    async querySlides() {
      const slideData = await findSlide();
      this.matchs = (slideData || []).filter(m => !!+m.matchID);
    },
  },
};
</script>
<style lang="less">
.home-b06 {
  .sport-filter-b06 {
    position: relative;
    z-index: 1;
    background: #f5f5f5;
    transition: background-color .25s ease-out;
  }
  .qb-container {
    position: relative;
    z-index: 0;
    margin-top: 0;
  }
  &.inquick {
    .qb-container {
      margin-top: -.58rem;
      &::before {
        position: absolute;
        content: "";
        display: block;
        width: 100%;
        height: .04rem;
        bottom: 0;
        left: 0;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        box-shadow: -1px -1px 5px 5px rgba(223, 222, 223, 0.19);
      }
    }
    .nav-bar-b06 {
      border-color: #223044;
    }
    .sport-filter-b06 {
      background: rgba(34, 48, 68, .8);
      border-bottom: solid 1px #2a2a2a;
    }
    .match-list {
      position: relative;
      z-index: 3;
      padding-top: .04rem;
      background: #f5f5f5;
      margin-top: -.04rem;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }
  }
}
</style>
