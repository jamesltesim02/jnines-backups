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
// 系统自定义语言包
import appLocales from '../../assets/locales';
// 可用语言枚举
import { Locales } from '../../consts/app';
// store对象
import appStore from '../../stores/app';

// antd语言包的映射
const antdLocales = {
  [Locales.ZH_CN]: antdZhCN,
  [Locales.EN_US]: antdEnUS
}

function LocaleProvider (
  { children }: { children: any }
) {
  const { locale } = appStore;

  // 语言变化时更新到dayjs上
  React.useEffect(
    () => { dayjs.locale(locale) },
    [locale]
  )

  return (
    // 全局语言设置
    <IntlProvider
      messages={appLocales[locale]}
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
