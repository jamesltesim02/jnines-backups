import { Toast } from 'antd-mobile';
import { observer } from 'mobx-react';
import React from 'react';
import { useIntl } from 'react-intl';
import { useApi } from '../../apis';
import { getCustomerServiceUrlSync } from '../../apis/SyncApi';
import User from '../../apis/User';

import appStore from '../../stores/app';

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
      Toast.fail('获取在线客服地址失败,请稍后再试.')
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
  //   [user, appStore.customerServiceUrl]
  // );
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
