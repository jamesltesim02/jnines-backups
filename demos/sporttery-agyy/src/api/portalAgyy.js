import store from '@/store';
import Axios from 'axios';
import queryString from 'query-string';
import { encrypt } from '@/utils/CryptUtils';
import { PaymentTypeOrder, PaymentChannelOrder, PaymentMapping } from '@/config/constants';
import { logout } from '@/utils/UserinfoUtil';
import Ajaxer from './Ajaxer';

const { PORTAL_API_URL: baseURL } = window.NBConfig;

// 创建axios对象
const axios = Axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'x-requested-with': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  validateStatus: status => parseInt(status / 100, 10) === 2 || status === 401,
});

// 请求拦截器,当参数为加密内容时,自动加上des请求头标志
axios.interceptors.request.use(
  (config) => {
    if (config.data && config.data.parameter) {
      config.headers['X-Request-Encrypt'] = 'DES';
    }
    if (config.method.toUpperCase() === 'POST') {
      config.data = queryString.stringify(config.data);
    }
    return config;
  },
  (e) => {
    console.warn('request error:', e);
    store.commit('app/toast', 'message.netError');
    return Promise.reject(e);
  },
);

// 响应拦截器, 处理响应结果
axios.interceptors.response.use(
  ({ data = { code: 500 } }) => {
    const error = {
      code: data.code,
      msg: data.data,
    };

    if (+data.code === 200) {
      return Promise.resolve(data.data);
    }

    if (+data.code === 401) {
      store.commit('app/toast', { msg: 'message.logOuttime' });
      logout();
      return null;
    }

    if (+data.code === 6008) {
      return Promise.reject(error);
    }

    store.commit('app/toast', {
      msg: `agMessage.${error.code}`,
      normal: error.msg || 'message.defaultErrorMsg',
    });

    return Promise.reject(error); // eslint-disable-line prefer-promise-reject-errors
  },
  (e) => {
    console.log('response:', e.response);
    console.warn('network error:', e);
    store.commit('app/toast', 'message.netError');
    return Promise.reject(e);
  },
);

/**
 * 本地实现的ajax, 支持同步
 */
const ajaxer = Ajaxer.create({
  baseURL,
  withCredentials: true,
  headers: {
    'x-requested-with': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  validateStatus: status => parseInt(status / 100, 10) === 2 || status === 401,
  transformResponse(result) {
    result = JSON.parse(result);
    return result.data;
  },
});

/**
 * 对请求参数加密
 *
 * @param {object} params
 *    被加密的数据对象
 */
export const encryptParam = params => ({ parameter: encrypt(JSON.stringify(params)) });


/**
 * 注册
 *
 * @param {object} params
 *    注册参数
 */
export const agFastRegister = params => axios.post('api/fastRegister', encryptParam(params));

/**
 * 登录
 *
 * @param {object} params
 *    登录参数
 */
export const agLogin = params => axios.post('api/login', encryptParam(params));

/**
 * 退出
 */
export const agLogout = () => axios.get('api/sync/logout');

/**
 * 查询用户信息
 */
export const getCustomer = () => axios.get('api/customer');

/**
 * 将总余额转入游戏
 */
export const transferToGame = flag => axios.post(`api/transfer/${!flag ? 'totalAmount' : 'local'}-game`, {}, {
  transformResponse(data) {
    const result = JSON.parse(data);
    if (flag || result.code !== 200) {
      return result;
    }
    try {
      result.data.token = (JSON.parse(result.data.token)).data;
    } catch (e) {
      console.warn(e);
    }

    return result;
  },
});

/**
 * 查询余额
 */
export const agGetBalance = () => axios.get('api/balance', { params: { v: Date.now() } });

/**
 * 获取支付通道
 */
export const getPayChannel = () => axios.get('api/pay/channel', {
  transformResponse(data) {
    const result = JSON.parse(data);

    if (result.code !== 200) {
      return result;
    }

    const { data: { rules } } = result;
    const channels = {};

    // 支付通道归类
    Object.entries(result.data).forEach((entry) => {
      const [k, v] = entry;

      if (!v || !v.successful) {
        return;
      }

      // 获取类别key
      const groupName = PaymentMapping[k];
      if (!groupName) {
        return;
      }

      // 初始化
      if (!channels[groupName]) {
        channels[groupName] = [];
      }

      // 归到类别下
      channels[groupName].push({
        ...v,
        key: k,
      });
    });

    // 获取存款通道名称列表
    const types = [];
    PaymentTypeOrder.forEach((pt) => {
      if (!channels[pt] || !channels[pt].length) {
        return;
      }

      types.push(pt);

      const corder = PaymentChannelOrder[pt];
      if (!corder) {
        return;
      }
      channels[pt].sort((c1, c2) => corder.indexOf(c1.key) - corder.indexOf(c2.key));
    });

    return {
      ...result,
      data: {
        channels,
        types,
        rules,
      },
    };
  },
});

/**
 * 提交扫码支付订单 (包含扫码支付, APP支付, 支付宝支付)
 *
 * @param {obejct} params
 *    订单信息
 */
export const payScanQR = params => axios.post('api/pay/scan-qr', params);
export const payScanQRSync = params => ajaxer.post('api/pay/scan-qr', params, { async: false });

/**
 * 获取扫码支付订单信息(通过当前session信息获取,无需传参)
 */
export const getScanOrder = () => axios.get('api/pay/scan-qr/order-form');
export const getScanOrderSync = () => ajaxer.get('api/pay/scan-qr/order-form', {}, { async: false });

/**
 * APP环境下获取订单信息(通过token获取)
 */
export const getOder4App = () => axios.get('api/pay/wap-app/order-form');

/**
 * 提交在线支付订单(包含在线支付下的网银在线支付和银联在线支付)
 *
 * @param {object} params
 *    订单信息
 */
export const payOnline = params => axios.post('api/pay/online', params);
export const payOnlineSync = params => ajaxer.post('api/pay/online', params, { async: false });

/**
 * 获取在线支付订单信息
 */
export const getOnlineOrder = () => axios.get('api/pay/online/order-form');
export const getOnlineOrderSync = () => ajaxer.get('api/pay/online/order-form', {}, { async: false });

/**
 * 提交银行卡转账订单
 *
 * @param {object} params
 *    订单信息
 */
export const payTransfer = params => axios.post('api/pay/bq', params);

/**
 * 获取汇率
 *
 * @param {object} params
 *    汇率类别参数
 */
export const getExchange = params => axios.post('api/pay/virtual/exchange-rate', params);

/**
 * 提交虚拟支付订单
 *
 * @param {object} params
 *    订单信息
 */
export const payVirtual = params => axios.post('api/pay/virtual', params);

/**
 * 查询洗码信息
 */
export const getRebate = () => axios.get('api/rebate/nb');

/**
 * 提交洗码请求
 */
export const submitRebate = () => axios.put('api/rebate/nb');

/**
 * 查询充值记录
 */
export const getDepositHis = params => axios.get('api/payment/record', { params });

/**
 * 查询提现记录
 */
export const getWithdrawHis = params => axios.get('api/withdrawal/record', { params });

/**
 * 查询洗码记录
 */
export const getWashCodeHis = params => axios.get('api/rebate/record', { params });

/**
 * 获取银行卡列表
 */
export const getBankList = () => axios.get('api/banks');

/**
 * 查询银行卡
 */
export const getWithdrawList = () => axios.get('api/withdrawal');

/**
 * 查询虚拟币汇率
 */
export const getVirtualCurr = params => axios.get('api/withdraw/rate', { params });

/**
 * 银行卡和虚拟币提现
 */
export const doWithdrawAction = params => axios.post(`api/withdraw/request-${params.rate ? 'virtual' : 'cny'}`, params);

/**
 * 设置默认银行卡
 */
export const setDefBank = params => axios.put(`api/banks/${params.id}`, { params });

/**
 * 删除银行卡
 */
export const deleteBank = params => axios.delete(`api/banks/${params.id}`, { params });

/**
 * 验证手机号
 */
export const checkPhone = params => axios.get('api/phone/right', { params });

/**
 * 获取短信验证码
 */
export const getPhoneMessage = params => axios.post('api/sms', encryptParam(params));

/**
 * 校验短信验证码
 */
export const verPhoneMessage = params => axios.post('api/sms/verify', encryptParam(params));

/**
 * 新增比特币钱包和银行卡
 */
export const addVertOrCard = v => axios.post(`api/banks${v.bankAccountNo ? '' : '/virtual'}`, encryptParam(v));

/**
 * 获取省份和城市列表
 */
export const getProAndCity = v => axios.get(`api/banks/${v && v.province ? 'district' : 'provinces-bankNames'}`, { params: v });

/**
 * 获取加密和验证方式
 */
export const getAppInit = params => axios.get('api/init', { params });

/**
 * 获取文字验证文字
 */
export const getWdCheckWord = params => axios.get('api/captcha/CLICK_TEXT', { params });

/**
 * 验证文字验证码
 */
export const checkingWords = params => axios.get('api/captcha/CLICK_TEXT/check', { params });
