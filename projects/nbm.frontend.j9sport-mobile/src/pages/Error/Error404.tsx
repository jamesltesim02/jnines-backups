import React from 'react';

import M from '../../components/common/m';
import ErrorPage from './ErrorPage';
import appStore from '../../stores/app';
import { useHistory } from 'react-router-dom';

function Error404 () {
  const history = useHistory();
  const handleBack = () => {
    if (appStore.firstRoute) {
      history.push('/');
      return;
    }
    history.goBack();
  };

  return (
    <ErrorPage
      errorTitle={<M id="pages.404.title" />}
      className="error-404"
      headerVisible
    >
      <div className="error-content">
        <p><M id="pages.404.content_en" /></p>
        <p><M id="pages.404.content_zh" /></p>
        <button onClick={handleBack}><M id="pages.404.back" /></button>
      </div>
    </ErrorPage>
  );
};

export default Error404;
