import React from 'react';
// import { Observer, useObserver, observer } from 'mobx-react-lite';
import { observer } from 'mobx-react';
import { Menu, Dropdown, Button, DatePicker, Space } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import { FormattedMessage } from 'react-intl';

import { LOCALE_LIST } from '../../consts/app';
import appStore from '../../stores/app';

// TODO 与LocaleProvider合并到同一个文件

function LocaleSwitcher () {
  return (
    <div>
      <Dropdown
        overlay={
          <Menu>
            {
              LOCALE_LIST.map(locale => (
                <Menu.Item
                  key={locale}
                  icon={<UserOutlined />}
                  onClick={() => appStore.locale = locale}
                >
                  <FormattedMessage id={`locale.${locale}`} />
                </Menu.Item>
              ))
            }
          </Menu>
        }
      >
        <Button>
          <FormattedMessage id={`locale.${appStore.locale}`} />
          <DownOutlined />
        </Button>
      </Dropdown>
      <Space direction="vertical">
        <DatePicker onChange={(e) => { console.log(e) }} />
      </Space>
    </div>
  );
}

export default observer(LocaleSwitcher);
