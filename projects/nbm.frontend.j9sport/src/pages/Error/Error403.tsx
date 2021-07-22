import React from 'react';

import Logo from '../../components/common/AppHeader/Logo';

import M from '../../components/common/m';
import appStore from '../../stores/app';

import './Error.less';

const Error403 = () => {
  return (
    <div className="error-page error-403">
      <div className="content">
        <header>
          <Logo />
          <label><M id="pages.403.title" /></label>
        </header>
        <section>
          <p><M id="pages.403.content_en" values={{ ip:  appStore.systemState.clientIP }} /></p>
          <p><M id="pages.403.content_zh" values={{ ip:  appStore.systemState.clientIP }} /></p>
        </section>
      </div>
    </div>
  );
};

export default Error403;
