<template>
  <bet-cover-box class="nb-bet-succ-fail-mix white" :index="999999" :show="show" @close="closeFun" >
    <div class="mix-succ-fail-body" v-if="show" >
      <div class="top-red"></div>
      <div class="mix-slip-head flex-center">{{$t('pageBet.slipFinish')}}</div>
      <div class="mix-slip-body">
        <div class="mix-slip-item-box" v-for="(v, k) in btRstArr" :key="k" >
          <div class="mix-slip-item-mult-box" v-if="v.btp > 1">
            <v-touch class="mix-slip-mult-item" v-for="(w, n) in v.bets" :key="n" @tap="toggleMult(v, w)" >
              <div class="slip-mult-show-box flex-between">
                <span class="slip-mult-show-title">{{w.num}}{{$t('pageBet.betFolds')}}{{w.fld}}</span>
                <!-- <span class="slip-mult-show-count flex-center" v-if="!w.show">{{w.cnt}}</span> -->
                <div class="slip-mult-num-box flex-end" >
                  <span class="slip-mult-num-at">@</span>
                  <span class="slip-mult-num-txt">{{w.odds / (w.cnt || 1) | NumFmt(true, 3)}}</span>
                </div>
              </div>
              <div class="slip-mult-toggle-box" v-if="!!w.show" >
                <div class="slip-mult-toggle-item flex-between" v-for="(u, l) in w.list.data" :key="l" >
                  <span class="mix-slip-show-txt">{{u.oids.join('/')}}</span>
                  <div class="mix-slip-show-num-box flex-start" >
                    <span class="slip-mult-show-num-at">@</span>
                    <span class="slip-mult-show-num-txt">{{(u.odds || 1) | NumFmt(true, 3)}}</span>
                  </div>
                  <span class="slip-mult-show-txt">{{w.list.amt * (u.odds || 1) | NumFmt}}</span>
                </div>
              </div>
              <div class="slip-mult-cal-box flex-between" v-if="!!w.show" >
                <div class="mix-slip-mix-box flex-start">
                  <span class="mix-slip-show-txt">{{$t('pageBet.betCount')}}</span>
                  <span class="mix-slip-show-num">{{w.cnt}}</span>
                </div>
                <div class="mix-slip-mix-box flex-end">
                  <span class="mix-slip-show-txt">{{$t('pageBet.eachBet')}}</span>
                  <span class="mix-slip-show-num">{{w.list.amt | NumFmt}}</span>
                </div>
              </div>
              <div class="slip-mult-cal-box flex-between" v-if="!!w.show" >
                <div class="mix-slip-mix-box flex-start">
                  <span class="mix-slip-show-txt">{{$t('pageBet.betMoney')}}</span>
                  <span class="mix-slip-show-num">{{w.amt | NumFmt}}</span>
                </div>
                <div class="mix-slip-mix-box flex-end">
                  <span class="mix-slip-show-txt">{{$t('pageBet.willRtn')}}</span>
                  <span class="mix-slip-show-num">{{w.rtn | NumFmt}}</span>
                </div>
              </div>
            </v-touch>
          </div>
          <div class="slip-opts-cal-box" >
            <div class="slip-opts-item" v-for="(w, n) in v.opts" :key="n" >
              <bet-history-option :data="w" :showId="getShowID(v)" isSingle />
              <div class="slip-opts-item-line" :style="getLineStyle(v, w)" ></div>
            </div>
            <div class="slip-result-box flex-center-col" v-if="v.wid">
              <div class="slip-result-icon-box flex-end">
                <div class="slip-result-icon flex-start">
                  <bet-mix-success v-if="/^[2389]$/.test(v.slip)" />
                  <bet-mix-failure v-else-if="/^[04567]$/.test(v.slip)" />
                  <bet-mix-submit v-else />
                </div>
              </div>
              <div class="slip-result-txt-box flex-center-col">
                <span class="slip-result-title flex-end" v-if="/^[04567]$/.test(v.slip)" >{{getErrTitle(v)}}</span>
                <span class="slip-result-explan flex-end" v-if="/^[04567]$/.test(v.slip)" >{{getErrExplan(v)}}</span>
                <span class="slip-result-live flex-end" v-else-if="getIsLive(v)" >
                  {{$t('pageBet.betLive')}} {{t.count}}{{$t('pageBet.second')}}
                </span>
              </div>
            </div>
          </div>
          <div class="slip-slip-cal-box flex-between" >
            <div class="mix-slip-mix-box flex-start">
              <span class="mix-slip-show-txt">{{$t('pageBet.betMoney')}}</span>
              <span class="mix-slip-show-num">{{v.amt | NumFmt}}</span>
            </div>
            <div class="mix-slip-mix-box flex-end">
              <span class="mix-slip-show-txt">{{$t('pageBet.willRtn')}}</span>
              <span class="mix-slip-show-num">{{v.rtn | NumFmt}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mix-slip-show flex-between">
        <div class="mix-slip-mix-box flex-start">
          <span class="mix-slip-show-txt">{{$t('pageBet.tMixBet')}}</span>
          <span class="mix-slip-show-num">{{btRstAmt | NumFmt}}</span>
          <span class="mix-slip-show-txt-s">({{$t('pageBet.selfBet')}}</span>
          <span class="mix-slip-show-num">{{btSelAmt | NumFmt}}</span>
          <span class="mix-slip-show-txt">)</span>
        </div>
        <div class="mix-slip-mix-box flex-end">
          <span class="mix-slip-show-txt">{{$t('pageBet.tMixRtn')}}</span>
          <span class="mix-slip-show-num">{{btRstRtn | NumFmt}}</span>
        </div>
      </div>
      <div class="mix-slip-btns flex-between">
        <v-touch class="mix-slip-btn btn-normal flex-center" @tap="toHisFun">{{$t('pageBet.viewHistory')}}</v-touch>
        <v-touch class="mix-slip-btn btn-active flex-center" @tap="closeFun">{{$t('pageBet.continueBet')}}</v-touch>
      </div>
    </div>
    <div class="mix-succ-fail-close flex-center" v-if="show" ><bet-cover-close /></div>
  </bet-cover-box>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BetCoverBox from './BetComps/BetCoverBox';
import BetMixSubmit from './BetComps/BetMixSubmit';
import BetMixSuccess from './BetComps/BetMixSuccess';
import BetMixFailure from './BetComps/BetMixFailure';
import BetCoverClose from './BetComps/BetCoverClose';
import BetHistoryOption from './BetComps/BetHistoryOption';

export default {
  inheritAttrs: false,
  name: 'BetSuccFailMix',
  data() {
    return {
      btRstAmt: 0,
      btRstRtn: 0,
      btSelAmt: 0,
      btRstArr: [],
      t: { timer: null, count: 0, cntMax: 5 },
    };
  },
  props: { show: Boolean },
  computed: {
    ...mapState('app', ['theme']),
    ...mapState({
      bObj: state => state.bet.bettingObj,
      pArr: state => state.bet.betPushArr,
      rArr: state => state.bet.betResultArr,
    }),
  },
  watch: {
    bObj() {
      this.makeBetRstList();
    },
    rArr() {
      this.addWidToList();
    },
    pArr() {
      this.updateRstToList();
    },
  },
  components: {
    BetCoverBox,
    BetMixSubmit,
    BetMixSuccess,
    BetMixFailure,
    BetCoverClose,
    BetHistoryOption,
  },
  methods: {
    ...mapMutations(['clearBetItem', 'setBettingObj']),
    getShowID(v) {
      return v.bets.filter(u => !!u.show).length > 0;
    },
    getIsLive(v) {
      const liveArr = v.opts.filter(u => /^[12]$/.test(u.matchState));
      return !/^[023456789]$/.test(v.slip) && liveArr.length > 0;
    },
    getLineStyle(v, w) {
      const defColor = /^blue$/i.test(this.theme) ? '#2e2f34' : '#ecebeb';
      return w.idx < v.opts.length ? { borderBottom: `.01rem solid ${defColor}` } : { };
    },
    getErrTitle(v) {
      let errRtnStr = '';
      const errObjFromLan = this.$t('pageBet.betErrObj');
      if (/^[04567]$/.test(v.slip) && v.code && errObjFromLan[v.code]) {
        const errRtnObj = errObjFromLan[v.code];
        errRtnStr = errRtnObj && errRtnObj.title ? `${errRtnObj.title} [${v.code}]` : errRtnStr;
      }
      return errRtnStr;
    },
    getErrExplan(v) {
      let errRtnStr = '';
      const errObjFromLan = this.$t('pageBet.betErrObj');
      if (/^[04567]$/.test(v.slip) && v.code && errObjFromLan[v.code]) {
        const errRtnObj = errObjFromLan[v.code];
        errRtnStr = errRtnObj && errRtnObj.explan ? errRtnObj.explan : errRtnStr;
      }
      return errRtnStr;
    },
    closeFun() {
      clearInterval(this.t.timer);
      this.setBettingObj();
      this.clearBetItem();
      this.$emit('close', true);
    },
    toHisFun() {
      clearInterval(this.t.timer);
      this.setBettingObj();
      this.$emit('history', true);
    },
    toggleMult(v, w) {
      if (v.bets.length < 2 && (!w.list || !w.list.data || w.list.data.length < 2)) return;
      for (let i = 0; i < this.btRstArr.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.btRstArr[i]));
        if (`${obj.showId}` === `${v.showId}`) {
          for (let j = 0; j < obj.bets.length; j += 1) {
            if (`${obj.bets[j].num}_${obj.bets[j].fld}` === `${w.num}_${w.fld}`) {
              obj.bets[j].show = !obj.bets[j].show;
              break;
            }
          }
          this.$set(this.btRstArr, i, obj);
          break;
        }
      }
    },
    makeBetRstList() {
      clearInterval(this.t.timer);
      this.btRstAmt = this.bObj && this.bObj.amt ? this.bObj.amt : 0;
      this.btRstRtn = this.bObj && this.bObj.rtn ? this.bObj.rtn : 0;
      const codeAmt = this.bObj && this.bObj.cAmt ? this.bObj.cAmt : 0;
      this.btSelAmt = this.btRstAmt - codeAmt;
      const btArr = [];
      if (this.bObj && this.bObj.arr && this.bObj.arr.length) {
        for (let i = 0; i < this.bObj.arr.length; i += 1) {
          const obj = JSON.parse(JSON.stringify(this.bObj.arr[i]));
          obj.showId = `sid${1000000000 + i}`;
          btArr.push(obj);
        }
      }
      this.btRstArr = btArr;
      this.addWidToList();
    },
    addWidToList() {
      if (this.rArr && this.rArr.length) {
        const nrArr = JSON.parse(JSON.stringify(this.rArr));
        for (let i = 0; i < this.btRstArr.length; i += 1) {
          if (!this.btRstArr[i].wid) {
            const obj = JSON.parse(JSON.stringify(this.btRstArr[i]));
            for (let j = nrArr.length - 1; j >= 0; j -= 1) {
              let nrPass = nrArr[j].bets.length === obj.bets.length;
              nrPass = nrPass && nrArr[j].oids.length === obj.opts.length;
              if (`${nrArr[j].btp}` === `${obj.btp}` && nrPass && nrArr[j].wid) {
                let inPass = true;
                for (let k = 0; k < obj.opts.length; k += 1) {
                  inPass = inPass && nrArr[j].oids.indexOf(`${obj.opts[k].optionID}`) > -1;
                  if (!inPass) break;
                }
                if (inPass) {
                  for (let k = 0; k < obj.bets.length; k += 1) {
                    let itemPass = false;
                    const btkObj = obj.bets[k];
                    const objItem = `${btkObj.num}_${btkObj.fld}_${btkObj.cnt}_${btkObj.amt / (btkObj.cnt || 1)}`;
                    for (let m = 0; m < nrArr[j].bets.length; m += 1) {
                      const nrBtObj = nrArr[j].bets[m];
                      const nrItem = `${nrBtObj.num}_${nrBtObj.fld}_${nrBtObj.cnt}_${nrBtObj.amt}`;
                      itemPass = itemPass || nrItem === objItem;
                      if (itemPass) break;
                    }
                    inPass = inPass && itemPass;
                    if (!inPass) break;
                  }
                }
                if (inPass) {
                  const liveArr = obj.opts.filter(v => /^[12]$/.test(v.matchState));
                  [obj.wid, obj.slip] = [nrArr[j].wid, liveArr && liveArr.length ? -1 : -2];
                  this.$set(this.btRstArr, i, obj);
                  nrArr.splice(j, 1);
                  break;
                }
              }
            }
          }
        }
        this.startCount();
      }
      this.updateRstToList();
    },
    updateRstToList() {
      if (this.pArr && this.pArr.length) {
        const pushArr = JSON.parse(JSON.stringify(this.pArr));
        for (let i = 0; i < this.btRstArr.length; i += 1) {
          const obj = JSON.parse(JSON.stringify(this.btRstArr[i]));
          if (obj.wid && !/^[023456789]$/.test(obj.slip)) {
            const slpArr = pushArr.filter(v => `${v.wid}` === `${obj.wid}`);
            if (slpArr && slpArr.length) {
              [obj.slip, obj.code] = [slpArr[0].slip, slpArr[0].code];
              this.$set(this.btRstArr, i, obj);
            }
          }
        }
      }
    },
    startCount() {
      clearInterval(this.t.timer);
      if (!this.show) return;
      this.t.count = this.t.cntMax;
      this.t.timer = setInterval(() => {
        this.t.count = this.t.count > 0 ? this.t.count - 1 : this.t.cntMax;
      }, 1000);
    },
  },
  mounted() {
    this.makeBetRstList();
  },
  beforeDestroy() {
    clearInterval(this.t.timer);
  },
};
</script>

<style lang="less">
.nb-bet-succ-fail-mix .nb-bet-public-box-body {
  top: .8rem;
  .mix-succ-fail-body { width: 3.3rem; border-radius: .1rem; margin: 0 auto; overflow: hidden; }
  .top-red { width: 100%; height: .06rem; }
  .mix-slip-head { width: 100%; height: .45rem; font-size: .18rem; font-weight: 600; }
  .mix-slip-body { width: 100%; max-height: 3rem; padding: 0 .1rem .1rem .1rem; overflow: auto; -webkit-overflow-scrolling: touch; }
  .mix-slip-item-box { width: 100%; margin-top: .1rem; border-radius: .06rem; }
  .slip-mult-show-box { width: 100%; height: .3rem; padding: 0 .1rem; font-weight: 500; }
  .slip-mult-show-title { font-size: .14rem; }
  .slip-mult-show-count { width: .23rem; height: .23rem; border-radius: 100%; font-size: .11rem; }
  .slip-mult-num-at { padding-right: .01rem; font-family: PingFangTC; }
  .slip-mult-show-num-at { padding-right: .01rem; font-family: PingFangTC; }
  .mix-slip-mix-box { width: 100%; height: 100%; overflow: hidden; }
  .slip-mult-num-box { .slip-mult-num-at { font-size: .14rem; } .slip-mult-num-txt { font-size: .16rem; } }
  .mix-slip-show-num-box { position: absolute; width: 90%; height: 100%; left: 0; top: 0; padding-left: 32%; }
  .mix-slip-show-num-box { .slip-mult-num-at { font-size: .12rem; } .slip-mult-num-txt { font-size: .14rem; } }
  .slip-mult-toggle-box { width: 100%; }
  .slip-mult-toggle-item { position: relative; width: 100%; height: .26rem; padding: 0 .1rem; }
  .slip-mult-toggle-item:last-child { border: none; }
  .slip-mult-cal-box { width: 100%; height: .3rem; padding: 0 .1rem; }
  .slip-slip-cal-box { width: 100%; height: .3rem; padding: 0 .1rem; }
  .slip-opts-cal-box { position: relative; width: 100%; }
  .slip-opts-item-line { width: 75%; height: .05rem; }
  .slip-result-box { position: absolute; width: 100%; height: .75rem; right: 0; bottom: 0; }
  .slip-result-icon-box { width: 100%; .slip-result-icon { width: .56rem; } }
  .slip-result-txt-box { width: 100%; flex-grow: 1; padding-right: .1rem; }
  .slip-result-title { width: 100%; height: 45%; font-size: .12rem; }
  .slip-result-explan { width: 100%; height: 45%; font-size: .1rem; }
  .slip-result-live { width: 100%; height: 40%; font-size: .12rem; }
  .mix-slip-show { width: 100%; height: .37rem; padding: 0 .1rem; }
  .mix-slip-show-txt { font-size: .12rem; padding-right: .06rem; }
  .mix-slip-show-txt-s { font-size: .12rem; padding: 0 .03rem 0 .06rem; }
  .mix-slip-show-num { font-size: .14rem; font-weight: 500; }
  .mix-slip-btns { width: 100%; height: .5rem; .mix-slip-btn { width: 100%; height: 100%; font-size: .16rem; } }
  .mix-succ-fail-close { position: absolute; left: 0; right: 0; bottom: -.72rem; height: .72rem; }
}
.white .nb-bet-succ-fail-mix .nb-bet-public-box-body {
  .mix-succ-fail-body { background: #fff; }
  .top-red { background: #ff5353; }
  .mix-slip-head { border-bottom: .01rem solid #ecebeb; color: #303030; }
  .mix-slip-item-box { border: .01rem solid #ecebeb; box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1); background: linear-gradient(to top, #f9f9f9, #fff); }
  .slip-mult-show-box { border-bottom: .01rem solid #ecebeb; }
  .slip-mult-show-title { color: #ff5353; }
  .slip-mult-show-count { background: #ecebeb; color: #767477; }
  .slip-mult-num-at, .slip-mult-num-txt { color: #ff5353; }
  .slip-mult-show-num-at, .slip-mult-show-num-txt { color: #909090; }
  .slip-mult-show-txt { color: #909090; }
  .slip-mult-toggle-box { border-bottom: .01rem solid #ecebeb; }
  .slip-mult-toggle-item { border-bottom: .01rem solid #efefef; }
  .slip-mult-cal-box { border-bottom: .01rem solid #ecebeb; }
  .slip-opts-cal-box { border-bottom: .01rem solid #ecebeb; }
  .slip-result-title { color: #ff5353; }
  .slip-result-explan { color: #909090; }
  .slip-result-live { color: #909090; }
  .mix-slip-show { border-top: .01rem solid #ecebeb; box-shadow: 0 -.02rem .04rem 0 rgba(156,156,156,.1); }
  .mix-slip-show-txt, .mix-slip-show-txt-s { color: #909090; }
  .mix-slip-show-num { color: #ff5353; }
  .mix-slip-btn.btn-normal { color: #909090; border-top: .01rem solid #ecebeb; }
  .mix-slip-btn.btn-active { background: #ff5353; color: #fff; }
}
.black .nb-bet-succ-fail-mix .nb-bet-public-box-body {
  .mix-succ-fail-body { background: #fff; }
  .top-red { background: #ff5353; }
  .mix-slip-head { border-bottom: .01rem solid #ecebeb; color: #303030; }
  .mix-slip-item-box { border: .01rem solid #ecebeb; box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1); background: linear-gradient(to top, #f9f9f9, #fff); }
  .slip-mult-show-box { border-bottom: .01rem solid #ecebeb; }
  .slip-mult-show-title { color: #ff5353; }
  .slip-mult-show-count { background: #ecebeb; color: #767477; }
  .slip-mult-num-at, .slip-mult-num-txt { color: #ff5353; }
  .slip-mult-show-num-at, .slip-mult-show-num-txt { color: #909090; }
  .slip-mult-show-txt { color: #909090; }
  .slip-mult-toggle-box { border-bottom: .01rem solid #ecebeb; }
  .slip-mult-toggle-item { border-bottom: .01rem solid #efefef; }
  .slip-mult-cal-box { border-bottom: .01rem solid #ecebeb; }
  .slip-opts-cal-box { border-bottom: .01rem solid #ecebeb; }
  .slip-result-title { color: #ff5353; }
  .slip-result-explan { color: #909090; }
  .slip-result-live { color: #909090; }
  .mix-slip-show { border-top: .01rem solid #ecebeb; box-shadow: 0 -.02rem .04rem 0 rgba(156,156,156,.1); }
  .mix-slip-show-txt, .mix-slip-show-txt-s { color: #909090; }
  .mix-slip-show-num { color: #ff5353; }
  .mix-slip-btn.btn-normal { color: #909090; border-top: .01rem solid #ecebeb; }
  .mix-slip-btn.btn-active { background: #ff5353; color: #fff; }
}
.blue .nb-bet-succ-fail-mix .nb-bet-public-box-body {
  .mix-succ-fail-body { background: #2e2f34; }
  .top-red { background: linear-gradient(92deg, #00ffd8, #00e5fe); }
  .mix-slip-head { border-bottom: .01rem solid #3b3b3b; color: #ecebeb; }
  .mix-slip-item-box { border: .01rem solid #2e2f34; box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1); background: linear-gradient(to bottom, #3a393f, #333238); }
  .slip-mult-show-box { border-bottom: .01rem solid #2e2f34; }
  .slip-mult-show-title { color: #53fffd; }
  .slip-mult-show-count { background: #39383e; color: #bababa; }
  .slip-mult-num-at, .slip-mult-num-txt { color: #53fffd; }
  .slip-mult-show-num-at, .slip-mult-show-num-txt { color: #666666; }
  .slip-mult-show-txt { color: #909090; }
  .slip-mult-toggle-box { border-bottom: .01rem solid #2e2f34; }
  .slip-mult-toggle-item { border-bottom: .01rem solid #2e2f34; }
  .slip-mult-cal-box { border-bottom: .01rem solid #2e2f34; }
  .slip-opts-cal-box { border-bottom: .01rem solid #2e2f34; }
  .slip-result-title { color: #53fffd; }
  .slip-result-explan { color: #909090; }
  .slip-result-live { color: #909090; }
  .mix-slip-show { border-top: .01rem solid #2e2f34; box-shadow: 0 -.02rem .04rem 0 rgba(0,0,0,.1); }
  .mix-slip-show-txt, .mix-slip-show-txt-s { color: #909090; }
  .mix-slip-show-num { color: #53fffd; }
  .mix-slip-btn.btn-normal { color: #909090; border-top: .01rem solid #252525; }
  .mix-slip-btn.btn-active { background: #00b5b3; color: #fff; }
}
.horizontal .nb-bet-succ-fail-mix .nb-bet-public-box-body { top: .4rem; }
</style>
