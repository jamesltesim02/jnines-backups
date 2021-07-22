import React from 'react';
import { observer } from 'mobx-react';
import WidgetSettings from '../WidgetSettings';

import memberStore from '../../stores/member';
import appStore from '../../stores/app';
import widgetStore from '../../stores/widgets';

import { useApi } from '../../apis';
import User, { BalanceTarget } from '../../apis/User';
import Pull from '../../apis/Pull';
import { CURRENCY_MAP_TEXT, Locales, SkinType } from '../../consts/app';
import QuickBetMatchs from './QuickBetMatchs';
import LoadingBar from '../../components/common/LoadingBar';
import QuickBetToast from './QuickBetToast';
import TransferPopover from './TransferPopover';
import { IntlProvider } from 'react-intl';
import { ConfigProvider, message } from 'antd';

import dayjs from 'dayjs';

// antd的语言包
import antdEnUS from 'antd/es/locale/en_US';
import antdZhCN from 'antd/es/locale/zh_CN';
// dayjs的语言包
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
// 本地语言包
import zhMessage from '../../assets/locales/zh-CN.message';
import enMessage from '../../assets/locales/en-US.message';

import flatObject from '../../utils/flatObject';

// antd语言包的映射
const antdLocales = {
  [Locales.ZH_CN]: antdZhCN,
  [Locales.EN_US]: antdEnUS
}
// 本地语言包
const localeMessages:Record<string, any> = {
  [Locales.ZH_CN]: flatObject(zhMessage),
  [Locales.EN_US]: flatObject(enMessage),
}

const QuickBet = observer(() => {
  const { systemState } = appStore;
  const {
    j9Token,
    currency,
    on,
    ...settings
  } = widgetStore?.settings as WidgetSettings

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
      } catch (e) {
        console.warn(e)
      } finally {
        setMemberLoading(false);
      }
    },
    [user]
  )

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

      const handleSignRequest = () => {
        if (on?.signRequest) {
          on.signRequest(queryMemberInfo);
        } else {
          message.warn('请先登录');
        }
      };

      const handleRechargeRequest = () => {
        if (on?.rechargeRequest) {
          on.rechargeRequest();
        } else {
          message.warn('当前可用投注额度不足,请先充值.');
        }
      };

      const handleSetToken = (event: any) => {
        if (event.detail) {
          queryMemberInfo(event.detail);
        }
      };

      window.addEventListener('j9s-quickbet-sign-request', handleSignRequest);
      window.addEventListener('j9s-quickbet-recharge-request', handleRechargeRequest);
      window.addEventListener('j9s-invoke-QuickbetSetToken', handleSetToken);
      return () => {
        window.removeEventListener('j9s-quickbet-sign-request', handleSignRequest);
        window.removeEventListener('j9s-quickbet-recharge-request', handleRechargeRequest);
        window.removeEventListener('j9s-invoke-QuickbetSetToken', handleSetToken);
      };
    },
    [user, pull, j9Token]
  );

  // 正在加载系统状态显示为loading
  if (stateLoading) {
    return (<LoadingBar />);
  }

  // 地域限制
  if (systemState.forbbiden) {
    return (<div className="forbbiden">地域限制</div>);
  }

  // 维护中
  if (systemState.mainting) {
    return (<div className="mainting">系统维护中</div>);
  }

  return (
    <>
      <header>快捷投注</header>
      <div className="j9s-balance">
        {
          memberLoading ? (
            <span>用户信息加载中...</span>
          ) : (
            memberStore.isLoged
            ? (
              <>
                <span>
                  体育账户余额: {
                    memberStore.balance
                  }{
                    CURRENCY_MAP_TEXT[currency as number]
                  }
                </span>
                <TransferPopover onFinish={() => queryMemberInfo(j9Token)} />
              </>
            )
            : (
              <>
                <span>您还未登录</span>
                {
                  on?.signRequest
                  ? (
                    <button onClick={() => on?.signRequest(queryMemberInfo)}>立即登录</button>
                  ) : undefined
                }
              </>
            )
          )
        }
      </div>
      <QuickBetMatchs />
      <div className="to-j9s">
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
          更多玩法，进入<var>九游体育</var>
        </a>
      </div>
    </>
  )
});

const LocaleProvider = observer((
  { children }: { children: any }
) => {
  const { locale } = appStore;

  React.useEffect(
    () => {
      // 语言变化时更新dayjs的语言
      dayjs.locale(locale);
    },
    []
  );

  return (
      // 全局语言设置
      <IntlProvider
        messages={localeMessages[locale]}
        locale={locale}
      >
        {/* antd语言设置 */}
        <ConfigProvider locale={antdLocales[locale]}>
          {children}
        </ConfigProvider>
      </IntlProvider>
  );
});

function QuickBetContainer () {
  return (
    <div className="j9s j9s-quick-bet-container">
      <LocaleProvider>
        <>
          <QuickBet />
          <QuickBetToast />
        </>
      </LocaleProvider>
    </div>
  );
}


export default QuickBetContainer
