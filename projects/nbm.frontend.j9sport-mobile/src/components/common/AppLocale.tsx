import React from 'react';
import { observer } from 'mobx-react';
import { IntlProvider } from 'react-intl';
import { LocaleProvider } from 'antd-mobile';

// 可用语言枚举
import { Locales } from '../../consts/app';

// app store
import appStore from '../../stores/app';

// 系统自定义语言包
// import appLocales from '../../assets/locales';
import LoadingBar from './LoadingBar';

import flatObject from '../../utils/flatObject';

const localeFileMapping = {
  [Locales.ZH_CN]: 'zh-CN.message',
  [Locales.EN_US]: 'en-US.message',
}

/** 语言提供者,根据store中的locale获取对应的语言包并显示 */
export const AppLocaleProvider = observer(({ children }: { children: any }) => {
  const { locale } = appStore;
  const [loading, setLoading] = React.useState(true);
  const [messages, setMessages] = React.useState<Record<string, any>>({});

  // antd-mobile 的语言包设置 (antd mobile 的英文语言包)
  const amProps:any = (
    locale === Locales.EN_US
    ? { locale: import('antd-mobile/lib/locale-provider/en_US') }
    : {}
  );

  React.useEffect(
    () => {
      setLoading(true);
      // 加载对应的语言包
      import(
        `../../assets/locales/${localeFileMapping[locale]}`
      ).then(result => {
        setMessages(flatObject(result.default));
        setLoading(false);
      });
    },
    [locale]
  )

  if (loading) {
    return (<LoadingBar />);
  }

  return (
    // 全局语言环境provider
    <IntlProvider
      messages={messages}
      locale={locale}
    >
      {/* antd-mobile 语言provider */}
      <LocaleProvider {...amProps}>
        {children}
      </LocaleProvider>
    </IntlProvider>
  );
});

export function LocaleSwitcher () {}