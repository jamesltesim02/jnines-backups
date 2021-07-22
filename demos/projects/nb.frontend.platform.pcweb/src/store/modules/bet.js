import store from '@/store';
import oddsFormat from '@/filters/oddsFormat';
import { portalTrans } from '@/api/portalAxios';
import appConfig from '@/config/business.config';
import { getQuoteMultBetList } from '@/api/quote';
import { StorageKey } from '@/config/constants';
import { getSettings } from '@/utils/PortalUtils';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import { updateBetOptions, updateQuoteItem } from '@/utils/betUtils';
import { postDoBetList, postDoMixBetList, getBetBalance } from '@/api/bet';

const state = {
  matchIDArr: loadFromStorage(StorageKey.BET_MID_KEY, []),
  betIDArr: loadFromStorage(StorageKey.BET_OID_KEY, []),
  betList: loadFromStorage(StorageKey.BET_CART_KEY, []),
  betCount: loadFromStorage(StorageKey.BET_CART_KEY, []).filter(v => !v.type && /^7$/.test(v.betStatus)).length,
  pushData: { Matchs: [{ Mids: [] }], OptionIDs: [] },
  cartStatus: false,
  inputFlag: false,
  cartFlag: false,
  betMult: 0,
  slipList: [],
  slipObj: null,
  popList: [],
  betStatus: [],
  betFlag: false,
  slipStatus: 1,
  earlySuccess: false,
  earlySucFlag: false,
  betShow: null,
  hisType: 0,
  earlyTimmer: null,
  succStatus: false,
  errorCode: 0,
  pushMstID: null,
  betTime: 0,
  bettingFlag: false,
  bettingType: '',
  pushMstFlag: false,
  betHistoryFlag: false,
  clearAmtFlag: false,
  inputFocused: false,
  bettingObj: null,
  betPushArr: [],
  betResultArr: [],
  matchHisList: [],
  matchHisCount: 0,
  quoteReqTime: 0,
  quoteMultArr: [],
  quoteMultTpArr: [],
  quoteObj: Object.assign({ min: 0, max: 1000000000, rtn: 10000000000 }, { odds: 1, mOdds: 1, gtp: 0 }),
  betInputObj: Object.assign({ num: 1, cnt: 1, amt: '' }, { title: '', action: '', toast: '' }, { min: 0, max: 0, odds: 0 }),
};

const mutations = {
  loadBetId(bState) {
    const [data, idArr, mthArr] = [bState.betList, [], []];
    for (let i = 0, len = data.length; i < len; i += 1) {
      idArr.push({ id: `${data[i].optionID}`, type: data[i].type || '' });
      if (!data[i].type && mthArr.indexOf(`${data[i].matchID}`) < 0 && /^7$/.test(data[i].betStatus)) {
        mthArr.push(`${data[i].matchID}`);
      }
    }
    [bState.betIDArr, bState.matchIDArr] = [idArr, mthArr];
    saveToStorage(StorageKey.BET_OID_KEY, idArr);
    saveToStorage(StorageKey.BET_MID_KEY, mthArr);
  },
  loadList(bState) {
    const bList = loadFromStorage(StorageKey.BET_CART_KEY, []);
    for (let i = 0; i < bList.length; i += 1) {
      for (let j = 0; j < bState.betList.length; j += 1) {
        if (`${bList[i].optionID}` === `${bState.betList[j].optionID}` && `${bList[i].type || ''}` === `${bState.betList[j].type || ''}`) {
          bList[i].amt = bState.betList[j].amt;
        }
      }
    }
    if (JSON.stringify(bList) !== JSON.stringify(bState.betList)) {
      [bState.betList, bState.betCount] = [bList, bList.filter(v => !v.type && /^7$/.test(v.betStatus)).length];
      mutations.loadBetId(bState);
    }
    mutations.updateQuoteObj(bState, bState.betList);
  },
  saveList(bState, data) {
    if (JSON.stringify(data) !== JSON.stringify(bState.betList)) {
      saveToStorage(StorageKey.BET_CART_KEY, updateBetOptions(data, []));
    }
    mutations.loadList(bState);
  },
  updateItemAmt(bState, item) {
    for (let i = 0; i < bState.betList.length; i += 1) {
      if (`${bState.betList[i].optionID}` === `${item.optionID}` && `${bState.betList[i].type || ''}` === `${item.type || ''}`) {
        bState.betList[i].amt = item.amt;
      }
    }
  },
  showBetHistory(bState, status) {
    bState.betHistoryFlag = !!status;
    if (bState.betHistoryFlag) {
      mutations.changeSuccStatus(bState, false);
    }
  },
  changeInputFlag(bState, flag) {
    [bState.inputFlag, bState.cartFlag] = [!bState.inputFlag, !!flag];
    if (!flag) mutations.clearAmount(bState);
  },
  changeInputFocused(bState, value) {
    bState.inputFocused = !!value;
  },
  changeSlipStatus(bState, status = 1) {
    bState.slipStatus = status;
  },
  changeBetMult(bState, num) {
    bState.betMult = num ? 1 : 0;
    mutations.clearAmount(bState);
  },
  changeAmtFlag(bState) {
    bState.clearAmtFlag = !bState.clearAmtFlag;
  },
  clearAmount(bState) {
    for (let i = 0; i < bState.betList.length; i += 1) {
      bState.betList[i].amt = '';
    }
    mutations.changeAmtFlag(bState);
  },
  changeCartStatus(bState, status) {
    bState.cartStatus = !!status;
    mutations.quoteBetOption(bState, { data: bState.betList });
  },
  changeSuccStatus(bState, status) {
    bState.succStatus = !!status;
  },
  updateMatchHisCount(bState, num) {
    bState.matchHisCount = num || 0;
  },
  updateMatchHisList(bState, obj) {
    bState.matchHisList = obj || null;
    if (!bState.matchHisList || !bState.matchHisList.length) {
      mutations.clearEarlyTimer(bState);
      mutations.changeEarlySuccess(bState);
    }
  },
  setBettingFlag(bState, status) {
    bState.bettingFlag = !!status;
  },
  setBettingType(bState, type) {
    bState.bettingType = type || '';
  },
  changeErrorCode(bState, code) {
    bState.errorCode = code || 0;
    bState.pushMstID = null;
  },
  setMstID(bState, obj) {
    bState.pushMstID = obj || null;
  },
  changeHisType(bState, type) {
    bState.hisType = type ? 1 : 0;
    mutations.clearEarlyTimer(bState);
    mutations.changeEarlySuccess(bState);
  },
  clearEarlyTimer(bState) {
    clearInterval(bState.earlyTimmer);
    bState.earlyTimmer = null;
  },
  changeEarlySuccess(bState, flag) {
    bState.earlySuccess = !!flag;
    if (flag) {
      bState.earlySucFlag = !bState.earlySucFlag;
    }
  },
  updateQuoteMultArr(bState, items = []) {
    bState.quoteMultArr = items && items.length ? items : [];
  },
  updateQuoteMultTpArr(bState, items = []) {
    bState.quoteMultTpArr = items && items.length ? items : [];
  },
  createEarlyTimer(bState, fun) {
    mutations.clearEarlyTimer(bState);
    if (fun && typeof fun === 'function') {
      bState.earlyTimmer = setInterval(() => {
        fun();
      }, appConfig.earlyCashTime);
    }
  },
  pushPopSlipList(bState, arr) {
    const nArr = arr || bState.popList;
    for (let i = 0; i < nArr.length; i += 1) {
      mutations.changeSlipList(bState, nArr[i]);
    }
    bState.popList = arr || [];
  },
  changeSlipList(bState, wid) {
    const idx = bState.slipList.indexOf(`${wid}`);
    if (idx > -1) {
      bState.slipList.splice(idx, 1);
    } else {
      bState.slipList.push(`${wid}`);
    }
  },
  changeSlipObj(bState, obj) {
    bState.slipObj = obj || null;
  },
  setBettingObj(bState, obj) {
    bState.bettingObj = obj || null;
    mutations.setBetResultArr(bState);
  },
  setBetResultArr(bState, arr) {
    bState.betResultArr = arr || [];
  },
  updateBetPushArr(bState, obj) {
    const arr = typeof obj === 'object' ? [obj] : [];
    bState.betPushArr = (bState.betPushArr || []).concat(arr);
  },
  clearBetItem(bState, { type, arr = [] }) {
    const nArr = arr.constructor === Object ? [arr] : arr;
    mutations.loadList(bState);
    const data = JSON.parse(JSON.stringify(bState.betList));
    for (let i = 0; i < data.length; i += 1) {
      [data[i].oOdds, data[i].alert] = [data[i].odds, 0];
    }
    if (nArr.length) {
      for (let k = 0; k < nArr.length; k += 1) {
        for (let i = 0; i < data.length; i += 1) {
          if (`${data[i].optionID}` === `${nArr[k].optionID}` && `${data[i].type || ''}` === `${type || ''}`) {
            data.splice(i, 1);
            break;
          }
        }
      }
    } else {
      for (let i = data.length; i > 0; i -= 1) {
        if (`${data[i - 1].type || ''}` === `${type || ''}`) {
          data.splice(i - 1, 1);
        }
      }
    }
    mutations.saveList(bState, data);
    if (bState.matchIDArr.length < 2) {
      mutations.changeBetMult(bState, 0);
    }
  },
  clickBetItem(bState, item) {
    mutations.loadList(bState);
    const data = JSON.parse(JSON.stringify(bState.betList));
    let [delFlag, opFlag] = [0, 0];
    if (item && typeof item === 'object') {
      for (let i = data.length - 1; i >= 0; i -= 1) {
        const optionCheck = `${data[i].optionID}` === `${item.optionID}` && `${data[i].type || ''}` === `${item.type || ''}`;
        const optTypeCheck = item.type && `${data[i].type || ''}` === `${item.type || ''}`;
        [delFlag, opFlag] = [optionCheck ? 1 : delFlag, optionCheck || optTypeCheck ? 1 : opFlag];
        if (optionCheck || optTypeCheck) {
          data.splice(i, 1);
        }
      }
    }
    if (opFlag) mutations.saveList(bState, data);
    [bState.betFlag, bState.betStatus] = [!bState.betFlag, 0 - delFlag];
  },
  checkBetItem(bState, items = []) {
    mutations.loadList(bState);
    const [data, result] = [bState.betList, []];
    let iData = items.constructor === Array ? items : [items];
    iData = iData.length === 1 && iData[0].constructor === Array ? iData[0] : iData;
    for (let i = 0; i < iData.length; i += 1) {
      const optionID = typeof iData[i] === 'object' ? iData[i].optionID : iData[i];
      for (let j = 0; j < data.length; j += 1) {
        if (`${data[j].optionID}` === `${optionID}`) {
          result.push(j);
          break;
        }
      }
      if (result.length <= i) result.push(-1);
    }
    const rtn = result.length ? result : null;
    bState.betStatus = rtn && rtn.length === 1 ? rtn[0] : rtn;
  },
  updateQuoteObj(bState, data = []) {
    const quote = Object.assign({ min: 0, max: 1000000000, rtn: 10000000000 }, { odds: 1, mOdds: 1, gtp: 0 });
    let show = null;
    for (let i = 0; i < data.length; i += 1) {
      if (/^7$/.test(data[i].betStatus)) {
        show = { gmt: data[i].gameType, bar: data[i].betBar || '', opt: data[i].betOption };
        quote.min = data[i].min > quote.min ? data[i].min : quote.min;
        quote.max = data[i].max < quote.max ? data[i].max : quote.max;
        quote.rtn = data[i].rtn < quote.rtn ? data[i].rtn : quote.rtn;
        quote.odds = data[i].odds || quote.odds;
        quote.mOdds *= data[i].odds ? data[i].odds + 1 : 1;
        quote.gtp = data[i].gameType || 0;
      }
    }
    [bState.betShow, bState.quoteObj] = [show, quote];
  },
  quoteBetOption(bState, obj = { data: [], list: [] }) {
    let data = obj && obj.data && obj.data.length ? obj.data : [];
    data = updateBetOptions(JSON.parse(JSON.stringify(data)), []);
    const oList = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = JSON.parse(JSON.stringify(data[i]));
      oList.push({ optionID: item.optionID, odds: item.odds });
    }
    data = updateBetOptions(data, obj.list);
    for (let i = 0; i < data.length; i += 1) {
      [data[i].oOdds, data[i].alert] = [data[i].odds, 0];
      for (let j = 0; j < oList.length; j += 1) {
        if (`${oList[j].optionID}` === `${data[i].optionID}`) {
          const aFlag = data[i].odds - oList[j].odds;
          [data[i].oOdds, data[i].alert] = [oList[j].odds, Math.abs(aFlag) < 0.00001 ? 0 : aFlag];
          break;
        }
      }
    }
    mutations.saveList(bState, JSON.parse(JSON.stringify(data)));
  },
  pushBetOption(bState, obj) {
    mutations.loadList(bState);
    const [item, bets] = [obj || { nt: -1 }, JSON.parse(JSON.stringify(bState.betList))];
    if (/^(1|2)$/.test(item.nt) && item.mid && item.data && item.data.length) {
      for (let i = bets.length - 1; i >= 0; i -= 1) {
        bets[i].oOdds = bets[i].odds;
        if (`${bets[i].matchID}` === `${item.mid}`) {
          const fItem = item.data.filter(v => `${v.gtp}` === `${bets[i].gameType}`);
          let upItem = [];
          for (let j = 0; j < fItem.length; j += 1) {
            upItem = upItem.concat(fItem[j].options || []);
          }
          bets[i] = updateQuoteItem(bets[i], { }, upItem);
          bets[i].alert = (bets[i].odds - bets[i].oOdds) || bets[i].alert;
          if (!/^7$/.test(bets[i].betStatus)) {
            bets.splice(i, 1);
          }
        }
      }
    } else if (/^3$/.test(item.nt)) {
      const upItem = { betBar: item.data && item.data.betbar ? item.data.betbar : '' };
      for (let i = bets.length - 1; i >= 0; i -= 1) {
        if (`${bets[i].matchID}` === `${item.mid}`) {
          bets[i] = updateQuoteItem(bets[i], { }, [upItem]);
          if (!/^7$/.test(bets[i].betStatus)) {
            bets.splice(i, 1);
          }
        }
      }
    } else if (/^(4|7)$/.test(item.nt)) {
      const upItem = { matchScore: '' };
      if (/^4$/.test(item.nt) && item.data) {
        upItem.matchScore = `${item.data.hs || 0}:${item.data.as || 0}`;
      } else if (item.data) {
        const sArr = `${item.data.set_scores || '0-0'}-0-0`.split(/[\s:-]+/);
        const gArr = `${item.data.game_score || '0-0'}-0-0`.split(/[\s:-]+/);
        upItem.matchScore = `${sArr[0]} ${gArr[0]}:${sArr[1]} ${gArr[1]}`;
      }
      for (let i = bets.length - 1; i >= 0; i -= 1) {
        if (`${bets[i].matchID}` === `${item.mid}` && upItem.matchScore) {
          bets[i] = updateQuoteItem(bets[i], { }, [upItem]);
          if (!/^7$/.test(bets[i].betStatus)) {
            bets.splice(i, 1);
          }
        }
      }
    } else if (/^10$/.test(item.nt)) {
      bState.pushMstFlag = !bState.pushMstFlag;
      const rArr = `${item.rsn || 0}`.match(/(-?\d+)/);
      const eCode = rArr ? +rArr[1] : 0;
      const sObj = { wid: item.wid, slip: item.wst, code: eCode };
      mutations.updateBetPushArr(bState, sObj);
      mutations.changeErrorCode(bState, eCode);
      if (/^[2389]$/.test(item.wst)) {
        mutations.changeSuccStatus(bState, true);
      }
      if (bState.slipList.indexOf(`${item.wid}`) < 0) {
        mutations.setMstID(bState, { wid: `${item.wid}`, wst: item.wst });
      }
      if (bState.slipList.indexOf(`${item.wid}`) > -1 || Date.now() - bState.betTime < 5000) {
        mutations.changeSlipList(bState, item.wst);
        mutations.changeSlipStatus(bState, item.wst);
      }
    } else if (/^15$/.test(item.nt)) {
      for (let i = bets.length - 1; i >= 0; i -= 1) {
        if (`${bets[i].matchID}` === `${item.mid}`) {
          bets.splice(i, 1);
        }
      }
    }
    mutations.saveList(bState, bets);
  },
};

const actions = {
  makePushPara({ commit }) {
    commit('loadList');
    const [data, matchs, options] = [this.state.bet.betList, [], []];
    for (let v = 0; v < data.length; v += 1) {
      if (matchs.indexOf(data[v].matchID) < 0) {
        matchs.push(data[v].matchID);
      }
      if (options.indexOf(data[v].optionID) < 0) {
        options.push(data[v].optionID);
      }
    }
    this.state.bet.pushData = { Matchs: [{ Mids: matchs }], OptionIDs: options };
  },
  async quoteBetCart({ commit }, { item, type }) {
    const [qType, bet] = [type || (item && item.type), this.state.bet];
    const user = loadFromStorage(StorageKey.CASINO_USER_KEY, null);
    const [qTime, aTime] = [bet.quoteReqTime, Date.now()];
    this.state.bet.quoteReqTime = aTime;
    if (item) commit('clickBetItem', item);
    commit('loadList');
    const sts = !!(item && bet.betStatus < 0);
    let data = [].concat(item && !sts ? item : []).concat(JSON.parse(JSON.stringify(bet.betList)));
    data = updateBetOptions(data, []);
    if (!user || !user.nbUser || !data || !data.length || sts || aTime - qTime < 500) {
      commit('saveList', data);
      return;
    }
    const req = { userId: user.nbUser, options: [] };
    for (let v = 0; v < data.length; v += 1) {
      if (data[v].optionID && `${data[v].type || ''}` === `${qType || ''}`) {
        req.options.push({ optionId: data[v].optionID });
      }
    }
    if (qType) {
      commit('updateQuoteMultTpArr', []);
    } else {
      commit('updateQuoteMultArr', []);
    }
    try {
      const list = await getQuoteMultBetList(req);
      if (list && typeof list === 'object') {
        if (list.constructor === Array && list.length) {
          commit('quoteBetOption', { data, list });
        } else if (list.data && list.data.length) {
          commit('quoteBetOption', { data, list: list.data });
          if (list.extras && list.extras.length && !qType) {
            commit('updateQuoteMultArr', list.extras);
          } else if (list.extras && list.extras.length && qType) {
            commit('updateQuoteMultTpArr', list.extras);
          }
        }
      }
    } catch (e) {
      commit('saveList', data);
    }
  },
  async doBetAction({ commit }, betObj = { }) {
    const [bTime, aTime, betsPass] = [this.state.bet.betTime, Date.now(), betObj && betObj.bets && betObj.bets.length];
    this.state.bet.betTime = aTime;
    if (aTime - bTime < 2000 || (this.state.bet.bettingFlag && aTime - bTime < 10000) || !betsPass) {
      return 0;
    }
    commit('setBettingType', betObj.type || '');
    commit('setBettingFlag', true);
    commit('changeSlipStatus', 1);
    commit('loadList');
    const [user, bet] = [loadFromStorage(StorageKey.CASINO_USER_KEY, null), this.state.bet];
    const [data, set] = [betObj.arr || JSON.parse(JSON.stringify(bet.betList)), store.state.setting];
    if (!user || !user.token || !user.nbUser || !data || !data.length || !set) {
      commit('saveList', data);
      commit('setBettingFlag', false);
      return !data || !data.length ? 1 : 2;
    }
    let from = 5;
    for (let i = 0; i < data.length; i += 1) {
      from = /^7$/.test(data[i].betStatus) && data[i].from !== undefined && data[i].from < from ? data[i].from : from;
    }
    let obj = Object.assign({ ofid: set.oddsType }, { ac: set.oddsAC, cry: set.currency, ctp: +(`210${from}`) });
    obj = Object.assign(obj, { btp: betObj.mult || (bet.betMult + 1), bets: betObj.bets, opts: [] });
    for (let i = data.length - 1; i >= 0; i -= 1) {
      const item = data[i];
      if (/^7$/.test(item.betStatus) && `${item.type || ''}` === `${betObj.type || ''}`) {
        obj.opts.push({ oid: item.optionID, gpt: item.groupType, odv: oddsFormat(item.odds, item.gameType) });
      }
    }
    for (let i = 0; i < obj.bets.length; i += 1) {
      obj.bets[i].fld = obj.bets[i].fld || 1;
    }
    obj.opts = betObj.opts || obj.opts;
    if (!obj.bets[0].num || !obj.opts.length) {
      commit('setBettingFlag', false);
      return 1;
    }
    try {
      const rData = await postDoBetList(obj);
      if (!rData || !rData.mstid) {
        commit('changeErrorCode', -1);
        commit('changeSlipStatus', 0);
      } else {
        const [mArr, tk] = [[`${rData.mstid}`], rData.tickets];
        if (tk && tk.length && tk[0].wid && tk[0].wid !== rData.mstid) {
          mArr.push(`${rData.tickets[0].wid}`);
        }
        if (bet.pushMstID && bet.pushMstID.wid && mArr.indexOf(`${bet.pushMstID.wid}`) > -1) {
          commit('changeSlipStatus', bet.pushMstID.wst);
        } else {
          commit('pushPopSlipList', mArr);
          const liveItem = data.filter(v => /^[12]$/.test(v.matchState));
          commit('changeSlipStatus', liveItem && liveItem.length ? -1 : -2);
        }
      }
    } catch (e) {
      commit('changeErrorCode', e && e.code ? e.code : -1);
      commit('changeSlipStatus', 0);
    } finally {
      if (!betObj.noClear && (obj.bets[0].num > 1 || !betObj.arr)) {
        commit('clearBetItem', { type: betObj.type || '' });
      } else if (!betObj.noClear) {
        commit('clearBetItem', { type: betObj.type || '', arr: betObj.arr });
      }
      commit('clearAmount');
      if (betObj.slip && !betObj.type) commit('changeSlipObj', betObj.slip);
      setTimeout(() => { commit('setBettingFlag', false); }, 500);
    }
    return 0;
  },
  async doMixBetAction({ commit }, btMixObj = { data: [], set: null }) {
    const [btArr, btSetObj] = [btMixObj.data || [], btMixObj.set || null];
    const [bTime, aTime, betObj] = [this.state.bet.betTime, Date.now(), { betArr: [] }];
    this.state.bet.betTime = aTime;
    if (aTime - bTime < 2000 || (this.state.bet.bettingFlag && aTime - bTime < 10000)) {
      return 0;
    }
    const [user, set] = [loadFromStorage(StorageKey.CASINO_USER_KEY, null), store.state.setting];
    commit('setBettingFlag', true);
    for (let i = 0; i < btArr.length; i += 1) {
      const obj = btArr[i];
      if (/^[12]$/.test(obj.btp) && obj.bets && obj.bets.length && obj.optArr && obj.optArr.length) {
        [obj.ofid, obj.opts] = [set.oddsType, []];
        [obj.ac, obj.cry] = [set.oddsAC, set.currency];
        let from = 5;
        for (let j = 0; j < obj.optArr.length; j += 1) {
          const op = obj.optArr[j];
          from = /^7$/.test(op.betStatus) && op.from !== undefined && op.from < from ? op.from : from;
          obj.opts.push({ oid: op.optionID, gpt: op.groupType, odv: oddsFormat(op.odds, op.gameType) });
        }
        obj.ctp = +(`310${from}`);
        delete obj.optArr;
        betObj.betArr.push(obj);
      }
    }
    if (!user || !user.token || !user.nbUser || !betObj.betArr.length) {
      commit('setBettingFlag', false);
      return !betObj.betArr || !betObj.betArr.length ? 1 : 2;
    }
    commit('setBettingObj', btSetObj);
    try {
      const rData = await postDoMixBetList(betObj);
      const rPass = rData && rData.tickets && rData.tickets.length;
      commit('setBetResultArr', rPass ? rData.tickets : []);
      commit('clearBetItem', { type: '' });
    } catch (e) {
      commit('changeErrorCode', e && e.code ? e.code : -1);
      commit('changeSlipStatus', 0);
    } finally {
      setTimeout(() => { commit('setBettingFlag', false); }, 500);
    }
    return 0;
  },
  async getNBUser({ commit }, flag) {
    const [user, nowt, maxt] = [store.state.app.userinfo, Date.now(), 60000];
    if (user && user.token && (flag || !user.nbUser || !user.t || nowt - user.t > maxt)) {
      try {
        const data = await getBetBalance();
        const nUser = store.state.app.userinfo;
        if (nUser && nUser.token) {
          user.balance = data && data.balance !== undefined ? data.balance : user.balance;
          [user.nbUser, user.t] = [data && data.nbUser ? data.nbUser : '', nowt];
          commit('app/updateUserinfo', user);
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  async tranBalToNB({ commit }, flag, getFlag) {
    const [user, pSet] = [store.state.app.userinfo, getSettings()];
    const hasUrl = /^[a-z]+:\/\//.test(window.NBConfig.PORTAL_API_URL);
    const pApi = hasUrl && pSet && pSet.TRANS_API;
    const center = !!(pSet && pSet.USER_CENTER_URL);
    if (user && user.token && center && pApi && pApi.URI && pApi.METHOD) {
      if (flag) {
        await portalTrans({ to: 'NB' });
      } else {
        portalTrans({ to: 'NB' });
      }
      if (getFlag) {
        commit('getNBUser', true);
      }
    }
    return !!(user && user.token && center);
  },
};

export default { state, mutations, actions };
