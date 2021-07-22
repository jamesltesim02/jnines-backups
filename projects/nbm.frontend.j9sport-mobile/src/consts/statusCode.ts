/** 用户登录相关状态码 */
// todo 中英文化
export const USER_STATUS_CODE = {
  /** 验证码 */
  CAPTCHA: {
    6200: '验证码错误',
    6201: '验证码超时',
    9610: '文字点击验证码不能为空',
    9611: '验证码不能为空',
  }
}

export enum CAPTCHA_TYPE {
  "TEXT" = 9610,
  "IMAGE" = 9611
}