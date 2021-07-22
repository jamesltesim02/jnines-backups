import React from 'react';
import { useIntl } from 'react-intl';
import { Button, Dropdown, Menu, message } from 'antd';
import { observer } from 'mobx-react';

import appStore from '../../../../../stores/app';
import { Locales } from '../../../../../consts/app';

import chineseImg from '../../../../icons/icon-lang/chinese.png';
import englishImg from '../../../../icons/icon-lang/english.png';

import M from '../../../m';
import { useApi } from '../../../../../apis';
import Pull from '../../../../../apis/Pull';

const LOCALES = [
  Locales.ZH_CN,
  Locales.EN_US
];

const LOCALE_ICONS = {
  [Locales.ZH_CN]: chineseImg,
  [Locales.EN_US]: englishImg
};

function LocaleItem ({ locale }: { locale: Locales}) {
  return (
    <div className="locale-switcher-item">
      <img
        src={LOCALE_ICONS[locale]}
        alt=""
      />
      <M id={`locale.${locale}`} />
    </div>
  );
}

/* eslint-disable jsx-a11y/anchor-is-valid */
function LocaleSwither () {
  const [pull] = useApi([Pull]);
  const intl = useIntl();

  const handleSetLocale = async (locale: Locales) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'pages.faving' })
    );
    try {
      // await pull.saveSettings({
      //   accept: appStore.oddsAccept,
      //   language: locale,
      //   goalNotify: appStore.goalSound,
      //   theme: appStore.skin,
      //   stake: appStore.acceptAmount,
      // });

      const { origin, pathname } = window.location;
      const params = new URLSearchParams(appStore.queryString);
      params.set('locale', locale);
      window.location.href = `${origin}${pathname}?${params.toString()}`;
    } finally {
      hide();
    }
  };

  const menu = (
    <Menu className="locale-switcher-menu">
      {
        LOCALES.map(locale => (
          <Menu.Item key={locale}>
            <Button onClick={() => handleSetLocale(locale)}>
              <LocaleItem locale={locale} />
            </Button>
          </Menu.Item>
        ))
      }
    </Menu>
  );
  return (
    <Dropdown
      overlay={menu}
      arrow
    >
      <Button className="locale-switcher">
        <LocaleItem locale={appStore.locale} />
      </Button>
    </Dropdown>
  );
}

export default observer(LocaleSwither);
