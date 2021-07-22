<template>
  <transition name="history">
    <div class="nb-history-list" v-if="show">
      <div class="history-list-item flex-between" v-for="(v, k) in bArr" :key="k">
        <span class="list-item-name">{{v.oids.join('/')}}</span>
        <div class="list-item-odds-box flex-start" >
          <span class="list-item-odds-at">@</span>
          <span class="list-item-odds-txt">{{(v.odds || 1) | NumFmt(true, 3)}}</span>
        </div>
        <div class="list-item-other-box flex-end" >
          <span class="list-item-other-txt" v-if="!v.win">{{$t('pageBet.willRtn')}}</span>
          <span class="list-item-other-txt" v-else>{{$t('pageBet.moneyRtn')}}</span>
          <span class="list-item-win" :style="{ color: winColor }" v-if="v.win > 0" >
            {{(v.win + betAmt) | NumFmt(true)}}
          </span>
          <span class="list-item-lose" :style="{ color: /^3$/.test(bettingMode) ? winColor : loseColor }" v-else-if="v.win < 0" >
            {{(v.win + betAmt) | NumFmt(true)}}
          </span>
          <span class="list-item-other-num" v-else>{{((v.odds || 1) * betAmt) | NumFmt(true)}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import { toSerList } from '@/utils/betUtils';

export default {
  inheritAttrs: false,
  name: 'BetHistoryList',
  data() {
    return { bArr: [] };
  },
  props: { data: Object, item: Object },
  computed: {
    ...mapState('app', ['theme', 'bettingMode']),
    show() {
      return this.item.detail;
    },
    betAmt() {
      return this.item.tamt / (this.item.cnt || 1);
    },
    winColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BET_HIS_WIN_COLOR ? pSet.BLACK_BET_HIS_WIN_COLOR : '#ff5353';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_BET_HIS_WIN_COLOR ? pSet.BLUE_BET_HIS_WIN_COLOR : '#32dcda';
      }
      return pSet && pSet.WHITE_BET_HIS_WIN_COLOR ? pSet.WHITE_BET_HIS_WIN_COLOR : '#ff5353';
    },
    loseColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (/^black$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BET_HIS_LOSE_COLOR ? pSet.BLACK_BET_HIS_LOSE_COLOR : '#428723';
      }
      if (/^blue$/i.test(this.theme)) {
        return pSet && pSet.BLUE_BET_HIS_LOSE_COLOR ? pSet.BLUE_BET_HIS_LOSE_COLOR : '#909090';
      }
      return pSet && pSet.WHITE_BET_HIS_LOSE_COLOR ? pSet.WHITE_BET_HIS_LOSE_COLOR : '#428723';
    },
  },
  watch: {
    show() {
      this.calculateMult();
    },
  },
  methods: {
    repOids(arr = []) {
      let arrStr = JSON.stringify(arr);
      for (let i = 0; i < this.data.opts.length; i += 1) {
        arrStr = arrStr.replace(new RegExp(`([\\[,])${this.data.opts[i].oid}([,\\]])`, 'g'), `$1${i + 1}$2`);
      }
      arrStr = JSON.parse(arrStr);
      for (let i = 0; i < arrStr.length; i += 1) {
        arrStr[i].win = arrStr[i].win || 0;
      }
      return arrStr;
    },
    calculateMult() {
      const bOpts = JSON.parse(JSON.stringify(this.data.opts));
      const nData = JSON.parse(JSON.stringify(this.item));
      if (!this.show) {
        this.bArr = [];
        return;
      }
      let [flag, data] = [false, []];
      for (let i = 0; i < bOpts.length; i += 1) {
        if (!bOpts[i].mid || !bOpts[i].ods) {
          flag = true;
          break;
        }
        bOpts[i].odds = bOpts[i].ods + 1;
        if (!bOpts[i].res) {
          [bOpts[i].win, bOpts[i].flag] = [0, 1];
        } else if (/^(-50|-100)$/.test(bOpts[i].res)) {
          bOpts[i].win = /5/.test(bOpts[i].res) ? 0.5 : 0;
        } else if (/^(50|100)$/.test(bOpts[i].res)) {
          const pt = bOpts[i].ods * (/5/.test(bOpts[i].res) ? 0.5 : 1);
          bOpts[i].win = pt + 1;
        } else {
          bOpts[i].win = 1;
        }
      }
      if (!flag && nData) {
        const amt = nData.tamt && nData.cnt ? nData.tamt / nData.cnt : 0;
        const stNum = nData.fld && nData.fld > 1 ? 2 : nData.num;
        for (let i = stNum; i <= nData.num; i += 1) {
          data = data.concat(toSerList(bOpts, i, nData.amt || amt));
        }
      }
      this.bArr = data && data.length ? this.repOids(data) : [];
    },
  },
};
</script>

<style lang="less">
.history-enter-active, .history-leave-active { transition: all 0.15s linear; }
.history-enter, .history-leave-active { transform: scaleY(0); }
.white .nb-history-list {
  border-bottom: .01rem solid #ECEBEB;
  .history-list-item {
    border-bottom: .01rem solid #F7F7F7;
    .list-item-name { color: #909090; }
    .list-item-other-txt, .list-item-other-num { color: #999; }
    .list-item-odds-at, .list-item-odds-txt { color: #666; }
  }
}
.black .nb-history-list {
  border-bottom: .01rem solid #2e2f34;
  .history-list-item {
    border-bottom: .01rem solid #2e2f34;
    .list-item-name { color: #bababa; }
    .list-item-other-txt, .list-item-other-num { color: #999; }
    .list-item-odds-at, .list-item-odds-txt { color: #bababa; }
  }
}
.blue .nb-history-list {
  border-bottom: .01rem solid #36353a;
  .history-list-item {
    border-bottom: .01rem solid #36353a;
    .list-item-name { color: #909090; }
    .list-item-other-txt, .list-item-other-num { color: #909090; }
    .list-item-odds-at, .list-item-odds-txt { color: #666666; }
  }
}
.nb-history-list {
  width: 100%;
  .history-list-item {
    position: relative;
    width: 100%;
    height: .3rem;
    padding: 0 .15rem;
    .list-item-odds-box { position: absolute; width: 90%; height: 100%; left: 0; top: 0; padding-left: 31%; }
    .list-item-name, .list-item-win, .list-item-lose { font-size: .13rem; }
    .list-item-other-txt, .list-item-other-num { font-size: .12rem; }
    .list-item-other-txt { padding-right: .06rem; }
    .list-item-odds-at { font-size: .12rem; padding-right: .01rem; font-family: PingFangTC; }
    .list-item-odds-txt { font-size: .12rem; }
  }
  .history-list-item:last-child { border: none; }
}
</style>
