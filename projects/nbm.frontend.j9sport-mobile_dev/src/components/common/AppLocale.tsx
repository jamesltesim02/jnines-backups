import React from 'react';
import { observer } from 'mobx-react';
import { IntlProvider } from 'react-intl';
import { LocaleProvider } from 'antd-mobile';

// 可用语言枚举
import { Locales } from '../../consts/app';

// app store
import appStore from '../../stores/app';

// 系统自定义语言包
import appLocales from '../../assets/locales';

// TODO 将antd-mobile的语言文件提取到assets/locales文件中

/** 语言提供者,根据store中的locale获取对应的语言包并显示 */
export const AppLocaleProvider = observer(({ children }: { children: any }) => {
  const { locale } = appStore;

  // antd-mobile 的语言包设置 (antd mobile 的英文语言包)
  const amProps:any = (
    locale === Locales.EN_US
    ? { locale: import('antd-mobile/lib/locale-provider/en_US') }
    : {}
  );

  return (
    // 全局语言环境provider
    <IntlProvider
      messages={appLocales[locale]}
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