import { Toast } from 'antd-mobile';
import React from 'react';
import { withApi } from '../../../apis';
import User from '../../../apis/User';
import IconCaptcha from '../../../pages/Tabs/Member/Wallet/icons/IconCaptcha';
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
        Toast.fail('????????????????????????,???????????????????????????.');
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
      Toast.success('?????????????????????,???????????????')
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

  /** ??????????????????????????? */
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
      // ???????????????
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

  /** ??????????????????????????? */
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
      // ???????????????
      await user.googleVerify({
        type,
        code: value
      });
      this.handleCheckSuccess();
    } finally {
      this.setState(old => ({ ...old, checking: false }));
    }
  }

  /** ???????????? */
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
        className="verification-dialog"
        onClose={() => this.setState({ ...this.state, open: false })}
      >
        <header>????????????</header>
        {
          (
            googleBindStatus
            &&
            googleMode
          ) ? (
            <>
              <p>????????????????????????????????????????????????????????????????????????</p>
              <div className="input-item google-verify">
                <label>G</label>
                <input
                  type="text"
                  placeholder="??????????????????????????????6?????????"
                  maxLength={6}
                  value={value}
                  onChange={({ target: { value } }) => this.setState(old => ({ ...old, value: value.replace(/\D+/gi, '') }))}
                />
              </div>
              <button
                className={mergeClass({
                  submit: true,
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
                  : '?????????'
                }
              </button>
            </>
          ) : (
            <>
              <p>???????????????????????????????????????????????????????????????????????????????????????</p>
              <div className="input-item phone-number">
                <label>
                  {countryCode}
                </label>
                <span>{prefix}</span>
                <span className="input">
                  <input
                    type="text"
                    placeholder="?????????????????????"
                    maxLength={8}
                    value={number}
                    onChange={({ target: { value } }) => this.setState(old => ({ ...old, number: value.replace(/\D+/gi, '') }))}
                  />
                </span>
              </div>
              <div className="input-item captcha">
                <label><IconCaptcha /></label>
                <span className="input">
                  <input
                    type="text"
                    placeholder="??????????????????"
                    value={value}
                    onChange={({ target: { value } }) => this.setState(old => ({ ...old, value: value.replace(/\D+/gi, '') }))}
                  />
                </span>
                <button
                  onClick={handleSendSms.bind(this)}
                  className={
                    count === 0
                    &&
                    !sending
                    &&
                    !checking
                    ? 'available'
                    : undefined
                  }
                >
                  {
                    sending ? (
                      <LoadingBar />
                    ) : (
                      count > 0
                      ? `??????${count}S`
                      : '???????????????'
                    )
                  }
                </button>
              </div>
              <button
                className={mergeClass({
                  submit: true,
                  available: !checking && value.length === 6
                })}
                onClick={handleCheckCaptcha.bind(this)}
              >
                {
                  checking
                  ? <LoadingBar />
                  : '????????????'
                }
                </button>
            </>
          )
        }

        <div className="remark">
          {
            googleBindStatus ? (
              <>
                <a onClick={() => this.setState(v => ({ ...v, googleMode: !googleMode }))}>
                  ??????<b>{googleMode ? '??????' : '??????'}??????</b>
                </a>
                <i />
              </>
            ) : null
          }
          <OnlineCustomerService>
            ?????????????????????????<b>????????????</b>
          </OnlineCustomerService>
        </div>
      </Dialog>
    );
  }
}

export default withApi({ user: User })(Verification);
