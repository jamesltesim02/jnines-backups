<template>
  <div class="nb-blockade-item flex-end" >
    <div class="nb-blockade-img" :style="{ backgroundImage: `url(${data.bunchPcImages})` }"></div>
    <div class="blockade-content-box">
      <div class="blockade-title flex-start">{{data.bunchTitle || ''}}</div>
      <div class="blockade-detail">{{data.bunchContent || ''}}</div>
    </div>
    <div class="blockade-list-box">
      <div class="blockade-head-odds-box flex-end">
        <span class="head-box-text">{{$t('page.blockade.totalOdds')}}</span>
        <span class="head-box-odds" :style="{ color: oddsColor }">{{changeType(data.odds || 1)}}</span>
        <icon-recom class="blockade-odds-icon" :fill="oddsColor" />
      </div>
      <div class="blockade-list-b">
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
      <bet-keyboard class="blockade-bet-box" :btnName="$t('pageBet.fastBet')" :opts="data.bunchList" type="blockade" />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import oddsFormat from '@/filters/oddsFormat';
import { changeNumType } from '@/utils/betUtils';
import toOptionName from '@/components/Matchs/GameOption/toOptionName';
import RollingText from '@/components/common/RollingText';
import BetKeyboard from '@/components/Bet/BetKeyboard';
import IconRecom from './IconRecom';

export default {
  props: ['data'],
  computed: {
    ...mapState('app', ['theme']),
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
  },
  components: { RollingText, BetKeyboard, IconRecom },
  methods: {
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
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
  },
};
</script>
<style lang="less">
.nb-blockade-item {
  position: relative;
  width: 100%;
  margin: 55px 0 75px;
  background: #171717;
  .nb-blockade-img {
    position: absolute;
    width: 38%;
    height: 117.5%;
    z-index: 10;
    left: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .blockade-content-box {
    position: absolute;
    width: 31%;
    height: 90%;
    z-index: 20;
    left: 32%;
    top: 0;
    .blockade-title {
      width: 100%;
      height: 76px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 31px;
      font-weight: 500;
      color: #f5f5f5;
    }
    .blockade-detail {
      width: 100%;
      height: 84px;
      text-align: start;
      line-height: 21px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      color: #f5f5f5;
    }
  }
  .blockade-list-box {
    width: 40%;
    margin-right: 25px;
    .blockade-head-odds-box {
      position: relative;
      width: 100%;
      height: 77px;
      left: 0;
      top: 0;
      padding-right: 42px;
      .head-box-text { font-size: 14px; margin: 20px 10px 0 0; color: #bababa; }
      .head-box-odds { font-size: 42px; font-weight: 500; }
      .blockade-odds-icon { position: absolute; top: 0; right: 0; }
    }
    .blockade-list-b { width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: flex-end; }
    .blockade-list {
      width: 76.5%;
      height: 24px;
      margin-bottom: 10px;
      border-radius: 2px;
      background: linear-gradient(91deg, #28272d, #28272d);
      .blockade-time-group {
        width: 21.5%;
        height: 16px;
        padding: 0 8px;
        border-right: .1px solid #35343a;
        .blockade-time { font-size: 12px; color: #909090; }
        .blockade-group {  font-size: 12px; font-weight: 500; max-width: 28px; color: #909090; }
      }
      .blockade-team-box {
        width: 56%;
        height: 100%;
        padding: 0 8px;
        font-size: 12px;
        font-weight: 500;
        .blockade-team { max-width: 150px; color: #bababa; }
      }
      .blockade-odds-box {
        width: 22.5%;
        height: 16px;
        padding: 0 8px;
        border-left: 1px solid #35343a;
        .blockade-option { font-size: 12px; color: #909090; }
        .blockade-odds { font-size: 14px; font-weight: 500; }
      }
    }
    .blockade-list:last-child { margin-bottom: 0; }
    .blockade-bet-box { width: 100%; margin: 20px 0; }
  }
}
.white .nb-blockade-item {
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(236, 236, 236, 0.5);
  .blockade-title { color: #f5f5f5; }
  .blockade-detail { color: #f5f5f5; }
  .head-box-text { color: #909090; }
  .blockade-list { background: #ECEBEB; }
  .blockade-time-group { border-right: .1px solid #ddd; color: #909090; }
  .blockade-team-box { color: #bababa; }
  .blockade-odds-box { border-left: 1px solid #ddd; color: #909090; }
}
</style>
