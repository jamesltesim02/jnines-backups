import React from 'react';

import M from '../../components/common/m';

import './Error.less';

import appStore from '../../stores/app';
import ErrorPage from './ErrorPage';
import { useIntl } from "react-intl";

const Error503 = () => {
  const intl = useIntl()
  const { maintenancetime } = appStore.systemState;
  return (
    <ErrorPage
      errorTitle={intl.formatMessage({id: 'pages.503.title'})}
      className="error-503"
    >
      <div className="error-content">
        <p><M id="pages.503.customer" /></p>
        <p><M id="pages.503.content" /></p>
        {
          Boolean(maintenancetime) ? (
            <p>
              <M
                id="pages.503.time"
                values={{
                  start: maintenancetime.startTime,
                  end: maintenancetime.endTime
                }}
              />
            </p>
          ) : null
        }
        <p><M id="pages.503.qa" /></p>
      </div>
    </ErrorPage>
  );
};

export default Error503;
