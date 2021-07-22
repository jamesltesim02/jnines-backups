import store from '@/store';

/**
 * 计算可串关列表
 * @param {array} items
 * 已选中的投注项
 */
export const toMatch = (items = [], type) => {
  const matchs = [];
  for (let i = 0, find = 0; i < items.length; i += 1, find = 0) {
    const idx = items[i].idx || items[i].oid || items[i].optionID || i + 1;
    for (let j = 0; j < matchs.length; j += 1) {
      if (!type && (`${matchs[j].mid}` === `${items[i].mid}` || `${matchs[j].mid}` === `${items[i].matchID}`)) {
        matchs[j] = Object.assign({ win: matchs[j].win + (items[i].win || 0), odds: matchs[j].odds + (items[i].odds || 0) }, { mid: items[i].mid || items[i].matchID, mct: matchs[j].mct + 1 });
        find = 1;
      } else if (type && (`${matchs[j][0].mid}` === `${items[i].mid}` || `${matchs[j][0].mid}` === `${items[i].matchID}`)) {
        matchs[j].push(Object.assign({ odds: items[i].odds || 0, win: items[i].win || 0, oid: idx }, { mid: items[i].mid || items[i].matchID, flag: items[i].flag || 0 }));
        find = 1;
      }
      if (find) break;
    }
    if (!find && !type) {
      matchs.push(Object.assign({ mid: items[i].mid || items[i].matchID, mct: 1, odds: items[i].odds || 0 }, { win: items[i].win || 0 }));
    } else if (!find && type) {
      matchs.push([Object.assign({ odds: items[i].odds || 0, win: items[i].win || 0, oid: idx }, { mid: items[i].mid || items[i].matchID, flag: items[i].flag || 0 })]);
    }
  }
  return matchs;
};

export const getCount = (ops = [], arr = [], id, k, result) => {
  const len = ops.length + arr.length;
  if (arr.length === id) {
    let cal = { mct: 0, odds: 0 };
    for (let i = k; i < ops.length; i += 1) {
      cal = { mct: cal.mct + ops[i].mct, odds: cal.odds + ops[i].odds };
    }
    for (let i = 0; i < id; i += 1) {
      cal = { mct: cal.mct * arr[i].mct, odds: cal.odds * arr[i].odds };
    }
    return { mct: result.mct + cal.mct, odds: result.odds + cal.odds };
  }
  for (let i = k; i < len - id; i += 1) {
    result = getCount(ops, [ops[i]].concat(arr), id, i + 1, result);
  }
  return result;
};

export const toSeries = (items = []) => {
  const [result, ops, n] = [[], toMatch(items), 10 ** 8];
  for (let i = 0; i < ops.length; i += 1) {
    const rObj = Object.assign({ nm: i + 1 }, getCount(ops, [], i, 0, { mct: 0, odds: 0 }));
    rObj.odds = Math.round(rObj.odds * n) / n;
    result.push(rObj);
  }
  return result;
};

export const getSerList = (ops = [], arr = [], id, k, def, result) => {
  const [len, n] = [ops.length + arr.length, 10 ** 8];
  if (arr.length === id) {
    let cal = Object.assign({ oids: [], odds: 1 }, { win: def || 1, flag: 0 });
    for (let i = 0; i < id; i += 1) {
      cal = Object.assign({ oids: cal.oids.concat([arr[i].oid]), flag: cal.flag + arr[i].flag }, { odds: cal.odds * arr[i].odds, win: cal.win * arr[i].win });
    }
    for (let i = k; i < ops.length; i += 1) {
      for (let j = 0; j < ops[i].length; j += 1) {
        const rObj = Object.assign({ oids: cal.oids.concat([ops[i][j].oid]), flag: cal.flag + ops[i][j].flag }, { odds: cal.odds * ops[i][j].odds, win: cal.win * ops[i][j].win });
        [rObj.odds, rObj.win] = [Math.round(rObj.odds * n) / n, Math.round(rObj.win * n) / n];
        const rWin = rObj.flag ? 0 : rObj.win - def;
        result.push({ oids: rObj.oids, odds: rObj.odds, win: Math.floor(rWin * 100) / 100 });
      }
    }
    return result;
  }
  for (let i = k; i < len - id; i += 1) {
    for (let j = 0; j < ops[i].length; j += 1) {
      result = getSerList(ops, arr.concat([ops[i][j]]), id, i + 1, def, result);
    }
  }
  return result;
};

export const toSerList = (items = [], num = 2, def = 1) => getSerList(toMatch(items, true), [], num - 1, 0, def, []);

/**
 * 更新数据
 */
export const updateQuoteItem = (item, obj = {}, arr = []) => {
  const rst = Object.assign({ min: 0, max: 1000000, rtn: 1000000 }, item);
  [rst.gameType, rst.groupType] = [obj.gameType || rst.gameType || 0, obj.groupType || rst.groupType || 0];
  [rst.betBar, rst.betStage, rst.amt] = [obj.betBar || rst.betBar || '', obj.betStage || rst.betStage || 0, rst.amt || 0];
  [rst.matchScore, rst.betStatus, rst.alert] = [obj.matchScore || rst.matchScore || '0:0', rst.betStatus || 7, rst.alert || 0];
  [rst.matchState, rst.tournamentName] = [obj.matchState || rst.matchState || 0, obj.tournamentName || rst.tournamentName || ''];
  [rst.sportID, rst.matchID, rst.from] = [obj.sportID || rst.sportID || 10, obj.matchID || rst.matchID || '', rst.from || obj.from || 0];
  rst.compName = obj.competitor1Name && obj.competitor2Name ? `${obj.competitor1Name} vs ${obj.competitor2Name}` : rst.compName || rst.matchName || '';
  if (arr && arr.length) {
    for (let i = 0; i < arr.length; i += 1) {
      if ((!arr[i].optionId && !arr[i].oid) || `${arr[i].optionId}` === `${rst.optionID}` || `${arr[i].oid}` === `${rst.optionID}`) {
        rst.matchScore = arr[i].matchScore || rst.matchScore;
        if (arr[i].optionId || arr[i].oid) {
          rst.betStatus = arr[i].state !== undefined ? arr[i].state : rst.betStatus;
          rst.odds = arr[i].odds !== undefined ? arr[i].odds : rst.odds || 0;
          rst.betBar = arr[i].betBar !== undefined ? arr[i].betBar : rst.betBar;
          rst.min = arr[i].minBet !== undefined ? +arr[i].minBet : rst.min;
          rst.max = arr[i].maxBet !== undefined ? +arr[i].maxBet : rst.max;
          rst.rtn = arr[i].maxReturn !== undefined ? +arr[i].maxReturn : rst.rtn;
        } else if (`${arr[i].gtp}` === `${rst.gameType}`) {
          rst.betBar = arr[i].betBar !== undefined || arr[i].betbar !== undefined ? arr[i].betBar || arr[i].betbar : rst.betBar;
        }
        break;
      }
    }
  }
  return rst;
};

export const deepCheckOptions = (data = [], item = {}, find = null, uData = []) => {
  const nData = data.constructor === Array ? data : [];
  let nFind = find || null;
  for (let i = nData.length - 1; i >= 0; i -= 1) {
    if (nData[i] && nData[i].constructor === Array) {
      [nData[i], nFind] = deepCheckOptions(nData[i], item, nFind, uData);
    } else if (nData[i] && nData[i].optionID) {
      nData[i] = updateQuoteItem(nData[i], item, uData);
      if (nData[i].betStatus < 6) {
        nData.splice(i, 1);
      } else if (`${nData[i].optionID}` === `${item.optionID}` && /^7$/.test(nData[i].betStatus)) {
        nFind = nData[i];
      }
    }
  }
  return [nData, nFind];
};

export const deepCheckData = (data = [], item = {}, find = null, uData = []) => {
  const nData = data.constructor === Array ? data : [];
  let nFind = find || null;
  for (let i = nData.length - 1; i >= 0; i -= 1) {
    [nData[i].options, nFind] = deepCheckOptions(nData[i].options, Object.assign({}, nData[i], item), nFind, uData);
  }
  return [nData, nFind];
};

export const sortOptions = data => data.sort((a, b) => a.matchID - b.matchID);

/*
 * 投注项无用选项清理
*/
export const updateBetOptions = (data = [], uData = [], idx) => {
  const [nData, con] = [sortOptions(data.constructor === Array ? data : []), window.NBConfig];
  const allow = /^2$/.test(con.BETTING_MODE) && con.ALLOW_SAME_MATCH && con.ALLOW_MULT_OPTION;
  const delfIdx = idx === undefined && allow ? undefined : 0;
  for (let i = nData.length - 1; i >= 0; i -= 1) {
    nData[i] = nData[i] && nData[i].optionID ? updateQuoteItem(nData[i], { }, uData) : nData[i];
    nData[i].same = false;
    if (!nData[i] || !nData[i].optionID || nData[i].betStatus < 6) {
      nData.splice(i, 1);
    }
  }
  if (/^1$/.test(store.state.app.bettingMode)) {
    for (let i = nData.length - 1; i > 0; i -= 1) {
      for (let j = 0; j < i; j += 1) {
        if (`${nData[j].matchID}` === `${nData[i].matchID}`) {
          nData.splice(i, 1);
          break;
        }
      }
    }
  }
  let show = false;
  for (let i = 0; i < nData.length; i += 1) {
    const iPass = /^7$/.test(nData[i].betStatus);
    nData[i].show = iPass && `${nData[i].idx || 0}` === `${idx || delfIdx}`;
    [nData[i].idx, show] = [i + 1, nData[i].show || show];
    for (let j = i + 1; j < nData.length; j += 1) {
      const jPass = /^7$/.test(nData[j].betStatus);
      if (iPass && jPass && `${nData[j].matchID}` === `${nData[i].matchID}`) {
        [nData[i].same, nData[j].same] = [true, true];
      }
    }
  }
  if (!show && nData.length && /^7$/.test(nData[0].betStatus)) {
    nData[0].show = !(idx === undefined && allow);
  }
  return nData;
};

export const getTpTime = (time) => {
  const dt = time ? new Date(time) : new Date();
  const rt = `${dt.getFullYear()}/${`0${dt.getMonth() + 1}`.slice(-2)}/${`0${dt.getDate()}`.slice(-2)}`;
  return `${rt} ${`0${dt.getHours()}`.slice(-2)}:${`0${dt.getMinutes()}`.slice(-2)}:${`0${dt.getSeconds()}`.slice(-2)}`;
};

/*
 * 投注项显示数据转换
 *
*/
export const getMultStatus = (st, win, $t) => {
  if (/^1$/.test(st)) {
    return $t.admiss;
  }
  if (/^2$/.test(st)) {
    return $t.settle;
  }
  if (/^(3|8)$/.test(st)) {
    const rs = win > 0 ? $t.win75 : $t.lose0;
    return win < 0 ? $t.lose100 : rs;
  }
  return $t.cancel;
};

export const getNBit = (num, n) => {
  const [nNum, fN, oN] = [Math.abs(num), n + 4, n + 1];
  const nn = 5 * (10 ** -fN);
  const [numStr, flag] = [(nNum + nn).toString(), +num < 0 ? '-' : ''];
  return `${flag}${numStr.slice(0, numStr.indexOf('.') + oN)}`;
};

export const getBetStatus = (st, $t) => {
  const obj = {
    '-100': $t.lose100,
    '-50': $t.lose50,
    1: $t.win0,
    0: '',
    50: $t.win50,
    100: $t.win100,
    3: $t.cancel,
  };
  return obj[st] || '';
};

export const betDisplay = (opt, $t, md) => {
  const [item, hisType] = [opt, store.state.bet.hisType || !/^[12]$/.test(opt.wst)];
  [item.cash, item.cashout, item.live] = [0, false, false];
  [item.title, item.ctp, item.cashObj] = [$t.sinBet, item.ctp || 2, null];
  if (item.opts && item.bets && item.opts.length > 1) {
    for (let k = 0; k < item.bets.length; k += 1) {
      item.bets[k].detail = false;
      item.bets[k].btId = `bid_${10000000 + k}`;
      item.title = item.bets[k].num > 1 ? $t.mulBet : item.title;
    }
  }
  item.flwId = /\d\d+/.test(item.followId) ? item.followId : '';
  item.nTitle = item.title === $t.sinBet ? $t.nSinBet : $t.nMulBet;
  item.nTitle = /\d\d+/.test(item.followId) ? $t.nFlwBet : item.nTitle;
  item.cRtn = +(item.couponInf && /^1$/.test(item.couponInf.type) ? (item.couponInf.amt || 0) : 0);
  item.x = Object.assign({ amt: 0, rtn: 0, win: 0 }, { single: item.title === $t.sinBet });
  const check = item.title === $t.sinBet && item.bets && /^[12]$/.test(item.wst);
  if (check && item.mstid && item.bets && item.bets.length && item.opts && item.opts.length) {
    item.cashObj = { orderId: item.mstid, optionId: item.opts[0].oid, odds: item.opts[0].ods };
    [item.cashObj.oddsFormat, item.cashObj.betAmount] = [3, item.bets[0].tamt || item.bets[0].amt];
    item.live = item.opts[0].dt > 0;
  }
  [item.time, item.show] = [getTpTime(+item.tp), true];
  const $rstLan = !/^3$/.test(md) ? $t.rstNorObj : $t.rstMixObj;
  if (item.opts && item.opts.length > 0) {
    for (let k = 0; k < item.opts.length; k += 1) {
      item.opts[k].winStu = item.title === $t.sinBet ? '' : getBetStatus(item.opts[k].res, $rstLan);
      [item.opts[k].idx, item.opts[k].ofid, item.opts[k].live] = [k + 1, item.ofid, item.opts[k].dt > 0];
    }
  }
  if (item.bets && item.bets.length > 0) {
    for (let k = 0; k < item.bets.length; k += 1) {
      const bet = item.bets[k];
      item.x.amt += bet.tamt;
      item.x.win += hisType ? bet.win : bet.mxp;
      item.x.rtn += hisType ? bet.tamt + bet.win : bet.mxp;
    }
  }
  item.x.amt = item.x.amt || item.tamt;
  return item;
};

export const numFmt = (num, hasPt, bit, noDt) => {
  if (!/^-?\d+(\.\d+)?$/.test(`${num}`)) {
    return num || '';
  }
  const bMode = /^3$/.test(store.state.app.bettingMode);
  const regOne = new RegExp(`^(\\d+\\.\\d{${bit || 2}})(\\d*)`);
  const regTwo = new RegExp('(-?\\d)(?=(?:\\d{3})+(\\.\\d+)?$)', 'g');
  let nStr = `${Math.abs(+num) + 0.000005}`.replace(regOne, '$1');
  nStr = /^-/.test(num) ? `-${nStr}` : nStr;
  nStr = noDt || bMode ? nStr : nStr.replace(regTwo, '$1,');
  return hasPt ? nStr : nStr.replace(/0+$/, '').replace(/\.$/, '');
};

export const dateFmt = (dateStr, pattern = 'YYYY/MM/DD HH:mm:ss') => {
  const dt = /^\d+$/.test(dateStr) ? new Date(+dateStr) : new Date();
  let dtStr = `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`;
  dtStr = !dateStr || /^\d{9}\d+$/.test(dateStr) ? dtStr : `${dateStr}`;
  const dArr = dtStr.match(/^[^\d]*(\d{2,4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{1,2})[^\d]*$/);
  let ptnStr = pattern.replace(/Y+/i, `0000${dArr[1]}`.slice(0 - pattern.replace(/[^Yy]/g, '').length));
  ptnStr = ptnStr.replace(/M+/, `0000${dArr[2]}`.slice(0 - pattern.replace(/[^M]/g, '').length));
  ptnStr = ptnStr.replace(/D+/i, `0000${dArr[3]}`.slice(0 - pattern.replace(/[^Dd]/g, '').length));
  ptnStr = ptnStr.replace(/H+/i, `0000${dArr[4]}`.slice(0 - pattern.replace(/[^Hh]/g, '').length));
  ptnStr = ptnStr.replace(/m+/, `0000${dArr[5]}`.slice(0 - pattern.replace(/[^m]/g, '').length));
  return ptnStr.replace(/s+/i, `0000${dArr[6]}`.slice(0 - pattern.replace(/[^Ss]/g, '').length));
};

export const ellip = (value, len = 25) => {
  const varStr = `${value || ''}`;
  return varStr.length > len ? `${varStr.slice(0, len)}...` : varStr;
};
