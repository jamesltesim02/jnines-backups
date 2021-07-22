/** 普通接口配置项 */
export const ApiConst = {
  /** 接口请求超时时间: 5秒钟 */
  TIMEOUT: 5000,
  /** 跨域请求是否提供凭据信息(cookie、HTTP认证及客户端SSL证明等) */
  WITH_CREDENTIALS: false
};

/** 推送配置项 */
export const PushConst = {
  /** 推送重连时间: 35秒 */
  RETRY_DELAY: 35000,
  /** 最多重连次数 */
  RETRY_TIMES: 5,
  /** 窗口获得焦点后是否重连 */
  RETRY_ON_FOCUS: false,
  /** 心跳时间: 30秒 (Don't Kill Me, 大哥别杀我) */
  DKM_DELAY: 30000
};
