<template>
  <transition name="history">
    <div class="nb-history-list" v-if="show">
      <div class="history-list-row flex-between" v-for="(rw, i) in bArr" :key="i">
        <div class="history-list-item flex-between" v-for="(v, k) in rw" :key="k">
          <span class="list-item-name" v-if="v.oids">{{v.oids.join('/')}}</span>
          <div class="list-item-odds-box flex-start" >
            <span class="list-item-odds-at">@</span>
            <span class="list-item-odds-txt">{{changeType(v.odds || 1, true, 3)}}</span>
          </div>
          <div class="list-item-other-box flex-end" >
            <span class="list-item-other-txt" v-if="!v.win">{{$t('pageBet.willRtn')}}</span>
            <span class="list-item-other-txt" v-else>{{$t('pageBet.moneyRtn')}}</span>
            <span class="list-item-win" :style="{ color: winColor }" v-if="v.oids && v.win > 0" >
              {{changeType(v.win + betAmt, true)}}
            </span>
            <span class="list-item-lose" :style="{ color: /^3$/.test(bettingMode) ? winColor : loseColor }" v-else-if="v.oids && v.win < 0" >
              {{changeType(v.win + betAmt, true)}}
            </span>
            <span class="list-item-other-num" v-else>{{changeType((v.odds || 1) * betAmt, true)}}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import { toSerList, changeNumType } from '@/utils/betUtils';

export default {
  inheritAttrs: false,
  name: 'BetHistoryList',
  data() {
    return { bArr: [] };
  },
  props: { data: Object, item: Object },
  computed: {
    ...mapState('app', ['bettingMode', 'bettingStyle']),
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
    show() {
      return this.item.detail;
    },
    betAmt() {
      return this.item.tamt / (this.item.cnt || 1);
    },
    winColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BET_HIS_WIN_COLOR ? pSet.BLACK_BET_HIS_WIN_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_BET_HIS_WIN_COLOR ? pSet.WHITE_BET_HIS_WIN_COLOR : '#ff5353';
    },
    loseColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BET_HIS_LOSE_COLOR ? pSet.BLACK_BET_HIS_LOSE_COLOR : '#428723';
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
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
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
      const [bOpts, twoArr] = [JSON.parse(JSON.stringify(this.data.opts)), []];
      const nData = JSON.parse(JSON.stringify(this.item));
      const rowNum = nData.num > 12 || this.betCheck ? 1 : 2;
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
      data = data && data.length ? this.repOids(data) : [];
      for (let i = 0; i < data.length; i += 1) {
        if (!(i % rowNum)) {
          twoArr.push([]);
        }
        twoArr[twoArr.length - 1].push(data[i]);
      }
      if (twoArr.length && twoArr[twoArr.length - 1].length < rowNum) {
        for (let j = twoArr[twoArr.length - 1].length; j < rowNum; j += 1) {
          twoArr[twoArr.length - 1].push({ });
        }
      }
      this.bArr = twoArr;
    },
  },
};
</script>

<style lang="less">
.history-enter-active, .history-leave-active { transition: all 0.15s linear; }
.history-enter, .history-leave-active { transform: scaleY(0); }
.nb-history-list {
  width: 100%;
  .history-list-row {
    width: 100%;
    height: 30px;
    .history-list-item { position: relative; width: 100%; height: 100%; padding: 0 20px; }
    .list-item-odds-box { position: absolute; width: 90%; height: 100%; left: 0; top: 0; padding-left: 31%; }
    .list-item-name, .list-item-win, .list-item-lose { font-size: 13px; }
    .list-item-other-txt, .list-item-other-num { font-size: 12px; }
    .list-item-other-txt { padding-right: 6px; }
    .list-item-odds-at { font-size: 12px; padding-right: 1px; font-family: PingFangTC; padding-bottom: 1px; }
    .list-item-odds-txt { font-size: 12px; }
  }
  .history-list-row:last-child { border: none; }
}
.black .nb-history-list {
  border-bottom: 1px solid #3b3b3b7d;
  .history-list-row {
    border-bottom: 1px solid #3b3b3b7d;
    .list-item-name { color: #bababa; }
    .list-item-other-txt, .list-item-other-num { color: #999; }
    .list-item-odds-at, .list-item-odds-txt { color: #bababa; }
  }
}
.white .nb-history-list {
  border-bottom: 1px solid #ECEBEB;
  .history-list-row {
    border-bottom: 1px solid #F7F7F7;
    .list-item-name { color: #909090; }
    .list-item-other-txt, .list-item-other-num { color: #999; }
    .list-item-odds-at, .list-item-odds-txt { color: #666; }
  }
}
</style>
