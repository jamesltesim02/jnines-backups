<template>
<div class="nb-bet-slip-three" >
  <div class="nb-bet-cart-content-head" v-if="show" >
    <div class="nb-bet-cart-title flex-center" :style="{ color: oddsColor }" @click="toggleCart" >
      <div class="nb-bet-cart-flag flex-center" :style="rotateStyle"><icon-cart-toggle :fill="oddsColor" /></div>
      {{$t('pageBet.mySelect')}}
      <span class="nb-bet-cart-count flex-center" :style="{ background: btnColor }">{{betCnt}}</span>
    </div>
  </div>
  <perfect-scrollbar class="nb-bet-cart-content-body" v-if="show && cartSts" >
    <div class="page-box-title flex-between">
      <span class="page-box-title-text">{{$t('pageBet.betItem')}}</span>
      <span class="page-box-title-clear flex-center" @click="clearFun" >{{$t('pageBet.clearAll')}}</span>
    </div>
    <div v-bind="getOptAttr(v, 0)" v-for="(v, k) in optsArr" :key="k" >
      <bet-option-box :data="v" :showId="showID" @check="checkInputFun" @change="changeOptData" v-if="!v.sType" />
    </div>
    <div class="page-box-title flex-between" v-if="betCnt > 1" >
      <span class="page-box-title-text">{{$t('pageBet.fldItem')}}</span>
      <span class="page-box-title-alert flex-between" v-if="sameAlert" >
        <bet-box-alert size="14" color="#ff5353" />
        <span class="page-box-title-alert-text flex-none">{{$t('pageBet.mixFoldAlert')}}</span>
      </span>
    </div>
    <div class="nb-bet-mix-mult-box" v-if="betCnt > 1" >
      <div v-bind="getOptAttr(v, 1)" v-for="(v, k) in optsArr" :key="k" >
        <bet-mult-mix-item :data="v" @check="checkInputFun" @change="changeOptData" v-if="v.sType" />
      </div>
    </div>
  </perfect-scrollbar>
  <div class="nb-bet-cart-content-foot" v-if="show && cartSts" >
    <div class="submit-box-top-show flex-between">
      <div class="submit-shows flex-start">
        <span class="submit-shows-text">{{$t('pageBet.totalAmtP')}}</span>
        <span class="submit-shows-num" :style="{ color: oddsColor }">{{changeType(totalAmt, true)}}</span>
      </div>
      <div class="submit-shows flex-end">
        <span class="submit-shows-text">{{$t('pageBet.totalRtnP')}}</span>
        <span class="submit-shows-num" :style="{ color: oddsColor }">{{changeType(totalRtn, true)}}</span>
      </div>
    </div>
    <div :class="`cart-mix-submit${actBet ? '-active' : ''} flex-center`" :style="btnStyle" @click="betFun" >
      {{$t(`pageBet.${balAlt ? 'noBalance' : oddsChange ? 'oddsChangeM' : 'sureBet'}`)}}
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { changeNumType, toSeries, toSerList } from '@/utils/betUtils';
import { toPortalUrlByKey, getSettings } from '@/utils/PortalUtils';
import BetMultMixItem from '@/components/Bet/BetMultMixItem';
import BetBoxAlert from '@/components/Bet/BetComps/BetBoxAlert';
import BetOptionBox from '@/components/Bet/BetComps/BetOptionBox';
import IconCartToggle from '@/components/common/icons/IconCartToggle';

export default {
  data() {
    return { btime: 0, optsArr: [] };
  },
  props: { show: Boolean },
  computed: {
    ...mapState({
      cFlag: state => state.bet.cartFlag,
      betCnt: state => state.bet.betCount,
      betList: state => state.bet.betList,
      cartSts: state => state.bet.cartStatus,
      quoteArr: state => state.bet.quoteMultArr,
      inputFocused: state => state.bet.inputFocused,
    }),
    ...mapState('app', ['userinfo', 'theme']),
    needSplit() {
      return !!window.NBConfig.FOLDS_NEED_SPLIT;
    },
    balAct() {
      return !!(this.userinfo && this.userinfo.balance !== undefined);
    },
    curBal() {
      return this.balAct ? this.userinfo.balance : 100000;
    },
    btList() {
      return this.betList.filter(v => !v.type && /^7$/.test(v.betStatus));
    },
    oddsChange() {
      return this.btList.filter(v => !!v.alert).length;
    },
    sameAlert() {
      return this.btList.filter(v => v.same).length > 0;
    },
    showID() {
      return this.optsArr.filter(v => v.toggle).length > 0;
    },
    totalAmt() {
      let tNum = 0;
      for (let i = 0; i < this.optsArr.length; i += 1) {
        tNum += (this.optsArr[i].mct || 1) * (this.optsArr[i].amt || 0);
      }
      return tNum;
    },
    balAlt() {
      return this.curBal < this.totalAmt;
    },
    totalRtn() {
      let tNum = 0;
      for (let i = 0; i < this.optsArr.length; i += 1) {
        const nOds = this.optsArr[i].odds || 0;
        const tOds = this.optsArr[i].sType ? (nOds || 1) : (1 + nOds);
        tNum += tOds * (this.optsArr[i].amt || 0);
      }
      return tNum;
    },
    actBet() {
      const dt = JSON.parse(JSON.stringify(this.optsArr));
      let betPass = 2;
      for (let i = 0; i < dt.length; i += 1) {
        const nOds = dt[i].odds || 0;
        const iAmt = +(dt[i].amt || 0);
        const tOds = dt[i].sType ? (nOds || 1) : (1 + nOds);
        betPass = betPass > 1 && iAmt ? 1 : betPass;
        if (iAmt && (iAmt < dt[i].min || iAmt > dt[i].max || (iAmt * tOds > dt[i].rtn))) {
          betPass = 0;
        }
      }
      return !!(this.balAlt || this.oddsChange || betPass === 1);
    },
    rotateStyle() {
      return !this.cartSts ? { transform: 'rotate(180deg)' } : { };
    },
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
    btnStyle() {
      const obj = { };
      if (!this.balAlt && this.oddsChange) {
        obj.background = 'linear-gradient(98deg, #ffa653, #ff5378)';
      } else if (this.actBet) {
        [obj.background, obj.border] = [this.btnColor, `1px solid ${this.btnColor}`];
      }
      return obj;
    },
  },
  components: {
    BetBoxAlert,
    BetOptionBox,
    BetMultMixItem,
    IconCartToggle,
  },
  watch: {
    cFlag() {
      if (this.show && !this.cFlag) this.clearOptAmt();
    },
    show() {
      if (this.show) {
        this.clearOptAmt();
        this.getOptsArr(true);
      }
    },
    cartSts() {
      if (this.show && this.cartSts) {
        this.clearOptAmt();
        this.getOptsArr(true);
      }
    },
    btList() {
      if (this.show) this.getOptsArr(true);
    },
    quoteArr(n) {
      if (this.show && n && n.length) {
        this.getOptsArr(true);
      }
    },
    betCnt(n, o) {
      if (this.show && !o && n === 1) {
        this.changeCartStatus(true);
      } else if (this.show && !n && o) {
        this.changeCartStatus(false);
      }
      if (this.show) this.quoteBetCart({ });
    },
  },
  methods: {
    ...mapMutations(['clearBetItem', 'changeCartStatus', 'changeInputFocused']),
    ...mapActions(['getNBUser', 'quoteBetCart', 'doMixBetAction']),
    ...mapMutations('app', ['getUserInfo']),
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
    toggleCart() {
      this.changeCartStatus(!!(!this.cartSts && this.betCnt));
    },
    clearFun() {
      this.clearBetItem({ type: '' });
    },
    checkInputFun() {
      let fPass = false;
      for (let i = 0; i < this.optsArr.length; i += 1) {
        fPass = !!(fPass || this.optsArr[i].amt || this.optsArr[i].sAmt);
      }
      this.changeInputFocused(fPass);
    },
    clearOptAmt() {
      for (let i = 0; i < this.optsArr.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.optsArr[i]));
        if (!obj.sType || obj.nm > 1) {
          obj.amt = '';
        } else {
          obj.sAmt = '';
        }
        obj.oldAmt = '';
        this.$set(this.optsArr, i, obj);
      }
    },
    changeOptData(v) {
      const [nv, newAmt, lastAmt] = [v, `${v.amt || v.sAmt || ''}`, `${v.oldAmt}`];
      nv.oldAmt = newAmt;
      for (let i = 0; i < this.optsArr.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.optsArr[i]));
        const sPass = !nv.sType && !obj.sType && `${nv.optionID}` === `${obj.optionID}`;
        const mPass = nv.sType && obj.sType && `${nv.nm}_${nv.fld}` === `${obj.nm}_${obj.fld}`;
        if (sPass || mPass) this.$set(this.optsArr, i, nv);
      }
      if (newAmt === lastAmt) return;
      for (let i = 0; i < this.optsArr.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.optsArr[i]));
        const amtPass = !nv.sType && obj.sType && /^1$/.test(obj.nm) && obj.sAmt;
        const sAmtPass = nv.sType && /^1$/.test(nv.nm) && !obj.sType && `${nv.sAmt}` !== `${obj.amt}`;
        if (sAmtPass) {
          [obj.amt, obj.oldAmt] = [nv.sAmt, nv.sAmt];
        } else if (amtPass) {
          [obj.sAmt, obj.oldAmt] = ['', ''];
        }
        if (sAmtPass || amtPass) this.$set(this.optsArr, i, obj);
      }
    },
    getOptAttr(v, sType) {
      let clsName = !v.sType === !sType && !sType ? 'mix-bet-option-single bet-page-item' : 'mix-bet-option-null';
      clsName = !v.sType === !sType && sType ? 'mix-bet-option-multiple' : clsName;
      let idStr = !v.sType ? `bet_opt_${v.optionID}` : `bet_opt_${v.nm}_${v.fld}`;
      idStr = !v.sType === !sType ? idStr : `null_${idStr}`;
      return { class: clsName, id: idStr };
    },
    getOptsArr(flag) {
      this.getUserInfo();
      const [cpArr, rtnArr] = [JSON.parse(JSON.stringify(this.btList)), []];
      const [ftArr, dt] = [cpArr.filter(v => !v.type && /^7$/.test(v.betStatus)), []];
      let [tMin, tMax, mRtn] = [0, 1000000000, 10000000000];
      for (let i = 0; i < ftArr.length; i += 1) {
        const sObj = JSON.parse(JSON.stringify(ftArr[i]));
        sObj.mxRtn = parseInt(sObj.rtn / (1 + (sObj.odds || 0)), 10);
        tMin = sObj.min > tMin ? sObj.min : tMin;
        tMax = sObj.max < tMax ? sObj.max : tMax;
        mRtn = sObj.mxRtn < mRtn ? sObj.mxRtn : mRtn;
        [sObj.fld, sObj.amt, sObj.oldAmt] = [1, '', ''];
        [sObj.sType, sObj.mct] = [0, 1];
        for (let j = 0; j < this.optsArr.length; j += 1) {
          if (!this.optsArr[j].sType && `${sObj.optionID}` === `${this.optsArr[j].optionID}`) {
            [sObj.amt, sObj.oldAmt] = [this.optsArr[j].amt || '', this.optsArr[j].amt || ''];
          }
        }
        rtnArr.push(sObj);
      }
      for (let i = 0; i < ftArr.length; i += 1) {
        const odObj = JSON.parse(JSON.stringify(ftArr[i]));
        odObj.odds = odObj.odds ? odObj.odds + 1 : 1;
        dt.push(odObj);
      }
      if (ftArr.length > 1) {
        const serArr = toSeries(dt);
        if (serArr.length > 2) {
          const serObj = Object.assign({ nm: 0, mct: 0, odds: 0 }, { fld: 0 });
          for (let j = 0; j < serArr.length; j += 1) {
            if (serArr[j].nm > 1) {
              [serObj.mct, serObj.odds] = [serObj.mct + serArr[j].mct, serObj.odds + serArr[j].odds];
              [serObj.nm, serObj.fld] = [serArr[j].nm > serObj.nm ? serArr[j].nm : serObj.nm, serObj.mct];
            }
          }
          serArr.push(serObj);
        }
        for (let i = 0; i < serArr.length; i += 1) {
          const obj = JSON.parse(JSON.stringify(serArr[i]));
          [obj.min, obj.max, obj.mxRtn] = [tMin, tMax, mRtn];
          [obj.sType, obj.mct] = [1, obj.mct || 1];
          [obj.toggle, obj.fld] = [false, obj.fld || 1];
          if (obj.nm > 1) {
            [obj.amt, obj.oldAmt] = ['', ''];
          } else {
            [obj.sAmt, obj.oldAmt] = ['', ''];
          }
          for (let j = 0; j < this.optsArr.length; j += 1) {
            if (this.optsArr[j].sType && obj.sType && `${obj.nm}_${obj.fld}` === `${this.optsArr[j].nm}_${this.optsArr[j].fld}`) {
              obj.toggle = !!this.optsArr[j].toggle;
              if (obj.nm > 1) {
                [obj.amt, obj.oldAmt] = [this.optsArr[j].amt || '', this.optsArr[j].amt || ''];
              } else {
                [obj.sAmt, obj.oldAmt] = [this.optsArr[j].sAmt || '', this.optsArr[j].sAmt || ''];
              }
            }
          }
          if (obj.nm && obj.nm > 1) {
            let [totalMxRtn, find] = [0, false];
            if (this.quoteArr && this.quoteArr.length) {
              for (let j = 0; j < this.quoteArr.length; j += 1) {
                if (`${this.quoteArr[j].betN}_${this.quoteArr[j].betM}` === `${obj.nm}_${obj.fld || 1}`) {
                  obj.min = this.quoteArr[j].minBet !== undefined ? this.quoteArr[j].minBet : obj.min;
                  obj.max = this.quoteArr[j].maxBet !== undefined ? this.quoteArr[j].maxBet : obj.max;
                  [obj.mxRtn, find] = [this.quoteArr[j].maxReturn || obj.mxRtn, !!this.quoteArr[j].maxReturn];
                  obj.mxRtn = parseInt(obj.mxRtn / (obj.odds || 1), 10);
                  break;
                }
              }
            }
            if (this.userinfo && this.userinfo.rtn && !find) {
              const nmSt = obj.fld && obj.fld > 1 ? 2 : obj.nm;
              for (let tm = obj.nm; tm >= nmSt; tm -= 1) {
                let rtnNum = 10000000000;
                for (let j = tm; j >= 2; j -= 1) {
                  if (this.userinfo.rtn[`mut${j}`]) {
                    const userRtnObj = this.userinfo.rtn[`mut${j}`];
                    if (typeof userRtnObj === 'object' && userRtnObj.maxBet !== undefined) {
                      obj.max = +userRtnObj.maxBet;
                    }
                    if (typeof userRtnObj === 'object' && userRtnObj.maxReturn) {
                      rtnNum = +userRtnObj.maxReturn;
                    } else {
                      rtnNum = +userRtnObj;
                    }
                    break;
                  }
                }
                totalMxRtn += parseInt(rtnNum / (obj.odds || 1), 10);
              }
              obj.mxRtn = totalMxRtn < obj.mxRtn ? totalMxRtn : obj.mxRtn;
            }
          }
          rtnArr.push(obj);
        }
      }
      this.optsArr = rtnArr;
      this.getToggleData();
      this.checkInputFun();
      if (flag) this.updateBal();
    },
    getToggleData() {
      const tgOpts = this.optsArr.filter(w => !!w.optionID);
      const tgOptsArr = JSON.parse(JSON.stringify(tgOpts));
      for (let i = 0; i < tgOptsArr.length; i += 1) {
        [tgOptsArr[i].odds, tgOptsArr[i].win] = [tgOptsArr[i].odds + 1, tgOptsArr[i].odds + 1];
      }
      for (let i = 0; i < this.optsArr.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.optsArr[i]));
        if (obj.sType && obj.nm) {
          const stNum = obj.fld > 1 ? 2 : obj.nm;
          let [tArr, wd] = [[], obj.nm >= 4 ? '33.333%' : '25%'];
          wd = obj.nm >= 7 ? '50%' : wd;
          wd = obj.nm >= 10 ? '100%' : wd;
          for (let j = stNum; j <= obj.nm; j += 1) {
            tArr = tArr.concat(toSerList(tgOptsArr, j, 1));
          }
          [obj.toggleStyle, obj.toggleArr] = [{ width: wd }, tArr];
          this.$set(this.optsArr, i, obj);
        }
      }
    },
    getBettingObj() {
      let [ttlAmt, ttlRtn] = [0, 0];
      const [bArr, bets, opts] = [[], [], []];
      const optCpArr = JSON.parse(JSON.stringify(this.optsArr));
      for (let i = 0; i < optCpArr.length; i += 1) {
        optCpArr[i].alert = 0;
        const [obj, oAmt] = [optCpArr[i], +(optCpArr[i].amt || 0)];
        if (!obj.sType) {
          opts.push(obj);
          if (oAmt) {
            const tRtn = oAmt * (1 + obj.odds);
            [ttlAmt, ttlRtn] = [ttlAmt + oAmt, ttlRtn + tRtn];
            const bItem = Object.assign({ num: 1, fld: 1, cnt: 1 }, { amt: oAmt, rtn: tRtn, odds: 1 + obj.odds });
            const defObj = Object.assign({ wid: '', slip: 1, code: -1 }, { amt: oAmt, rtn: tRtn });
            bArr.push(Object.assign(defObj, { btp: 1, bets: [bItem], opts: [obj] }));
          }
        }
      }
      let [mutAmt, mutRtn] = [0, 0];
      for (let i = 0; i < optCpArr.length; i += 1) {
        const [obj, oAmt] = [optCpArr[i], +(optCpArr[i].amt || 0)];
        if (obj.sType && obj.nm > 1 && oAmt) {
          const bObj = { num: obj.nm, fld: obj.fld, cnt: obj.mct };
          const [tAmt, tRtn] = [oAmt * obj.mct, oAmt * obj.odds];
          const btList = { amt: oAmt, data: obj.toggleArr };
          [bObj.amt, bObj.rtn, bObj.list] = [tAmt, tRtn, btList];
          [ttlAmt, ttlRtn] = [ttlAmt + tAmt, ttlRtn + tRtn];
          [mutAmt, mutRtn] = [mutAmt + tAmt, mutRtn + tRtn];
          [bObj.odds, bObj.show] = [obj.odds, false];
          bets.push(bObj);
        }
      }
      if (bets.length > 0) {
        const defObj = { wid: '', slip: 1, code: -1 };
        [defObj.amt, defObj.rtn] = [mutAmt, mutRtn];
        bArr.push(Object.assign({ btp: 2, bets, opts }, defObj));
      }
      return { amt: ttlAmt, rtn: ttlRtn, arr: bArr };
    },
    getBettingObjSplit() {
      let [ttlAmt, ttlRtn] = [0, 0];
      const [bArr, opts] = [[], []];
      const optCpArr = JSON.parse(JSON.stringify(this.optsArr));
      for (let i = 0; i < optCpArr.length; i += 1) {
        optCpArr[i].alert = 0;
        const [obj, oAmt] = [optCpArr[i], +(optCpArr[i].amt || 0)];
        if (!obj.sType) {
          opts.push(obj);
          if (oAmt) {
            const tRtn = oAmt * (1 + obj.odds);
            [ttlAmt, ttlRtn] = [ttlAmt + oAmt, ttlRtn + tRtn];
            const bItem = Object.assign({ num: 1, fld: 1, cnt: 1 }, { amt: oAmt, rtn: tRtn, odds: 1 + obj.odds });
            const defObj = Object.assign({ wid: '', slip: 1, code: -1 }, { amt: oAmt, rtn: tRtn });
            bArr.push(Object.assign({ btp: 1, bets: [bItem], opts: [obj] }, defObj));
          }
        }
      }
      const wObj = Object.assign({ wid: '', slip: 1 }, { code: -1, btp: 2 });
      for (let i = 0; i < optCpArr.length; i += 1) {
        const [obj, oAmt] = [optCpArr[i], +(optCpArr[i].amt || 0)];
        if (obj.sType && obj.nm > 1 && oAmt) {
          [ttlAmt, ttlRtn] = [ttlAmt + oAmt * obj.mct, ttlRtn + oAmt * obj.odds];
          const bObj = { num: obj.nm, fld: 1, cnt: 1 };
          for (let j = 0; j < obj.toggleArr.length; j += 1) {
            const [spObj, spOpts] = [obj.toggleArr[j], []];
            let spRtn = oAmt;
            for (let k = 0; k < spObj.oids.length; k += 1) {
              for (let m = 0; m < opts.length; m += 1) {
                if (`${spObj.oids[k]}` === `${opts[m].idx}`) {
                  spOpts.push(opts[m]);
                  spRtn *= 1 + (opts[m].odds || 0);
                  break;
                }
              }
            }
            const spItem = Object.assign({ amt: oAmt, rtn: spRtn }, { show: false, odds: spObj.win }, bObj);
            bArr.push(Object.assign({ amt: oAmt, rtn: spRtn }, { bets: [spItem], opts: spOpts }, wObj));
          }
        }
      }
      return { amt: ttlAmt, rtn: ttlRtn, arr: bArr };
    },
    makeBetParams() {
      const optCpArr = JSON.parse(JSON.stringify(this.optsArr));
      const [bArr, bets, opts] = [[], [], []];
      for (let i = 0; i < optCpArr.length; i += 1) {
        const [obj, oAmt] = [optCpArr[i], +(optCpArr[i].amt || 0)];
        if (!obj.sType) {
          opts.push(obj);
          if (oAmt) {
            const bItem = Object.assign({ num: 1, fld: 1, cnt: 1 }, { amt: oAmt });
            bArr.push({ btp: 1, bets: [bItem], optArr: [obj] });
          }
        }
      }
      for (let i = 0; i < optCpArr.length; i += 1) {
        const [obj, oAmt] = [optCpArr[i], +(optCpArr[i].amt || 0)];
        if (obj.sType && obj.nm > 1 && oAmt) {
          const bObj = { num: obj.nm, fld: obj.fld, cnt: obj.mct };
          bObj.amt = oAmt;
          bets.push(bObj);
        }
      }
      if (bets.length > 0) {
        bArr.push({ btp: 2, bets, optArr: opts });
      }
      return bArr;
    },
    makeBetParamsSplit() {
      const optCpArr = JSON.parse(JSON.stringify(this.optsArr));
      const [bArr, opts] = [[], []];
      for (let i = 0; i < optCpArr.length; i += 1) {
        const [obj, oAmt] = [optCpArr[i], +(optCpArr[i].amt || 0)];
        if (!obj.sType) {
          opts.push(obj);
          if (oAmt) {
            const bItem = Object.assign({ num: 1, fld: 1, cnt: 1 }, { amt: oAmt });
            bArr.push({ btp: 1, bets: [bItem], optArr: [obj] });
          }
        }
      }
      for (let i = 0; i < optCpArr.length; i += 1) {
        const [obj, oAmt] = [optCpArr[i], +(optCpArr[i].amt || 0)];
        if (obj.sType && obj.nm > 1 && oAmt) {
          const spItem = Object.assign({ num: obj.nm, fld: 1, cnt: 1 }, { amt: oAmt });
          for (let j = 0; j < obj.toggleArr.length; j += 1) {
            const [spObj, spOpts] = [obj.toggleArr[j], []];
            for (let k = 0; k < spObj.oids.length; k += 1) {
              for (let m = 0; m < opts.length; m += 1) {
                if (`${spObj.oids[k]}` === `${opts[m].idx}`) {
                  spOpts.push(opts[m]);
                  break;
                }
              }
            }
            bArr.push({ btp: 2, bets: [spItem], optArr: spOpts });
          }
        }
      }
      return bArr;
    },
    async betFun() {
      this.getUserInfo();
      if (!this.userinfo || !this.userinfo.token) {
        if (this.oddsChange) {
          this.quoteBetOption({ data: this.betList });
        } else if (this.actBet) {
          toPortalUrlByKey('LOGIN_PAGE_URL');
        }
      } else if (this.balAlt) {
        const pSet = getSettings();
        if (pSet && pSet.USER_CENTER_URL && pSet.DEPOSIT_PAGE_URL) {
          toPortalUrlByKey('DEPOSIT_PAGE_URL');
        } else if (pSet && pSet.USER_CENTER_URL) {
          toPortalUrlByKey('USER_CENTER_URL');
        } else {
          this.pushRouter('/member/payment');
        }
      } else if (this.oddsChange) {
        this.quoteBetOption({ data: this.betList });
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const paras = this.needSplit ? this.makeBetParamsSplit() : this.makeBetParams();
        const btSet = this.needSplit ? this.getBettingObjSplit() : this.getBettingObj();
        const rtn = await this.doMixBetAction({ data: paras, set: btSet });
        if (rtn) {
          let rtnStr = /^2$/.test(rtn) ? 'userWrong' : 'betWrong';
          rtnStr = /^3$/.test(rtn) ? 'noBetList' : rtnStr;
          this.$toast(this.$t(`pageBet.${rtnStr}`));
        }
      }
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
    this.getOptsArr(false);
  },
};
</script>

<style lang="less">
.nb-bet-slip-three {
  width: 100%;
  .nb-bet-cart-content-head { position: relative; width: 100%; z-index: 30; }
  .nb-bet-cart-content-body { position: relative; width: 100%; height: 100%; z-index: 10; overflow: auto; }
  .nb-bet-cart-content-foot { position: relative; width: 100%; z-index: 30; }
  .ps__rail-y, .ps__rail-y:hover { background: transparent; .ps__thumb-y { width: 4px; background-color: transparent; } }
  .nb-bet-cart-title { position: relative; width: 100%; height: 43px; font-size: 16px; font-weight: 600; }
  .nb-bet-cart-flag { position: absolute; top: 0; left: 0; width: 69px; height: 100%; cursor: pointer; }
  .nb-bet-cart-count { position: absolute; width: 20px; height: 20px; top: 11.5px; right: 100px; border-radius: 10px; padding-right: 2px; font-size: 12px; font-weight: 100; }
  .page-box-title { width: 310px; height: 22px; margin: 10px auto; }
  .page-box-title-text { font-size: 13px; }
  .page-box-title-clear { height: 22px; padding: 0 10px; border-radius: 11px; font-size: 12px; cursor: pointer; }
  .page-box-title-alert-text { font-size: 12px; padding: 0 2px 0 4px; }
  .mix-bet-option-single { width: 310px; margin: 0 auto 10px; border-radius: 10px; }
  .nb-bet-mix-mult-box { width: 310px; margin: 0 auto 10px; padding: 5px 0; border-radius: 10px; }
  .mix-bet-option-multiple { width: 100%; }
  .mix-bet-option-multiple:last-child { border-bottom: none !important; }
  .mix-bet-option-null { display: none; }
  .submit-box-top-show { width: 100%; height: 38px; padding: 0 22px; }
  .submit-shows { width: 100%; height: 100%; }
  .submit-shows-text { font-size: 12px; padding-right: 5px; }
  .submit-shows-num { font-size: 16px; }
  .cart-mix-submit, .cart-mix-submit-active { position: relative; width: 290px; height: 40px; margin: 0 auto 12px; border-radius: 6px; font-size: 16px; }
  .cart-mix-submit-mix, .cart-mix-submit-mix-active { position: relative; width: 290px; height: 40px; margin: 0 auto 12px; border-radius: 6px; font-size: 16px; }
}
.black .nb-bet-slip-three {
  .nb-bet-cart-title { border-bottom: 1px solid #2e2f34; box-shadow: 0 10px 20px 0 rgba(0,0,0,.1); }
  .nb-bet-cart-count { color: #ebe9e9; }
  .page-box-title-text { color: #9b9b9b; }
  .page-box-title-clear { border: 1px solid #4a4a4a; color: #9b9b9b; }
  .page-box-title-alert-text { color: #9b9b9b; }
  .mix-bet-option-single { box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); border: 1px solid #2e2f34; background: linear-gradient(to bottom, #3a393f, #333238); }
  .nb-bet-mix-mult-box { box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); border: 1px solid #2e2f34; background: linear-gradient(to bottom, #3a393f, #333238); }
  .mix-bet-option-multiple { border-bottom: 1px solid #2e2f34; }
  .nb-bet-cart-content-foot { background: linear-gradient(to bottom, #3c3b43, #2b2a31); border-top: 1px solid #2e2f34; box-shadow: 0 -2px 4px 0 rgba(156,156,156,.1); }
  .submit-shows-text { color: #909090; }
  .submit-shows-num { color: #909090; }
  .cart-mix-submit { background: #2a2a2c; color: #ffffff80; }
  .cart-mix-submit-active { color: #fff; }
}
.white .nb-bet-slip-three {
  .nb-bet-cart-title { border-bottom: 1px solid #ECEBEB; box-shadow: 0 10px 20px 0 rgba(223,222,223,.5); }
  .nb-bet-cart-count { color: #ebe9e9; }
  .page-box-title-text { color: rgba(46,47,52,0.7); }
  .page-box-title-clear { border: 1px solid #bababa; color: rgba(46,47,52,.5); }
  .page-box-title-alert-text { color: rgba(46,47,52,0.5); }
  .mix-bet-option-single { box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); border: 1px solid #ecebeb; background: linear-gradient(to top, #f9f9f9, #ffffff); }
  .nb-bet-mix-mult-box { box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); border: 1px solid #ecebeb; background: linear-gradient(to top, #f9f9f9, #ffffff); }
  .mix-bet-option-multiple { border-bottom: 1px solid #ECEBEB; }
  .nb-bet-cart-content-foot { background: #f5f4f5; border-top: 1px solid #ecebeb; box-shadow: 0 -2px 4px 0 rgba(156,156,156,.1); }
  .submit-shows-text { color: #909090; }
  .submit-shows-num { color: #909090; }
  .cart-mix-submit { background: #bababa; color: #ffffff80; }
  .cart-mix-submit-active { color: #fff; }
}
</style>
