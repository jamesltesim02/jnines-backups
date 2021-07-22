import AppConfig from '../configs';
import SyncApiInvoker from './SyncApiInvoker';

import appStore from '../stores/app';
import memberStore from '../stores/member';

function toast(message: any) {
  window.dispatchEvent(
    new CustomEvent('toast', {detail: message})
  );
}
function toRoute (fn: (history: any, location: any) => void) {
  window.dispatchEvent(
    new CustomEvent('route', { detail: fn })
  );
}

/**
 * 本地实现的ajax, 支持同步
 */
const invoker = SyncApiInvoker.create({
  withCredentials: true,
  headers: {
    'x-requested-with': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  handleRequest (conf: any) {
    // 请求语言
    conf.headers['Accept-Language'] = appStore.locale;
    // 客户端类型
    conf.headers['Client_Type'] = appStore.clientType;
    // 站点Code 默认：HC6_PC
    conf.headers['X_Website_Code'] = 'HC6_PC';
    // 商户id
    // conf.headers['front_id'] = AppConfig.FRONT_ID;
    conf.headers['front_id'] = appStore.frontId;
    // language
    conf.headers['language'] = appStore.locale;

    // 构造新请求参数, 添加clientType,language与frontId
    conf.data = {
      // frontId: AppConfig.FRONT_ID,
      frontId: appStore.frontId,
      clientType: appStore.clientType,
      language: appStore.locale,
      ...(conf.data || {})
    }

    // 如果已登录则添加用户相关参数
    if (memberStore.isLoged) {
      // 主站Token，未登录默认为空
      conf.headers['Authorization'] = memberStore.agToken;
      // 登录后，NB生成的Token
      conf.headers['NB_Token'] = memberStore.nbToken;
      conf.data.token = memberStore.nbToken;
      conf.data.userId = memberStore.userId;
    }

    return conf;
  },
  handleResponse (
    result: any,
    conf: any
  ) {
    // 如果处理结果为200, 则表示处理成功,返回内容
    if (result.code === 200) {
      // 判断是否地域限制或者维护
      // 是否包含地域限制属性,如果维护或者地域限制均会包含此属性
      if (
        result.data?.game === 'j9'
        &&
        result.data?.hasOwnProperty('forbbiden')
      ) {
        appStore.systemState = result.data;
        throw new Error();
      }
      return result.data;
    }

    // 如果是401则需要重新登录, 提示需要登录, 清空store, 跳转到登录页面
    if (result.code === 401) {
      if (memberStore.isLoged) {
        // 提示
        toast({
          key: 401,
          type: 'warn',
          content: '登录已失效,请重新登录'
        });
        memberStore.memberInfo = null
        // 转到登录
      // 转到登录
        setTimeout(
          () => {
            toRoute((history, location) => {
              history.replace(`/login?from=${location.pathname}`);
            });
          },
          2500
        );
      }
      throw new Error();
    }

    // 如果响应中有msg则提示消息
    if (result.msg) {
      toast({
        key: result.code,
        type: 'error',
        content: result.msg
      });
    }

    return result
  },
  validateStatus: (status: number) => Math.floor(status / 100) === 2 || status === 401,
  transformResponse(result: string) {
    const resultData: any = JSON.parse(result);
    return resultData.data;
  },
});

/** 同步检查游戏厅是否维护中 */
export const getGameStateSync = (target: string) => {
  return invoker.get(
    'live',
    { target },
    { baseURL: AppConfig.PULL }
  );
};

/** 转额到指定游戏厅  */
export const transferToGameSync = (target: string) => {
  return invoker.get(
    'user/balance',
    { target },
    { baseURL: AppConfig.AG_USER_URL }
  );
};

/** 扫码支付接口 */
export const scanqrPayment = (
  params: {
    /** 商户支付id */
    payId: string,
    /**
     * 支付类型
     * * ONLINE_BANK,
     * * QQ_QR,
     * * QQ_APP,
     * * WECHAT_QR,
     * * BIG_WECHAT_QR,
     * * WECHAT_APP,
     * * BIG_WECHAT_APP,
     * * ONLINE_UNIONPAY_QR,
     * * ONLINE_PLATFORM,
     * * IVI_ONLINE_PLATFORM_MOBILE,
     * * ONLINE_JD_QR,
     * * QUICK_PAY,
     * * ALIPAY_QR,
     * * BIG_ALIPAY_QR,
     * * ALIPAY_APP,
     * * BIG_ALIPAY_APP,
     * * BITCOIN,
     * * USDT,
     * * BITCOIN_MOBI,
     * * USDT_MOBI,
     * * PAY_CARD,
     * * USDT_BFB,
     * * USDT_XJK
     */
    payType: string,
    /** 充值金额 */
    amount: number,
    /** 代理费金额 */
    reChargeFeeAmount: number,
    /** 代理费费率 */
    reChargeFeeRate: number,
  }
) => {
  return invoker.post(
    'payment/scanqr',
    params,
    {
      baseURL: AppConfig.AG_USER_URL,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
  );
};

/** 获取在线客服地址 */
export const getCustomerServiceUrlSync = () => {
  const {
    protocol,
    host
  } = window.location;
  return invoker.get(
    'online/url',
    { loginUrl: `${protocol}://${host}` },
    { baseURL: AppConfig.AG_USER_URL }
  )
};
