<template>
  <list-page class="master-page">
    <bet-master-head slot="header" />
    <div class="master-page-box">
      <div class="bet-box-none flex-center-col" v-if="noData">
        <bet-box-none :inColor="inCol" :outColor="ouCol" />
        <p class="bet-box-none-text flex-center">{{$t('pageBet.noTicket')}}</p>
      </div>
      <div class="bet-box-detail" v-else>
        <div class="page-box-title flex-between">
          <span class="page-box-title-text">{{multType ? $t('pageBet.betItem') : ''}}</span>
          <v-touch tag="span" class="page-box-title-clear flex-center" @tap="clearFun">
            {{$t('pageBet.clearAll')}}
          </v-touch>
        </div>
        <bet-keyboard-multiple class="page-box-mult" v-if="multType" />
        <div class="page-box-title flex-between" v-if="multType">
          <span class="page-box-title-text">{{$t('pageBet.betSlips')}}</span>
          <span class="page-box-title-alert flex-between" v-if="betList.find(v => v.same)">
            <bet-box-alert />
            <span class="page-box-title-alert-text flex-none">{{$t('pageBet.sameAlert')}}</span>
          </span>
        </div>
        <div class="bet-page-item" v-for="(v, k) in betList" :key="k">
          <bet-option-box :data="v" :showId="!!multType" />
        </div>
      </div>
    </div>
  </list-page>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ListPage from '@/components/common/ListPage';
import BetBoxNone from '@/components/Bet/BetComps/BetBoxNone';
import BetBoxAlert from '@/components/Bet/BetComps//BetBoxAlert';
import BetOptionBox from '@/components/Bet/BetComps/BetOptionBox';
import BetMasterHead from '@/components/Bet/BetComps/BetMasterHead';
import BetKeyboardMultiple from '@/components/Bet/BetKeyboardMultiple';

export default {
  data() {
    return {
      multSel: 0,
      balance: '0.00',
      range: Object.assign({ min: 0, max: 0, rtn: 0 }, { odds: 0, mOdds: 0, gtp: 0 }),
      right: { m: 0, o: '1.00', lock: false },
      st: { o: {}, i: {} },
    };
  },

  computed: {
    ...mapState({
      betList: state => state.bet.betList,
    }),
    ...mapState('app', {
      theme: state => state.theme,
      multType: state => state.multType,
    }),
    noData() {
      if (!this.multType) {
        return this.betList.length < 1;
      }
      if (this.betList.length < 2) {
        return true;
      }
      const mArr = [];
      for (let i = 0; i < this.betList.length; i += 1) {
        if (mArr.indexOf(`${this.betList[i].matchID}`) < 0) {
          mArr.push(`${this.betList[i].matchID}`);
        }
      }
      return mArr.length < 2;
    },
    inCol() {
      return /black/i.test(this.theme) ? '#37383C' : '#909090';
    },
    ouCol() {
      return /black/i.test(this.theme) ? '#55565A' : '#AAAAAA';
    },
  },
  components: {
    ListPage,
    BetBoxNone,
    BetBoxAlert,
    BetOptionBox,
    BetMasterHead,
    BetKeyboardMultiple,
  },
  methods: {
    ...mapMutations([
      'clearBetItem',
      'changeSubStatus',
      'changeShowIndex',
      'changebetAmount',
    ]),
    ...mapMutations('app', ['setTabHeight']),
    clearFun() {
      this.clearBetItem();
    },
    backFun() {
      this.$router.go(-1);
      this.changeSubStatus(false);
    },
    eFun(v) {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (/close/i.test(cName)) {
        this.clearBetItem(v);
      } else if (v.matchID) {
        this.$router.push(`/detail/${v.sportID}/${v.matchID}`);
      }
    },
  },
  mounted() {
    this.changeShowIndex();
    this.changebetAmount({ amt: '' });
    setTimeout(() => { this.setTabHeight('0'); }, 100);
  },
};
</script>

<style lang="less">
.white .master-page-box {
  .bet-box-none .bet-box-none-text {
    color: #2E2F34;
  }
  .page-box-title {
    .page-box-title-text {
      color: rgba(46,47,52,0.7);
    }
    .page-box-title-clear {
      border: .01rem solid #bababa;
      color: rgba(46,47,52,0.5);
    }
    .page-box-title-alert-text {
      color: rgba(46,47,52,0.3);
    }
  }
  .bet-page-item {
    background-image: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
    box-shadow: 0 .1rem .2rem 0 rgba(223,222,223,0.5);
    border: .01rem solid #EBE9E9;
  }
}
.black .master-page-box {
  .bet-box-none .bet-box-none-text {
    color: #FFF;
  }
  .page-box-title {
    .page-box-title-text {
      color: rgba(255,255,255,0.7);
    }
    .page-box-title-clear {
      border: .01rem solid #666;
      color: rgba(255,255,255,0.5);
    }
    .page-box-title-alert-text {
      color: rgba(255,255,255,0.3);
    }
  }
  .bet-page-item {
    background-image: linear-gradient(to bottom, #3a393f, #333238);
    box-shadow: 0 .1rem .2rem 0 rgba(37, 37, 37, 0.5);
    border: .01rem solid #2e2f34;
  }
}
.master-page-box {
  width: 3.55rem;
  margin: .1rem auto 0;
  .bet-box-none {
    width: 100%;
    height: 4.5rem;
    .bet-box-none-text {
      width: 100%;
      height: .53rem;
      font-size: .15rem;
      opacity: 0.7;
    }
  }
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
    .page-box-title-alert {
      .page-box-title-alert-text {
        font-size: .12rem;
        padding: 0 .03rem .01rem .06rem;
      }
    }
  }
  .page-box-mult {
    margin: .1rem auto;
  }
  .bet-page-item {
    width: 100%;
    margin-top: .1rem;
    border-radius: .1rem;
    overflow: hidden;
  }
}
</style>
