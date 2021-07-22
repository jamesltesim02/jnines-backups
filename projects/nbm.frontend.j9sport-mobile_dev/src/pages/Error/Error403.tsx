import React from 'react';

import M from '../../components/common/m';
import ErrorPage from './ErrorPage';
import appStore from '../../stores/app';

const Error403 = () => {
  return (
    <ErrorPage
      errorTitle={<M id="pages.403.title" />}
      className="error-403"
    >
      <div className="error-content">
        <p><M id="pages.403.content_en" values={{ ip:  appStore.systemState.clientIP }} /></p>
        <p><M id="pages.403.content_zh" values={{ ip:  appStore.systemState.clientIP }} /></p>
      </div>
    </ErrorPage>
  );
};

export default Error403;
