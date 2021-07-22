<template>
  <list-page class="bet-page">
    <bet-head slot="header" />
    <div class="bet-page-box">
      <div class="page-box-title flex-between">
        <span class="page-box-title-text">{{$t('pageBet.betSlips')}}</span>
        <v-touch tag="span" class="page-box-title-clear flex-center" @tap="clearFun">
          {{$t('pageBet.clearAll')}}
        </v-touch>
      </div>
      <div class="bet-page-item" v-for="(v, k) in betList" :key="k">
        <bet-option-box :data="v" />
      </div>
    </div>
    <bet-mult-submit slot="footer" />
  </list-page>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ListPage from '@/components/common/ListPage';
import BetHead from '@/components/Bet/BetComps/BetHead';
import BetMultSubmit from '@/components/Bet/BetMultSubmit';
import BetOptionBox from '@/components/Bet/BetComps/BetOptionBox';

export default {
  computed: {
    ...mapState({
      betList: state => state.bet.betList,
    }),
    ...mapState('app', {
      theme: state => state.theme,
    }),
  },
  watch: {
    betList() {
      if (this.betList.length < 2) {
        this.$router.go(-1);
        this.changeSubStatus(false);
      }
    },
  },
  components: {
    ListPage,
    BetHead,
    BetMultSubmit,
    BetOptionBox,
  },
  methods: {
    ...mapMutations(['clearBetItem', 'changeSubStatus']),
    ...mapMutations('app', ['setTabHeight']),
    clearFun() {
      this.clearBetItem();
    },
  },
  mounted() {
    setTimeout(() => { this.setTabHeight('0'); }, 100);
  },
};
</script>

<style lang="less">
.white .bet-page-box {
  .page-box-title {
    .page-box-title-text {
      color: rgba(46,47,52,0.7);
    }
    .page-box-title-clear {
      border: .01rem solid #bababa;
      color: rgba(46,47,52,0.5);
    }
  }
  .bet-page-item {
    background-image: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
    box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,0.5);
    border: .01rem solid #EBE9E9;
  }
}
.black .bet-page-box {
  .page-box-title {
    .page-box-title-text {
      color: rgba(255,255,255,0.7);
    }
    .page-box-title-clear {
      border: .01rem solid #666;
      color: rgba(255,255,255,0.5);
    }
  }
  .bet-page-item {
    background-image: linear-gradient(to bottom, #3a393f, #333238);
    box-shadow: 0 .1rem .2rem 0 rgba(37, 37, 37, 0.5);
    border: .01rem solid #2e2f34;
  }
}
.bet-page-box {
  width: 3.52rem;
  margin: .1rem auto 0;
  .page-box-title {
    width: 100%;
    height: .23rem;
    .page-box-title-text {
      font-size: .13rem;
    }
    .page-box-title-clear {
      height: .22rem;
      padding: 0 .1rem;
      border-radius: .11rem;
      font-size: .12rem;
    }
  }
  .bet-page-item {
    width: 100%;
    margin-top: .1rem;
    border-radius: .1rem;
    overflow: hidden;
  }
}
</style>
