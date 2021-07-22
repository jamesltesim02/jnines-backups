import BaseApi from './BaseApi'
import AppConfig from '../configs'

export type Balance = {
  /** 总余额 */
  sportBalance: number,
  /** 可取金额 */
  withdrawableBalance: number,
  /** 汇率 */
  exchangeRate: number,
  /** 游戏额度 */
  gameBalance: number,
  /** 用户积分 */
  integral: number,
  /** 用户等级 */
  level: number,
  /** 本地额度 */
  localBalance: number,
  /** 总余额 */
  totalBalance: number,
  /** 总人民币额度 */
  totalCNYBalance: number,
  /** 可转账额度 */
  transferAmount: number
  /** 当前厅可投注额度 (当前厅的实际 1:1 或 1:7 额度) */
  targetBalance: number,
};

/** 体育额度钱包类型 */
export enum BalanceTarget {
  /** J9体育厅(用于在j9上投注的额度) */
  SABA_API = 'SABA_API',
  /** 接入的沙巴体育(iframe嵌入的沙巴) */
  SABA_IFRAME = 'SABA_IFRAME',
  /** J9体育总钱包 */
  SPORT = 'SPORT',
}

export default class User extends BaseApi {
  constructor() {
    super({
      baseURL: AppConfig.AG_USER_URL,
      transformResponse(data: any) {
        const result = data ? JSON.parse(data) : {}
        // 小于四位数的状态码不提示
        // if (result.code < 1000) {
        //   return {
        //     ...result,
        //     msg: '',
        //   }
        // }
        return result;
      }
    });
  }

  /**
   * @params  用户登录
   */
  login(
    prams: {
      loginName: string
      countryCode?: string
      password: string
      currency: number
      verification?: string
    }
  ) {
    return this._post(
      'login/login',
      prams
    )
  }

  /**
   * 谷歌登录
   * @param params
   */
  googleLogin(
    params: {
      loginName: string
      authCode: string
      countryCode?: string
      verification?: string
      currency: number
    }
  ) {
    return this._post(
      "/login/google",
      params
    )
  }

  /**
   * @param params 短信登录
   * @param params.loginName 游戏账号或者手机号
   * @param params.countryCode 区号（手机号码需填）
   * @param params.currency 货币
   * @param params.code 验证码
   */
  smsLogin(
    params: {
      loginName: string
      countryCode: string
      currency: number
      code: string
    }
  ) {
    return this._post(
      '/login/smsLogin',
      params
    )
  }

  /**
   * @param params 短信登录发送验证码
   * @param params.loginName 手机号或者游戏账号
   * @param params.countryCode 区号
   */
  smsLoginSend(
    params: {
      loginName: string
      countryCode: string
    }
  ) {
    return this._post(
      '/login/smsLoginSend',
      params
    )
  }

  /**
   * @param params 检验手机号码
   * @param params.countryCode 区号
   * @param params.phone 手机号
   */
  changePhoneVerify(
    params: {
      countryCode: string
      phone: string
    }
  ) {
    return this._get(
      "/mobile/right",
      {
        params: {
          params
        }
      }
    )
  }

  /** 退出登录 */
  loginOut() {
    return this._get('/login/logout')
  }

  /**
   * 注册 检查用户名
   */
  registerCheck(
    params:
      {
        loginName: string
      }
  ) {
    return this._get(
      '/register/check',
      {params}
    )
  }

  /**
   * 检查注册次数限制，获取注册码类型
   */
  captchaType() {
    return this._get(
      '/register/captchaType'
    )
  }

  /**
   * 获取普通图片验证码
   * @param type 普通图片验证码类型
   */
  captcha(type: 'register' | 'login') {
    return this._get(
      '/captcha/new/image?captchaType=' + type,
      {
        transformResponse: data => {
          const url = URL.createObjectURL(data)
          if (url) {
            return {
              code: 200,
              data: url
            };
          }
        },
        responseType: 'blob'
      }
    )
  }

  /**
   * 获取点击文字验证码
   * @param type 文字验证码类型
   */
  captchaClick(type: 'REGISTER' | 'LOGIN') {
    return this._get(
      '/captcha/clickText?captchaType=' + type
    )
  }

  /**
   *  检查文字验证码
   * @param type
   * @param code
   */
  captchaClickCheck(captchaType: 'REGISTER' | 'LOGIN', code: string) {
    return this._get(
      `/captcha/clickText/check`,
      {
        params: {
          captchaType,
          code
        }
      }
    )
  }

  /**
   * @param params 普通注册
   * @param params.loginName 用户名
   * @param params.password 密码
   * @param params.code 验证码
   * @param params.currency 货币
   * @param params.recommendcode 推荐码
   * @param params.countryCode 区号
   * @param params.phone 手机号
   * @param params.nbInviteCode nb邀请码
   */
  register(
    params: {
      loginName: string
      password: string
      code: string
      currency: number
      recommendcode?: string
      countryCode: string
      phone: string
      nbInviteCode?: string
    }
  ) {
    return this._post(
      '/register/register',
      params
    )
  }

  /**
   * @param params 快速注册
   * @param params.loginName 用户名
   * @param params.password 密码
   * @param params.code 验证码
   * @param params.currency 货币
   * @param params.recommendcode 推荐码
   * @param params.countryCode 区号
   * @param params.phone 手机号
   * @param params.nbInviteCode nb邀请码
   */
  registerFast(
    params: {
      phone: string
      password: string
      currency: number
      countryCode: string
      recommendcode?: string
      code?: string
      nbInviteCode?: string
    }
  ) {
    return this._post(
      "/register/fastRegister",
      params
    )
  }

  /**
   * @param params 发送手机验证码
   * @param params.countryCode 区号
   * @param params.phone 手机号
   * @param params.type 验证码类型
   */
  smsSend(
    params: {
      countryCode: string
      phone: string
      // type: 'forgot' | 'change_phone_old' | 'change_phone_new' | 'register' | 'bound' | 'bank' | 'DCBOX' | 'GOOGLE_CHANGE' | 'GOOGLE_BIND'
      type: string
    }
  ) {
    return this._post(
      "/sms/send",
      params
    )
  }

  // ANK,
  // LOGIN,
  // FORGOT,
  // BOUND,
  // CHANGE_PHONE_OLD,
  // CHANGE_PHONE_NEW,
  // MOVIE_TICKET,
  // DOWNLOAD_APP,
  // PAYMENT_REMIND_BANK_CARD_NUMBER_CHANGE,
  // PAYMENT_REMIND_FIRST_TIME_BQ,
  // PAYMENT_REMIND_CLEAR_BANK_CARD_HISTORY,
  // REGISTER,
  // BIFUBAO,
  // DCBOX,
  // GOOGLE_BIND,
  // GOOGLE_CHANGE,
  // GENERAL,
  // BQ_PAY,
  // MISSION,
  // BBX

  /**
   * @param params 校验验证码
   * @param params.countryCode 区号
   * @param params.phone 手机号
   * @param params.type 类型
   * @param params.code 验证码
   */
  smsVerify(
    params: {
      countryCode: string
      phone: string
      // type: 'forgot' | 'change_phone_old' | 'change_phone_new' | 'register' | 'bound' | 'bank' | 'DCBOX'
      type: string,
      code: string
    }
  ) {
    // return Promise.resolve();
    return this._post(
      "/sms/verify", params
    );
  }

  /**
   * @param params 重置密码
   * @param params.countryCode 区号
   * @param params.phone 手机号
   * @param params.password 密码
   */
  resetPassword(
    params: {
      countryCode: string
      phone: string
      password: string
    }
  ) {
    return this._post(
      "/password/forgot",
      params
    )
  }

  /**
   * 绑定手机
   */
  bindPhone(
    params: {
      countryCode: string,
      phone: string,
      captcha: string
    }
  ) {
    return this._post(
      "/mobile/bound",
      params
    )
  }

  /**
   * 修改手机号码
   * @param params
   */
  updatePhone(
    params: {
      countryCode: String
      phone: String
      code: String
    }
  ) {
    return this._get(
      '/mobile/update',
      {params}
    )
  }

  /**
   * 获取原绑定的手机号码
   */
  getBindPhone() {
    return this._get(
      "/mobile/init"
    )
  }

  /** 获取google绑定 */
  googleCheck() {
    return this._get(
      "/google/check"
    )
  }

  /**
   * 获取google二维码
   */
  googleQrCode(
    {
      type
    }: {
      type: "GOOGLE_BIND" | "GOOGLE_CHANGE"
    }
  ) {
    return this._get(
      "/google/obtain",
      {
        params: {
          type
        }
      }
    )
  }

  /** 校验谷歌二维码的验证码 */
  googleQRcodeVerify(
    params: {
      code: string,
      version: string,
      type: 'GOOGLE_BIND' | 'GOOGLE_CHANGE'
    }
  ) {
    return this._get(
      '/google/verify',
      {params}
    )
  }

  /** 校验谷歌验证码 */
  googleVerify(
    params: {
      /** 用户名或手机号 */
      loginName?: string,
      /** 国家编码 */
      countryCode?: string,
      /** 校验类型 */
      // type: 'forgot' | 'bank' | 'CHANGE_PHONE_OLD',
      type: string,
      /** 验证码 */
      code: string
    }
  ) {
    // return Promise.resolve();
    return this._get(
      'google/business/verify',
      {params}
    );
  }

  /** 绑定谷歌验证码 */
  googleBind(
    params: {
      code: string
      version: string
      type: "GOOGLE_BIND" | "GOOGLE_CHANGE"
    }
  ) {
    return this._get(
      "/google/bind",
      {params}
    )
  }

  /**
   * @param params 修改手机密码
   * @param params.oldPassword 旧密码
   * @param params.password 新密码
   * @param params.loginName 登录用户名
   */
  passwordChange(
    params: {
      oldPassword: string
      password: string
      loginName: string
    }
  ) {
    return this._post(
      "/password/modify",
      params
    )
  }

  /** 主站余额查询接口 */
  fundBalance() {
    return this._get('fund/balance');
  }

  /**
   * 查询体育厅余额
   *
   * > 如果不传入任何参数, 则只查询所有额度而不做任何转账
   *
   * @param params.target 将要转到的钱包类型, 为空则不转入
   * @param params.onlyRead 是否只查询当前厅余额 (必须传入target)
   */
  userBalance(
    params?: {
      /** 将要转到的钱包类型, 为空则不转入 */
      target?: BalanceTarget,
      /** 是否只查询当前厅余额 (必须传入target) */
      onlyRead?: boolean
    }
  ) {
    return this._get(
      'user/balance',
      {
        params,
        transformResponse: [function (data) {
          const result = data ? JSON.parse(data) : {}
          return result
        }]
      },
    );
  }

  /** 检查用户是否可以取款 */
  checkWithdrawal(): Promise<boolean> {
    // return Promise.resolve<boolean>(false);
    return this._get('withdraw/check');
  }

  /** 查询可取款的钱包列表 */
  withdrawalWallets() {
    return this._get('withdraw/info');
  }

  /** 查询取款汇率 */
  withdrawalRate(currency: string): Promise<number> {
    // return new Promise((resolve) => {
    //   setTimeout(
    //     () => resolve(6.8),
    //     2000
    //   );
    // });

    return this._get(
      'withdraw/rate',
      {params: {currency}}
    );
  }

  /** 人民币提款 */
  withdrawalCny(
    params: {
      bankId: number,
      withdrawAmount: number,
      withdrawalChannel?: 0 | 1,
      check: boolean
    }
  ) {
    return this._post(
      'withdraw/cny',
      params,
      {
        transformResponse(data: string) {
          const result = data ? JSON.parse(data) : {};
          // result.successful = true;

          // result.successful = false;
          // result.code = 8522;

          // result.successful = false;
          // result.code = 8901;

          // result.successful = false;
          // result.code = 8515;

          // result.successful = false;
          // result.code = 8537;
          // result.data = {
          //   actName: '一个优惠',
          //   postulateAccount: 200,
          //   validAccount: 20
          // };

          // result.successful = false;
          // result.code = 8535;
          // result.data = {
          //   checkTransWrap: [
          //     {
          //       auditItemName: '优惠1',
          //       betAmountDesc: '800000',
          //       betAmount: '500000',
          //       needBetAmount: '300000'
          //     },
          //     {
          //       auditItemName: '优惠1',
          //       betAmountDesc: '20000',
          //       betAmount: '8000',
          //       needBetAmount: '12000'
          //     }
          //   ]
          // }

          return {
            code: 200,
            data: result,
            msg: '',
          };
        }
      }
    );
  }

  /** 虚拟币提款 */
  withdrawalVirtual(
    params: {
      amount: number,
      currency: string,
      id: number,
      rate?: number,
      check: boolean
    }
  ) {
    return this._post(
      'withdraw/virtual',
      params,
      {
        transformResponse(data: string) {
          const result = data ? JSON.parse(data) : {};
          // result.successful = true;

          // result.successful = false;
          // result.code = 8522;

          // result.successful = false;
          // result.code = 8901;

          // result.successful = false;
          // result.code = 8515;

          // result.successful = false;
          // result.code = 8537;
          // result.data = {
          //   actName: '一个优惠',
          //   postulateAccount: 200,
          //   validAccount: 20
          // };

          // result.successful = false;
          // result.code = 8535;
          // result.data = {
          //   checkTransWrap: [
          //     {
          //       auditItemName: '优惠1',
          //       betAmountDesc: '800000',
          //       betAmount: '500000',
          //       needBetAmount: '300000'
          //     },
          //     {
          //       auditItemName: '优惠1',
          //       betAmountDesc: '20000',
          //       betAmount: '8000',
          //       needBetAmount: '12000'
          //     }
          //   ]
          // }

          return {
            code: 200,
            data: result,
            msg: '',
          };
        }
      }
    );
  }

  /** 取款时针对8537的优惠申请处理 */
  approvePromoForWithdrawal() {
    return this._get(
      'promotion/insert/approve',
      {
        transformResponse(data: string) {
          const result = data ? JSON.parse(data) : {};
          // result.successful = false;
          return {
            code: 200,
            data: result,
            msg: '',
          };
        }
      }
    );
  }

  /** 取款时针对8515扣除福利优惠码优惠金额 */
  promoDeductForWithdrawal(
    params: {
      promotionRequestId: string,
      userSource?: string
    }
  ) {
    // return Promise.resolve({
    //   successful: true
    // });
    return this._get(
      'withdraw/promotion/deduct',
      {
        params,
        transformResponse(data: string) {
          const result = data ? JSON.parse(data) : {};
          // result.successful = true;
          return {
            code: 200,
            data: result,
            msg: '',
          };
        }
      }
    );
  }

  /** 获取在线客服地址 */
  getCustomerServiceUrl() {
    const {
      protocol,
      host
    } = window.location;
    return this._get(
      'online/url',
      { params: { loginUrl: `${protocol}://${host}` } }
    )
  }

  /** 将额度转到本地 */
  balanceTransferToLocal () {
    return this._get('fund/game/local');
    // return this._get('fund/game-local');
    // return new Promise<number>(resolve => {
    //   setTimeout(
    //     () => resolve(2000),
    //     1000
    //   )
    // });
  }

  /**
   * 与主站之间的额度转换
   *
   * @param params 转换参数
   *  {
   *    amount: 转账金额
   *    action: 转账方向: 1:从体育站转到主站 2:从主站拉到体育站
   *  }
   * @returns
   */
  balanceTransfer(
    params: {
      /** 转账金额 */
      amount: number
      /** 转账方向: 1:从体育站转到主站 2:从主站拉到体育站 */
      action: 1 | 2
    }
  ) {
    return this._post(
      'fund/transfer',
      params,
      {
        transformResponse(data: string) {
          const result = data ? JSON.parse(data) : {};

          if (result.data?.status !== 1) {
            result.code = -1;
          }

          return result;
        }
      }
    );
  }

  /**
   * 根据主站token获取用户信息
   *
   * @param agToken 主站用户token
   * @param currency 当前货币类型
   *
   * @returns 用户信息
   */
  initFromAgToken(
    agToken: string,
    currency: number
  ) {
    return this._get(
      'user/init',
      {
        params: {currency},
        headers: {
          Authorization: agToken
        }
      }
    );
  }

  /**
   * 取消提款
   */
  cancelWithdraw(
    params: {
      transId: number
    }
  ) {
    return this._get(
      '/withdraw/cancel',
      {params}
    )
  }

  /**
   * 获取洗码详情
   */
  getWashCodeDetail() {
    return this._get(
      '/rebate/details'
    )
  }

  /**
   * 洗码结算
   */
  settleWashCode() {
    return this._get(
      '/rebate/settle'
    )
  }

  /**
   * 查询资金密码状态
   *
   * @returns params
   */
  getCreditPasswordStatus () : Promise<{
    /** 资金安全密码是否开始 0:未开启 1:已开启 */
    fundsPasswordFlaf: 0 | 1,
    /** 是否设置资金安全密码 0:未设置 1:已设置 */
    fundsPwd: 0 | 1
  }> {
    return this._get('fund/password/status/get');
  }

/**
 * 
 * @param param.securityPwd 资金密码
 * @param param.init 是否为首次设置
 * 
 * @returns 
 */
  setCreditPassword (
    {
      securityPwd,
      init
    }: {
      /** 资金密码密码 */
      securityPwd: string,
      /** 是否为首次设置 */
      init: boolean
    }
  ) {
    return this._post(
      init ? 'fund/set/password' : 'fund/reset/password',
      { securityPwd }
    );
  }

  /** 设置资金安全密码开启关闭 */
  setCreditPasswordStatus (flag: boolean) {
    return this._get(
      'fund/password/status/set',
      { params: { flag } }
    )
  }

  /** 资金密码 验证资金密码 */
  verifyCreditPassword (securityPwd: string) {
    return this._post(
      'fund/password/verify',
      { securityPwd }
    )
  }
}