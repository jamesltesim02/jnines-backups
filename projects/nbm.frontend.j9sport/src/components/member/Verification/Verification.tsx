import { message } from 'antd';
import React from 'react';
import { withApi } from '../../../apis';
import User from '../../../apis/User';
import mergeClass from '../../../utils/mergeClass';
import LoadingBar from '../../common/LoadingBar';
import OnlineCustomerService from '../../common/OnlineCustomerService';
import Dialog from '../Dialog';

export enum VerifyType {
  BANK = 'bank',
  CREDIT_PASSWORD = 'check_funds_pwd',
}

type VerificationProps = {
  api: { user: User },
  ref: Function
};

type VerificationState = {
  open: boolean,
  reject?: Function,
  resolve?: Function,
  phoneBindStatus: boolean,
  googleBindStatus: boolean,
  googleMode: boolean,
  value: string,
  countryCode: string,
  prefix: string,
  number: string,
  count: number,
  sending: boolean,
  checking: boolean,
  type: VerifyType,
  verifiedCache: Array<VerifyType>
};

const DEFAULT_STATE = {
  open: false,
  reject: undefined,
  resolve: undefined,
  phoneBindStatus: false,
  googleBindStatus: false,
  googleMode: false,
  value: '',
  countryCode: '',
  prefix: '',
  number: '',
  count: 0,
  sending: false,
  checking: false,
  type: VerifyType.BANK,
  verifiedCache: []
};

class Verification extends React.PureComponent<VerificationProps> {

  state: VerificationState = { ...DEFAULT_STATE };

  constructor (props: VerificationProps) {
    super(props);
  }

  checkVerify (
    type: VerifyType,
    cacheable: boolean = false,
  ) {
    return new Promise<boolean>((resolve, reject) => {
      if (
        cacheable
        &&
        this.state.verifiedCache.includes(type)
      ) {
        resolve(true);
        return;
      }

      const { user } = this.props.api;
      Promise.all([
        user.googleCheck(),
        user.getBindPhone()
      ]).then(([googleBind, mobileBind]) => {
        this.setState({
          ...DEFAULT_STATE,
          ...googleBind,
          type,
          open: true,
          googleMode: googleBind.googleBindStatus,
          prefix: mobileBind.phone.substring(0, 3),
          countryCode: mobileBind.countryCode,
          reject,
          resolve,
        });
      }).catch(() => {
        message.warning('获取绑定信息出错,请稍后刷新页面再试.')
        resolve(false);
      });
    });
  }

  async handleSendSms () {
    const {
      state: {
        countryCode,
        prefix,
        number,
        count,
        sending,
        type
      },
      props: {
        api: { user }
      }
    } = this;
  
    if (
      sending
      ||
      count > 0
    ) {
      return;
    }
    try {
      this.setState(old => ({ ...old, sending: true }));
      const msg = await user.smsSend({
        phone: `${prefix}${number}`,
        type,
        countryCode: countryCode as string
      });
      message.info('验证码发送成功,请注意查收');
      const counter = setInterval(
        () => {
          this.setState((old: VerificationState) => {
            if (old.count <= 0) {
              clearInterval(counter);
              return old;
            }
            return ({
              ...old,
              count: old.count - 1
            })
          });
        },
        1000
      );
      this.setState((old: VerificationState) => ({
        ...old,
        count: 300,
        counter
      }));
    } finally {
      this.setState((old: VerificationState) => ({ ...old, sending: false }));
    }
  }

  /** 进行短信验证码校验 */
  async handleCheckCaptcha () {
    const {
      state: {
        value,
        checking,
        countryCode,
        prefix,
        number,
        type
      },
      props: {
        api: { user }
      }
    } = this;
  
    if (
      checking
      ||
      checking
      ||
      value.length < 6
    ) {
      return;
    }
    try {
      this.setState(old => ({ ...old, checking: true }));
      // 校验验证码
      await user.smsVerify({
        countryCode: countryCode,
        phone: `${prefix}${number}`,
        type,
        code: value
      });
      this.handleCheckSuccess();
    } finally {
      this.setState(old => ({ ...old, checking: false }));
    }
  }

  /** 进行谷歌验证码校验 */
  async handleGoogleCheck () {
    const {
      state: {
        value,
        checking,
        type
      },
      props: {
        api: { user }
      }
    } = this;

    if (
      checking
      ||
      value.length !== 6
    ) {
      return;
    }
    try {
      this.setState(old => ({ ...old, checking: true }));
      // 校验验证码
      await user.googleVerify({
        type,
        code: value
      });
      this.handleCheckSuccess();
    } finally {
      this.setState(old => ({ ...old, checking: false }));
    }
  }

  /** 校验成功 */
  handleCheckSuccess () {
    const { resolve } = this.state;
    resolve && resolve(true);
    this.setState((v:VerificationState)=> ({
      ...v,
      open: false,
      verifiedCache: [...v.verifiedCache, v.type]
    }));
  }

  render () {
    const {
      state: {
        open,
        googleBindStatus,
        googleMode,
        value,
        checking,
        countryCode,
        prefix,
        number,
        count,
        sending
      },
      handleSendSms,
      handleCheckCaptcha,
      handleGoogleCheck,
    } = this;

    return (
      <Dialog
        open={open}
        closeButton
        imgbg
        className="verification-dialog"
        onClose={() => this.setState({ ...this.state, open: false })}
      >
        <header>身份验证</header>
        {
          (
            googleBindStatus
            &&
            googleMode
          ) ? (
            <>
              <p>为确保是您本人操作，使用谷歌验证器完成身份验证。</p>
              <div className="input-item google-verify">
                <label>G</label>
                <div>
                  <input
                    type="text"
                    placeholder="请输入谷歌验证器中的6位数字"
                    maxLength={6}
                    value={value}
                    onChange={({ target: { value } }) => this.setState(old => ({ ...old, value: value.replace(/\D+/gi, '') }))}
                  />
                </div>
              </div>
              <div className="remark">
                {
                  googleBindStatus ? (
                    <>
                      <a onClick={() => this.setState(v => ({ ...v, googleMode: !googleMode }))}>
                        使用<b>{googleMode ? '短信' : '谷歌'}验证</b>
                      </a>
                      <i />
                    </>
                  ) : null
                }
                <OnlineCustomerService>
                  遇到问题了吗?联系<b>在线客服</b>
                </OnlineCustomerService>
              </div>
              <button
                className={mergeClass({
                  submit: true,
                  'single-submit': true,
                  available: (
                    !checking
                    &&
                    value.length === 6
                  )
                })}
                onClick={handleGoogleCheck.bind(this)}
              >
                {
                  checking
                  ? <LoadingBar />
                  : '下一步'
                }
              </button>
            </>
          ) : (
            <>
              <p>为确保是您本人操作，<br />请在以下输入框完善信息后点击发送验证码</p>
              <div className="input-item phone-number">
                <label>
                  <b>*</b>手机号码:
                </label>
                <div>
                  <span className="country-code">{countryCode}</span>
                  <span className="input">
                    <span>{prefix}</span>
                    <input
                      type="text"
                      placeholder="请补充电话号码"
                      maxLength={8}
                      value={number}
                      onChange={({ target: { value } }) => this.setState(old => ({ ...old, number: value.replace(/\D+/gi, '') }))}
                    />
                  </span>
                </div>
              </div>
              <div className="input-item captcha">
                <label>
                  <b>*</b>验证码:
                </label>
                <div>
                  <span className="input">
                    <input
                      type="text"
                      placeholder="请输入验证码"
                      value={value}
                      onChange={({ target: { value } }) => this.setState(old => ({ ...old, value: value.replace(/\D+/gi, '') }))}
                    />
                  </span>
                  <button
                    onClick={handleSendSms.bind(this)}
                    className={mergeClass(
                      'submit',
                      (
                        count === 0
                        &&
                        !sending
                        &&
                        !checking
                        ? 'available'
                        : undefined
                      )
                    )}
                  >
                    {
                      sending ? (
                        <LoadingBar />
                      ) : (
                        count > 0
                        ? `重发${count}S`
                        : '发送验证码'
                      )
                    }
                  </button>
                </div>
              </div>
              <div className="remark">
                {
                  googleBindStatus ? (
                    <>
                      <a onClick={() => this.setState(v => ({ ...v, googleMode: !googleMode }))}>
                        使用<b>{googleMode ? '短信' : '谷歌'}验证</b>
                      </a>
                      <i />
                    </>
                  ) : null
                }
                <OnlineCustomerService>
                  遇到问题了吗?联系<b>在线客服</b>
                </OnlineCustomerService>
              </div>
              <button
                className={mergeClass({
                  submit: true,
                  'single-submit': true,
                  available: !checking && value.length === 6
                })}
                onClick={
                  sending
                  ? undefined
                  : handleCheckCaptcha.bind(this)
                }
              >
                {
                  checking
                  ? <LoadingBar />
                  : '完成验证'
                }
              </button>
            </>
          )
        }
      </Dialog>
    );
  }
}

export default withApi({ user: User })(Verification);
