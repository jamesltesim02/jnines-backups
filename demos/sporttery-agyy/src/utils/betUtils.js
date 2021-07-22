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
        matchs[j] = { mid: items[i].mid || items[i].matchID, mct: matchs[j].mct + 1, odds: matchs[j].odds + (items[i].odds || 0) };
        find = 1;
      } else if (type && (`${matchs[j][0].mid}` === `${items[i].mid}` || `${matchs[j][0].mid}` === `${items[i].matchID}`)) {
        matchs[j].push(Object.assign({ mid: items[i].mid || items[i].matchID, oid: idx }, { odds: items[i].odds || 0, flag: items[i].flag || 0 }));
        find = 1;
      }
      if (find) break;
    }
    if (!find && !type) {
      matchs.push({ mid: items[i].mid || items[i].matchID, mct: 1, odds: items[i].odds || 0 });
    } else if (!find && type) {
      matchs.push([Object.assign({ mid: items[i].mid || items[i].matchID, oid: idx }, { odds: items[i].odds || 0, flag: items[i].flag || 0 })]);
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
    let cal = { oids: [], win: def || 1, flag: 0 };
    for (let i = 0; i < id; i += 1) {
      cal = { oids: cal.oids.concat([arr[i].oid]), win: cal.win * arr[i].odds, flag: cal.flag + arr[i].flag };
    }
    for (let i = k; i < ops.length; i += 1) {
      for (let j = 0; j < ops[i].length; j += 1) {
        const rObj = { oids: cal.oids.concat([ops[i][j].oid]), win: cal.win * ops[i][j].odds, flag: cal.flag + ops[i][j].flag };
        rObj.win = Math.round(rObj.win * n) / n;
        const rWin = rObj.flag ? 0 : rObj.win - def;
        result.push({ oids: rObj.oids, win: Math.floor(rWin * 100) / 100 });
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
  [rst.sportID, rst.matchID] = [obj.sportID || rst.sportID || 10, obj.matchID || rst.matchID || ''];
  [rst.betBar, rst.betStage] = [obj.betBar || rst.betBar || '', obj.betStage || rst.betStage || 0];
  [rst.gameType, rst.groupType] = [obj.gameType || rst.gameType || 0, obj.groupType || rst.groupType || 0];
  [rst.matchScore, rst.betStatus, rst.alert] = [obj.matchScore || rst.matchScore || '0:0', rst.betStatus || 7, rst.alert || 0];
  [rst.matchState, rst.tournamentName] = [obj.matchState || rst.matchState || 0, obj.tournamentName || rst.tournamentName || ''];
  rst.compName = obj.competitor1Name && obj.competitor2Name ? `${obj.competitor1Name} vs ${obj.competitor2Name}` : rst.compName || '';
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

/*
 * 投注项无用选项清理
*/
export const updateBetOptions = (data = [], uData = [], idx = 0) => {
  const nData = data.constructor === Array ? data : [];
  for (let i = nData.length - 1; i >= 0; i -= 1) {
    nData[i] = nData[i] && nData[i].optionID ? updateQuoteItem(nData[i], { }, uData) : nData[i];
    nData[i].same = false;
    if (!nData[i] || !nData[i].optionID || nData[i].betStatus < 6) {
      nData.splice(i, 1);
    }
  }
  if (!/^2$/.test(store.state.app.bettingMode)) {
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
    nData[i].show = iPass && `${nData[i].idx || 0}` === `${idx || 0}`;
    [nData[i].idx, show] = [i + 1, nData[i].show || show];
    for (let j = i + 1; j < nData.length; j += 1) {
      const jPass = /^7$/.test(nData[j].betStatus);
      if (iPass && jPass && `${nData[j].matchID}` === `${nData[i].matchID}`) {
        [nData[i].same, nData[j].same] = [true, true];
      }
    }
  }
  if (!show && nData.length && /^7$/.test(nData[0].betStatus)) {
    nData[0].show = true;
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
  let nn = 10 ** -fN;
  nn *= 5;
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

export const betDisplay = (opt, $t) => {
  const item = opt;
  [item.cash, item.cashout, item.live] = [0, false, false];
  [item.title, item.cashObj] = [$t.sinBet, null];
  if (item.opts.length > 1) {
    for (let k = 0; k < item.bets.length; k += 1) {
      if (item.bets[k].num > 1) {
        item.title = $t.mulBet;
        break;
      }
    }
  }
  const check = item.title === $t.sinBet && item.mstid && item.bets;
  if (check && item.bets.length && item.opts && item.opts.length) {
    item.cashObj = { orderId: item.mstid, optionId: item.opts[0].oid, odds: item.opts[0].ods };
    [item.cashObj.oddsFormat, item.cashObj.betAmount] = [3, item.bets[0].tamt || item.bets[0].amt];
    item.live = item.opts[0].dt > 0;
  }
  [item.time, item.show, item.detail] = [getTpTime(+item.tp), true, false];
  for (let k = 0; k < item.opts.length; k += 1) {
    item.opts[k].winStu = item.title === $t.sinBet ? '' : getBetStatus(item.opts[k].res, $t);
    [item.opts[k].idx, item.opts[k].ofid, item.opts[k].live] = [k + 1, item.ofid, item.opts[k].dt > 0];
  }
  return item;
};
