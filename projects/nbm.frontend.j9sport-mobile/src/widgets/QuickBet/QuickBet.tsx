import { observer } from 'mobx-react';
import React from 'react';
import WidgetSettings from '../WidgetSettings';

import memberStore from '../../stores/member';
import appStore from '../../stores/app';
import widgetStore from '../../stores/widgets';

import { useApi } from '../../apis';
import User, { BalanceTarget } from '../../apis/User';
import Pull from '../../apis/Pull';
import { CURRENCY_TEXT, Locales, SkinType } from '../../consts/app';
import LoadingBar from '../../components/common/LoadingBar';
import { LocaleProvider } from 'antd-mobile';
import TransferDialog from './TransferDialog';
import QuickBetToast from './QuickBetToast';
import QuickBetMatchs from './QuickBetMatchs';
import { IntlProvider, useIntl } from 'react-intl';

import flatObject from '../../utils/flatObject';
// 本地语言包
import zhMessage from '../../assets/locales/zh-CN.message';
import enMessage from '../../assets/locales/en-US.message';

// 本地语言包
const localeMessages:Record<string, any> = {
  [Locales.ZH_CN]: flatObject(zhMessage),
  [Locales.EN_US]: flatObject(enMessage),
}

const QuickBet = observer(() => {
  const intl = useIntl();
  const { systemState } = appStore;
  const {
    j9Token,
    currency,
    on,
    ...settings
  } = widgetStore.settings as WidgetSettings

  const {
    user,
    pull
  }: {
    user: User,
    pull: Pull
  } = useApi({
    user: User,
    pull: Pull
  });
  const [stateLoading, setStateLoading] = React.useState(true);
  const [memberLoading, setMemberLoading] = React.useState(true);
  const [transfering, setTransfering] = React.useState(false);

  // 查询用户信息
  const queryMemberInfo = React.useCallback(
    async (j9Token) =>  {
      if (!j9Token) {
        setMemberLoading(false);
        return;
      }
      try {
        setMemberLoading(true);
        // 根据祝转token初始化用户状态信息
        const initResult = await user.initFromAgToken(j9Token, currency as number);
        // 是否找到
        if (!initResult || !initResult.nbToken) {
          return;
        }
        // 设置加载出来的用户信息到store
        memberStore.memberInfo = {
          agToken: j9Token,
          currency,
          nbToken: initResult.nbToken,
          userId: initResult.nbUserId,
          customerId: initResult.loginName
        };
        // 查询用户余额
        const userBalance = await user.userBalance({
          target: BalanceTarget.SABA_API
        });
        // 设置用户信息
        memberStore.memberInfo = {
          ...memberStore.memberInfo,
          ...userBalance,
          userId: userBalance.nbUserId,
        };
        // 设置用户的余额信息
        memberStore.j9Balance = {
          ...memberStore.j9Balance,
          targetBalance: userBalance.targetBalance,
          sportBalance: userBalance.totalBalance,
          withdrawableBalance: userBalance.availableBalance
        };
        if (widgetStore.settings) {
          widgetStore.settings.j9Token = j9Token;
        }
      } finally {
        setMemberLoading(false);
      }
    },
    [user]
  )

  // 遇到错误
  // 系统维护
  // 数据为空

  React.useEffect(
    () => {
      const initWidget = async () => {
        // 设置默认值
        appStore.clientType = settings.clientType;
        appStore.locale = settings.locale || Locales.ZH_CN;
        appStore.skin = SkinType.BLACK;

        try {
          // 判断是否地域限制和系统维护
          await pull.getSystemState().catch(() => {});
          // 查询用户信息
          queryMemberInfo(j9Token);
          // 加载成功
          if (on?.widgetReady) {
            on.widgetReady();
          }
        } catch (e) {
          console.warn(e);
        } finally {
          setStateLoading(false);
        }
      };

      initWidget();

      // 登录请求
      const handleSignRequest = () => {
        if (on?.signRequest) {
          on.signRequest(queryMemberInfo);
        } else {
          widgetStore.toast({ msg: '您还未登录,请先登录' });
        }
      };

      // 充值请求
      const handleRechargeRequest = () => {
        if (on?.rechargeRequest) {
          on.rechargeRequest();
        }
      };

      // 全局toast消息
      const handleToastEvent = (event: any) => {
        const {
          detail: {
            type = 'info',
            intl: i18nMessage,
            ...detail
          }
        } = event;
        
        if (i18nMessage) {
          detail.content = intl.formatMessage(i18nMessage);
        }

        widgetStore.toast({ msg: detail.content });
      };

      // 打开转账弹窗
      const handleTransfer = () => {
        if (!memberStore.isLoged) {
          window.dispatchEvent(new Event('j9s-quickbet-sign-request'));
          return;
        } else {
          widgetStore.toast({ msg: '当前可用投注额度不足,请先充值.'  });
        }
        setTransfering(true);
      };

      const handleSetToken = (event: any) => {
        if (event.detail) {
          queryMemberInfo(event.detail);
        }
      };

      window.addEventListener('toast', handleToastEvent);
      window.addEventListener('j9s-quickbet-sign-request', handleSignRequest);
      window.addEventListener('j9s-quickbet-recharge-request', handleRechargeRequest);
      window.addEventListener('j9s-invoke-QuickbetTransfer', handleTransfer);
      window.addEventListener('j9s-invoke-QuickbetSetToken', handleSetToken);
      return () => {
        window.removeEventListener('toast', handleToastEvent);
        window.removeEventListener('j9s-quickbet-sign-request', handleSignRequest);
        window.removeEventListener('j9s-quickbet-recharge-request', handleRechargeRequest);
        window.removeEventListener('j9s-invoke-QuickbetTransfer', handleTransfer);
        window.removeEventListener('j9s-invoke-QuickbetSetToken', handleSetToken);
      };
    },
    [user, pull]
  );

  // 正在加载系统状态显示为loading
  if (stateLoading) {
    return (<LoadingBar />);
  }

  // 地域限制
  if (systemState.forbbiden) {
    return (<div className="j9s-forbbiden">地域限制</div>);
  }

  // 维护中
  if (systemState.mainting) {
    return (<div className="j9s-mainting">系统维护中</div>);
  }

  return (
    <>
      <header>
        <label>快捷投注</label>
        <a
          onClick={() => {
            // 转到更多
            if (on?.moreBet) {
              on.moreBet();
            } else {
              window.open(`${settings.j9sPath}?j9Token=${j9Token || ''}&origin=${encodeURIComponent(window.location.href)}`)
            }
          }}
        >
          更多投注 
          <svg
            viewBox="0 0 14 14"
            version="1.1"
            width="1em"
            height="1em"
          >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(-351.000000, -573.000000)">
                <g transform="translate(291.000000, 571.000000)">
                  <g transform="translate(60.000000, 2.000000)">
                    <circle fill="currentColor" cx="7" cy="7" r="7"></circle>
                    <path d="M1.09836142,6.48395761 C0.956099275,6.62071489 0.875744056,6.80670714 0.875,7.00095567 C0.875744053,7.1952042 0.956099271,7.38119645 1.09836141,7.51795373 C1.24062355,7.65471101 1.43311945,7.73101186 1.6334375,7.7300453 L9.659375,7.7300453 L6.5346875,10.73504 C6.33120879,10.9159226 6.24689777,11.1907136 6.3153125,11.4500387 C6.38421875,11.7091292 6.59421875,11.9114016 6.86375,11.9773105 C7.13258884,12.0433671 7.41722223,11.9627924 7.6071875,11.7668563 L11.8967187,7.64186363 C11.984375,7.55413652 12.125,7.45459124 12.125,7.00004658 C12.125,6.54550193 11.97875,6.44095666 11.8953125,6.35822954 L7.60578125,2.23323682 C7.41572279,2.03713685 7.13086023,1.95654805 6.861875,2.02278264 C6.59330074,2.08792154 6.38291496,2.29018796 6.3134375,2.55005443 C6.24500001,2.80914488 6.32890625,3.08323531 6.5328125,3.26505317 L9.6575,6.27004787 L1.6334375,6.27004787 C1.43311945,6.27089949 1.24062356,6.34720033 1.09836142,6.48395761 Z" fill="#16161A" fillRule="nonzero" />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </a>
      </header>
      <div className="j9s-balance">
        {
          memberLoading ? (
            <span>用户信息加载中...</span>
          ) : (
            memberStore.isLoged
            ? (
              <>
                <span>
                  体育账户余额:
                  <var>{memberStore.balance}</var>
                  {CURRENCY_TEXT[currency as number]}
                </span>
                <button onClick={() => setTransfering(true)}>转入</button>
              </>
            )
            : (
              <>
                <span>您还未登录</span>
                {
                  on?.signRequest
                  ? (
                    <button
                      onClick={() => on?.signRequest(queryMemberInfo)}
                    >立即登录</button>
                  ) : undefined
                }
              </>
            )
          )
        }
      </div>
      <QuickBetMatchs />
      <TransferDialog
        open={transfering}
        onClose={() => setTransfering(false)}
        onFinish={() => {
          queryMemberInfo(j9Token);
          setTransfering(false);
        }}
      />
    </>
  )
});


const AppLocaleProvider = observer((
  { children }: { children: any }
) => {
  const { locale } = appStore;

  // antd-mobile 的语言包设置 (antd mobile 的英文语言包)
  const amProps:any = (
    locale === Locales.EN_US
    ? { locale: import('antd-mobile/lib/locale-provider/en_US') }
    : {}
  );

  return (
      // 全局语言设置
      <IntlProvider
        messages={localeMessages[locale]}
        locale={locale}
      >
        {/* antd语言设置 */}
        <LocaleProvider {...amProps}>
          {children}
        </LocaleProvider>
      </IntlProvider>
  );
});

function QuickBetContainer () {
  return (
    <div className="j9s j9s-quick-bet-container">
      <AppLocaleProvider>
        <>
          <QuickBet />
          <QuickBetToast />
        </>
      </AppLocaleProvider>
    </div>
  );
}


export default QuickBetContainer;
