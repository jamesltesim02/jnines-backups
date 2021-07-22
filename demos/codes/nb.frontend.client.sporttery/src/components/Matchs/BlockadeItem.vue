<template>
  <div class="nb-blockade-item" >
    <div class="nb-blockade-head flex-between">
      <div class="blockade-img-box">
        <div class="nb-blockade-img" :style="{ backgroundImage: `url(${data.bunchImages})` }"></div>
      </div>
      <div class="blockade-content-box">
        <div class="blockade-title" :style="{ color: oddsColor }">{{data.bunchTitle || ''}}</div>
        <div class="blockade-detail">{{data.bunchContent || ''}}</div>
        <div class="blockade-head-odds-box">
          <span class="head-box-text">{{$t('page.totalOdds')}}</span>
          <span class="head-box-odds" :style="{ color: oddsColor }">{{(data.odds || 1) | NumFmt}}</span>
          <icon-recom :fill="oddsColor" />
        </div>
      </div>
    </div>
    <div class="blockade-list-box">
      <div class="blockade-list flex-between" v-for="(v, k) in data.bunchList" :key="k" >
        <div class="blockade-time-group flex-between">
          <span class="blockade-time">{{v.matchDate}}</span>
          <rolling-text class="blockade-group" :text="v.tournamentName" :maxLength="5" scrollamount="1" />
        </div>
        <div class="blockade-team-box flex-start">
          <rolling-text class="blockade-team" :text="v.matchName" :maxLength="25" scrollamount="2" />
        </div>
        <div class="blockade-odds-box flex-between">
          <rolling-text class="blockade-option" :text="getOptName(v)" :maxLength="7" scrollamount="1" />
          <span class="blockade-odds" :style="{ color: oddsColor }">{{formatOdds(v)}}</span>
        </div>
      </div>
    </div>
    <v-touch class="blockade-submit flex-center" :style="{ background: btnColor }" @tap="toBetFun">{{$t('page.fastBet')}}</v-touch>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import oddsFormat from '@/filters/oddsFormat';
import toOptionName from '@/components/common/GameOption/toOptionName';
import RollingText from '@/components/common/RollingText';
import IconRecom from './icons/IconRecom';

export default {
  props: ['data'],
  computed: {
    ...mapState('app', ['theme']),
    ...mapState({ bCnt: state => state.bet.betCount }),
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_OPTION_COLOR ? pSet.BLUE_OPTION_COLOR : '#53fffd';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    btnColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BOTTON_BACKGROUND ? pSet.BLACK_BOTTON_BACKGROUND : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_BOTTON_BACKGROUND ? pSet.BLUE_BOTTON_BACKGROUND : '#00b5b3';
      }
      return pSet && pSet.WHITE_BOTTON_BACKGROUND ? pSet.WHITE_BOTTON_BACKGROUND : '#ff5353';
    },
  },
  components: { RollingText, IconRecom },
  methods: {
    ...mapActions(['quoteBetCart']),
    ...mapMutations(['clearBetItem', 'setNeedShowSingle', 'saveList']),
    getOptName(v) {
      const obj = toOptionName(v.gameType, v.bar || v.betBar || '', v.betOption);
      let optName = obj.key_s ? this.$t(`common.optionNames.${obj.key_s}`) : '';
      optName += obj.prefix ? `${/-/.test(obj.prefix) ? '' : '+'}${obj.prefix} ` : '';
      optName += obj.key_e ? this.$t(`common.optionNames.${obj.key_e}`) : '';
      optName += !obj.key_s && obj.key ? this.$t(`common.optionNames.${obj.key}`) : '';
      return `${optName}${obj.value || ''}${obj.suffix || ''}`;
    },
    formatOdds(v) {
      return oddsFormat(v.odds, v.gmt || v.gameType);
    },
    async toBetFun() {
      const dt = this.data.bunchList;
      for (let i = 0; i < dt.length; i += 1) {
        dt[i].from = 4;
      }
      this.clearBetItem();
      this.setNeedShowSingle(true);
      this.saveList(dt);
      await this.quoteBetCart();
      if (this.bCnt < this.data.bunchList.length) {
        this.clearBetItem();
        this.$toast(this.$t('pageBet.cantBet'));
      }
    },
  },
};
</script>
<style lang="less">
.white .nb-blockade-item {
  background: #fff;
  box-shadow: 0 .1rem .2rem 0 rgba(236, 236, 236, 0.5);
  .nb-blockade-head {
    border-bottom: .01rem solid #ECEBEB;
    .blockade-detail { color: #bababa; }
    .head-box-text { color: #909090; }
  }
  .blockade-list { background: #ECEBEB; }
  .blockade-time-group { border-right: .01rem solid #ddd; color: #909090; }
  .blockade-team-box { color: #bababa; }
  .blockade-odds-box { border-left: .01rem solid #ddd; color: #909090; }
  .blockade-submit { color: #fff }
}
.black .nb-blockade-item {
  background: linear-gradient(to bottom, #3a393f, #333238);
  box-shadow: 0 .1rem .2rem 0 rgba(37, 37, 37, 0.5);
  .nb-blockade-head {
    border-bottom: .01rem solid #28272d;
    .blockade-detail { color: #bababa; }
    .head-box-text { color: #909090; }
  }
  .blockade-list { background: #28272d; }
  .blockade-time-group { border-right: .01rem solid #35343a; color: #909090; }
  .blockade-team-box { color: #bababa; }
  .blockade-odds-box { border-left: .01rem solid #35343a; color: #909090; }
  .blockade-submit { color: #fff }
}
.nb-blockade-item {
  width: 3.51rem;
  margin: .2rem auto 0;
  border-radius: .06rem;
  .nb-blockade-head {
    width: 100%;
    height: 1.4rem;
    padding: .1rem .1rem 0 .1rem;
    .blockade-img-box {
      width: 1.27rem;
      height: 100%;
      .nb-blockade-img {
        width: 1.13rem;
        height: 100%;
        line-height: 100%;
        text-align: start;
        margin: 0 auto;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
    .blockade-content-box {
      width: 2.04rem;
      height: 100%;
      position: relative;
      .blockade-title {
        width: 100%;
        height: .24rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: .16rem;
        font-weight: 600;
      }
      .blockade-detail {
        width: 100%;
        height: .68rem;
        margin: .04rem 0;
        text-align: start;
        line-height: .17rem;
        font-size: .12rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }
      .blockade-head-odds-box {
        position: absolute;
        width: 100%;
        height: .3rem;
        bottom: 0;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        .head-box-text { font-size: .11rem; margin: 0 .06rem 0 0; }
        .head-box-odds { font-size: .22rem; margin: 0 .12rem -.02rem 0; font-weight: 600; }
      }
    }
  }
  .blockade-list-box {
    width: 100%;
    padding: .04rem .1rem;
    .blockade-list {
      width: 100%;
      height: .24rem;
      margin-top: .07rem;
      border-radius: .02rem;
      .blockade-time-group {
        width: .78rem;
        height: .16rem;
        padding: 0 .08rem;
        .blockade-time { font-size: .12rem; }
        .blockade-group {  font-size: .12rem; font-weight: 600; max-width: .28rem; }
      }
      .blockade-team-box {
        width: 1.7rem;
        height: 100%;
        padding: 0 .08rem;
        font-size: .12rem;
        font-weight: 600;
        .blockade-team { max-width: 1.5rem; }
      }
      .blockade-odds-box {
        width: .83rem;
        height: .16rem;
        padding: 0 .08rem;
        .blockade-option { font-size: .12rem; }
        .blockade-odds { font-size: .14rem; font-weight: 600; }
      }
    }
  }
  .blockade-submit {
    width: 100%;
    height: .4rem;
    margin-top: .16rem;
    font-size: .16rem;
    font-weight: 600;
    border-bottom-left-radius: .06rem;
    border-bottom-right-radius: .06rem;
  }
}
</style>
