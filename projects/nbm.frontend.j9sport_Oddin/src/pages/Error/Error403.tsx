import React from 'react';

import LogoImage from '../../components/common/AppHeader/logo.png';

import M from '../../components/common/m';

import './Error.less';

const Error403 = () => {
  return (
    <div className="error-page error-403">
      <div className="content">
        <header>
          <img src={LogoImage} alt="" />
          <label><M id="pages.403.title" /></label>
        </header>
        <section>
          <p><M id="pages.403.content_en" /></p>
          <p><M id="pages.403.content_zh" /></p>
        </section>
      </div>
    </div>
  );
};

export default Error403;
