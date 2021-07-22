import { CustomerServiceOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { useIntl } from 'react-intl';
import { getCustomerServiceUrlSync } from '../../apis/SyncApi';
// import { useApi } from '../../apis';
// import User from '../../apis/User';

import appStore from '../../stores/app';
import memberStore from '../../stores/member';

function OnlineCustomerService (
  {
    children,
    className
  }: {
    children?: any,
    className?: string
  }
) {
  const intl = useIntl();
  // const { user } : { user: User } = useApi({ user: User });

  const handleOpenCustomerService = async () => {
    try {
      const url = getCustomerServiceUrlSync();
      window.open(url);
    } catch (e) {
      console.error(e);
      message.warning('获取在线客服地址失败,请稍后再试.')
    }
  }

  // React.useEffect(
  //   () => {
  //     user.getCustomerServiceUrl().then(
  //       url => {
  //         appStore.customerServiceUrl = url;
  //       }
  //     )
  //   },
  //   [user, appStore.customerServiceUrl, memberStore.isLoged]
  // )

  return (
    <a
      // href={appStore.customerServiceUrl}
      // target="_blank"
      onClick={handleOpenCustomerService}
      className={className}
    >
      {
        children ? children : (
          <>
            <CustomerServiceOutlined />
            <span
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({ id: 'member.form.onlineCustomerText' })
              }}
            />
          </>
        )
      }
    </a>
  );
}

export default observer(OnlineCustomerService);
