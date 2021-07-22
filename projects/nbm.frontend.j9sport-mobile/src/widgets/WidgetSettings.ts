import { Locales, ClientTypes } from "../consts/app";

/** 组件参数  */
type WidgetSettings = {
  /** 组件名称 */
  widgetName: string,
  /** 需要显示到到容器 */
  el: string,
  /** 客户端类型 */
  clientType: ClientTypes,
  /** 商户id */
  frontId: string,
  /** 主站用户token */
  j9Token?: string,
  /** 语言类型 */
  locale?: Locales,
  /** 货币类型 */
  currency?: 1|2,
  /** j9sport地址 */
  j9sPath: string,
  /** 事件 */
  on?: {
    /** 组件添加成功 */
    widgetReady: () => void,
    /** 登录请求事件 */
    signRequest: (setToken: (newToken: string) => void) => void,
    /** 充值请求事件 */
    rechargeRequest: () => void,
    /** 投注成功事件 */
    betFinished: () => void,
    /** 更多比赛 */
    moreBet: () => void,
  }
};

export default WidgetSettings;
