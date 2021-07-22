import React from 'react';

import M from '../../components/common/m';
import ErrorPage from './ErrorPage';

const Error403 = () => {
  return (
    <ErrorPage
      errorTitle={<M id="pages.403.title" />}
      className="error-403"
    >
      <div className="error-content">
          <p><M id="pages.403.content_en" /></p>
          <p><M id="pages.403.content_zh" /></p>
      </div>
    </ErrorPage>
  );
};

export default Error403;
