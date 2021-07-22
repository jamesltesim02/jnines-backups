import store from '@/store';
import { numFmt, dateFmt } from '@/utils/betUtils';

const getDateObj = time => ({ date: dateFmt(time, 'MM-DD'), time: dateFmt(time, 'hh:mm:ss') });

const getSportName = (opts, $t) => {
  const arr = [];
  for (let i = 0; i < opts.length; i += 1) {
    if (arr.indexOf(opts[i].sno) < 0) arr.push(opts[i].sno);
  }
  return arr.length > 1 ? $t.together : $t[arr[0]] || '';
};

export const queryDefault = (type, delData) => {
  const dt = store.state.query.queryData;
  const hasFromTo = !!(dt.from && dt.to);
  [dt.from, dt.to] = [dt.from || dateFmt(null, 'YYYY/MM/DD'), dt.to || dateFmt(null, 'YYYY/MM/DD')];
  dt.type = type || dt.type;
  dt.type = !dt.type || dt.type < 1 ? 1 : dt.type;
  dt.type = parseInt(dt.type > 9 ? 9 : dt.type, 10);
  store.commit('query/setQueryData', dt);
  if (!hasFromTo) {
    store.commit('query/setStatsData', delData);
  }
  return dt;
};

export const getTypeData = (title, data, delData) => {
  const dt = queryDefault(null, delData);
  const tData = { hide: true, title, data };
  const def = tData.data[0].filter(v => `${v.value}` === `${dt.type}`);
  tData.default = def && def.length ? def[0].text : '';
  return tData;
};

export const getDateData = (type, delData) => {
  const dt = queryDefault(null, delData);
  const dateStr = type ? dt.to : dt.from;
  return dateStr || '';
};

export const displayMoney = (item, type) => {
  const createDate = type === 4 ? item.createDate : item.createdDate;
  const obj = getDateObj(createDate.replace(/-/g, '/'));
  let name = type > 3 ? item.accountType : item.orderTypeZH;
  name = type > 4 ? item.rebateMode : name;
  name = type > 5 ? item.promotionType : name;
  const id = type > 3 ? item.requestId : item.orderNo;
  [obj.name, obj.id] = [name, type > 4 ? '' : id];
  let money = item.btcAmount || item.amount || item.Amount || item.handleAmount;
  money = numFmt(+(`${money || 0}`.replace(/[^\d.]/g, '')), true);
  money = `${type === 4 ? '-' : '+'}${money.replace(/[+-]/, '')}`;
  [obj.money, obj.status] = [money, type > 3 ? item.flagZH : item.orderFlagZH];
  return obj;
};

export const displayBetting = (item, $t) => {
  const obj = getDateObj(+item.tp);
  [obj.name, obj.id] = [getSportName(item.opts, $t), item.mstid];
  obj.money = numFmt(item.tamt || item.amt);
  const sts = /^[12]$/.test(item.wst) ? $t.setNo : $t.cancel;
  obj.status = /^[389]$/.test(item.wst) ? numFmt(item.win) : sts;
  return obj;
};
