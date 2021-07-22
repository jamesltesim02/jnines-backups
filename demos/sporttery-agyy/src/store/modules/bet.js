import store from '@/store';
import { StorageKey } from '@/config/constants';
import appConfig from '@/config/business.config';
import { postDoBetList } from '@/api/bet';
import { getQuoteMultBetList } from '@/api/quote';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';
import { updateBetOptions, updateQuoteItem } from '@/utils/betUtils';
import oddsFormat from '@/filters/oddsFormat';

const state = {
  betIDArr: loadFromStorage(StorageKey.BET_OID_KEY, []),
  betList: loadFromStorage(StorageKey.BET_CART_KEY, []),
  betCount: loadFromStorage(StorageKey.BET_CART_KEY, []).filter(v => /^7$/.test(v.betStatus)).length,
  pushData: { Matchs: [{ Mids: [] }], OptionIDs: [] },
  balAlert: false,
  oddsAlert: 0,
  slipList: [],
  popList: [],
  betPerct: 1,
  betStatus: [],
  betFlag: false,
  slipStatus: 1,
  keyStatus: false,
  subStatus: false,
  earlyStatus: null,
  earlyObject: null,
  earlySuccess: false,
  betShow: null,
  hisType: 0,
  earlyTimmer: null,
  succStatus: false,
  errorCode: 0,
  isIphoneX: false,
  pushMstID: null,
  betTime: 0,
  showIndex: 0,
  needShowSingle: false,
  quoteObj: Object.assign({ min: 0, max: 1000000000, rtn: 10000000000 }, { odds: 1, mOdds: 1, gtp: 0 }),
  betInputObj: Object.assign({ num: 1, cnt: 1, amt: '' }, { title: '', action: '', toast: '' }, { min: 0, max: 0, odds: 0 }),
};

const mutations = {
  loadBetId(bState) {
    const [data, idArr] = [bState.betList, []];
    for (let i = 0, len = data.length; i < len; i += 1) {
      idArr.push(`${data[i].optionID}`);
    }
    bState.betIDArr = idArr;
    saveToStorage(StorageKey.BET_OID_KEY, idArr);
  },
  loadList(bState) {
    const bList = loadFromStorage(StorageKey.BET_CART_KEY, []);
    if (JSON.stringify(bList) !== JSON.stringify(bState.betList)) {
      [bState.betList, bState.betCount] = [bList, bList.filter(v => /^7$/.test(v.betStatus)).length];
      mutations.loadBetId(bState);
    }
    mutations.updateQuoteObj(bState, bState.betList);
  },
  saveList(bState, data) {
    if (JSON.stringify(data) !== JSON.stringify(bState.betList)) {
      saveToStorage(StorageKey.BET_CART_KEY, updateBetOptions(data, [], bState.showIndex));
    }
    mutations.loadList(bState);
  },
  changeShowIndex(bState, idx) {
    const nIdx = idx || 0;
    if (`${bState.showIndex}` !== `${nIdx}`) {
      [bState.showIndex, bState.betInputObj.amt] = [nIdx, ''];
      const data = JSON.parse(JSON.stringify(bState.betList));
      saveToStorage(StorageKey.BET_CART_KEY, updateBetOptions(data, [], bState.showIndex));
    }
    mutations.loadList(bState);
  },
  changeSlipStatus(bState, status = 1) {
    bState.slipStatus = status;
  },
  changeKeyStatus(bState, status) {
    mutations.changeBalAlert(bState);
    bState.keyStatus = !!status;
  },
  changeBalAlert(bState, status) {
    bState.balAlert = !!status;
  },
  changeOddsAlert(bState, num) {
    const rst = num > 0 ? 1 : 0;
    bState.oddsAlert = num < 0 ? -1 : rst;
  },
  changeSubStatus(bState, status) {
    bState.subStatus = !!status;
  },
  changeSuccStatus(bState, status) {
    bState.succStatus = !!status;
  },
  changebetAmount(bState, obj) {
    let nObj = JSON.parse(JSON.stringify(bState.betInputObj));
    if (obj) {
      nObj.num = obj.num || nObj.num || 1;
      nObj.cnt = obj.cnt || nObj.cnt || 1;
      nObj.amt = obj.amt !== undefined ? obj.amt : '';
      nObj.min = obj.min !== undefined ? obj.min : nObj.min || 0;
      nObj.max = obj.max !== undefined ? obj.max : nObj.max || 0;
      nObj.odds = obj.odds !== undefined ? obj.odds : nObj.odds || 0;
      nObj.title = obj.title !== undefined ? obj.title : nObj.title || '';
      nObj.action = obj.action !== undefined ? obj.action : nObj.action || '';
      nObj.toast = obj.toast !== undefined ? obj.toast : nObj.toast || '';
    } else {
      nObj = Object.assign({ num: 1, cnt: 1, amt: '' }, { title: '', action: '', toast: '' }, { min: 0, max: 0, odds: 0 });
    }
    bState.betInputObj = nObj;
    mutations.changeBalAlert(bState);
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
  changeEarlyObject(bState, obj) {
    bState.earlyObject = obj || null;
  },
  changeEarlySuccess(bState, flag) {
    bState.earlySuccess = !!flag;
  },
  setNeedShowSingle(bState, status) {
    bState.needShowSingle = !!status;
  },
  checkIsIphoneX(bState) {
    const [n, s] = [window.navigator, window.screen];
    const isIOS = !!n.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    const notSafari = isIOS && (window.innerHeight > s.height - 100 || n.standalone);
    bState.isIphoneX = notSafari && s.height >= 812 && s.width >= 375;
  },
  changeEarlyStatus(bState, obj) {
    bState.earlyStatus = obj || null;
    if (obj) mutations.changeEarlyObject(bState);
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
  clearBetItem(bState, arr = []) {
    const nArr = arr.constructor === Object ? [arr] : arr;
    mutations.changeKeyStatus(bState);
    mutations.changeEarlyStatus(bState);
    mutations.setNeedShowSingle(bState);
    mutations.loadList(bState);
    let data = JSON.parse(JSON.stringify(bState.betList));
    if (nArr.length) {
      for (let k = 0; k < nArr.length; k += 1) {
        for (let i = 0; i < data.length; i += 1) {
          if (`${data[i].optionID}` === `${nArr[k].optionID}`) {
            data.splice(i, 1);
            break;
          }
        }
      }
    } else {
      data = [];
      mutations.changebetAmount(bState);
      mutations.changeSubStatus(bState);
    }
    mutations.changeBalAlert(bState);
    mutations.changeOddsAlert(bState, 0);
    mutations.saveList(bState, data);
  },
  clickBetItem(bState, item) {
    mutations.loadList(bState);
    mutations.changebetAmount(bState);
    const data = JSON.parse(JSON.stringify(bState.betList));
    let delFlag = 0;
    if (item && typeof item === 'object') {
      for (let i = data.length - 1; i >= 0; i -= 1) {
        const matchCheck = !/^2$/.test(store.state.app.bettingMode) && `${data[i].matchID}` === `${item.matchID}`;
        if (`${data[i].optionID}` === `${item.optionID}` || matchCheck) {
          delFlag = `${data[i].optionID}` === `${item.optionID}` ? 1 : delFlag;
          data.splice(i, 1);
        }
      }
    }
    if (delFlag) mutations.saveList(bState, data);
    [bState.betFlag, bState.betStatus] = [!bState.betFlag, 0 - delFlag];
    if (delFlag || !item) return;
    let [pct, aFlag] = [100, false];
    clearInterval(window.betPctTimer);
    window.betPctTimer = setInterval(() => {
      if (aFlag && pct >= 100) {
        pct = 100;
        clearInterval(window.betPctTimer);
      } else if (aFlag) {
        pct += 4;
      } else {
        [pct, aFlag] = [pct - 10, pct <= 50];
      }
      bState.betPerct = pct / 100;
    }, 10);
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
    let [data, oOdds, nOdds] = [obj && obj.data && obj.data.length ? obj.data : [], 1, 1];
    const oList = [];
    data = updateBetOptions(data, []);
    for (let i = 0; i < data.length; i += 1) {
      oList.push({ optionID: data[i].optionID, odds: data[i].odds });
    }
    data = updateBetOptions(data, obj.list);
    for (let i = 0; i < data.length; i += 1) {
      for (let j = 0; j < oList.length; j += 1) {
        if (`${oList[j].optionID}` === `${data[i].optionID}`) {
          [oOdds, nOdds] = [oOdds * oList[j].odds, nOdds * data[i].odds];
          data[i].alert = data[i].odds - oList[j].odds;
          break;
        }
      }
    }
    mutations.changeOddsAlert(bState, nOdds - oOdds);
    mutations.saveList(bState, data);
  },
  pushBetOption(bState, obj) {
    mutations.loadList(bState);
    const [item, bets] = [obj || { nt: -1 }, JSON.parse(JSON.stringify(bState.betList))];
    if (/^(1|2)$/.test(item.nt) && item.mid && item.data && item.data.length) {
      for (let i = bets.length - 1; i >= 0; i -= 1) {
        if (`${bets[i].matchID}` === `${item.mid}`) {
          const fItem = item.data.filter(v => `${v.gtp}` === `${bets[i].gameType}`);
          let [oldOdds, newOdds, upItem] = [0, 0, []];
          for (let j = 0; j < fItem.length; j += 1) {
            upItem = upItem.concat(fItem[j].options || []);
          }
          oldOdds = bets[i].odds;
          bets[i] = updateQuoteItem(bets[i], { }, upItem);
          newOdds = bets[i].odds;
          if (newOdds !== oldOdds) {
            bets[i].alert = newOdds - oldOdds;
            mutations.changeOddsAlert(bState, newOdds - oldOdds);
          }
          if (!/^7$/.test(bets[i].betStatus)) {
            bets.splice(i, 1);
            mutations.changeOddsAlert(bState, 0);
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
            mutations.changeOddsAlert(bState, 0);
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
            mutations.changeOddsAlert(bState, 0);
          }
        }
      }
    } else if (/^10$/.test(item.nt)) {
      const rArr = `${item.rsn || 0}`.match(/(-?\d+)/);
      mutations.changeErrorCode(bState, rArr ? +rArr[1] : 0);
      if (/^[2389]$/.test(item.wst)) {
        mutations.changeSuccStatus(bState, true);
      }
      if (bState.slipList.indexOf(`${item.wid}`) > -1 || Date.now() - bState.betTime < 5000) {
        mutations.changeEarlyStatus(bState);
        mutations.changeSlipList(bState, item.wst);
        mutations.changeSlipStatus(bState, item.wst);
      } else {
        mutations.setMstID(bState, { wid: `${item.wid}`, wst: item.wst });
      }
    } else if (/^15$/.test(item.nt)) {
      for (let i = bets.length - 1; i >= 0; i -= 1) {
        if (`${bets[i].matchID}` === `${item.mid}`) {
          bets.splice(i, 1);
          mutations.changeOddsAlert(bState, 0);
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
  async quoteBetCart({ commit }, item) {
    const [user, bet, app] = [loadFromStorage(StorageKey.CASINO_USER_KEY, null), this.state.bet, store.state.app];
    let sts = false;
    if (item) {
      commit('clickBetItem', item);
      sts = bet.betStatus < 0;
    }
    commit(!app.multType && !/^2$/.test(app.bettingMode) ? 'clearBetItem' : 'loadList');
    let data = [].concat(item && !sts ? item : []).concat(JSON.parse(JSON.stringify(bet.betList)));
    data = updateBetOptions(data, []);
    if (!user || !user.nbUser || !data || !data.length || sts) {
      commit('saveList', data);
      return;
    }
    const req = { userId: user.nbUser, options: [] };
    for (let v = 0; v < data.length; v += 1) {
      if (data[v].optionID) {
        req.options.push({ optionId: data[v].optionID });
      }
    }
    try {
      const list = await getQuoteMultBetList(req);
      if (list && list.length) commit('quoteBetOption', { data, list });
    } catch (e) {
      commit('saveList', data);
    }
  },
  async doBetAction({ commit }, arr) {
    const [bTime, aTime] = [this.state.bet.betTime, Date.now()];
    this.state.bet.betTime = aTime;
    if (aTime - bTime < 1000) {
      return 0;
    }
    commit('loadList');
    const [user, bet, app] = [loadFromStorage(StorageKey.CASINO_USER_KEY, null), this.state.bet, store.state.app];
    const [data, set, bItem] = [arr || JSON.parse(JSON.stringify(bet.betList)), store.state.setting, bet.betInputObj];
    if (!user || !user.token || !data || !data.length || !set || !bItem.amt) {
      commit('saveList', data);
      return !data || !data.length ? 1 : 2;
    }
    let obj = Object.assign({ ofid: set.oddsType }, { ac: set.oddsAC, cry: set.currency, ctp: set.clientType });
    obj = Object.assign(obj, { btp: app.multType + 1, bets: [{ num: bItem.num, cnt: bItem.cnt, amt: +bItem.amt }], opts: [] });
    for (let i = data.length - 1; i >= 0; i -= 1) {
      const item = data[i];
      if (/^7$/.test(item.betStatus)) {
        obj.opts.push({ oid: item.optionID, gpt: item.groupType, odv: oddsFormat(item.odds, item.gameType) });
        if (bItem.num < 2) break;
      }
    }
    if (!obj.bets[0].num || !obj.opts.length) {
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
          commit('changeEarlyStatus');
          commit('changeSlipStatus', bet.pushMstID.wst);
        } else {
          commit('pushPopSlipList', mArr);
          commit('changeSlipStatus', bItem.num < 2 && /^1$/.test(data[0].matchState) ? -1 : -2);
        }
      }
    } catch (e) {
      commit('changeErrorCode', e && e.code ? e.code : -1);
      commit('changeSlipStatus', 0);
    }
    if (!/^2$/.test(app.bettingMode) || bItem.num > 1) {
      commit('clearBetItem');
    } else {
      commit('clearBetItem', arr);
    }
    return 0;
  },
};

export default {
  state,
  mutations,
  actions,
};
