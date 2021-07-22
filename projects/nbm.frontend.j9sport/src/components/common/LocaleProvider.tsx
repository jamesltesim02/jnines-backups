import React from 'react';
import { observer } from 'mobx-react';
import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import dayjs from 'dayjs';

// antd的语言包
import antdEnUS from 'antd/es/locale/en_US';
import antdZhCN from 'antd/es/locale/zh_CN';

// dayjs的语言包
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

// 可用语言枚举
import { Locales } from '../../consts/app';
// store对象
import appStore from '../../stores/app';

import flatObject from '../../utils/flatObject';

import LoadingBar from './LoadingBar';

// antd语言包的映射
const antdLocales = {
  [Locales.ZH_CN]: antdZhCN,
  [Locales.EN_US]: antdEnUS
}

const localeFileMapping = {
  [Locales.ZH_CN]: 'zh-CN.message',
  [Locales.EN_US]: 'en-US.message',
}

function LocaleProvider (
  { children }: { children: any }
) {
  const { locale } = appStore;
  const [loading, setLoading] = React.useState(true);
  const [messages, setMessages] = React.useState<Record<string, any>>({});

  React.useEffect(
    () => {
      setLoading(true);
      // 语言变化时更新dayjs的语言
      dayjs.locale(locale);
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
    // 全局语言设置
    <IntlProvider
      messages={messages}
      locale={locale}
    >
      {/* antd语言设置 */}
      <ConfigProvider locale={antdLocales[locale]}>
        {children}
      </ConfigProvider>
    </IntlProvider>
  );
}

export default observer(LocaleProvider);


