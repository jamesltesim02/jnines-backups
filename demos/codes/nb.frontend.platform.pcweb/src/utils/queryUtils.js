import store from '@/store';

const dateDefault = () => {
  const dt = new Date();
  return `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()}`;
};

const getDateObj = (time) => {
  const [obj, dt] = [{ }, time ? new Date(time) : new Date()];
  obj.date = `${`0${dt.getMonth() + 1}`.slice(-2)}-${`0${dt.getDate()}`.slice(-2)}`;
  obj.time = `${`0${dt.getHours()}`.slice(-2)}:${`0${dt.getMinutes()}`.slice(-2)}:${`0${dt.getSeconds()}`.slice(-2)}`;
  return obj;
};

const formatMoney = (money, fnum) => {
  const num = Math.floor((money + 0.000005) * 100) / 100;
  const arr = `${Math.abs(num) + 0.000005}`.match(/^(\d+)(\.\d{2})/);
  const [len, flag] = [arr[1].length % 3, num < 0 ? '-' : ''];
  const str = `${new Array(len ? 4 - len : 1).join('0')}${arr[1]}`;
  let rtn = '';
  for (let i = 0; i < str.length; i += 3) {
    rtn += `${str.slice(i, i + 3)}${i === str.length - 3 ? '' : ','}`;
  }
  rtn = `${fnum && num > 0 ? '+' : flag}${`${rtn}`.replace(/^0{1,2}/, '')}`;
  return fnum ? `${rtn}${arr[2]}` : `${rtn}${`${arr[2]}`.replace(/[.0]+$/, '')}`;
};

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
  [dt.from, dt.to] = [dt.from || dateDefault(), dt.to || dateDefault()];
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
  let money = formatMoney(type > 4 ? item.Amount : item.amount, true);
  money = `${type === 4 ? '-' : '+'}${money.replace(/[+-]/, '')}`;
  [obj.money, obj.status] = [money, type > 3 ? item.flagZH : item.orderFlagZH];
  return obj;
};

export const displayBetting = (item, $t) => {
  const obj = getDateObj(+item.tp);
  [obj.name, obj.id] = [getSportName(item.opts, $t), item.mstid];
  obj.money = formatMoney(item.tamt || item.amt);
  const sts = /^[12]$/.test(item.wst) ? $t.setNo : $t.cancel;
  obj.status = /^[389]$/.test(item.wst) ? formatMoney(item.win) : sts;
  return obj;
};
