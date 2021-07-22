<template>
<div class="nb-bet-slip-three" >
  <div class="mix-slip-head-box" v-if="show" >
    <div class="mix-slip-head flex-center" >
      <bet-slip-flag />
      <span class="slip-head-text">{{$t('pageBet.slipFinish')}}</span>
    </div>
    <div class="mix-slip-show flex-between" >
      <div class="mix-slip-mix-box flex-start">
        <span class="mix-slip-show-txt">{{$t('pageBet.tMixBet')}}</span>
        <span class="mix-slip-show-num">{{changeType(btRstAmt, true)}}</span>
      </div>
      <div class="mix-slip-mix-box flex-end">
        <span class="mix-slip-show-txt">{{$t('pageBet.tMixRtn')}}</span>
        <span class="mix-slip-show-num">{{changeType(btRstRtn, true)}}</span>
      </div>
    </div>
  </div>
  <perfect-scrollbar class="mix-slip-body" v-if="show" >
    <div class="mix-slip-item-box" v-for="(v, k) in btRstArr" :key="k" >
      <div class="mix-slip-item-mult-box" v-if="v.btp > 1">
        <div class="mix-slip-mult-item" v-for="(w, n) in v.bets" :key="n" @click="toggleMult(v, w)" >
          <div class="slip-mult-show-box flex-between">
            <span class="slip-mult-show-title">{{w.num}}{{$t('pageBet.betFolds')}}{{w.fld}}</span>
            <div class="slip-mult-num-box flex-end" >
              <span class="slip-mult-num-at">@</span>
              <span class="slip-mult-num-txt">{{changeType(w.odds, true, 3)}}</span>
            </div>
          </div>
          <div class="slip-mult-toggle-box" v-if="!!w.show" >
            <div class="slip-mult-toggle-item flex-between" v-for="(u, l) in w.list.data" :key="l" >
              <span class="mix-slip-show-txt">{{u.oids.join('/')}}</span>
              <div class="mix-slip-show-num-box flex-start" >
                <span class="slip-mult-show-num-at">@</span>
                <span class="slip-mult-show-num-txt">{{changeType(u.odds || 1, true, 3)}}</span>
              </div>
              <span class="slip-mult-show-txt">{{changeType(w.list.amt * (u.odds || 1), true)}}</span>
            </div>
          </div>
          <div class="slip-mult-cal-box flex-between" v-if="!!w.show" >
            <div class="mix-slip-mix-box flex-start">
              <span class="mix-slip-show-txt">{{$t('pageBet.betCount')}}</span>
              <span class="mix-slip-show-num">{{w.cnt}}</span>
            </div>
            <div class="mix-slip-mix-box flex-end">
              <span class="mix-slip-show-txt">{{$t('pageBet.eachBet')}}</span>
              <span class="mix-slip-show-num">{{changeType(w.list.amt, true)}}</span>
            </div>
          </div>
          <div class="slip-mult-cal-box flex-between" v-if="!!w.show" >
            <div class="mix-slip-mix-box flex-start">
              <span class="mix-slip-show-txt">{{$t('pageBet.betMoney')}}</span>
              <span class="mix-slip-show-num">{{changeType(w.amt, true)}}</span>
            </div>
            <div class="mix-slip-mix-box flex-end">
              <span class="mix-slip-show-txt">{{$t('pageBet.willRtn')}}</span>
              <span class="mix-slip-show-num">{{changeType(w.rtn, true)}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="slip-opts-cal-box" >
        <div class="slip-opts-item" v-for="(w, n) in v.opts" :key="n" >
          <bet-option-box :data="w" :showId="getShowID(v)" isResult />
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
          <span class="mix-slip-show-num">{{changeType(v.amt, true)}}</span>
        </div>
        <div class="mix-slip-mix-box flex-end">
          <span class="mix-slip-show-txt">{{$t('pageBet.willRtn')}}</span>
          <span class="mix-slip-show-num">{{changeType(v.rtn, true)}}</span>
        </div>
      </div>
    </div>
  </perfect-scrollbar>
  <div class="mix-slip-btns flex-between" v-if="show" >
    <div class="mix-slip-btn btn-normal flex-center" @click="toHisFun">{{$t('pageBet.viewHistory')}}</div>
    <div class="mix-slip-btn btn-active flex-center" @click="closeFun">{{$t('pageBet.continueBet')}}</div>
  </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { changeNumType } from '@/utils/betUtils';
import BetSlipFlag from '@/components/Bet/BetComps/BetSlipFlag';
import BetOptionBox from '@/components/Bet/BetComps/BetOptionBox';
import BetMixSubmit from '@/components/Bet/BetComps/BetMixSubmit';
import BetMixSuccess from '@/components/Bet/BetComps/BetMixSuccess';
import BetMixFailure from '@/components/Bet/BetComps/BetMixFailure';

export default {
  data() {
    return {
      btRstAmt: 0,
      btRstRtn: 0,
      btRstArr: [],
      t: { timer: null, count: 0, cntMax: 5 },
    };
  },
  props: { show: Boolean },
  computed: {
    ...mapState({
      bObj: state => state.bet.bettingObj,
      pArr: state => state.bet.betPushArr,
      rArr: state => state.bet.betResultArr,
    }),
    ...mapState('app', ['userinfo', 'theme']),
    oddsColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_OPTION_COLOR ? pSet.BLACK_OPTION_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_OPTION_COLOR ? pSet.WHITE_OPTION_COLOR : '#ff5353';
    },
    btnColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BOTTON_BACKGROUND ? pSet.BLACK_BOTTON_BACKGROUND : '#ff5353';
      }
      return pSet && pSet.WHITE_BOTTON_BACKGROUND ? pSet.WHITE_BOTTON_BACKGROUND : '#ff5353';
    },
    alertColor() {
      const pSet = window.NBConfig.PORTAL_SETTING;
      if (!/^white$/i.test(this.theme)) {
        return pSet && pSet.BLACK_BET_ALERT_COLOR ? pSet.BLACK_BET_ALERT_COLOR : '#ff5353';
      }
      return pSet && pSet.WHITE_BET_ALERT_COLOR ? pSet.WHITE_BET_ALERT_COLOR : '#ff5353';
    },
  },
  components: {
    BetSlipFlag,
    BetOptionBox,
    BetMixSubmit,
    BetMixSuccess,
    BetMixFailure,
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
  methods: {
    ...mapMutations(['clearBetItem', 'showBetHistory', 'setBettingObj']),
    ...mapActions(['getNBUser', 'quoteBetCart']),
    ...mapMutations('app', ['getUserInfo']),
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
    getShowID(v) {
      return v.bets.filter(u => !!u.show).length > 0;
    },
    getIsLive(v) {
      const liveArr = v.opts.filter(u => /^[12]$/.test(u.matchState));
      return !/^[023456789]$/.test(v.slip) && liveArr.length > 0;
    },
    getLineStyle(v, w) {
      const lineColor = /^black$/i.test(this.theme) ? '#2e2f34' : '#ecebeb';
      return w.idx < v.opts.length ? { borderBottom: `1px solid ${lineColor}` } : { };
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
      this.clearBetItem({ type: '' });
      clearInterval(this.t.timer);
      this.setBettingObj();
      this.updateBal();
    },
    toHisFun() {
      this.closeFun();
      this.showBetHistory(true);
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
    updateBal() {
      if (this.show) {
        this.quoteBetCart({ });
        if (this.userinfo && this.userinfo.token) {
          this.getNBUser(true);
        }
      }
    },
  },
  mounted() {
    this.getUserInfo();
    this.makeBetRstList();
  },
  beforeDestroy() {
    clearInterval(this.t.timer);
  },
};
</script>

<style lang="less">
.nb-bet-slip-three {
  position: relative;
  width: 100%;
  z-index: 10;
  .ps__rail-y, .ps__rail-y:hover { background: transparent; .ps__thumb-y { width: 4px; background-color: transparent; } }
  .mix-slip-head-box { width: 100%; height: 82px; }
  .mix-slip-head { width: 100%; height: 45px; font-size: 18px; font-weight: 600; .slip-head-text { padding-left: 10px; } }
  .mix-slip-show { width: 100%; height: 37px; padding: 0 20px; }
  .mix-slip-show-txt { font-size: 12px; padding-right: 6px; }
  .mix-slip-show-num { font-size: 14px; font-weight: 500; }
  .mix-slip-body { width: 100%; padding: 10px 10px 60px 10px; }
  .mix-slip-item-box { width: 100%; margin-bottom: 10px; border-radius: 6px; }
  .slip-mult-show-box { width: 100%; height: 30px; padding: 0 10px; font-weight: 500; }
  .slip-mult-show-title { font-size: 14px; }
  .slip-mult-show-count { width: 23px; height: 23px; border-radius: 100%; font-size: 11px; }
  .slip-mult-show-txt { font-size: 14px; }
  .slip-mult-num-at { padding-right: 1px; font-family: PingFangTC; }
  .slip-mult-show-num-at { padding-right: 1px; padding-bottom: 1px; font-size: 12px; font-family: PingFangTC; }
  .slip-mult-show-num-txt { font-size: 14px; }
  .mix-slip-mix-box { width: 100%; height: 100%; overflow: hidden; }
  .slip-mult-num-box { .slip-mult-num-at { font-size: 14px; } .slip-mult-num-txt { font-size: 16px; } }
  .mix-slip-show-num-box { position: absolute; width: 90%; height: 100%; left: 0; top: 0; padding-left: 32%; }
  .mix-slip-show-num-box { .slip-mult-num-at { font-size: 12px; } .slip-mult-num-txt { font-size: 14px; } }
  .slip-mult-toggle-box { width: 100%; }
  .slip-mult-toggle-item { position: relative; width: 100%; height: 26px; padding: 0 10px; }
  .slip-mult-toggle-item:last-child { border: none !important; }
  .slip-mult-cal-box { width: 100%; height: 30px; padding: 0 10px; }
  .slip-slip-cal-box { width: 100%; height: 30px; padding: 0 10px; }
  .slip-opts-cal-box { position: relative; width: 100%; }
  .slip-opts-item-line { width: 75%; }
  .slip-result-box { position: absolute; width: 100%; height: 75px; right: 0; bottom: 0; }
  .slip-result-icon-box { width: 100%; .slip-result-icon { width: 56px; } }
  .slip-result-txt-box { width: 100%; flex-grow: 1; padding-right: 10px; }
  .slip-result-title { width: 100%; height: 45%; font-size: 12px; }
  .slip-result-explan { width: 100%; height: 45%; font-size: 10px; }
  .slip-result-live { width: 100%; height: 40%; font-size: 12px; }
  .mix-slip-btns { position: absolute; z-index: 9999; width: 100%; height: 60px; left: 0; bottom: 0; padding: 0 10px; }
  .mix-slip-btn { width: 48.4%; height: 40px; font-size: 16px; border-radius: 6px; }
}
.white .nb-bet-slip-three {
  .mix-slip-head-box { border-bottom: 1px solid #ecebeb; box-shadow: 0 -2px 4px 0 rgba(156,156,156,.1);  }
  .mix-slip-head { border-bottom: 1px solid #ecebeb; color: #ff5353; }
  .mix-slip-show-txt { color: #909090; }
  .mix-slip-show-num { color: #ff5353; }
  .mix-slip-item-box { border: 1px solid #EBE9E9; box-shadow: 0 10px 20px 0 rgba(223,222,223,.5); background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%); }
  .slip-mult-show-box { border-bottom: 1px solid #ecebeb; }
  .slip-mult-show-title { color: #ff5353; }
  .slip-mult-show-count { background: #ecebeb; color: #767477; }
  .slip-mult-num-at, .slip-mult-num-txt { color: #ff5353; }
  .slip-mult-show-num-at, .slip-mult-show-num-txt { color: #909090; }
  .slip-mult-show-txt { color: #909090; }
  .slip-mult-toggle-box { border-bottom: 1px solid #ecebeb; }
  .slip-mult-toggle-item { border-bottom: 1px solid #efefef; }
  .slip-mult-cal-box { border-bottom: 1px solid #ecebeb; }
  .slip-opts-cal-box { border-bottom: 1px solid #ecebeb; }
  .slip-result-title { color: #ff5353; }
  .slip-result-explan { color: #909090; }
  .slip-result-live { color: #909090; }
  .mix-slip-btns { background: #f5f4f5; border-top: 1px solid #ecebeb; box-shadow: 0 -2px 4px 0 rgba(156,156,156,.1); }
  .mix-slip-btn.btn-normal { color: #ff5353; border: 1px solid #ff5353; }
  .mix-slip-btn.btn-active { background: #ff5353; color: #fff; }
}

.dark .nb-bet-slip-three {
  .mix-slip-item-box {
    background-image: linear-gradient(to bottom, #3a393f, #333238);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .mix-slip-head {
    svg > g > g {
      fill: #53fffd;
    }
    .slip-head-text {
      color: #53fffd !important;
    }
  }
  .mix-slip-show {
    border-top: 1px solid #292a2e;
    border-bottom: 1px solid #292a2e;
    .mix-slip-show-num {
      color: #53fffd !important;
    }
  }
  .mix-body-game {
    border-left: 1px solid #888;
  }
  .mix-slip-show-num,
  .head-odds-mix {
    color: #53fffd !important;
  }
  .mix-slip-btns {
    .mix-slip-btn {
      cursor: pointer;
    }
    .btn-normal {
      border: 1px solid #00b5b3;
      color: #00b5b3;
    }
    .btn-active {
      background: #00b5b3;
      color: #fff;
    }
  }
}
</style>
