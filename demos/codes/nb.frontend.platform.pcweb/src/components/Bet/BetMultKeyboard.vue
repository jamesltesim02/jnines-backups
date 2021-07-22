<template>
  <div :class="`nb-bet-keyboard-multiple ${betCheck ? 'mix' : 'none'}`">
    <div class="input-box-item">
      <div class="input-touch-box" v-for="v in bets" :key="v.nm" @click="touchFun(v)">
        <div :class="`input-box-item-box${betCheck ? '-mix' : ''} flex-between`">
          <div :class="`input-box-item-title${v.active ? '-active' : ''} flex-start`">
            <span class="box-item-title-point" v-if="!betCheck" ></span>
            <span class="box-item-title-text">{{getMultName(v.nm, v.fld)}}</span>
          </div>
          <div class="input-box-item-body flex-end">
            <div class="input-box-item-cnt-box flex-end" v-if="betCheck" >
              <span class="input-box-item-num">{{v.mct}}</span>
              <span class="input-box-item-flag">x</span>
            </div>
            <span class="input-box-item-count" v-else >
              {{`${$t('pageBet.total')}${v.mct}${$t('pageBet.count')}`}}
            </span>
            <div :class="`bet-show-input-box${betCheck ? '-p' : ''}`" >
              <div class="bet-show-input-place flex-center" v-if="!v.value" >{{getPlaceStr(v)}}</div>
              <input type="text" :class="getIptClass(v)" v-model="v.value" :style="{ color: oddsColor }" autocomplete="off"
              @focus="focusFun(v)" @input="inputFun(v)" @blur="blurFun(v)" maxLength="6" />
            </div>
          </div>
        </div>
        <div :class="`body-shows${betCheck ? '-m' : ''} flex-between`" :style="getInputStyle(v)" v-if="v.down">
          <div class="body-show-item flex-center">
            <div class="bet-show-item-p flex-center" v-if="betCheck">{{$t('pageBet.mutOddsP')}}</div>
            <div class="bet-show-item flex-center" v-else>{{$t('pageBet.mutOdds')}}</div>
            <div class="bet-show-num-p flex-center" :style="{ color: oddsColor }" v-if="betCheck">@</div>
            <div class="bet-show-num flex-center" :style="{ color: oddsColor }">{{changeType(v.odds / (v.mct || 1), true, 3)}}</div>
          </div>
          <div class="body-show-item flex-center">
            <div class="bet-show-item-p flex-center" v-if="betCheck">{{$t('pageBet.maxRtnP')}}</div>
            <div class="bet-show-item flex-center" v-else>{{$t('pageBet.maxRtn')}}</div>
            <div v-if="v.value || betCheck" class="bet-show-num flex-center" :style="{ color: oddsColor }">{{changeType(v.willRtn, true)}}</div>
            <div v-else class="bet-show-null flex-center">............</div>
          </div>
        </div>
        <transition name="toggle">
          <bet-box-toggle v-if="v.toggle" :data="v" :opts="data" />
        </transition>
      </div>
    </div>
    <div :class="`body-shows-${betCheck ? 'mix' : 't'} flex-between`">
      <div class="body-show-item flex-center">
        <span class="bet-show-item-p flex-center" v-if="betCheck">{{$t('pageBet.totalAmtP')}}</span>
        <span class="bet-show-item flex-center" v-else>{{$t('pageBet.totalAmt')}}</span>
        <div v-if="totalAmt || betCheck" class="bet-show-num flex-center" :style="{ color: oddsColor }">{{changeType(totalAmt, true)}}</div>
        <div v-else class="bet-show-null flex-center">............</div>
      </div>
      <div class="body-show-item flex-center">
        <span class="bet-show-item-p flex-center" v-if="betCheck">{{$t('pageBet.totalRtnP')}}</span>
        <span class="bet-show-item flex-center" v-else>{{$t('pageBet.maxTotalRtn')}}</span>
        <div v-if="totalRtn || betCheck" class="bet-show-num flex-center" :style="{ color: oddsColor }">{{changeType(totalRtn, true)}}</div>
        <div v-else class="bet-show-null flex-center">............</div>
      </div>
    </div>
    <div :class="`keyboard-multiple-submit${betCheck ? '-mix' : ''}${actBet ? '-active' : ''} flex-center`" :style="btnStyle" @click="betFun" >
      {{$t(`pageBet.${balAlt ? 'noBalance' : oddsAlt ? `oddsChange${betCheck ? 'M' : ''}` : 'sureBet'}`)}}
      <div class="bet-foot-odds-box flex-center" v-if="!betCheck && !balAlt && oddsAlt" :style="`transform:rotate(${oddsAlt < 0 ? 180 : 0}deg)`">
        <bet-odds-flag class="bet-foot-odds-change" size="40" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { toSeries, toSerList, changeNumType } from '@/utils/betUtils';
import { toPortalUrlByKey, getSettings } from '@/utils/PortalUtils';
import BetBoxToggle from './BetComps/BetBoxToggle';
import BetOddsFlag from './BetComps/BetOddsFlag';

export default {
  inheritAttrs: false,
  name: 'BetMultKeyboard',
  data() {
    return {
      bets: [],
      data: [],
      btime: 0,
      focusItem: null,
    };
  },
  computed: {
    ...mapState({
      cFlag: state => state.bet.cartFlag,
      betList: state => state.bet.betList,
      clrFlag: state => state.bet.clearAmtFlag,
      quoteArr: state => state.bet.quoteMultArr,
    }),
    ...mapState('app', ['userinfo', 'theme', 'bettingMode', 'bettingStyle']),
    betCheck() {
      return /^1$/.test(this.bettingStyle) || /^3$/.test(this.bettingMode);
    },
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
    btMin() {
      let bkNum = 0;
      for (let i = 0; i < this.btList.length; i += 1) {
        bkNum = this.btList[i].min > bkNum ? this.btList[i].min : bkNum;
      }
      return bkNum;
    },
    btMax() {
      let bkNum = 1000000000;
      for (let i = 0; i < this.btList.length; i += 1) {
        bkNum = this.btList[i].max < bkNum ? this.btList[i].max : bkNum;
      }
      return bkNum;
    },
    totalAmt() {
      let tAmt = 0;
      for (let i = 0; i < this.bets.length; i += 1) {
        tAmt += (this.bets[i].mct || 1) * (this.bets[i].value || 0);
      }
      return tAmt;
    },
    balAlt() {
      return this.curBal < this.totalAmt;
    },
    totalRtn() {
      let tRtn = 0;
      for (let i = 0; i < this.bets.length; i += 1) {
        tRtn += (this.bets[i].odds || 1) * (this.bets[i].value || 0);
      }
      return tRtn;
    },
    oddsAlt() {
      let [oOdds, nOdds, aFlag] = [1, 1, 0];
      for (let i = 0; i < this.btList.length; i += 1) {
        aFlag = aFlag || this.btList[i].alert;
        oOdds *= 1 + (this.btList[i].oOdds || 0);
        nOdds *= 1 + (this.btList[i].odds || 0);
      }
      return this.betCheck ? aFlag : (nOdds - oOdds);
    },
    actBet() {
      const dt = JSON.parse(JSON.stringify(this.bets));
      let betPass = 2;
      for (let i = 0; i < dt.length; i += 1) {
        const iAmt = +(dt[i].value || 0);
        const iMax = +(dt[i].max || this.btMax);
        betPass = betPass > 1 && iAmt ? 1 : betPass;
        if (iAmt && (iAmt < this.btMin || iAmt > iMax || (iAmt * (dt[i].odds || 1) > dt[i].maxRtn))) {
          betPass = 0;
        }
      }
      return !!((this.betCheck && this.oddsAlt) || betPass === 1);
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
      if (!this.balAlt && this.betCheck && this.oddsAlt) {
        obj.background = 'linear-gradient(98deg, #ffa653, #ff5378)';
      } else if (this.actBet) {
        [obj.background, obj.border] = [this.btnColor, `1px solid ${this.btnColor}`];
      }
      return obj;
    },
  },
  watch: {
    btList() {
      this.toSeriesFun();
    },
    quoteArr() {
      this.toSeriesFun();
    },
    clrFlag() {
      for (let i = 0; i < this.bets.length; i += 1) {
        const bt = this.bets[i];
        bt.value = '';
        this.$set(this.bets, i, bt);
      }
    },
  },
  components: { BetBoxToggle, BetOddsFlag },
  methods: {
    ...mapMutations(['quoteBetOption', 'changeInputFlag', 'changeInputFocused']),
    ...mapActions(['quoteBetCart', 'doBetAction', 'doMixBetAction']),
    ...mapMutations('agyy', ['pushRouter']),
    ...mapMutations('app', ['getUserInfo']),
    changeType(num, fnum, bit) {
      return changeNumType(num, fnum, bit);
    },
    getIptClass(v) {
      return `box-item-like-input${this.focusItem === v || v.value ? ' focus' : ''}`;
    },
    getPlaceStr(v) {
      return `${this.betCheck ? '' : this.$t('pageBet.betRange')}${v.min}-${v.max}`;
    },
    getBetObj() {
      const obj = { type: '', noClear: false, bets: [] };
      obj.slip = { tAmt: this.totalAmt, tRtn: this.totalRtn };
      [obj.slip.arr, obj.slip.opts] = [[], this.btList];
      for (let i = 0; i < this.bets.length; i += 1) {
        if (this.bets[i].nm && this.bets[i].mct && +this.bets[i].value) {
          obj.slip.arr.push({ num: this.bets[i].nm, cnt: this.bets[i].mct });
          obj.bets.push({ num: this.bets[i].nm, cnt: this.bets[i].mct, amt: +this.bets[i].value });
        }
      }
      return obj;
    },
    getBettingObj() {
      let [ttlAmt, ttlRtn] = [0, 0];
      const [bArr, bets, opts] = [[], [], []];
      const optCpArr = JSON.parse(JSON.stringify(this.btList));
      for (let i = 0; i < optCpArr.length; i += 1) {
        optCpArr[i].alert = 0;
        opts.push(optCpArr[i]);
      }
      let [mutAmt, mutRtn] = [0, 0];
      for (let i = 0; i < this.bets.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.bets[i]));
        if (obj.nm > 1 && obj.value) {
          const bObj = { num: obj.nm, fld: 1, cnt: obj.mct };
          const [tAmt, tRtn] = [(+obj.value) * obj.mct, (+obj.value) * obj.odds];
          const btListObj = { amt: +obj.value, data: obj.toggleArr };
          [bObj.amt, bObj.rtn, bObj.list] = [tAmt, tRtn, btListObj];
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
      const optCpArr = JSON.parse(JSON.stringify(this.btList));
      for (let i = 0; i < optCpArr.length; i += 1) {
        optCpArr[i].alert = 0;
        opts.push(optCpArr[i]);
      }
      const wObj = Object.assign({ wid: '', slip: 1 }, { code: -1, btp: 2 });
      for (let i = 0; i < this.bets.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.bets[i]));
        if (obj.nm > 1 && obj.value) {
          [ttlAmt, ttlRtn] = [ttlAmt + (+obj.value) * obj.mct, ttlRtn + (+obj.value) * obj.odds];
          const bObj = { num: obj.nm, fld: 1, cnt: 1 };
          for (let j = 0; j < obj.toggleArr.length; j += 1) {
            const [spObj, spOpts] = [obj.toggleArr[j], []];
            let spRtn = +obj.value;
            for (let k = 0; k < spObj.oids.length; k += 1) {
              for (let m = 0; m < opts.length; m += 1) {
                if (`${spObj.oids[k]}` === `${opts[m].idx}`) {
                  spOpts.push(opts[m]);
                  spRtn *= 1 + (opts[m].odds || 0);
                  break;
                }
              }
            }
            const spItem = Object.assign({ amt: +obj.value, rtn: spRtn }, { show: false, odds: spObj.win }, bObj);
            bArr.push(Object.assign({ amt: +obj.value, rtn: spRtn }, { bets: [spItem], opts: spOpts }, wObj));
          }
        }
      }
      return { amt: ttlAmt, rtn: ttlRtn, arr: bArr };
    },
    makeBetParams() {
      const optCpArr = JSON.parse(JSON.stringify(this.btList));
      const [bArr, bets, opts] = [[], [], []];
      for (let i = 0; i < optCpArr.length; i += 1) {
        opts.push(optCpArr[i]);
      }
      for (let i = 0; i < this.bets.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.bets[i]));
        if (obj.nm > 1 && obj.value) {
          bets.push(Object.assign({ num: obj.nm, fld: 1, cnt: obj.mct }, { amt: +obj.value }));
        }
      }
      if (bets.length > 0) {
        bArr.push({ btp: 2, bets, optArr: opts });
      }
      return bArr;
    },
    makeBetParamsSplit() {
      const optCpArr = JSON.parse(JSON.stringify(this.btList));
      const [bArr, opts] = [[], []];
      for (let i = 0; i < optCpArr.length; i += 1) {
        opts.push(optCpArr[i]);
      }
      for (let i = 0; i < this.bets.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.bets[i]));
        if (obj.nm > 1 && obj.value) {
          const spItem = Object.assign({ num: obj.nm, fld: 1, cnt: 1 }, { amt: +obj.value });
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
        if (this.betCheck && this.oddsAlt) {
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
      } else if (this.betCheck && this.oddsAlt) {
        this.quoteBetOption({ data: this.betList });
      } else if (this.actBet && Date.now() - this.btime > 2000) {
        this.btime = Date.now();
        const paras = this.needSplit ? this.makeBetParamsSplit() : this.makeBetParams();
        const btSet = this.needSplit ? this.getBettingObjSplit() : this.getBettingObj();
        let rtn = null;
        if (this.betCheck) {
          rtn = await this.doMixBetAction({ data: paras, set: btSet });
        } else {
          rtn = await this.doBetAction(this.getBetObj());
        }
        if (rtn) {
          let rtnStr = /^2$/.test(rtn) ? 'userWrong' : 'betWrong';
          rtnStr = /^3$/.test(rtn) ? 'noBetList' : rtnStr;
          this.$toast(this.$t(`pageBet.${rtnStr}`));
        }
      }
    },
    getMultName(num, fld) {
      const [lan, nFld] = [this.$t('pageBet.betMoney'), fld || 1];
      const nunStr = !/[a-z]+/i.test(lan) ? '一二三四五六七八九十' : '';
      if (nunStr) {
        const beStr = num < 11 ? '一二三四五六七八九十'.substr(num - 1, 1) : num;
        const afStr = nFld < 11 ? '一二三四五六七八九十'.substr(nFld - 1, 1) : nFld;
        return this.betCheck ? `${num}串${nFld}` : `${beStr}串${afStr}`;
      }
      return `${num} Folds${fld && fld > 1 ? ` ${fld}` : ''}`;
    },
    touchFun(v) {
      const e = window.event ? window.event : null;
      let cName = e && e.target && e.target.className ? e.target.className : '';
      cName = e && typeof cName === 'object' ? cName.baseVal : cName;
      if (!/like-input/i.test(cName) && !v.down && Date.now() - v.blur > 300) {
        this.setBetsOpt(v, 'toggle', !v.toggle);
      }
    },
    getInputStyle(v) {
      const styleObj = { height: '30px' };
      if (!this.betCheck && !v.toggle && `${this.bets[this.bets.length - 1].nm}` !== `${v.nm}`) {
        const showEle = this.$el.querySelector('.body-shows,.body-shows-m,.body-shows-t,.body-shows-mix');
        if (showEle && window.getComputedStyle(showEle).borderTopColor) {
          styleObj.borderBottom = `1px solid ${window.getComputedStyle(showEle).borderTopColor}`;
        }
      }
      return styleObj;
    },
    focusFun(v) {
      this.focusItem = v;
      this.changeInputFlag(true);
      this.changeInputFocused(true);
      if (!this.cFlag) this.quoteBetCart({ });
      setTimeout(() => { this.setBetsOpt(v, 'down', true); }, 100);
    },
    inputFun(v) {
      let [val, flag] = [v.value.replace(/[^\d]/g, '').replace(/^0+/, ''), 0];
      if (+val > +(v.max || this.btMax)) {
        [val, flag] = [`${v.max || this.btMax}`, 1];
      }
      if ((+val) * v.odds > v.maxRtn) {
        [val, flag] = [`${parseInt(v.maxRtn / (v.odds || 1), 10)}`, flag || 2];
      }
      if (flag) this.$toast(this.$t(`pageBet.${flag < 2 ? 'maxToast' : 'rightToast'}`));
      this.setBetsOpt(v, 'value', val, 'willRtn', +val * v.odds);
    },
    blurFun(v) {
      this.focusItem = null;
      this.checkInputFocus();
      this.setBetsOpt(v, 'down', false, 'blur', Date.now());
    },
    checkInputFocus() {
      let pass = false;
      for (let i = 0; i < this.bets.length; i += 1) {
        pass = !!(pass || this.bets[i].value);
      }
      this.changeInputFocused(pass);
    },
    setBetsOpt(v, ...vals) {
      for (let i = 0; i < this.bets.length; i += 1) {
        if (`${this.bets[i].nm}` === `${v.nm}`) {
          const bt = this.bets[i];
          for (let j = 0; j < vals.length; j += 2) {
            bt[vals[j]] = vals[j + 1];
          }
          this.$set(this.bets, i, bt);
          break;
        }
      }
    },
    toSeriesFun() {
      this.getUserInfo();
      const [dt, bt, bList] = [[], [], JSON.parse(JSON.stringify(this.btList))];
      for (let i = 0; i < bList.length; i += 1) {
        const obj = bList[i];
        obj.odds = obj.odds ? obj.odds + 1 : 1;
        dt.push(obj);
      }
      this.data = dt.filter(v => !v.type && /^7$/.test(v.betStatus));
      this.series = toSeries(this.data);
      for (let i = 0; i < this.series.length; i += 1) {
        const rtnObj = Object.assign({ toggle: false, down: false, maxRtn: 1000000000 }, { blur: 0, min: this.btMin, max: this.btMax });
        let find = false;
        if (this.quoteArr && this.quoteArr.length && this.series[i].nm > 1) {
          for (let j = 0; j < this.quoteArr.length; j += 1) {
            if (`${this.quoteArr[j].betN}_${this.quoteArr[j].betM}` === `${this.series[i].nm}_1`) {
              rtnObj.min = this.quoteArr[j].minBet !== undefined ? this.quoteArr[j].minBet : rtnObj.min;
              rtnObj.max = this.quoteArr[j].maxBet !== undefined ? this.quoteArr[j].maxBet : rtnObj.max;
              [rtnObj.maxRtn, find] = [this.quoteArr[j].maxReturn || rtnObj.maxRtn, !!this.quoteArr[j].maxReturn];
              break;
            }
          }
        }
        if (this.userinfo && this.userinfo.rtn && this.series[i].nm > 1 && !find) {
          for (let j = this.series[i].nm; j >= 2; j -= 1) {
            if (this.userinfo.rtn[`mut${j}`]) {
              const userRtnObj = this.userinfo.rtn[`mut${j}`];
              if (typeof userRtnObj === 'object' && userRtnObj.maxBet !== undefined) {
                rtnObj.max = +userRtnObj.maxBet;
              }
              if (typeof userRtnObj === 'object' && userRtnObj.maxReturn) {
                rtnObj.maxRtn = +userRtnObj.maxReturn;
              } else {
                rtnObj.maxRtn = +userRtnObj;
              }
              break;
            }
          }
        }
        bt.push(Object.assign({ value: '', willRtn: 0, active: true }, rtnObj, this.series[i]));
      }
      this.bets = bt.filter(v => v.nm > 1);
      this.getToggleData();
    },
    getToggleData() {
      const tgOptsArr = JSON.parse(JSON.stringify(this.btList));
      for (let i = 0; i < tgOptsArr.length; i += 1) {
        [tgOptsArr[i].odds, tgOptsArr[i].win] = [tgOptsArr[i].odds + 1, tgOptsArr[i].odds + 1];
      }
      for (let i = 0; i < this.bets.length; i += 1) {
        const obj = JSON.parse(JSON.stringify(this.bets[i]));
        const stNum = obj.fld && obj.fld > 1 ? 2 : obj.nm;
        let [tArr, wd] = [[], obj.nm >= 4 ? '33.333%' : '25%'];
        wd = obj.nm >= 7 ? '50%' : wd;
        wd = obj.nm >= 10 ? '100%' : wd;
        for (let j = stNum; j <= obj.nm; j += 1) {
          tArr = tArr.concat(toSerList(tgOptsArr, j, 1));
        }
        [obj.toggleStyle, obj.toggleArr] = [{ width: wd }, tArr];
        this.$set(this.bets, i, obj);
      }
    },
  },
  mounted() {
    setTimeout(this.toSeriesFun, 10);
  },
};
</script>

<style lang="less">
.toggle-enter-active, .toggle-leave-active { transition: all 0.15s linear; }
.toggle-enter, .toggle-leave-active { transform: scaleY(0); }
.nb-bet-keyboard-multiple {
  width: 310px;
  border-radius: 10px;
  .input-box-item { width: 100%; }
  .input-touch-box { width: 100%; }
  .input-box-item-box { width: 100%; height: 40px; padding: 0 10px; }
  .input-box-item-box-mix { width: 100%; height: 48px; padding: 0 10px; }
  .input-box-item-title, .input-box-item-title-active { width: 80px; height: 100%; }
  .box-item-title-point { width: 8px; height: 8px; border-radius: 100%; margin-right: 7px; }
  .box-item-title-text { font-size: 16px; font-weight: 500; }
  .input-box-item-title { .box-item-title-point, .box-item-title-text { opacity: 0.3; } }
  .input-box-item-body { width: 220px; height: 100%; }
  .input-box-item-cnt-box { flex-grow: 1; height: 100%; }
  .input-box-item-count { padding-right: 11px; font-size: 13px; }
  .input-box-item-num, .input-box-item-flag { padding-right: 14px; font-size: 13px; }
  .bet-show-input-box { position: relative; width: 130px; height: 30px; z-index: 10; }
  .bet-show-input-box-p { position: relative; width: 104px; height: 30px; z-index: 10; }
  .bet-show-input-place { position: absolute; width: 100%; height: 100%; z-index: 20; font-size: 12px; }
  .box-item-like-input { position: absolute; width: 100%; height: 100%; z-index: 30; border-radius: 4px; background: transparent; padding: 0 10px; box-sizing: border-box; text-align: center; font-size: 12px; }
  .body-shows, .body-shows-t { width: 100%; height: 40px; margin-top: 5px; }
  .body-shows-m, .body-shows-mix { width: 100%; height: 32px; }
  .body-shows, .body-shows-m { padding: 0 12px 0 10px; }
  .body-shows-t, .body-shows-mix { padding: 0 22px; }
  .body-show-item { height: 100%; }
  .bet-show-item, .bet-show-item-p, .bet-show-null { font-size: 12px; }
  .bet-show-num, .bet-show-num-p { font-size: 14px; }
  .bet-show-item-p { padding-right: 5px; }
  .bet-show-num-p { padding-right: 1px; font-family: PingFangSC; }
  .keyboard-multiple-submit, .keyboard-multiple-submit-active { position: relative; width: 290px; height: 40px; margin: 0 auto 5px; font-size: 16px; border-radius: 6px; }
  .keyboard-multiple-submit-mix, .keyboard-multiple-submit-mix-active { position: relative; width: 100%; height: 40px; font-size: 16px; border-bottom-left-radius: 6px; border-bottom-right-radius: 6px; }
  .bet-foot-odds-box { position: absolute; right: 20px; top: 0; width: 42px; height: 48px; padding-top: 6px; }
}
.nb-bet-keyboard-multiple.none {
  padding: 5px 0;
  .input-touch-box:last-child .nb-bet-box-toggole { border-bottom: none !important; }
}
.white .nb-bet-keyboard-multiple {
  border: 1px solid #ECEBEB;
  background: linear-gradient(0deg, #F9F9F9 0%, #FFFFFF 100%);
  .input-box-item-box-mix { border-bottom: 1px solid #ecebeb; }
  .input-box-item-title .box-item-title-point { background: #716d6d; opacity: 0.3; }
  .input-box-item-title .box-item-title-text { color: #716d6d; opacity: 0.3; }
  .input-box-item-title-active .box-item-title-point { background: #ff5353; box-shadow: 0 2px 6px 0 rgba(255, 83, 83, 0.5); }
  .input-box-item-title-active .box-item-title-text { color: #2e2f34; }
  .input-box-item-count { color: #999999; }
  .input-box-item-num { color: #999999; }
  .input-box-item-flag { color: #bababa; }
  .box-item-like-input { border: 1px solid #ecebeb; }
  .bet-show-input-place { color: #bababa; }
  .body-shows, .body-shows-t { border-top: 1px solid #ecebeb; }
  .body-shows-m { border-bottom: 1px solid #ecebeb; }
  .body-shows-mix { background: #fff; }
  .body-show-item .bet-show-item, .bet-show-item-p, .body-show-item .bet-show-null { color: #909090; }
  .keyboard-multiple-submit { border: 1px solid #ecebeb; color: #aaaaaa; }
  .keyboard-multiple-submit-active { color: #fff; }
  .keyboard-multiple-submit-mix { background: #bababa; color: #ffffff80; }
  .keyboard-multiple-submit-mix-active { color: #fff; }
}

.dark .nb-bet-keyboard-multiple {
  .bet-show-num-p {
    color: #53fffd !important;
  }
  .bet-show-num {
    color: #53fffd !important;
  }
  .box-item-like-input {
    border: 1px solid #666;
    color: #53fffd !important;
  }
  .keyboard-multiple-submit-mix {
    background: #4d4c54;
    color: #888;
    cursor: pointer;
    transition: all 0.25s ease-out;
    &:active {
      background: #00b5b3;
      color: #fff;
    }
  }
  .keyboard-multiple-submit-mix-active {
    background: #00b5b3 !important;
    border-color: #00b5b3 !important;
    color: #fff;
  }
}
</style>
